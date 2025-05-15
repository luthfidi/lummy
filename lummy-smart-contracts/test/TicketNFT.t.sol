// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "forge-std/Test.sol";
import "src/core/TicketNFT.sol";
import "src/core/Event.sol";
import "src/libraries/Constants.sol";
import "forge-std/console.sol";

contract TicketNFTTest is Test {
    // Kontrak untuk testing
    TicketNFT public ticketNFT;
    Event public eventContract;
    
    // Alamat untuk testing
    address public deployer;
    address public organizer;
    address public eventAddress;
    address public attendee1;
    address public attendee2;
    
    // Data event
    string public eventName = "Konser Musik";
    uint256 public eventDate;
    
    // Private key untuk testing signature
    uint256 private _attendee1PrivateKey;
    
    // Custom error signatures for matching in tests
    bytes4 private constant _TICKET_ALREADY_USED_ERROR_SELECTOR = bytes4(keccak256("TicketAlreadyUsed()"));
    bytes4 private constant _ONLY_EVENT_CONTRACT_CAN_CALL_ERROR_SELECTOR = bytes4(keccak256("OnlyEventContractCanCall()"));
    bytes4 private constant _INVALID_TIMESTAMP_ERROR_SELECTOR = bytes4(keccak256("InvalidTimestamp()"));
    
    function setUp() public {
        console.log("Setting up TicketNFT test environment");
        
        // Setup alamat untuk testing
        deployer = makeAddr("deployer");
        organizer = makeAddr("organizer");
        
        // Generate private key untuk attendee1 (untuk testing signature)
        _attendee1PrivateKey = 0xA11CE; // Private key tetap (untuk konsistensi debugging)
        attendee1 = vm.addr(_attendee1PrivateKey);
        console.log("Attendee1 address:", attendee1);
        
        attendee2 = makeAddr("attendee2");
        
        // Set tanggal event (30 hari di masa depan)
        eventDate = block.timestamp + 30 days;
        
        // Deploy dan setup kontrak Event
        vm.startPrank(organizer);
        
        // Deploy Event contract
        eventContract = new Event();
        
        // Initialize Event
        eventContract.initialize(
            organizer,
            eventName,
            "Konser musik spektakuler",
            eventDate,
            "Jakarta International Stadium",
            "ipfs://event-metadata"
        );
        
        eventAddress = address(eventContract);
        
        // Deploy TicketNFT
        ticketNFT = new TicketNFT();
        
        // Initialize TicketNFT
        ticketNFT.initialize(eventName, "TIX", eventAddress);
        
        // Setup TicketNFT di Event
        eventContract.setTicketNFT(address(ticketNFT), address(0x1), deployer);
        
        vm.stopPrank();
        
        console.log("TicketNFT deployed at:", address(ticketNFT));
        console.log("Event deployed at:", eventAddress);
    }
    
    // Test inisialisasi TicketNFT
    function testTicketNFTInitialization() public view {
        // Verifikasi event contract
        assertEq(ticketNFT.eventContract(), eventAddress);
        
        // Verifikasi owner adalah Event contract
        assertEq(ticketNFT.owner(), eventAddress);
    }
    
    // Helper function untuk minting tiket
    function _mintTicket(address to, uint256 tierId, uint256 price) internal returns (uint256) {
        vm.startPrank(eventAddress);
        uint256 tokenId = ticketNFT.mintTicket(to, tierId, price);
        vm.stopPrank();
        return tokenId;
    }
    
    // Test minting tiket
    function testMintTicket() public {
        uint256 tierId = 1;
        uint256 price = 100 * 10**2;
        
        // Event contract mints ticket to attendee1
        vm.startPrank(eventAddress);
        uint256 tokenId = ticketNFT.mintTicket(attendee1, tierId, price);
        vm.stopPrank();
        
        // Verifikasi tiket minted dengan benar
        assertEq(ticketNFT.ownerOf(tokenId), attendee1);
        assertEq(ticketNFT.balanceOf(attendee1), 1);
        
        // Verifikasi metadata tiket
        (uint256 eventId, uint256 storedTierId, uint256 originalPrice, bool used, uint256 purchaseDate) = 
            ticketNFT.ticketMetadata(tokenId);
            
        assertEq(eventId, 0);  // Event ID default adalah 0
        assertEq(storedTierId, tierId);
        assertEq(originalPrice, price);
        assertEq(used, false);
        assertEq(purchaseDate, block.timestamp);
    }
    
    // Test transfer tiket
    function testTransferTicket() public {
        // Mint tiket terlebih dahulu
        uint256 tokenId = _mintTicket(attendee1, 1, 100 * 10**2);
        
        // Attendee1 mentransfer tiket ke attendee2
        vm.startPrank(attendee1);
        ticketNFT.transferTicket(attendee2, tokenId);
        vm.stopPrank();
        
        // Verifikasi tiket ditransfer dengan benar
        assertEq(ticketNFT.ownerOf(tokenId), attendee2);
        assertEq(ticketNFT.balanceOf(attendee1), 0);
        assertEq(ticketNFT.balanceOf(attendee2), 1);
        
        // Verifikasi transfer count
        assertEq(ticketNFT.transferCount(tokenId), 1);
    }
    
    // Test generate QR challenge
    function testGenerateQRChallenge() public {
        // Mint tiket terlebih dahulu
        uint256 tokenId = _mintTicket(attendee1, 1, 100 * 10**2);
        
        // Generate QR challenge
        bytes32 challenge = ticketNFT.generateQRChallenge(tokenId);
        
        // Verifikasi challenge bukan bytes32(0)
        assertTrue(challenge != bytes32(0));
        
        // Generate QR challenge lagi setelah beberapa waktu
        vm.warp(block.timestamp + Constants.VALIDITY_WINDOW + 1);
        
        // Generate QR challenge baru
        bytes32 newChallenge = ticketNFT.generateQRChallenge(tokenId);
        
        // Verifikasi challenge berubah
        assertTrue(challenge != newChallenge);
    }
    
    // Test verifikasi tiket
    function testVerifyTicket() public {
        // Mint tiket terlebih dahulu
        uint256 tokenId = _mintTicket(attendee1, 1, 100 * 10**2);
        
        // Trace debug untuk memeriksa nilai
        console.log("TokenId:", tokenId);
        console.log("Owner:", ticketNFT.ownerOf(tokenId));
        console.log("Expected signer:", attendee1);
        
        // Generate QR challenge untuk debug
        bytes32 challenge = ticketNFT.generateQRChallenge(tokenId);
        console.log("Challenge:", vm.toString(challenge));
        
        // Buat message hash sesuai dengan implementasi di SecurityLib
        bytes32 messageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", challenge)
        );
        console.log("Message hash:", vm.toString(messageHash));
        
        // Attendee1 signs challenge dengan private key
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(_attendee1PrivateKey, messageHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        console.log("Signature length:", signature.length);
        console.log("v:", v);
        
        // Gunakan timestamp saat ini untuk challenge
        uint256 currentTime = block.timestamp;
        
        // Verifikasi tiket - gunakan implementasi manual untuk debug
        address signer = ecrecover(messageHash, v, r, s);
        console.log("Recovered signer:", signer);
        
        // Verifikasi tiket 
        bool isValid = ticketNFT.verifyTicket(
            tokenId,
            attendee1,
            currentTime,
            signature
        );
        
        // Harusnya valid
        assertTrue(isValid);
    }
    
    // Test penggunaan tiket
    function testUseTicket() public {
        // Mint tiket terlebih dahulu
        uint256 tokenId = _mintTicket(attendee1, 1, 100 * 10**2);
        
        // Gunakan tiket (hanya event contract yang bisa melakukan ini)
        vm.startPrank(eventAddress);
        ticketNFT.useTicket(tokenId);
        vm.stopPrank();
        
        // Verifikasi tiket telah digunakan
        (,,,bool used,) = ticketNFT.ticketMetadata(tokenId);
        assertTrue(used);
    }
    
    // Test verifikasi tiket gagal karena timestamp tidak valid
    function testRevertIfVerifyTicketInvalidTimestamp() public {
        // Mint tiket terlebih dahulu
        uint256 tokenId = _mintTicket(attendee1, 1, 100 * 10**2);
        
        // Buat message hash sesuai dengan implementasi di SecurityLib
        bytes32 challenge = ticketNFT.generateQRChallenge(tokenId);
        bytes32 messageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", challenge)
        );
        
        // Attendee1 signs challenge
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(_attendee1PrivateKey, messageHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        // Warp ke waktu yang jauh melewati validity window
        vm.warp(block.timestamp + Constants.VALIDITY_WINDOW * 3);
        
        // Ekspektasi revert
        vm.expectRevert(_INVALID_TIMESTAMP_ERROR_SELECTOR);
        ticketNFT.verifyTicket(
            tokenId,
            attendee1,
            block.timestamp - Constants.VALIDITY_WINDOW * 3,
            signature
        );
    }
    
    // Test penggunaan tiket hanya oleh event contract
    function testRevertIfUseTicketByNonEventContract() public {
        // Mint tiket terlebih dahulu
        uint256 tokenId = _mintTicket(attendee1, 1, 100 * 10**2);
        
        // Coba gunakan tiket sebagai attendee1 (bukan event contract)
        vm.startPrank(attendee1);
        
        // Ekspektasi revert
        vm.expectRevert(_ONLY_EVENT_CONTRACT_CAN_CALL_ERROR_SELECTOR);
        ticketNFT.useTicket(tokenId);
        vm.stopPrank();
    }
    
    // Test tiket tidak bisa ditransfer setelah digunakan
    function testRevertIfTransferUsedTicket() public {
        // Mint tiket terlebih dahulu
        uint256 tokenId = _mintTicket(attendee1, 1, 100 * 10**2);
        
        // Gunakan tiket
        vm.startPrank(eventAddress);
        ticketNFT.useTicket(tokenId);
        vm.stopPrank();
        
        // Coba transfer tiket yang sudah digunakan
        vm.startPrank(attendee1);
        
        // Ekspektasi revert
        vm.expectRevert(_TICKET_ALREADY_USED_ERROR_SELECTOR);
        ticketNFT.transferTicket(attendee2, tokenId);
        vm.stopPrank();
    }
    
    // Test mark transferred
    function testMarkTransferred() public {
        // Mint tiket terlebih dahulu
        uint256 tokenId = _mintTicket(attendee1, 1, 100 * 10**2);
        
        // Verifikasi transfer count awal
        assertEq(ticketNFT.transferCount(tokenId), 0);
        
        // Mark transferred (hanya event contract yang bisa melakukan ini)
        vm.startPrank(eventAddress);
        ticketNFT.markTransferred(tokenId);
        vm.stopPrank();
        
        // Verifikasi transfer count bertambah
        assertEq(ticketNFT.transferCount(tokenId), 1);
    }
}