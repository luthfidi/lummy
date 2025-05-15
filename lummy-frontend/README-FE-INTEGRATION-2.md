# Panduan Integrasi Frontend dengan Smart Contract Lummy (Bagian 2)

## Pengantar

Dokumen ini merupakan lanjutan dari `README-FE-INTEGRATION-1.md` yang berisi detail implementasi lebih spesifik mengenai integrasi frontend Lummy dengan smart contract. Dokumen ini berisi panduan implementasi per file dengan fokus pada perubahan yang diperlukan untuk menghubungkan UI dengan blockchain.

## Persiapan dan Prasyarat

Pastikan Anda telah:
1. Membaca dan memahami `README-FE-INTEGRATION-1.md`
2. Menginstal semua dependensi yang diperlukan (`wagmi`, `viem`, `@xellar/kit`)
3. Memahami struktur smart contract Lummy yang dijelaskan di `README-SMART-CONTRACT-1.md` dan `README-SMART-CONTRACT-2.md`

## Implementasi Detail Per File

### 1. Setup Context untuk Smart Contract

Buat folder dan file baru untuk context provider:

```
src/context/ContractContext.tsx
```

File ini akan menyediakan akses ke smart contract di seluruh aplikasi.

**ContractContext.tsx** perlu berisi:

- Interface untuk tipe kontrak Event Factory
- Interface untuk tipe kontrak Event dan TicketNFT
- Provider yang menyimpan instance kontrak dan terhubung ke Lisk blockchain
- Custom hooks untuk akses mudah ke kontrak

### 2. Modifikasi File `constants.ts`

Di file `src/constants.ts`, tambahkan:

- Alamat kontrak `EventFactory` di Lisk Sepolia
- Network settings untuk Lisk Sepolia
- Constants untuk fee marketplace dan lainnya

### 3. Implementasi File ABI

Buat file `src/utils/abi.ts` dengan:

- ABI untuk EventFactory, Event, dan TicketNFT
- Export constants yang diperlukan untuk interaksi smart contract

### 4. Update Web3Provider

Di file `src/services/Web3Provider.tsx`, ubah:

- Tambahkan konfigurasi khusus untuk Lisk network
- Pastikan XellarKit dikonfigurasi dengan appId dan projectId yang sesuai
- Update chain configuration untuk Lisk Sepolia

### 5. Implementasi Hooks Khusus untuk Interaksi Smart Contract

Buat file hooks baru:

```
src/hooks/useEventContract.ts
src/hooks/useTicketNFT.ts
src/hooks/useEventFactory.ts
```

Setiap file hooks ini perlu mengimplementasikan fungsi-fungsi untuk berinteraksi dengan smart contract sesuai dengan kebutuhannya.

### 6. Update File Utama Per Fitur

#### 6.1. Pembelian Tiket

Perbarui file `src/pages/Checkout/CheckoutPage.tsx`:

- Tambahkan integasi dengan smart contract Event
- Implementasikan approval IDRX
- Tambahkan fungsi untuk memanggil purchaseTicket
- Handle error dan loading states saat berinteraksi dengan blockchain
- Update UI untuk menampilkan status transaksi blockchain

Perbarui file `src/components/checkout/PaymentMethod.tsx`:
- Implementasikan pengecekan allowance IDRX
- Tambahkan loading state saat approval dan pembelian
- Koneksi ke blockchain untuk pembelian

#### 6.2. Tampilan Tiket

Update file `src/pages/MyTickets/MyTicketsPage.tsx`:
- Ganti data mock dengan panggilan ke smart contract untuk mendapatkan tiket
- Implementasikan logika untuk membaca data NFT dari blockchain
- Implementasikan loading state saat fetching data tiket

Update file `src/components/tickets/TicketCard.tsx`:
- Connect ke data NFT on-chain
- Update tampilan dengan metadata dari blockchain

#### 6.3. QR Code Dinamis

Update file `src/components/tickets/QRCode.tsx`:
- Implementasikan generasi QR code dinamis menggunakan fungsi dari smart contract
- Tambahkan logika crypto untuk signature verification
- Implementasikan interval update untuk QR code dinamis

#### 6.4. Transfer Tiket

Update file `src/components/tickets/TransferTicket.tsx`:
- Implementasikan validasi alamat wallet
- Hubungkan dengan smart contract untuk transfer NFT
- Tambahkan status transaksi dan error handling

#### 6.5. Resell Tiket

Update file `src/components/tickets/ResellTicket.tsx`:
- Implementasikan batas harga berdasarkan aturan anti-scalping
- Tambahkan logika untuk listing tiket di marketplace
- Update UI untuk menampilkan status saat listing

#### 6.6. Marketplace

Update file `src/pages/Marketplace/MarketplacePage.tsx`:
- Ganti data mock dengan listing marketplace dari smart contract
- Implementasikan filter dan sorting berdasarkan data on-chain
- Tambahkan fungsi untuk membeli tiket dari marketplace

### 7. Implementasi Halaman Admin untuk Event Creator

Update file `src/pages/Admin/CreateEventForm.tsx`:
- Koneksikan form dengan fungsi createEvent di smart contract
- Tambahkan loading state saat pembuatan event
- Implementasikan upload metadata ke IPFS (opsional untuk MVP)

Update file `src/pages/Admin/EventManagement.tsx`:
- Connect dengan smart contract untuk manajemen event
- Implementasikan fungsi untuk update detail event
- Tambahkan fungsi untuk melihat statistik penjualan dari blockchain

### 8. Implementasi Pengelolaan Tiket dan Check-in

Update file `src/pages/TicketManagement/ScannerPage.tsx`:
- Implementasikan verifikasi QR code dengan blockchain
- Tambahkan logika untuk validasi tiket berdasarkan signature
- Update status tiket setelah check-in

### 9. Detail Implementasi Komponen Kritis

#### 9.1. WalletConnect

Update `src/components/wallet/ConnectButton.tsx` dan `WalletButton.tsx`:
- Pastikan komponen menggunakan Xellar Kit dengan benar
- Update untuk menampilkan balance IDRX
- Handle error saat koneksi ke wallet

#### 9.2. Event Detail dan Pembelian

Update `src/pages/EventDetail/EventDetailPage.tsx`:
- Fetch detail event dari blockchain
- Tampilkan tier ticket dari smart contract
- Tambahkan pengecekan ketersediaan tiket

#### 9.3. Order Confirmation

Update `src/components/checkout/PaymentConfirmation.tsx`:
- Tambahkan link ke block explorer
- Tampilkan detail transaksi blockchain
- Implementasikan retry mechanism jika ada kegagalan

## Implementasi Detail Fungsi Smart Contract

### 1. Pembelian Tiket

Implementasi pembelian tiket memerlukan dua langkah:
1. Approval token IDRX
2. Pembelian tiket

Contoh penggunaan dari `useEventContract.ts`:

```typescript
// Dua langkah approval dan pembelian
const handleBuyTicket = async () => {
  try {
    // 1. Approve IDRX token first
    const approvalTx = await approve(eventContractAddress, amountInWei);
    await waitForTransactionReceipt(approvalTx);
    
    // 2. Purchase ticket after approval
    const purchaseTx = await purchaseTicket(tierId, quantity);
    await waitForTransactionReceipt(purchaseTx);
    
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### 2. Transfer dan Resell Tiket

Kedua operasi ini perlu mengakses kontrak TicketNFT:

```typescript
// Transfer tiket
const handleTransfer = async () => {
  try {
    const result = await transferTicket(tokenId, recipientAddress);
    await waitForTransactionReceipt(result);
    // Handle success
  } catch (error) {
    // Handle error
  }
};

// Resell tiket
const handleResell = async () => {
  try {
    const result = await listTicketForResale(tokenId, priceInWei);
    await waitForTransactionReceipt(result);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### 3. Marketplace Operation

Transaksi marketplace harus memeriksa persetujuan dan melakukan pembelian:

```typescript
// Membeli dari marketplace
const handlePurchaseResale = async () => {
  try {
    // 1. Approve IDRX token first
    const approvalTx = await approve(eventContractAddress, priceInWei);
    await waitForTransactionReceipt(approvalTx);
    
    // 2. Purchase resale ticket
    const purchaseTx = await purchaseResaleTicket(tokenId);
    await waitForTransactionReceipt(purchaseTx);
    
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Error Handling dan UX

Beberapa pertimbangan penting untuk error handling:

1. **Wallet Error**: User reject transaction, insufficient balance
2. **Contract Error**: Reversion, out of gas
3. **Network Error**: Koneksi gagal, chain tidak didukung

Implementasikan error handling yang user-friendly:

```typescript
try {
  // Blockchain interaction
} catch (error) {
  if (error.code === 4001) {
    // User rejected transaction
    showMessage("Transaksi dibatalkan oleh user");
  } else if (error.message.includes("insufficient funds")) {
    // Insufficient balance
    showMessage("Saldo IDRX tidak mencukupi");
  } else {
    // Unexpected error
    showMessage("Terjadi kesalahan: " + error.message);
    console.error(error);
  }
}
```

## Testing Integrasi

Melakukan testing integrasi frontend dengan smart contract pada testnet:

1. **Unit Testing**: Test fungsi hooks dalam isolasi
2. **Integration Testing**: Test alur lengkap dari UI ke blockchain
3. **E2E Testing**: Test alur pengguna lengkap dari koneksi wallet hingga menerima NFT

## Kesimpulan

Dokumen ini memberikan panduan spesifik untuk mengimplementasikan integrasi frontend Lummy dengan smart contract blockchain. Dengan mengikuti panduan ini, developer dapat mengubah aplikasi React menjadi dApp yang terhubung dengan Lisk blockchain dan memberikan pengalaman user yang mulus saat berinteraksi dengan teknologi blockchain.

Ingat bahwa implementasi MVP dapat disederhanakan dengan fokus pada fitur-fitur utama terlebih dahulu, kemudian ditingkatkan secara bertahap setelah sistem dasar berfungsi dengan baik.

## Panduan Deployment

Setelah integrasi selesai:

1. Uji aplikasi di testnet Lisk Sepolia
2. Deploy smart contract seperti yang dijelaskan di `README-SMART-CONTRACT-2.md`
3. Update alamat kontrak di `constants.ts`
4. Build dan deploy frontend ke hosting pilihan (Vercel, Firebase, dll)

## Referensi Tambahan

- [Dokumentasi Wagmi](https://wagmi.sh/react/getting-started)
- [Dokumentasi Viem](https://viem.sh/docs/getting-started.html)
- [Dokumentasi Xellar Kit](https://xellar.io/docs)
- [Dokumentasi Lisk Blockchain](https://lisk.com/documentation)

Semoga sukses dengan pengembangan Lummy!