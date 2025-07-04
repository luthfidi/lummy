# Lummy - Decentralized Ticketing Platform

<img src="lummy-frontend/public/lummy-icon.png" alt="Lummy Logo" width="80px">

Lummy is a revolutionary decentralized ticket platform built on the Lisk blockchain. Using NFT technology and IDRX stablecoin payments, Lummy eliminates common issues in the traditional ticketing industry such as counterfeiting, scalping, and complex verification processes. The platform securely and transparently connects event organizers with ticket buyers, ensuring ticket authenticity and giving more control to event organizers.

## About This Repository

This repository contains both the frontend application and smart contracts for the Lummy platform, merged from two previously separate repositories:

- [lummy-frontend](https://github.com/luthfidi/lummy-frontend) - React frontend application
- [lummy-smart-contracts](https://github.com/luthfidi/lummy-smart-contracts) - Solidity smart contracts for the Lisk blockchain

## Deployed Versions

There are two deployed versions of the application:

1. **Frontend with Smart Contract Integration**:
   - URL: [https://lummy-ticket.vercel.app/](https://lummy-ticket.vercel.app/)
   - Note: This version has some integration issues with smart contract read/write functionality for event and ticket NFT contracts, resulting in some disconnected features.

2. **Frontend Only (Mock Data)**:
   - URL: [https://lummy-frontend.vercel.app/](https://lummy-frontend.vercel.app/)
   - This version uses mock data and simulates blockchain interactions.

## Smart Contract Deployments

The smart contracts are deployed on Lisk Sepolia Testnet:

- **EventFactory**: [0xb542de333373ffDB3FD40950a579033896a403bb](https://sepolia-blockscout.lisk.com/address/0xb542de333373ffDB3FD40950a579033896a403bb)
- **EventDeployer**: [0x1F7319899EB9dF662CC2e658fC54B77e34A84148](https://sepolia-blockscout.lisk.com/address/0x1F7319899EB9dF662CC2e658fC54B77e34A84148)

## Technology Stack

### Combined Technology Stack

- **Frontend**: React, TypeScript, Chakra UI, React Router, wagmi, Framer Motion
- **Blockchain**: Lisk Sepolia Testnet, Solidity 0.8.29
- **Smart Contracts**: OpenZeppelin libraries, Foundry development framework
- **Wallet Integration**: Xellar Kit (for wallet connection to Lisk)
- **Payment**: IDRX Stablecoin
- **Development Tools**: Vite, Forge, Ethers.js

### Project Structure

- `/lummy-frontend` - Frontend application code
- `/lummy-smart-contracts` - Smart contract code

## Core Features

- **NFT-Based Tickets**: Each ticket is a unique NFT token on the Lisk blockchain
- **Event Creation**: Organizers can create events and set up multiple ticket tiers
- **Primary Market**: Users can purchase tickets directly from organizers
- **Secondary Market**: Controlled resale marketplace with anti-scalping measures
- **Dynamic QR Codes**: Secure verification with regularly changing QR codes
- **Fee Distribution**: Transparent fee system for organizers and the platform
- **Blockchain Verification**: All transactions and transfers are verified on-chain

## Setup Instructions

See the individual README files in each directory for specific setup instructions:

- [Frontend README](lummy-frontend/README.md)
- [Smart Contracts README](lummy-smart-contracts/README.md)

## Acknowledgements

This project was developed for the Lisk Builders Challenge hackathon (March-May 2025).

## Contributors

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/luthfidi">
           <img src="https://avatars.githubusercontent.com/u/114864625?v=4?s=100" width="100px" alt="Luthfi Hadi" />
          <br />
          <sub><b>LUTHFI HADI</b></sub>
        </a>
        <br />Full Stack Developer
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/cizyypie">
          <img src="https://avatars.githubusercontent.com/u/140790736?v=4?s=100" width="100px" alt="Joanita Panggalo" />
          <br />
          <sub><b>JOANITA PANGGALO</b></sub>
        </a>
        <br /> Front End Developer
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/zahrasngk">
          <img src="https://avatars.githubusercontent.com/u/178831251?v=4?s=100" width="100px" alt="Zahra Sasongko" />
          <br />
          <sub><b>ZAHRA SASONGKO</b></sub>
        </a>
        <br />Smart Contract Developer
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://www.instagram.com/raffaryn_">
          <img src="https://ui-avatars.com/api/?size=100&name=RAFFA+NUGRAHA" width="100px" alt="Raffa Nugraha" />
          <br />
          <sub><b>RAFFA NUGRAHA</b></sub>
        </a>
        <br />UI/UX Designer
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/ardtys">
          <img src="https://avatars.githubusercontent.com/u/114295960?v=4?s=100" width="100px" alt="Daffa Rifki Arditya" />
          <br />
          <sub><b>DAFFA RIFKI ARDITYA</b></sub>
        </a>
        <br />Back End Developer
      </td>
    </tr>
  </tbody>
</table>
