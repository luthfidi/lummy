// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol";
import "lib/openzeppelin-contracts/contracts/utils/Counters.sol";
import "src/libraries/Structs.sol";
import "src/libraries/Constants.sol";
import "src/libraries/SecurityLib.sol";
import "src/interfaces/ITicketNFT.sol";

// Custom errors
error AlreadyInitialized();
error OnlyEventContractCanCall();
error NotApprovedOrOwner();
error TicketAlreadyUsed();
error TicketDoesNotExist();
error InvalidOwner();
error InvalidTimestamp();

contract TicketNFT is ITicketNFT, ERC721Enumerable, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    // Variabel state
    Counters.Counter private _tokenIdCounter;
    address public eventContract;
    mapping(uint256 => Structs.TicketMetadata) public ticketMetadata;
    mapping(uint256 => uint256) public transferCount;
    
    // Secret salt untuk QR challenge
    bytes32 private immutable _secretSalt;
    
    modifier onlyEventContract() {
        if(msg.sender != eventContract) revert OnlyEventContractCanCall();
        _;
    }
    
    constructor() ERC721("Ticket", "TIX") {
        _secretSalt = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender));
    }
    
    function initialize(
        string memory _eventName,
        string memory _symbol,
        address _eventContract
    ) external override {
        if(eventContract != address(0)) revert AlreadyInitialized();
        
        // Store the values in state variables even if we can't use them to rename the token
        string memory fullName = string(abi.encodePacked("Ticket - ", _eventName));
        emit InitializeLog(_eventName, _symbol, fullName);
        
        eventContract = _eventContract;
        
        // Transfer ownership to event contract
        _transferOwnership(_eventContract);
    }

    event InitializeLog(string eventName, string symbol, string fullName);
    
    function mintTicket(
        address to,
        uint256 tierId,
        uint256 originalPrice
    ) external override onlyEventContract nonReentrant returns (uint256) {
        // Mint tiket baru
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        // Set metadata
        ticketMetadata[tokenId] = Structs.TicketMetadata({
            eventId: 0, // Set 0 karena event ID bersifat implisit dari kontrak
            tierId: tierId,
            originalPrice: originalPrice,
            used: false,
            purchaseDate: block.timestamp
        });
        
        // Inisialisasi transfer count
        transferCount[tokenId] = 0;
        
        // Emit event
        emit TicketMinted(tokenId, to, tierId);
        
        return tokenId;
    }
    
    function transferTicket(address to, uint256 tokenId) external override nonReentrant {
        if(!_isApprovedOrOwner(msg.sender, tokenId)) revert NotApprovedOrOwner();
        if(ticketMetadata[tokenId].used) revert TicketAlreadyUsed();
        
        // Increment transfer count
        transferCount[tokenId]++;
        
        // Transfer NFT
        _safeTransfer(msg.sender, to, tokenId, "");
        
        // Emit event
        emit TicketTransferred(tokenId, msg.sender, to);
    }
    
    function generateQRChallenge(uint256 tokenId) external view override returns (bytes32) {
        if(!_exists(tokenId)) revert TicketDoesNotExist();
        if(ticketMetadata[tokenId].used) revert TicketAlreadyUsed();
        
        address owner = ownerOf(tokenId);
        
        // Generate dynamic QR challenge dengan timestamp saat ini
        // Bagi timestamp dengan VALIDITY_WINDOW untuk membuat blok waktu
        // QR code akan berubah setiap VALIDITY_WINDOW detik
        uint256 timeBlock = block.timestamp / Constants.VALIDITY_WINDOW;
        
        return keccak256(abi.encodePacked(
            tokenId,
            owner,
            timeBlock,
            _secretSalt
        ));
    }
    
    function verifyTicket(
        uint256 tokenId,
        address owner,
        uint256 timestamp,
        bytes memory signature
    ) external view override returns (bool) {
        if(!_exists(tokenId)) revert TicketDoesNotExist();
        if(ticketMetadata[tokenId].used) revert TicketAlreadyUsed();
        if(ownerOf(tokenId) != owner) revert InvalidOwner();
        
        // Validasi timestamp
        if(!SecurityLib.validateChallenge(timestamp, Constants.VALIDITY_WINDOW * 2)) revert InvalidTimestamp();
        
        // Buat challenge seperti di generateQRChallenge
        uint256 timeBlock = timestamp / Constants.VALIDITY_WINDOW;
        bytes32 challenge = keccak256(abi.encodePacked(
            tokenId,
            owner,
            timeBlock,
            _secretSalt
        ));
        
        // Recover signer dari signature dan pastikan itu adalah owner
        address signer = SecurityLib.recoverSigner(challenge, signature);
        return signer == owner;
    }
    
    function useTicket(uint256 tokenId) external override onlyEventContract {
        if(!_exists(tokenId)) revert TicketDoesNotExist();
        if(ticketMetadata[tokenId].used) revert TicketAlreadyUsed();
        
        // Mark ticket as used
        ticketMetadata[tokenId].used = true;
        
        // Emit event
        emit TicketUsed(tokenId, ownerOf(tokenId));
    }
    
    function getTicketMetadata(uint256 tokenId) external view override returns (Structs.TicketMetadata memory) {
        if(!_exists(tokenId)) revert TicketDoesNotExist();
        return ticketMetadata[tokenId];
    }
    
    function markTransferred(uint256 tokenId) external override onlyEventContract {
        if(!_exists(tokenId)) revert TicketDoesNotExist();
        transferCount[tokenId]++;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if(!_exists(tokenId)) revert TicketDoesNotExist();
        
        // Dalam implementasi sebenarnya, bisa dikembangkan untuk mengembalikan URI yang sesuai
        // misalnya metadata dari IPFS berdasarkan tokenId dan metadata event
        return "https://example.com/api/ticket/metadata";
    }
    
    // We need to explicitly override these functions to satisfy both IERC721 and ITicketNFT interfaces
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    // Events
    event TicketMinted(uint256 indexed tokenId, address indexed to, uint256 tierId);
    event TicketTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event TicketUsed(uint256 indexed tokenId, address indexed user);
}