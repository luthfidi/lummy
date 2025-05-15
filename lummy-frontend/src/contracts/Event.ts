// src/contracts/Event.ts
export const EVENT_ABI = [
  { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
  {
    "type": "function",
    "name": "addTicketTier",
    "inputs": [
      { "name": "_name", "type": "string", "internalType": "string" },
      { "name": "_price", "type": "uint256", "internalType": "uint256" },
      { "name": "_available", "type": "uint256", "internalType": "uint256" },
      {
        "name": "_maxPerPurchase",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cancelEvent",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cancelResaleListing",
    "inputs": [
      { "name": "_tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getTicketNFT",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "listTicketForResale",
    "inputs": [
      { "name": "_tokenId", "type": "uint256", "internalType": "uint256" },
      { "name": "_price", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "purchaseResaleTicket",
    "inputs": [
      { "name": "_tokenId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "purchaseTicket",
    "inputs": [
      { "name": "_tierId", "type": "uint256", "internalType": "uint256" },
      { "name": "_quantity", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ticketTiers",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      { "name": "name", "type": "string", "internalType": "string" },
      { "name": "price", "type": "uint256", "internalType": "uint256" },
      { "name": "available", "type": "uint256", "internalType": "uint256" },
      { "name": "sold", "type": "uint256", "internalType": "uint256" },
      {
        "name": "maxPerPurchase",
        "type": "uint256",
        "internalType": "uint256"
      },
      { "name": "active", "type": "bool", "internalType": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tierCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  }
];