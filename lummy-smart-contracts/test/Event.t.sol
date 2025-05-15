// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "forge-std/Test.sol";
import "src/core/EventFactory.sol";
import "src/core/Event.sol";
import "src/core/TicketNFT.sol";
import "src/libraries/Constants.sol";
import "src/libraries/Structs.sol";
import "forge-std/console.sol";

contract MockIDRX {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = 2;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        
        if (_allowances[sender][msg.sender] != type(uint256).max) {
            _approve(sender, msg.sender, _allowances[sender][msg.sender] - amount);
        }
        
        return true;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(_balances[sender] >= amount, "Transfer amount exceeds balance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "Approve from the zero address");
        require(spender != address(0), "Approve to the zero address");

        _allowances[owner][spender] = amount;
    }
}

contract EventTest is Test {
    Event public eventContract;
    ITicketNFT public ticketNFT;
    MockIDRX public idrx;
    
    address public deployer;
    address public organizer;
    address public buyer1;
    address public buyer2;
    address public reseller;
    
    uint256 public eventDate;
    address public eventAddress;
    string public eventName = "Concert Event";
    string public eventDescription = "A live music concert";
    string public eventVenue = "Jakarta Convention Center";
    string public eventIpfsMetadata = "ipfs://QmTestMetadata";
    
    // Custom error signatures for matching in tests
    bytes4 private constant _ONLY_ORGANIZER_CAN_CALL_ERROR_SELECTOR = bytes4(keccak256("OnlyOrganizerCanCall()"));
    bytes4 private constant _INVALID_MAX_PER_PURCHASE_ERROR_SELECTOR = bytes4(keccak256("InvalidMaxPerPurchase()"));
    bytes4 private constant _PRICE_EXCEEDS_MAX_ALLOWED_ERROR_SELECTOR = bytes4(keccak256("PriceExceedsMaxAllowed()"));
    
    function setUp() public {
        console.log("Setting up Event test environment");
        
        deployer = makeAddr("deployer");
        organizer = makeAddr("organizer");
        buyer1 = makeAddr("buyer1");
        buyer2 = makeAddr("buyer2");
        reseller = makeAddr("reseller");
        
        eventDate = block.timestamp + 30 days;
        
        vm.startPrank(deployer);
        
        idrx = new MockIDRX("IDRX Token", "IDRX");
        
        vm.stopPrank();
        
        idrx.mint(organizer, 10000 * 10**2); // 10,000 IDRX
        idrx.mint(buyer1, 5000 * 10**2);     // 5,000 IDRX
        idrx.mint(buyer2, 5000 * 10**2);     // 5,000 IDRX
        idrx.mint(reseller, 5000 * 10**2);   // 5,000 IDRX
        
        vm.startPrank(organizer);
        
        eventContract = new Event();
        
        eventContract.initialize(
            organizer,
            eventName,
            eventDescription,
            eventDate,
            eventVenue,
            eventIpfsMetadata
        );
        
        TicketNFT ticketNFTContract = new TicketNFT();
        
        ticketNFTContract.initialize(eventName, "TIX", address(eventContract));
        
        eventContract.setTicketNFT(address(ticketNFTContract), address(idrx), deployer);
        
        eventAddress = address(eventContract);
        
        ticketNFT = ITicketNFT(address(ticketNFTContract));
        
        vm.stopPrank();
        
        console.log("Event owner:", eventContract.owner());
        console.log("Event created at:", eventAddress);
        console.log("TicketNFT created at:", address(ticketNFT));
    }
    
    function testEventInitialization() public view {
        assertEq(eventContract.name(), eventName);
        assertEq(eventContract.description(), eventDescription);
        assertEq(eventContract.date(), eventDate);
        assertEq(eventContract.venue(), eventVenue);
        assertEq(eventContract.ipfsMetadata(), eventIpfsMetadata);
        assertEq(eventContract.organizer(), organizer);
        assertEq(eventContract.cancelled(), false);
        
        assertEq(Event(eventAddress).owner(), organizer);
    }
    
    function testAddTicketTier() public {
        string memory tierName = "VIP";
        uint256 price = 200 * 10**2; // 200 IDRX
        uint256 available = 100;
        uint256 maxPerPurchase = 4;
        
        vm.startPrank(organizer);
        eventContract.addTicketTier(
            tierName,
            price,
            available,
            maxPerPurchase
        );
        vm.stopPrank();
        
        (string memory name, uint256 tierPrice, uint256 tierAvailable, uint256 sold, uint256 tierMaxPerPurchase, bool active) = 
            eventContract.ticketTiers(0);
            
        assertEq(name, tierName);
        assertEq(tierPrice, price);
        assertEq(tierAvailable, available);
        assertEq(sold, 0);
        assertEq(tierMaxPerPurchase, maxPerPurchase);
        assertTrue(active);
        assertEq(eventContract.tierCount(), 1);
    }
    
    function testUpdateTicketTier() public {
        vm.startPrank(organizer);
        eventContract.addTicketTier(
            "Regular",
            100 * 10**2,
            200,
            5
        );
        
        string memory updatedName = "Early Bird";
        uint256 updatedPrice = 80 * 10**2; // 80 IDRX (harga diskon)
        uint256 updatedAvailable = 150;
        uint256 updatedMaxPerPurchase = 3;
        
        eventContract.updateTicketTier(
            0, // tierId
            updatedName,
            updatedPrice,
            updatedAvailable,
            updatedMaxPerPurchase
        );
        vm.stopPrank();
        
        (string memory name, uint256 price, uint256 available, uint256 sold, uint256 maxPerPurchase, bool active) = 
            eventContract.ticketTiers(0);
            
        assertEq(name, updatedName);
        assertEq(price, updatedPrice);
        assertEq(available, updatedAvailable);
        assertEq(sold, 0);
        assertEq(maxPerPurchase, updatedMaxPerPurchase);
        assertTrue(active);
    }
    
    function testPurchaseTicket() public {
        vm.startPrank(organizer);
        eventContract.addTicketTier(
            "Regular",
            100 * 10**2, // 100 IDRX
            100, // 100 tiket
            4 // max 4 tiket per pembelian
        );
        vm.stopPrank();
        
        uint256 initialOrganizerBalance = idrx.balanceOf(organizer);
        uint256 initialPlatformBalance = idrx.balanceOf(deployer);
        
        vm.startPrank(buyer1);
        idrx.approve(eventAddress, 500 * 10**2); // approve 500 IDRX
        
        uint256 quantity = 2;
        eventContract.purchaseTicket(0, quantity);
        vm.stopPrank();
        
        (,, , uint256 sold,,) = eventContract.ticketTiers(0);
        assertEq(sold, quantity);
        
        assertEq(ticketNFT.balanceOf(buyer1), quantity);
        
        uint256 ticketPrice = 100 * 10**2; // 100 IDRX
        uint256 totalPrice = ticketPrice * quantity;
        uint256 platformFee = (totalPrice * Constants.PLATFORM_FEE_PERCENTAGE) / Constants.BASIS_POINTS;
        uint256 organizerPayment = totalPrice - platformFee;
        
        assertEq(idrx.balanceOf(deployer) - initialPlatformBalance, platformFee);
        assertEq(idrx.balanceOf(organizer) - initialOrganizerBalance, organizerPayment);
    }
    
    function testSetResaleRules() public {
        vm.startPrank(organizer);
        
        uint256 maxMarkupPercentage = 2000; // 20%
        uint256 organizerFeePercentage = 500; // 5%
        bool restrictResellTiming = true;
        uint256 minDaysBeforeEvent = 3;
        
        eventContract.setResaleRules(
            maxMarkupPercentage,
            organizerFeePercentage,
            restrictResellTiming,
            minDaysBeforeEvent
        );
        vm.stopPrank();
        
        (bool allowResell, uint256 rMaxMarkupPercentage, uint256 rOrganizerFeePercentage, 
         bool rRestrictResellTiming, uint256 rMinDaysBeforeEvent, bool requireVerification) = eventContract.resaleRules();
        
        assertTrue(allowResell); // default is true
        assertEq(rMaxMarkupPercentage, maxMarkupPercentage);
        assertEq(rOrganizerFeePercentage, organizerFeePercentage);
        assertEq(rRestrictResellTiming, restrictResellTiming);
        assertEq(rMinDaysBeforeEvent, minDaysBeforeEvent);
        assertEq(requireVerification, false); // default is false
    }
    
    function _setupTicketsAndPurchase() internal {
        vm.startPrank(organizer);
        eventContract.addTicketTier(
            "Regular",
            100 * 10**2, // 100 IDRX
            100, // 100 tiket
            4 // max 4 tiket per pembelian
        );
        vm.stopPrank();
        
        vm.startPrank(reseller);
        idrx.approve(eventAddress, 200 * 10**2); // approve 200 IDRX
        eventContract.purchaseTicket(0, 2); // beli 2 tiket
        vm.stopPrank();
    }
    
    function testListTicketForResale() public {
        _setupTicketsAndPurchase();
        
        uint256 tokenId = 0; // Biasanya token ID pertama adalah 0
        
        vm.startPrank(reseller);
        
        ticketNFT.approve(eventAddress, tokenId);
        
        uint256 resalePrice = 120 * 10**2; // 120 IDRX (20% markup)
        
        eventContract.listTicketForResale(tokenId, resalePrice);
        vm.stopPrank();
        
        (address seller, uint256 price, bool active,) = eventContract.listings(tokenId);
        
        assertEq(seller, reseller);
        assertEq(price, resalePrice);
        assertTrue(active);
        
        assertEq(ticketNFT.ownerOf(tokenId), eventAddress);
    }
    
    function testPurchaseResaleTicket() public {
        _setupTicketsAndPurchase();
        
        uint256 tokenId = 0;
        uint256 resalePrice = 120 * 10**2; // 120 IDRX (20% markup)
        
        vm.startPrank(reseller);
        ticketNFT.approve(eventAddress, tokenId);
        eventContract.listTicketForResale(tokenId, resalePrice);
        vm.stopPrank();
        
        uint256 initialResellerBalance = idrx.balanceOf(reseller);
        uint256 initialOrganizerBalance = idrx.balanceOf(organizer);
        uint256 initialPlatformBalance = idrx.balanceOf(deployer);
        
        vm.startPrank(buyer2);
        idrx.approve(eventAddress, resalePrice);
        eventContract.purchaseResaleTicket(tokenId);
        vm.stopPrank();
        
        assertEq(ticketNFT.ownerOf(tokenId), buyer2);
        
        (, , bool active,) = eventContract.listings(tokenId);
        assertEq(active, false);
        
        uint256 platformFee = (resalePrice * Constants.PLATFORM_FEE_PERCENTAGE) / Constants.BASIS_POINTS;
        
        (,, uint256 organizerFeePercentage,,,) = eventContract.resaleRules();
        uint256 organizerFee = (resalePrice * organizerFeePercentage) / Constants.BASIS_POINTS;
        
        uint256 sellerAmount = resalePrice - platformFee - organizerFee;
        
        assertEq(idrx.balanceOf(deployer) - initialPlatformBalance, platformFee);
        assertEq(idrx.balanceOf(organizer) - initialOrganizerBalance, organizerFee);
        assertEq(idrx.balanceOf(reseller) - initialResellerBalance, sellerAmount);
    }
    
    function testCancelResaleListing() public {
        _setupTicketsAndPurchase();
        
        uint256 tokenId = 0;
        uint256 resalePrice = 120 * 10**2; // 120 IDRX
        
        vm.startPrank(reseller);
        ticketNFT.approve(eventAddress, tokenId);
        eventContract.listTicketForResale(tokenId, resalePrice);
        
        eventContract.cancelResaleListing(tokenId);
        vm.stopPrank();
        
        (, , bool active,) = eventContract.listings(tokenId);
        assertEq(active, false);
        
        assertEq(ticketNFT.ownerOf(tokenId), reseller);
    }
    
    function testCancelEvent() public {
        vm.startPrank(organizer);
        eventContract.cancelEvent();
        vm.stopPrank();
        
        assertTrue(eventContract.cancelled());
    }
    
    function testRevertIfBuyExceedingMaxPerPurchase() public {
        vm.startPrank(organizer);
        eventContract.addTicketTier(
            "Regular",
            100 * 10**2, // 100 IDRX
            100, // 100 tiket
            4 // max 4 tiket per pembelian
        );
        vm.stopPrank();
        
        vm.startPrank(buyer1);
        idrx.approve(eventAddress, 500 * 10**2);
        
        // Gunakan string error message yang sesuai dengan error sebenarnya
        vm.expectRevert("Quantity exceeds max per purchase");
        eventContract.purchaseTicket(0, 5); // Seharusnya gagal
        vm.stopPrank();
    }
    
    function testRevertIfNonOrganizerUpdateTicketTier() public {
        vm.startPrank(organizer);
        eventContract.addTicketTier(
            "Regular",
            100 * 10**2,
            100,
            4
        );
        vm.stopPrank();
        
        vm.startPrank(buyer1);
        
        vm.expectRevert(_ONLY_ORGANIZER_CAN_CALL_ERROR_SELECTOR);
        eventContract.updateTicketTier(
            0,
            "Updated Name",
            90 * 10**2,
            90,
            3
        );
        vm.stopPrank();
    }
    
    function testRevertIfListTicketExceedingMaxMarkup() public {
        _setupTicketsAndPurchase();
        
        vm.startPrank(organizer);
        eventContract.setResaleRules(
            2000, // 20% maksimum markup
            250,  // 2.5% fee organizer
            false,
            1
        );
        vm.stopPrank();
        
        uint256 tokenId = 0;
        uint256 tooHighResalePrice = 150 * 10**2; // 150 IDRX (50% markup, melebihi batas)
        
        vm.startPrank(reseller);
        ticketNFT.approve(eventAddress, tokenId);
        
        // Gunakan string error message yang sesuai dengan error sebenarnya
        vm.expectRevert("Resale price exceeds maximum allowed markup");
        eventContract.listTicketForResale(tokenId, tooHighResalePrice); // Seharusnya gagal
        vm.stopPrank();
    }
}