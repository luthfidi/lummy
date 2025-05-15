# Lummy - Decentralized Ticket Platform


<img src="public/lummy-icon.png" alt="Lummy Logo" width="80px">

Lummy is a revolutionary decentralized ticket platform built on the Lisk blockchain. Using NFT technology and IDRX stablecoin payments, Lummy eliminates common issues in the traditional ticketing industry such as counterfeiting, scalping, and complex verification processes. The platform securely and transparently connects event organizers with ticket buyers, ensuring ticket authenticity and giving more control to event organizers.

## Lisk Builders Challenge Submission

This project is being developed for the Lisk Builders Challenge hackathon (March-May 2025).

The Lisk Builders Challenge is an opportunity for developers to turn innovative blockchain ideas into reality. With a 3-month development period featuring workshops and mentorship, the challenge culminates in a Demo Day in Jakarta where the 10 best projects will compete.

### Key Tech Requirements:

- Smart Contract(s) deployed on Lisk Sepolia Testnet or Lisk Mainnet
- Integration with IDRX Stablecoin on Lisk Mainnet or Testnet
- Built with Xellar Kit for wallet integration

## Technology Stack

- **Frontend**: React with TypeScript, Chakra UI
- **Blockchain**: Lisk
- **Wallet Integration**: Xellar Wallet
- **Payment**: IDRX stablecoin
- **Authentication**: Web3 wallet authentication
- **Token Standard**: ERC-721 (NFT) for tickets

## Core Features

### 1. User Features

- Browse events by category, location, date, and price
- Purchase tickets securely using IDRX
- Receive NFT tickets in wallet
- Access QR codes for event entry
- Transfer tickets to other users
- Resell tickets on the marketplace (with anti-scalping measures)
- View ticket history and ownership records

### 2. Event Organizer Features

- Create and manage events
- Set up ticket tiers with customizable pricing
- Control reselling parameters (max markup %)
- Track sales and attendance in real-time
- Verify tickets at the venue
- Receive royalties from resales

### 3. Anti-Fraud & Anti-Scalping Features

- Blockchain verification ensures ticket authenticity
- QR codes change dynamically to prevent screenshots
- Price ceiling on resales to prevent scalping
- Transparent ownership history
- Optional KYC verification for high-security events

## Project Structure

### Frontend Pages

- **Home Page**: Featured events, category navigation, search functionality
- **Events Page**: Browse and filter events with comprehensive search options
- **Event Detail Page**: Complete event information and ticket purchasing
- **Checkout Process**: Secure IDRX payment via Xellar Wallet
- **Profile**: User ticket management, transaction history, wallet details
- **My Tickets**: View, manage, and transfer owned tickets
- **Marketplace**: Secondary market for ticket reselling with anti-scalping measures
- **Admin Dashboard**: Event creation and management for organizers
- **Ticket Management**: Check-in system with QR code scanning for event staff

### Key Components

- Event catalog with filtering and search
- Wallet connection and management
- NFT ticket minting and transfer
- QR code verification system
- User authentication and profiles
- Anti-scalping price controls
- Transaction history and tracking

## Current Development Progress

- ✅ UI Framework setup with Chakra UI
- ✅ Page routing structure
- ✅ User Profile page and components
- ✅ Home Page enhancement with featured events
- ✅ Events browsing and filtering system
- ✅ Ticket Management system for check-ins
- ✅ Category navigation and filtering
- ✅ Wallet integration with Xellar Kit
- 🔄 Event detail page (in progress)
- 🔄 Smart contract development (in progress)
- ⬜ Checkout process
- ⬜ NFT ticket issuance
- ⬜ Marketplace for reselling
- ⬜ Admin dashboard for event organizers

## Unique Value Proposition

Lummy transforms the ticketing experience by:

- **Eliminating fraud**: Blockchain-verified NFT tickets cannot be counterfeited
- **Fair reselling**: Price caps prevent excessive scalping while allowing legitimate transfers
- **Transparent ownership**: Complete history of ticket ownership and transfers
- **Enhanced control**: Event organizers set parameters for resales and receive royalties
- **Seamless experience**: User-friendly interface despite the advanced technology underneath
