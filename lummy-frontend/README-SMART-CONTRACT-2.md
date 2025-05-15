# Lummy Smart Contract Development Guide

## Overview

Lummy adalah platform tiket terdesentralisasi berbasis blockchain yang menggunakan NFT untuk merepresentasikan tiket event. Platform ini memungkinkan pengguna untuk membeli, menjual kembali, dan mentransfer tiket secara transparan dan aman dengan memanfaatkan teknologi blockchain Lisk dan token IDRX sebagai metode pembayaran.

## Status Implementasi MVP

Gunakan checklist berikut untuk melacak progress pengembangan smart contract:

| Feature | Status | Description |
|---------|--------|-------------|
| **Core Contracts** | | |
| ✅ EventFactory Contract | Pending | Registry kontrak untuk membuat dan melacak event |
| ✅ Event Contract | Pending | Kontrak per-event untuk mengelola detail dan tiket |
| ✅ TicketNFT Contract | Pending | Implementasi NFT untuk tiket |
| **Event Management** | | |
| ✅ Create Event | Pending | Fungsi untuk membuat event baru |
| ✅ Add Ticket Tier | Pending | Fungsi untuk menambahkan tier tiket pada event |
| ✅ Update Event Details | Pending | Fungsi untuk memperbarui detail event |
| **Ticket Operations** | | |
| ✅ Purchase Ticket | Pending | Fungsi untuk membeli tiket (primary sale) |
| ✅ Mint Ticket NFT | Pending | Fungsi untuk mencetak NFT tiket ke wallet pembeli |
| ✅ Transfer Ticket | Pending | Fungsi untuk mentransfer tiket antar wallet |
| **Validation System** | | |
| ✅ Dynamic QR Code Generation | Pending | Sistem untuk generate QR code yang berubah setiap interval |
| ✅ Ticket Verification | Pending | Fungsi untuk memverifikasi tiket saat check-in |
| **Resale Marketplace** | | |
| ✅ Resale Rules Configuration | Pending | Fungsi untuk mengatur aturan penjualan kembali |
| ✅ List Ticket for Resale | Pending | Fungsi untuk mendaftarkan tiket untuk dijual kembali |
| ✅ Purchase Resale Ticket | Pending | Fungsi untuk membeli tiket dari pasar sekunder |
| **Payment Integration** | | |
| ✅ IDRX Token Integration | Pending | Integrasi dengan stablecoin IDRX |
| ✅ Fee Distribution | Pending | Fungsi untuk distribusi fee ke organizer, platform, dll |

## Struktur Code Smart Contract

Struktur direktori smart contract Lummy dirancang secara modular sebagai berikut:

```
contracts/
├── core/
│   ├── EventFactory.sol      # Registry untuk event dan factory contract
│   ├── Event.sol             # Template untuk contract per-event
│   └── TicketNFT.sol         # Implementasi NFT untuk tiket
├── interfaces/
│   ├── IEventFactory.sol     # Interface untuk EventFactory
│   ├── IEvent.sol            # Interface untuk Event
│   ├── ITicketNFT.sol        # Interface untuk TicketNFT
│   └── IERC20.sol            # Interface untuk token IDRX
├── libraries/
│   ├── TicketLib.sol         # Library untuk operasi terkait tiket
│   └── SecurityLib.sol       # Library untuk fungsi keamanan
├── marketplace/
│   └── Marketplace.sol       # Kontrak untuk fitur resale marketplace
└── utils/
    ├── Structs.sol           # Definisi struct yang digunakan di berbagai kontrak
    └── Constants.sol         # Konstanta global untuk sistem
```

## Detail Per File

### Core Contracts

#### `EventFactory.sol`

**Deskripsi**: Kontrak utama yang berfungsi sebagai registry untuk semua event dan factory untuk men-deploy event contract baru.

**Isi File**:
- State variables:
  - `mapping(uint256 => address) public events` - Memetakan ID event ke alamat kontrak event
  - `uint256 public nextEventId` - Counter untuk ID event berikutnya
  - `address public owner` - Alamat admin platform
  - `address public idrxToken` - Alamat token IDRX

- Functions:
  - `constructor(address _idrxToken)` - Inisialisasi kontrak dengan alamat token IDRX
  - `createEvent(string memory name, string memory description, uint256 date, string memory venue, string memory ipfsMetadata)` - Membuat dan men-deploy kontrak event baru
  - `getEvents() external view returns (address[] memory)` - Mendapatkan alamat semua event
  - `getEventDetails(uint256 eventId) external view returns (EventDetails memory)` - Mendapatkan detail event berdasarkan ID

- Events:
  - `EventCreated(uint256 indexed eventId, address eventContract, string name)`

#### `Event.sol`

**Deskripsi**: Template untuk kontrak individual yang digunakan oleh setiap event. Mengelola detail event, tier tiket, dan logika pembelian.

**Isi File**:
- Structs:
  - `TicketTier` - Representasi tier tiket (nama, harga, jumlah tersedia, dll)
  - `ResaleRules` - Aturan untuk penjualan kembali tiket

- State variables:
  - `string public name` - Nama event
  - `string public description` - Deskripsi event
  - `uint256 public date` - Tanggal event (UNIX timestamp)
  - `string public venue` - Lokasi event
  - `string public ipfsMetadata` - IPFS hash untuk metadata tambahan
  - `address public organizer` - Alamat penyelenggara event
  - `mapping(uint256 => TicketTier) public ticketTiers` - Mapping dari ID tier ke TicketTier
  - `TicketNFT public ticketNFT` - Instance dari kontrak TicketNFT untuk event ini
  - `ResaleRules public resaleRules` - Aturan penjualan kembali tiket

- Functions:
  - `constructor(address _organizer, string memory _name, string memory _description, uint256 _date, string memory _venue, string memory _ipfsMetadata)` - Inisialisasi kontrak event
  - `addTicketTier(string memory name, uint256 price, uint256 available, uint256 maxPerPurchase)` - Menambahkan tier tiket baru
  - `updateTicketTier(uint256 tierId, string memory name, uint256 price, uint256 available, uint256 maxPerPurchase)` - Memperbarui tier tiket
  - `purchaseTicket(uint256 tierId, uint256 quantity)` - Membeli tiket dari tier tertentu
  - `setResaleRules(uint256 maxMarkupPercentage, uint256 organizerFeePercentage, bool restrictResellTiming, uint256 minDaysBeforeEvent)` - Mengatur aturan penjualan kembali
  - `listTicketForResale(uint256 tokenId, uint256 price)` - Mendaftarkan tiket untuk dijual kembali
  - `purchaseResaleTicket(uint256 tokenId)` - Membeli tiket dari pasar sekunder

- Events:
  - `TicketTierAdded(uint256 indexed tierId, string name, uint256 price)`
  - `TicketPurchased(address indexed buyer, uint256 indexed tierId, uint256 quantity)`
  - `ResaleRulesUpdated(uint256 maxMarkupPercentage, uint256 organizerFeePercentage)`
  - `TicketListedForResale(uint256 indexed tokenId, uint256 price)`
  - `TicketResold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price)`

#### `TicketNFT.sol`

**Deskripsi**: Implementasi NFT (ERC-721) untuk tiket event dengan fitur keamanan tambahan.

**Isi File**:
- State variables:
  - `mapping(uint256 => TicketMetadata) public ticketMetadata` - Metadata tambahan untuk tiap tiket
  - `mapping(uint256 => bool) public ticketUsed` - Status penggunaan tiket
  - `mapping(uint256 => uint256) public ticketTier` - Tier tiket untuk setiap tokenId
  - `address public eventContract` - Alamat kontrak event induk
  - `string public eventName` - Nama event (untuk nama token)

- Structs:
  - `TicketMetadata` - Metadata tambahan untuk tiket (tierId, harga original, dll)

- Functions:
  - `constructor(string memory _eventName, string memory _symbol)` - Inisialisasi NFT dengan nama dan simbol
  - `mintTicket(address to, uint256 tierId, uint256 originalPrice)` - Mencetak tiket baru
  - `transferTicket(address to, uint256 tokenId)` - Mentransfer tiket ke alamat lain
  - `generateQRChallenge(uint256 tokenId) public view returns (bytes32)` - Menghasilkan data untuk QR code dinamis
  - `verifyTicket(uint256 tokenId, address owner, uint256 timestamp, bytes memory signature) public view returns (bool)` - Memverifikasi tiket
  - `useTicket(uint256 tokenId)` - Menandai tiket sebagai sudah digunakan
  - `tokenURI(uint256 tokenId) public view override returns (string memory)` - Mengembalikan URI metadata untuk tiket

- Events:
  - `TicketMinted(uint256 indexed tokenId, address indexed to, uint256 tierId)`
  - `TicketUsed(uint256 indexed tokenId, address indexed user)`

### Interface Contracts

#### `IEventFactory.sol`

**Deskripsi**: Interface untuk EventFactory contract.

**Isi File**:
- Function signatures untuk semua fungsi publik di EventFactory
- Definisi struct yang digunakan dalam interface

#### `IEvent.sol`

**Deskripsi**: Interface untuk Event contract.

**Isi File**:
- Function signatures untuk semua fungsi publik di Event
- Definisi struct yang digunakan dalam interface

#### `ITicketNFT.sol`

**Deskripsi**: Interface untuk TicketNFT contract.

**Isi File**:
- Function signatures untuk semua fungsi publik di TicketNFT
- Definisi struct yang digunakan dalam interface

#### `IERC20.sol`

**Deskripsi**: Interface standar untuk token ERC-20 (IDRX).

**Isi File**:
- Function signatures standar ERC-20 (transfer, transferFrom, approve, dll)

### Libraries

#### `TicketLib.sol`

**Deskripsi**: Library untuk operasi terkait tiket.

**Isi File**:
- Functions:
  - `validateTicketPurchase(TicketTier memory tier, uint256 quantity) internal pure returns (bool)` - Validasi pembelian tiket
  - `calculateFees(uint256 price, uint256 organizerFeePercentage, uint256 platformFeePercentage) internal pure returns (uint256, uint256)` - Menghitung fee untuk penjualan kembali
  - `validateResalePrice(uint256 originalPrice, uint256 resalePrice, uint256 maxMarkupPercentage) internal pure returns (bool)` - Memvalidasi harga penjualan kembali

#### `SecurityLib.sol`

**Deskripsi**: Library untuk fungsi keamanan.

**Isi File**:
- Functions:
  - `recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address)` - Mendapatkan alamat penanda tangan dari signature
  - `validateChallenge(bytes32 challenge, uint256 timestamp, uint256 validityWindow) internal view returns (bool)` - Memvalidasi challenge berdasarkan timestamp

### Marketplace Contract

#### `Marketplace.sol`

**Deskripsi**: Kontrak untuk mengelola fitur marketplace resale tiket.

**Isi File**:
- Structs:
  - `ListingInfo` - Informasi listing tiket (harga, penjual, dll)

- State variables:
  - `mapping(uint256 => ListingInfo) public listings` - Mapping dari tokenId ke informasi listing
  - `mapping(address => mapping(uint256 => bool)) public userListings` - Tracking listing per pengguna

- Functions:
  - `listTicket(address ticketNFT, uint256 tokenId, uint256 price)` - Mendaftarkan tiket untuk dijual
  - `cancelListing(address ticketNFT, uint256 tokenId)` - Membatalkan listing tiket
  - `purchaseTicket(address ticketNFT, uint256 tokenId)` - Membeli tiket dari marketplace
  - `getListingInfo(address ticketNFT, uint256 tokenId) external view returns (ListingInfo memory)` - Mendapatkan informasi listing

- Events:
  - `TicketListed(address indexed ticketNFT, uint256 indexed tokenId, address indexed seller, uint256 price)`
  - `ListingCancelled(address indexed ticketNFT, uint256 indexed tokenId, address indexed seller)`
  - `TicketSold(address indexed ticketNFT, uint256 indexed tokenId, address indexed buyer, uint256 price)`

### Utility Files

#### `Structs.sol`

**Deskripsi**: Definisi struct yang digunakan di berbagai kontrak.

**Isi File**:
- Struct:
  - `EventDetails` - Detail lengkap event
  - `TicketTier` - Definisi tier tiket
  - `ResaleRules` - Aturan penjualan kembali tiket
  - `TicketMetadata` - Metadata tiket

#### `Constants.sol`

**Deskripsi**: Konstanta global untuk sistem.

**Isi File**:
- Constants:
  - `uint256 constant PLATFORM_FEE_PERCENTAGE` - Persentase fee platform (dalam basis poin)
  - `uint256 constant VALIDITY_WINDOW` - Jendela waktu validitas QR code (dalam detik)
  - `uint256 constant DEFAULT_MAX_MARKUP_PERCENTAGE` - Persentase markup default maksimum untuk resale
  - `uint256 constant BASIS_POINTS` - Basis poin untuk perhitungan persentase (10000 = 100%)

## Dependency Management

### Library yang Dibutuhkan

- **OpenZeppelin Contracts v4.9.0+**
  - ERC721.sol - Implementasi dasar ERC-721 standar
  - ERC721Enumerable.sol - Ekstensi untuk enumerable ERC-721
  - Ownable.sol - Implementasi pola akses berbasis kepemilikan
  - ReentrancyGuard.sol - Perlindungan terhadap serangan reentrancy
  - SafeMath.sol - Operasi matematika yang aman (jika menggunakan Solidity < 0.8.0)
  - ECDSA.sol - Untuk verifikasi tanda tangan digital

### Solidity Version

Gunakan **Solidity v0.8.17** atau yang lebih baru karena:
- Built-in overflow protection
- Custom errors untuk gas yang lebih efisien
- Fitur string concatenation yang lebih baik
- Support untuk structs sebagai parameter dan return values

### Development Environment

- **Framework**: Hardhat atau Foundry
- **Testing**: Mocha/Chai dengan Hardhat atau Forge Test dengan Foundry
- **Deployment**: Scripts Hardhat/Foundry 
- **Linting**: Solhint

## Deployment Guide

### Urutan Deployment

Untuk deployment yang benar, ikuti urutan berikut:

1. **Deploy IDRX Token**
   - Jika belum ada, deploy token IDRX Anda sendiri untuk testing
   - Atau gunakan alamat IDRX yang sudah ada di testnet/mainnet

2. **Deploy Libraries**
   - Deploy TicketLib.sol
   - Deploy SecurityLib.sol

3. **Deploy EventFactory**
   - Parameter: 
     - `address _idrxToken` - Alamat token IDRX

4. **Setting Awal**
   - Panggil `setFeeReceiver(address _feeReceiver)` pada EventFactory
   - Panggil `setPlatformFeePercentage(uint256 _feePercentage)` jika default perlu diubah

### Parameter Deployment

#### EventFactory
- `address _idrxToken`: Alamat kontrak token IDRX
  - Lisk Sepolia Testnet: `0xD63029C1a3dA68b51c67c6D1DeC3DEe50D681661`

#### Event (di-deploy otomatis oleh EventFactory)
- `address _organizer`: Alamat wallet organizer event
- `string memory _name`: Nama event
- `string memory _description`: Deskripsi event
- `uint256 _date`: Tanggal event (UNIX timestamp)
- `string memory _venue`: Lokasi event
- `string memory _ipfsMetadata`: Hash IPFS untuk metadata tambahan

#### TicketNFT (di-deploy otomatis oleh Event)
- `string memory _eventName`: Nama event
- `string memory _symbol`: Simbol untuk NFT (biasanya "TICKET")

### Deployment Script

Berikut adalah contoh script deployment menggunakan Hardhat:

```javascript
async function main() {
  // Deploy IDRX Token jika perlu untuk testing
  // const IDRX = await ethers.getContractFactory("IDRX");
  // const idrx = await IDRX.deploy("IDRX Stablecoin", "IDRX");
  // await idrx.deployed();
  // console.log("IDRX Token deployed to:", idrx.address);

  // Alamat IDRX yang sudah ada
  const idrxAddress = "0xD63029C1a3dA68b51c67c6D1DeC3DEe50D681661";
  
  // Deploy Libraries
  const TicketLib = await ethers.getContractFactory("TicketLib");
  const ticketLib = await TicketLib.deploy();
  await ticketLib.deployed();
  console.log("TicketLib deployed to:", ticketLib.address);
  
  const SecurityLib = await ethers.getContractFactory("SecurityLib");
  const securityLib = await SecurityLib.deploy();
  await securityLib.deployed();
  console.log("SecurityLib deployed to:", securityLib.address);
  
  // Link libraries ke contract factories
  const EventFactory = await ethers.getContractFactory("EventFactory", {
    libraries: {
      TicketLib: ticketLib.address,
      SecurityLib: securityLib.address
    }
  });
  
  // Deploy EventFactory dengan alamat IDRX
  const eventFactory = await EventFactory.deploy(idrxAddress);
  await eventFactory.deployed();
  console.log("EventFactory deployed to:", eventFactory.address);
  
  // Setup awal
  const feeReceiver = "YOUR_FEE_RECEIVER_ADDRESS"; // Ganti dengan alamat penerima fee
  await eventFactory.setFeeReceiver(feeReceiver);
  console.log("Fee receiver set to:", feeReceiver);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Verifikasi Kontrak

Setelah deployment, verifikasi kontrak pada Lisk Explorer untuk transparansi:

```bash
npx hardhat verify --network liskSepolia DEPLOYED_CONTRACT_ADDRESS CONSTRUCTOR_ARGS
```

Contoh untuk EventFactory:

```bash
npx hardhat verify --network liskSepolia 0xYourEventFactoryAddress "0xD63029C1a3dA68b51c67c6D1DeC3DEe50D681661"
```

## Kesimpulan

Panduan ini memberikan struktur dan detail yang dibutuhkan untuk mengembangkan smart contract Lummy. MVP fokus pada fitur-fitur utama seperti pembuatan event, pembelian tiket, generasi QR code dinamis, dan mekanisme validasi. Fitur marketplace resale dan advanced security features dapat ditambahkan setelah MVP berhasil di-deploy dan diuji.

Untuk bantuan lebih lanjut atau pertanyaan tentang implementasi, silakan hubungi tim pengembangan Lummy.