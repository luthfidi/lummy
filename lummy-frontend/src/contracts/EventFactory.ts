// src/contracts/EventFactory.ts
export const EVENT_FACTORY_ADDRESS = "0xb542de333373ffDB3FD40950a579033896a403bb";

export const EVENT_FACTORY_ABI = [
  {"inputs":[{"internalType":"address","name":"_idrxToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"EventDateMustBeInFuture","type":"error"},
  {"inputs":[],"name":"InvalidAddress","type":"error"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"eventId","type":"uint256"},{"indexed":true,"internalType":"address","name":"eventContract","type":"address"}],"name":"EventCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newToken","type":"address"}],"name":"IDRXTokenUpdated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"receiver","type":"address"}],"name":"PlatformFeeReceiverUpdated","type":"event"},
  {"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_date","type":"uint256"},{"internalType":"string","name":"_venue","type":"string"},{"internalType":"string","name":"_ipfsMetadata","type":"string"}],"name":"createEvent","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"deployer","outputs":[{"internalType":"contract EventDeployer","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"events","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"eventAddress","type":"address"}],"name":"getEventDetails","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"date","type":"uint256"},{"internalType":"string","name":"venue","type":"string"},{"internalType":"string","name":"ipfsMetadata","type":"string"},{"internalType":"address","name":"organizer","type":"address"}],"internalType":"struct Structs.EventDetails","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getEvents","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getPlatformFeePercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},
  {"inputs":[],"name":"idrxToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"platformFeeReceiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"setPlatformFeeReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_newToken","type":"address"}],"name":"updateIDRXToken","outputs":[],"stateMutability":"nonpayable","type":"function"}
];