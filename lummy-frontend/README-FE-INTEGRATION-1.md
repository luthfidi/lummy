# Panduan Integrasi Frontend dengan Smart Contract Lummy

## Pengantar

Dokumen ini berisi panduan komprehensif tentang cara mengintegrasikan aplikasi frontend React Lummy dengan smart contract blockchain yang telah dikembangkan. Panduan ini dirancang untuk developer frontend yang mungkin belum familiar dengan integrasi blockchain, dengan penjelasan step-by-step untuk memudahkan implementasi.

## Prasyarat

Sebelum memulai integrasi, pastikan Anda memiliki:

1. Repository frontend Lummy (React + TypeScript)
2. Smart contract Lummy yang sudah di-deploy ke Lisk Sepolia testnet
3. Xellar wallet dan beberapa token IDRX testnet
4. Pemahaman dasar tentang React hooks dan komponen

## Gambaran Arsitektur Integrasi

Integrasi frontend dengan smart contract Lummy mengikuti arsitektur berikut:

```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│                 │     │                   │     │                     │
│  React Frontend │◄────┤  Web3 Provider   │◄────┤  Lisk Blockchain    │
│  (Lummy App)    │     │  (Xellar Kit)     │     │  (Smart Contract)   │
│                 │     │                   │     │                     │
└─────────────────┘     └───────────────────┘     └─────────────────────┘
```

Komponen-komponen utama:

1. **React Frontend**: Aplikasi frontend Lummy yang menampilkan UI dan berinteraksi dengan user
2. **Web3 Provider**: Layer yang menghubungkan frontend dengan blockchain, powered by Xellar Kit
3. **Smart Contract**: Kontrak Lummy yang berjalan di blockchain Lisk, berisi logika bisnis

## Alur Interaksi Utama

1. User terhubung ke wallet mereka melalui Xellar Kit
2. Frontend membaca data dari smart contract (events, ticket tiers, dll)
3. User melakukan aksi (beli tiket, transfer, resell)
4. Frontend mengirim transaksi ke blockchain melalui wallet user
5. Smart contract memproses aksi dan menghasilkan perubahan state
6. Frontend memperbarui UI berdasarkan state baru dari blockchain

## 1. Setup dan Konfigurasi Wallet Integration

### Menyiapkan Web3Provider

File pertama yang perlu diperbarui adalah `src/services/Web3Provider.tsx`. Provider ini berfungsi sebagai wrapper yang menyediakan akses ke blockchain melalui Xellar Kit.

Pastikan Web3Provider dikonfigurasi dengan benar untuk terhubung ke jaringan Lisk:

```tsx
// Contoh konfigurasi Web3Provider.tsx
import { WagmiProvider, Config } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { XellarKitProvider, defaultConfig, lightTheme } from '@xellar/kit';
import { liskSepolia } from 'viem/chains';

// Konfigurasi untuk terhubung ke Lisk
const config = defaultConfig({
  appName: "Lummy",
  walletConnectProjectId: "YOUR_PROJECT_ID",
  xellarAppId: "YOUR_XELLAR_APP_ID",
  xellarEnv: "sandbox", // Gunakan "production" untuk mainnet
  chains: [liskSepolia],
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider theme={lightTheme}>
          {children}
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
```

### Menambahkan Konstanta Smart Contract

Berikutnya, buat atau perbarui file `src/constants.ts` untuk menyimpan alamat smart contract dan konfigurasi lainnya:

```tsx
// Alamat smart contract di Lisk Sepolia Testnet
export const LUMMY_CONTRACT_ADDRESS = "0x..."; // Alamat kontrak EventFactory
export const IDRX_SEPOLIA = "0xD63029C1a3dA68b51c67c6D1DeC3DEe50D681661"; // Token IDRX
```

### Mengimpor ABI Smart Contract

Buat file baru di `src/utils/abi.ts` untuk menyimpan ABI (Application Binary Interface) dari smart contract:

```tsx
// ABI (Application Binary Interface) dari smart contract Lummy
// Copy dari file JSON hasil kompilasi smart contract

export const EVENT_FACTORY_ABI = [...] as const;
export const EVENT_ABI = [...] as const;
export const TICKET_NFT_ABI = [...] as const;
```

## 2. Dasar-Dasar Interaksi dengan Smart Contract

### Membaca Data dari Smart Contract (Read Operations)

Lummy menggunakan Wagmi untuk berinteraksi dengan smart contract. Untuk operasi read, gunakan hook `useReadContract`:

```tsx
import { useReadContract } from 'wagmi';
import { EVENT_FACTORY_ABI } from '../utils/abi';
import { LUMMY_CONTRACT_ADDRESS } from '../constants';

// Dalam komponen React
const { data: allEvents, isLoading, isError } = useReadContract({
  address: LUMMY_CONTRACT_ADDRESS,
  abi: EVENT_FACTORY_ABI,
  functionName: 'getEvents',
});

// Data akan otomatis ter-fetch saat komponen di-render
// isLoading = true selama data diambil
// isError = true jika terjadi kesalahan
```

### Menulis Data ke Smart Contract (Write Operations)

Untuk operasi write, gunakan hook `useWriteContract`:

```tsx
import { useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { EVENT_FACTORY_ABI } from '../utils/abi';
import { LUMMY_CONTRACT_ADDRESS } from '../constants';

// Dalam komponen React
const { writeContractAsync, isPending, isSuccess, isError } = useWriteContract();

// Fungsi untuk membuat event baru
const createEvent = async () => {
  try {
    const hash = await writeContractAsync({
      address: LUMMY_CONTRACT_ADDRESS,
      abi: EVENT_FACTORY_ABI,
      functionName: 'createEvent',
      args: [
        eventName,
        eventDescription,
        new Date(eventDate).getTime() / 1000, // Convert ke UNIX timestamp
        eventVenue,
        ipfsMetadata,
      ],
    });
    
    console.log('Transaction hash:', hash);
    // Handle success
  } catch (error) {
    console.error('Error creating event:', error);
    // Handle error
  }
};
```

### Menunggu Transaksi Selesai

Untuk menunggu transaksi selesai dan mendapatkan receipt:

```tsx
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '../path/to/your/wagmi/config';
import { liskSepolia } from 'viem/chains';

const handleSomeAction = async () => {
  try {
    const hash = await writeContractAsync({
      // ...write contract params
    });

    // Tunggu transaksi selesai diproses
    const receipt = await waitForTransactionReceipt(config, {
      hash,
      chainId: liskSepolia.id,
    });

    console.log('Transaction confirmed:', receipt);
    // Update UI setelah transaksi berhasil
  } catch (error) {
    console.error('Transaction failed:', error);
    // Handle error
  }
};
```

## 3. Implementasi Fitur Tiket

### Menampilkan Daftar Event

Untuk menampilkan daftar event dari blockchain:

```tsx
// Dalam EventsPage.tsx
import { useReadContract } from 'wagmi';
import { EVENT_FACTORY_ABI } from '../utils/abi';
import { LUMMY_CONTRACT_ADDRESS } from '../constants';
import { EventCard } from '../components/core/Card';

const EventsPage = () => {
  // Fetch daftar event dari smart contract
  const { data: eventAddresses, isLoading } = useReadContract({
    address: LUMMY_CONTRACT_ADDRESS,
    abi: EVENT_FACTORY_ABI,
    functionName: 'getEvents',
  });

  // Fetch detail untuk setiap event
  const { data: eventDetails } = useReadContract({
    address: LUMMY_CONTRACT_ADDRESS,
    abi: EVENT_FACTORY_ABI,
    functionName: 'getEventDetails',
    args: [eventAddresses?.[0]], // Fetch detail untuk event pertama
    enabled: !!eventAddresses?.length, // Hanya fetch jika eventAddresses tersedia
  });

  if (isLoading) return <div>Loading events...</div>;

  return (
    <div>
      {/* Render daftar event */}
      {eventAddresses?.map((eventAddress, index) => (
        <EventCard 
          key={eventAddress} 
          event={/* Map event data to EventCard props */} 
          onClick={() => /* Navigate to event detail */}
        />
      ))}
    </div>
  );
};
```

### Pembelian Tiket

Proses pembelian tiket melibatkan dua langkah:
1. Approve token IDRX untuk digunakan oleh smart contract
2. Panggil fungsi `purchaseTicket` untuk membeli tiket

```tsx
// Dalam CheckoutPage.tsx
import { useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { erc20Abi } from 'viem';
import { EVENT_ABI } from '../utils/abi';
import { IDRX_SEPOLIA } from '../constants';

const CheckoutPage = () => {
  const { writeContractAsync } = useWriteContract();
  
  // Step 1: Approve IDRX tokens
  const handleApprove = async () => {
    const eventContractAddress = "0x..."; // Alamat kontrak event
    const amount = parseUnits(ticketPrice.toString(), 2); // IDRX uses 2 decimals
    
    const hash = await writeContractAsync({
      address: IDRX_SEPOLIA,
      abi: erc20Abi,
      functionName: 'approve',
      args: [eventContractAddress, amount],
    });
    
    // Wait for approval transaction to be confirmed
    await waitForTransactionReceipt(config, {
      hash,
      chainId: liskSepolia.id,
    });
    
    // Proceed to purchase after approval
  };
  
  // Step 2: Purchase ticket
  const handlePurchase = async () => {
    const hash = await writeContractAsync({
      address: eventContractAddress,
      abi: EVENT_ABI,
      functionName: 'purchaseTicket',
      args: [tierId, quantity],
    });
    
    // Wait for purchase transaction to be confirmed
    const receipt = await waitForTransactionReceipt(config, {
      hash,
      chainId: liskSepolia.id,
    });
    
    // Navigate to confirmation page or show success message
  };
  
  return (
    <div>
      {/* Checkout UI */}
      <button onClick={handleApprove}>Approve IDRX</button>
      <button onClick={handlePurchase}>Purchase Ticket</button>
    </div>
  );
};
```

### Transfer Tiket

Untuk mentransfer tiket ke wallet lain:

```tsx
// Dalam TransferTicket.tsx
import { useWriteContract } from 'wagmi';
import { TICKET_NFT_ABI } from '../utils/abi';

const TransferTicket = () => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const { writeContractAsync } = useWriteContract();
  
  const handleTransfer = async () => {
    const ticketContractAddress = "0x..."; // Alamat kontrak TicketNFT
    
    const hash = await writeContractAsync({
      address: ticketContractAddress,
      abi: TICKET_NFT_ABI,
      functionName: 'transferTicket',
      args: [recipientAddress, ticketId],
    });
    
    // Wait for transaction to be confirmed
    const receipt = await waitForTransactionReceipt(config, {
      hash,
      chainId: liskSepolia.id,
    });
    
    // Show success message and update UI
  };
  
  return (
    <div>
      {/* Transfer UI */}
      <input 
        type="text" 
        value={recipientAddress} 
        onChange={(e) => setRecipientAddress(e.target.value)} 
        placeholder="Recipient address"
      />
      <button onClick={handleTransfer}>Transfer Ticket</button>
    </div>
  );
};
```

### Resell Tiket

Untuk menjual kembali tiket di marketplace:

```tsx
// Dalam ResellTicket.tsx
import { useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { EVENT_ABI } from '../utils/abi';

const ResellTicket = () => {
  const [price, setPrice] = useState('');
  const { writeContractAsync } = useWriteContract();
  
  const handleListForResale = async () => {
    const eventContractAddress = "0x..."; // Alamat kontrak Event
    const parsedPrice = parseUnits(price, 2); // IDRX uses 2 decimals
    
    const hash = await writeContractAsync({
      address: eventContractAddress,
      abi: EVENT_ABI,
      functionName: 'listTicketForResale',
      args: [ticketId, parsedPrice],
    });
    
    // Wait for transaction to be confirmed
    const receipt = await waitForTransactionReceipt(config, {
      hash,
      chainId: liskSepolia.id,
    });
    
    // Update UI to show listing status
  };
  
  return (
    <div>
      {/* Resell UI */}
      <input 
        type="number" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        placeholder="Price in IDRX"
      />
      <button onClick={handleListForResale}>List for Resale</button>
    </div>
  );
};
```

## 4. Integrasi dengan Komponen UI yang Sudah Ada

### Connect Wallet Button

Update `ConnectButton` component di `Navbar.tsx`:

```tsx
import { ConnectButton } from '@xellar/kit';
import { useAccount, useBalance } from 'wagmi';
import { IDRX_SEPOLIA } from '../constants';

const Navbar = () => {
  return (
    <nav>
      {/* Other navbar elements */}
      
      <ConnectButton.Custom>
        {({ openConnectModal, isConnected, openProfileModal, account }) => {
          if (!isConnected) {
            return (
              <button onClick={openConnectModal}>
                Connect Wallet
              </button>
            );
          }

          return (
            <ConnectedButton 
              address={account?.address} 
              onClick={openProfileModal} 
            />
          );
        }}
      </ConnectButton.Custom>
    </nav>
  );
};

const ConnectedButton = ({ address, onClick }) => {
  const { data } = useBalance({
    address,
    token: IDRX_SEPOLIA,
  });

  return (
    <button onClick={onClick}>
      {address?.slice(0, 6)}...{address?.slice(-4)} - 
      {Number(data?.formatted || "0").toLocaleString()} IDRX
    </button>
  );
};
```

### Menampilkan QR Code Dinamis

Update komponen `QRCode.tsx` untuk menghasilkan QR code dinamis:

```tsx
// Dalam QRCode.tsx
import { useReadContract } from 'wagmi';
import { TICKET_NFT_ABI } from '../utils/abi';
import { useEffect, useState } from 'react';

const QRCode = ({ ticketContractAddress, tokenId }) => {
  const [timeKey, setTimeKey] = useState(Date.now());
  
  // Dapatkan challenge data untuk QR code yang berubah setiap interval
  const { data: qrChallenge } = useReadContract({
    address: ticketContractAddress,
    abi: TICKET_NFT_ABI,
    functionName: 'generateQRChallenge',
    args: [tokenId],
  });
  
  // Update QR code setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeKey(Date.now());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Render QR code dengan data yang berubah
  return (
    <div>
      {/* Render QR code with qrChallenge + timeKey */}
      {/* Gunakan library QR code seperti react-qr-code */}
    </div>
  );
};
```

## 5. Penanganan Loading State dan Error

Gunakan pola berikut untuk menangani loading state dan error:

```tsx
// Contoh pola umum
const MyComponent = () => {
  const { data, isLoading, isError, error } = useReadContract({
    // contract params
  });
  
  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Error state
  if (isError) {
    return <ErrorMessage message={error?.message || "An error occurred"} />;
  }
  
  // Success state - data tersedia
  return (
    <div>
      {/* Render component dengan data */}
    </div>
  );
};
```

Untuk operasi write, gunakan pola ini:

```tsx
const MyComponent = () => {
  const { writeContractAsync, isPending, isError, error } = useWriteContract();
  
  const handleAction = async () => {
    try {
      // Show loading state
      setIsSubmitting(true);
      
      const hash = await writeContractAsync({
        // contract params
      });
      
      // Wait for transaction
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId: liskSepolia.id,
      });
      
      // Show success
      showSuccessMessage();
    } catch (err) {
      // Handle error
      showErrorMessage(err.message);
    } finally {
      // Reset loading state
      setIsSubmitting(false);
    }
  };
  
  return (
    <button 
      onClick={handleAction} 
      disabled={isPending}
    >
      {isPending ? "Processing..." : "Submit"}
    </button>
  );
};
```

## 6. Best Practices dan Tips

1. **Selalu validasi input user** sebelum mengirim transaksi ke blockchain untuk menghindari error.

2. **Gunakan try-catch** untuk menangani error saat berinteraksi dengan blockchain.

3. **Berikan feedback yang jelas** kepada user tentang status transaksi mereka.

4. **Pisahkan logic blockchain** dari komponen UI untuk memudahkan maintenance.

5. **Pertimbangkan membuat hooks khusus** untuk operasi blockchain yang sering digunakan.

6. **Hadir kondisi "not connected"** di setiap halaman yang membutuhkan interaksi blockchain.

7. **Caching data blockchain** untuk meminimalkan jumlah request ke smart contract.

8. **Gunakan event emitter** dari smart contract untuk mendapatkan update real-time.

## Kesimpulan

Dokumen ini telah memberikan panduan dasar untuk mengintegrasikan frontend Lummy dengan smart contract blockchain. Implementasi lengkap memerlukan pemahaman mendalam tentang codebase frontend yang ada dan smart contract yang telah dikembangkan.

Untuk detail implementasi per file dan lebih spesifik tentang apa yang perlu diubah pada setiap komponen, silahkan lihat dokumen `README-FE-INTEGRATION-2.md`.

## Referensi

- [Dokumentasi Wagmi](https://wagmi.sh/)
- [Dokumentasi Viem](https://viem.sh/)
- [Dokumentasi Xellar Kit](https://docs.xellar.dev/)
- [Dokumentasi React](https://reactjs.org/docs/getting-started.html)