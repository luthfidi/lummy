// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "forge-std/Test.sol";
import "src/core/EventFactory.sol";
import "src/core/Event.sol";
import "src/core/TicketNFT.sol";
import "src/libraries/Constants.sol";
import "forge-std/console.sol";

// Mock IDRX token untuk testing
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
        _decimals = 2; // IDRX memiliki 2 desimal
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
        
        // Jika allowance tidak terhingga (uint256 max value), jangan kurangi
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

contract FeeDistributionTest is Test {
    // Kontrak untuk testing
    EventFactory public factory;
    Event public eventContract;
    ITicketNFT public ticketNFT;
    MockIDRX public idrx;
    
    // Alamat untuk testing
    address public deployer;
    address public platformFeeReceiver;
    address public organizer;
    address public buyer;
    address public reseller;
    
    // Data event
    uint256 public eventDate;
    address public eventAddress;
    
    // Ticket prices and fees
    uint256 public constant TICKET_PRICE = 100 * 10**2; // 100 IDRX
    uint256 public constant RESALE_PRICE = 120 * 10**2; // 120 IDRX (20% markup)
    uint256 public constant PLATFORM_FEE_PERCENTAGE = Constants.PLATFORM_FEE_PERCENTAGE; // 100 basis points = 1%
    uint256 public constant ORGANIZER_FEE_PERCENTAGE = 250; // 250 basis points = 2.5%
    
    function setUp() public {
        console.log("Setting up FeeDistribution test environment");
        
        // Setup alamat untuk testing
        deployer = makeAddr("deployer");
        platformFeeReceiver = makeAddr("platformFeeReceiver");
        organizer = makeAddr("organizer");
        buyer = makeAddr("buyer");
        reseller = makeAddr("reseller");
        
        // Set tanggal event (30 hari di masa depan)
        eventDate = block.timestamp + 30 days;
        
        // Deploy kontrak sebagai deployer
        vm.startPrank(deployer);
        
        // Deploy token IDRX
        idrx = new MockIDRX("IDRX Token", "IDRX");
        
        // Deploy EventFactory
        factory = new EventFactory(address(idrx));
        
        // Set platform fee receiver
        factory.setPlatformFeeReceiver(platformFeeReceiver);
        
        vm.stopPrank();
        
        // Mint IDRX ke akun pengujian
        idrx.mint(buyer, 10000 * 10**2);
        idrx.mint(reseller, 10000 * 10**2);
        
        // Create Event directly untuk tes
        vm.startPrank(organizer);
        
        // 1. Deploy Event contract
        eventContract = new Event();
        
        // 2. Initialize Event
        eventContract.initialize(
            organizer,
            "Concert Event",
            "A live music concert",
            eventDate,
            "Jakarta Convention Center",
            "ipfs://QmTestMetadata"
        );
        
        // 3. Deploy TicketNFT
        TicketNFT ticketNFTContract = new TicketNFT();
        
        // 4. Initialize TicketNFT
        ticketNFTContract.initialize("Concert Event", "TIX", address(eventContract));
        
        // 5. Set TicketNFT in Event
        eventContract.setTicketNFT(address(ticketNFTContract), address(idrx), platformFeeReceiver);
        
        // 6. Tambahkan tier tiket
        eventContract.addTicketTier(
            "Regular",
            TICKET_PRICE,
            100, // 100 tiket tersedia
            4 // max 4 tiket per pembelian
        );
        
        // 7. Set resale rules
        eventContract.setResaleRules(
            2000, // 20% max markup
            ORGANIZER_FEE_PERCENTAGE, // 2.5% organizer fee
            false, // tidak ada batasan waktu resale
            1 // minimum 1 hari sebelum event
        );
        
        // Store alamat dan kontrak
        eventAddress = address(eventContract);
        ticketNFT = ITicketNFT(address(ticketNFTContract));
        
        vm.stopPrank();
        
        console.log("Event created at:", eventAddress);
        console.log("TicketNFT created at:", address(ticketNFT));
    }
    
    // Test distribusi fee untuk pembelian tiket primary
    function testPrimaryPurchaseFeeDistribution() public {
        // Catat saldo awal
        uint256 initialOrganizerBalance = idrx.balanceOf(organizer);
        uint256 initialPlatformBalance = idrx.balanceOf(platformFeeReceiver);
        uint256 initialBuyerBalance = idrx.balanceOf(buyer);
        
        // Log saldo awal untuk debugging
        console.log("Initial balances:");
        console.log("  Organizer:", initialOrganizerBalance);
        console.log("  Platform:", initialPlatformBalance);
        console.log("  Buyer:", initialBuyerBalance);
        
        // Beli 2 tiket sebagai buyer
        vm.startPrank(buyer);
        idrx.approve(eventAddress, TICKET_PRICE * 2);
        eventContract.purchaseTicket(0, 2);
        vm.stopPrank();
        
        // Hitung fee yang diharapkan
        uint256 totalPurchaseAmount = TICKET_PRICE * 2;
        uint256 expectedPlatformFee = (totalPurchaseAmount * PLATFORM_FEE_PERCENTAGE) / Constants.BASIS_POINTS;
        uint256 expectedOrganizerShare = totalPurchaseAmount - expectedPlatformFee;
        
        // Log pembayaran yang diharapkan
        console.log("Expected distribution for purchase amount:", totalPurchaseAmount);
        console.log("  Platform fee:", expectedPlatformFee);
        console.log("  Organizer share:", expectedOrganizerShare);
        
        // Verifikasi distribusi fee
        uint256 actualPlatformFee = idrx.balanceOf(platformFeeReceiver) - initialPlatformBalance;
        uint256 actualOrganizerShare = idrx.balanceOf(organizer) - initialOrganizerBalance;
        uint256 buyerSpent = initialBuyerBalance - idrx.balanceOf(buyer);
        
        // Log distribusi aktual
        console.log("Actual distribution:");
        console.log("  Platform received:", actualPlatformFee);
        console.log("  Organizer received:", actualOrganizerShare);
        console.log("  Buyer spent:", buyerSpent);
        
        // Assertions
        assertEq(actualPlatformFee, expectedPlatformFee, "Platform fee tidak sesuai harapan");
        assertEq(actualOrganizerShare, expectedOrganizerShare, "Organizer fee tidak sesuai harapan");
        assertEq(buyerSpent, totalPurchaseAmount, "Pembeli membayar jumlah yang tidak sesuai");
    }
    
    // Helper untuk membeli dan list tiket resale
    function _buyAndListTicket() internal returns (uint256) {
        // Beli tiket sebagai reseller
        vm.startPrank(reseller);
        idrx.approve(eventAddress, TICKET_PRICE);
        eventContract.purchaseTicket(0, 1);
        
        // Dapatkan tokenId
        uint256 tokenId = 0; // Biasanya token pertama adalah 0
        
        // List tiket untuk resale
        ticketNFT.approve(eventAddress, tokenId);
        eventContract.listTicketForResale(tokenId, RESALE_PRICE);
        vm.stopPrank();
        
        return tokenId;
    }
    
    // Test distribusi fee untuk pembelian tiket secondary (resale)
    function testResaleFeeDistribution() public {
        // Setup tiket resale
        uint256 tokenId = _buyAndListTicket();
        
        // Catat saldo awal sebelum pembelian resale
        uint256 initialOrganizerBalance = idrx.balanceOf(organizer);
        uint256 initialPlatformBalance = idrx.balanceOf(platformFeeReceiver);
        uint256 initialResellerBalance = idrx.balanceOf(reseller);
        uint256 initialBuyerBalance = idrx.balanceOf(buyer);
        
        // Log saldo awal untuk debugging
        console.log("Initial balances for resale:");
        console.log("  Organizer:", initialOrganizerBalance);
        console.log("  Platform:", initialPlatformBalance);
        console.log("  Reseller:", initialResellerBalance);
        console.log("  Buyer:", initialBuyerBalance);
        
        // Beli tiket resale sebagai buyer
        vm.startPrank(buyer);
        idrx.approve(eventAddress, RESALE_PRICE);
        eventContract.purchaseResaleTicket(tokenId);
        vm.stopPrank();
        
        // Hitung fee yang diharapkan untuk resale
        uint256 platformFee = (RESALE_PRICE * PLATFORM_FEE_PERCENTAGE) / Constants.BASIS_POINTS;
        uint256 organizerFee = (RESALE_PRICE * ORGANIZER_FEE_PERCENTAGE) / Constants.BASIS_POINTS;
        uint256 sellerAmount = RESALE_PRICE - platformFee - organizerFee;
        
        // Log pembayaran yang diharapkan
        console.log("Expected distribution for resale amount:", RESALE_PRICE);
        console.log("  Platform fee:", platformFee);
        console.log("  Organizer fee:", organizerFee);
        console.log("  Seller amount:", sellerAmount);
        
        // Verifikasi distribusi fee
        uint256 actualPlatformFee = idrx.balanceOf(platformFeeReceiver) - initialPlatformBalance;
        uint256 actualOrganizerFee = idrx.balanceOf(organizer) - initialOrganizerBalance;
        uint256 actualSellerAmount = idrx.balanceOf(reseller) - initialResellerBalance;
        uint256 buyerSpent = initialBuyerBalance - idrx.balanceOf(buyer);
        
        // Log distribusi aktual
        console.log("Actual distribution for resale:");
        console.log("  Platform received:", actualPlatformFee);
        console.log("  Organizer received:", actualOrganizerFee);
        console.log("  Seller received:", actualSellerAmount);
        console.log("  Buyer spent:", buyerSpent);
        
        // Assertions
        assertEq(actualPlatformFee, platformFee, "Platform fee tidak sesuai harapan");
        assertEq(actualOrganizerFee, organizerFee, "Organizer fee tidak sesuai harapan");
        assertEq(actualSellerAmount, sellerAmount, "Seller amount tidak sesuai harapan");
        assertEq(buyerSpent, RESALE_PRICE, "Pembeli membayar jumlah yang tidak sesuai");
    }
    
    // Test perubahan platform fee receiver
    function testPlatformFeeReceiver() public {
        // Setup - Ambil platform fee receiver saat ini
        address currentPlatformFeeReceiver = platformFeeReceiver;
        console.log("Current platformFeeReceiver:", currentPlatformFeeReceiver);
        
        // Beli tiket untuk menghasilkan fee
        vm.startPrank(buyer);
        idrx.approve(eventAddress, TICKET_PRICE);
        eventContract.purchaseTicket(0, 1);
        vm.stopPrank();
        
        // Verifikasi platform fee diterima dengan benar
        uint256 initialPlatformFeeAmount = idrx.balanceOf(currentPlatformFeeReceiver);
        assertTrue(initialPlatformFeeAmount > 0, "Platform fee tidak diterima");
        
        // Perhatikan: Kita tidak dapat mengubah alamat platform fee receiver pada Event
        // yang sudah diinisialisasi karena ada pemeriksaan "TicketNFT already set"
        // Sebagai gantinya, kita buat Event baru untuk menguji fungsi ini
        
        // Buat Event baru dan setup dengan platform fee receiver yang berbeda
        vm.startPrank(organizer);
        Event newEvent = new Event();
        newEvent.initialize(
            organizer,
            "New Event",
            "Another concert",
            eventDate,
            "Different Venue",
            "ipfs://new-metadata"
        );
        
        // Buat TicketNFT baru
        TicketNFT newTicketNFT = new TicketNFT();
        newTicketNFT.initialize("New Event", "NTIX", address(newEvent));
        
        // Buat alamat penerima fee baru yang berbeda
        address newFeeReceiver = makeAddr("newFeeReceiver");
        console.log("New platformFeeReceiver:", newFeeReceiver);
        
        // Set TicketNFT dengan penerima fee yang berbeda
        newEvent.setTicketNFT(address(newTicketNFT), address(idrx), newFeeReceiver);
        
        // Tambahkan tier tiket
        newEvent.addTicketTier(
            "Regular",
            TICKET_PRICE,
            100,
            4
        );
        vm.stopPrank();
        
        // Beli tiket dari event baru
        vm.startPrank(buyer);
        idrx.approve(address(newEvent), TICKET_PRICE);
        newEvent.purchaseTicket(0, 1);
        vm.stopPrank();
        
        // Verifikasi fee diterima oleh penerima baru
        uint256 newReceiverFeeAmount = idrx.balanceOf(newFeeReceiver);
        console.log("Fee amount to new receiver:", newReceiverFeeAmount);
        
        // Hitung expected fee
        uint256 expectedFee = (TICKET_PRICE * PLATFORM_FEE_PERCENTAGE) / Constants.BASIS_POINTS;
        
        assertTrue(newReceiverFeeAmount > 0, "Fee tidak diterima oleh penerima baru");
        assertEq(newReceiverFeeAmount, expectedFee, "Fee tidak sesuai dengan yang diharapkan");
        
        // Verifikasi penerima lama tidak menerima fee dari event baru
        uint256 currentReceiverFinalAmount = idrx.balanceOf(currentPlatformFeeReceiver);
        assertEq(currentReceiverFinalAmount, initialPlatformFeeAmount, "Penerima lama menerima fee dari event baru");
    }
    
    // Test platform fee percentage
    function testPlatformFeePercentage() public {
        // Verifikasi platform fee di factory
        uint256 factoryPlatformFee = factory.getPlatformFeePercentage();
        assertEq(factoryPlatformFee, PLATFORM_FEE_PERCENTAGE, "Platform fee tidak sesuai dengan konstanta");
        
        // Beli tiket dan verifikasi fee
        vm.startPrank(buyer);
        idrx.approve(eventAddress, TICKET_PRICE);
        eventContract.purchaseTicket(0, 1);
        vm.stopPrank();
        
        // Hitung expected fee
        uint256 expectedFee = (TICKET_PRICE * PLATFORM_FEE_PERCENTAGE) / Constants.BASIS_POINTS;
        
        // Verifikasi fee diterima dengan benar
        uint256 actualFee = idrx.balanceOf(platformFeeReceiver);
        assertEq(actualFee, expectedFee, "Platform fee tidak sesuai harapan");
    }
}