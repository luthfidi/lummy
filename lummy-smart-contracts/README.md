# Lummy Smart Contracts

Lummy is a decentralized event ticketing platform built on Lisk Sepolia blockchain. This repository contains the smart contracts that power the Lummy platform.

## Overview

Lummy enables event organizers to create events, sell tickets, and manage resales in a secure and transparent way. The platform uses ERC-721 tokens (NFTs) for tickets, allowing attendees to prove ownership and facilitating a controlled secondary market.

## Core Features

- **Event Creation**: Anyone can create an event with details such as name, description, date, venue, and IPFS metadata
- **Ticket Tiers**: Organizers can set up multiple ticket tiers with different prices
- **Primary Market**: Users can purchase tickets directly from the organizer
- **Secondary Market**: Controlled resale marketplace with:
  - Maximum markup limits to prevent scalping
  - Fee distribution to organizers and the platform
  - Configurable resale timing restrictions
- **Ticket Verification**: Dynamic QR codes with cryptographic challenges for secure ticket validation
- **Fee System**: Configurable platform fees and organizer resale royalties

## Architecture

The project consists of several smart contracts:

1. **EventFactory** - The entry point that allows creation of events and maintains a registry
2. **EventDeployer** - Helper contract that deploys Event and TicketNFT contracts 
3. **Event** - Manages event details, ticket sales, and the resale marketplace
4. **TicketNFT** - ERC-721 contract representing tickets with verification functionality
5. **Libraries** - Helper utilities for various contract functions

## Current MVP Integration

The current MVP integrates:

- ✅ User-owned wallet connections
- ✅ IDRX token integration (testnet)
- ✅ Event creation and management
- ✅ Primary ticket sales with multiple tiers
- ✅ Secondary market with price limits
- ✅ Dynamic QR code ticket verification
- ✅ Fee distribution system
- ✅ Blockchain storage for event metadata
- ✅ IPFS integration for extended event data

## Security

- The contracts use OpenZeppelin's security libraries
- ReentrancyGuard protects against reentrancy attacks
- Custom error selectors for gas optimization
- Access control restrictions for admin functions
- Proper validation for all input parameters