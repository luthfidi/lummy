# Lummy Smart Contracts

Lummy's smart contracts provide the blockchain infrastructure for a decentralized event ticketing platform built on Lisk Sepolia blockchain. These contracts enable event creation, ticket sales, secure transfers, and a controlled secondary market with anti-scalping measures.

## Deployments

The smart contracts are deployed on Lisk Sepolia Testnet:

- **EventFactory**: [0xb542de333373ffDB3FD40950a579033896a403bb](https://sepolia-blockscout.lisk.com/address/0xb542de333373ffDB3FD40950a579033896a403bb)
- **EventDeployer**: [0x1F7319899EB9dF662CC2e658fC54B77e34A84148](https://sepolia-blockscout.lisk.com/address/0x1F7319899EB9dF662CC2e658fC54B77e34A84148)

## Technology Stack

- **Blockchain**: Lisk Sepolia Testnet
- **Smart Contract Language**: Solidity 0.8.29
- **Development Framework**: Foundry (Forge, Cast, Anvil)
- **Libraries**: OpenZeppelin Contracts
- **Token Standards**: ERC-721 (NFT) for tickets
- **Payment**: IDRX stablecoin integration

## Core Features

### Event Creation & Management
- Factory pattern for deploying new event contracts
- Event metadata storage on-chain with IPFS integration for extended data
- Multi-tier ticket creation with customizable pricing and supply

### Primary Market
- Direct ticket sales using IDRX stablecoin
- Automatic NFT minting upon purchase
- Configurable purchase limits per buyer

### Secondary Market
- Controlled resale marketplace with anti-scalping mechanisms
- Maximum markup percentage limiting (configurable by organizer)
- Fee distribution between platform and event organizers
- Configurable resale timing restrictions

### Security & Verification
- Dynamic QR code generation with cryptographic challenges
- Signature-based ticket verification
- Transfer tracking and usage status

### Fee System
- Transparent fee distribution for primary and secondary sales
- Configurable organizer royalties for resales
- Platform fee management

## Contract Architecture

The project consists of several smart contracts:

1. **EventFactory.sol** - Entry point that allows creation of events and maintains a registry
2. **EventDeployer.sol** - Helper contract that deploys Event and TicketNFT contracts
3. **Event.sol** - Manages event details, ticket sales, and the resale marketplace
4. **TicketNFT.sol** - ERC-721 contract representing tickets with verification functionality
5. **Libraries**:
   - **Structs.sol** - Data structures for events, tickets, and marketplace listings
   - **Constants.sol** - System-wide constants like fee percentages
   - **SecurityLib.sol** - Cryptographic helpers for ticket verification
   - **TicketLib.sol** - Functions for ticket validation and fee calculations

## Setup & Development

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- [Node.js](https://nodejs.org/) (for scripting if needed)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/luthfidi/lummy.git
   cd lummy/lummy-smart-contracts
   ```

2. Install dependencies:
   ```bash
   forge install
   ```

### Compiling

```bash
forge build
```

### Testing

```bash
forge test
```

For more detailed test output:
```bash
forge test -vvv
```

### Deployment

Create a `.env` file with the following variables:
```
PRIVATE_KEY=your_private_key
LISK_SEPOLIA_RPC_URL=https://rpc.sepolia.lisk.com
```

Then deploy with:
```bash
source .env
forge script script/DeployLummy.s.sol --rpc-url $LISK_SEPOLIA_RPC_URL --broadcast
```

## Key Smart Contract Interactions

### Creating an Event
```solidity
// Call EventFactory.createEvent
function createEvent(
    string memory name,
    string memory description,
    uint256 date,
    string memory venue,
    string memory ipfsMetadata
) external returns (address);
```

### Adding Ticket Tiers
```solidity
// Call Event.addTicketTier
function addTicketTier(
    string memory name,
    uint256 price,
    uint256 available,
    uint256 maxPerPurchase
) external;
```

### Purchasing Tickets
```solidity
// Call Event.purchaseTicket
function purchaseTicket(uint256 tierId, uint256 quantity) external;
```

### Listing a Ticket for Resale
```solidity
// Call Event.listTicketForResale
function listTicketForResale(uint256 tokenId, uint256 price) external;
```

### Purchasing a Resale Ticket
```solidity
// Call Event.purchaseResaleTicket
function purchaseResaleTicket(uint256 tokenId) external;
```

## Security Features

- ReentrancyGuard for all state-changing functions
- Access control restrictions for administrative functions
- Custom error selectors for gas optimization
- Validation checks for all input parameters
- Time-based verification for ticket QR codes