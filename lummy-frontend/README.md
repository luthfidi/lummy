# Lummy Frontend

<img src="public/lummy-icon.png" alt="Lummy Logo" width="80px">

Lummy's frontend application is a React-based web interface for the decentralized ticketing platform, providing users with an intuitive experience for browsing events, purchasing tickets, managing NFT tickets, and participating in the secondary market.

## Technology Stack

- **Framework**: React with TypeScript
- **UI Library**: Chakra UI
- **State Management**: React Context API, useState/useEffect hooks
- **Routing**: React Router v6
- **Blockchain Integration**: wagmi, Ethers.js, Xellar Kit
- **Web3 Wallet**: Xellar Wallet integration
- **Build Tools**: Vite
- **Animations**: Framer Motion
- **Data Visualization**: Recharts

## Features

### User Features

- **Event Discovery**: Browse events by category, location, date, and price
- **Ticket Purchase**: Securely buy tickets using IDRX stablecoin
- **NFT Ticket Management**: View, transfer, and manage NFT tickets in wallet
- **Dynamic QR Codes**: Access secure, time-based QR codes for event entry
- **Secondary Market**: Buy and sell tickets with anti-scalping price controls
- **Wallet Integration**: Connect with Xellar Wallet for blockchain transactions

### Event Organizer Features

- **Event Management**: Create and manage events with detailed information
- **Ticket Tiers**: Configure multiple ticket tiers with custom pricing
- **Sales Analytics**: Track sales and attendance metrics in real-time
- **Check-in System**: Verify tickets at venues with QR scanning
- **Resale Controls**: Set rules for secondary market sales

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application pages
- `/src/hooks` - Custom React hooks for blockchain functionality
- `/src/context` - React Context providers for global state
- `/src/services` - API services and blockchain interactions
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions
- `/src/data` - Mock data for development

## Development Modes

This application can run in two modes:

1. **Connected Mode**: Integrates with deployed smart contracts on Lisk Sepolia Testnet
2. **Mock Mode**: Uses mock data to simulate blockchain functionality (for development)

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lummy.git
   cd lummy/lummy-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_LISK_SEPOLIA_RPC_URL=https://rpc.sepolia.lisk.com
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id
   VITE_XELLAR_APP_ID=your_xellar_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The build files will be in the `dist` directory.

## Integration Status

The current integration with smart contracts has some challenges:
- Reading and writing to Event and TicketNFT contracts has some issues
- Some features may not work as expected in the integrated version

The frontend-only version using mock data provides a complete user experience for demonstration purposes.

## Deployment

The application is deployed on Vercel:

- Connected version: [https://lummy-ticket.vercel.app/](https://lummy-ticket.vercel.app/)
- Frontend-only version: [https://lummy-frontend.vercel.app/](https://lummy-frontend.vercel.app/)