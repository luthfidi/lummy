// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
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
    
    // State variables
    uint256 private _tokenIdCounter;
    address public eventContract;
    mapping(uint256 => Structs.TicketMetadata) public ticketMetadata;
    mapping(uint256 => uint256) public transferCount;
    
    // Tambahan: mapping status burned
    mapping(uint256 => bool) public isBurned;
    
    // Secret salt for QR challenge
    bytes32 private immutable _secretSalt;
    
    modifier onlyEventContract() {
        if(msg.sender != eventContract) revert OnlyEventContractCanCall();
        _;
    }
    
    constructor() ERC721("Ticket", "TIX") Ownable(msg.sender) {
        _secretSalt = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender));
    }
    
    // Helper function to check if token exists
    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    // Helper function to check if sender is approved or owner
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || 
                isApprovedForAll(owner, spender) || 
                getApproved(tokenId) == spender);
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
        // Mint new ticket
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        
        // Set metadata
        ticketMetadata[tokenId] = Structs.TicketMetadata({
            eventId: 0,
            tierId: tierId,
            originalPrice: originalPrice,
            used: false,
            purchaseDate: block.timestamp
        });
        
        // Initialize transfer count
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
        if(!_tokenExists(tokenId)) revert TicketDoesNotExist();
        if(ticketMetadata[tokenId].used) revert TicketAlreadyUsed();
        
        address owner = ownerOf(tokenId);
        
        // Generate dynamic QR challenge with current timestamp
        // Divide timestamp by VALIDITY_WINDOW to create time blocks
        // QR code will change every VALIDITY_WINDOW seconds
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
        if(!_tokenExists(tokenId)) revert TicketDoesNotExist();
        if(ticketMetadata[tokenId].used) revert TicketAlreadyUsed();
        if(ownerOf(tokenId) != owner) revert InvalidOwner();
        
        // Validate timestamp
        if(!SecurityLib.validateChallenge(timestamp, Constants.VALIDITY_WINDOW * 2)) revert InvalidTimestamp();
        
        // Create challenge as in generateQRChallenge
        uint256 timeBlock = timestamp / Constants.VALIDITY_WINDOW;
        bytes32 challenge = keccak256(abi.encodePacked(
            tokenId,
            owner,
            timeBlock,
            _secretSalt
        ));
        
        // Recover signer from signature and ensure it is the owner
        address signer = SecurityLib.recoverSigner(challenge, signature);
        return signer == owner;
    }
    
    function useTicket(uint256 tokenId) external override onlyEventContract {
        if(!_tokenExists(tokenId)) revert TicketDoesNotExist();
        if(ticketMetadata[tokenId].used) revert TicketAlreadyUsed();
        
        // Mark ticket as used
        ticketMetadata[tokenId].used = true;
        
        // Emit event
        emit TicketUsed(tokenId, ownerOf(tokenId));
    }
    
    function getTicketMetadata(uint256 tokenId) external view override returns (Structs.TicketMetadata memory) {
        if(!_tokenExists(tokenId)) revert TicketDoesNotExist();
        return ticketMetadata[tokenId];
    }
    
    function markTransferred(uint256 tokenId) external override onlyEventContract {
        if(!_tokenExists(tokenId)) revert TicketDoesNotExist();
        transferCount[tokenId]++;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if(!_tokenExists(tokenId)) revert TicketDoesNotExist();
        
        // In the actual implementation, this could be developed to return the appropriate URI
        // for example, metadata from IPFS based on tokenId and event metadata
        return "https://example.com/api/ticket/metadata";
    }
    
    // We need to explicitly override these functions to satisfy both IERC721 and ITicketNFT interfaces
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    // Fungsi burn NFT
    function burn(uint256 tokenId) external nonReentrant {
        if (!_isApprovedOrOwner(msg.sender, tokenId)) revert NotApprovedOrOwner();
        if (!_tokenExists(tokenId)) revert TicketDoesNotExist();
        _burn(tokenId);
        isBurned[tokenId] = true;
        emit TicketBurned(msg.sender, tokenId, block.timestamp);
    }
    
    // Fungsi generate dynamic QR hanya jika sudah burn
    function generateDynamicQR(uint256 tokenId) external view returns (bytes32) {
        if (!isBurned[tokenId]) revert("TicketNotBurned");
        uint256 timeBlock = block.timestamp / 1800; // 30 menit
        return keccak256(abi.encodePacked(tokenId, msg.sender, timeBlock, _secretSalt));
    }
    
    // Events
    event TicketMinted(uint256 indexed tokenId, address indexed to, uint256 tierId);
    event TicketTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event TicketUsed(uint256 indexed tokenId, address indexed user);
    event TicketBurned(address indexed user, uint256 indexed tokenId, uint256 timestamp);
}