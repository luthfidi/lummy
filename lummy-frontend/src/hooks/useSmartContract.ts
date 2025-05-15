// src/hooks/useSmartContract.ts
import { useState, useCallback } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'; // Hapus import yang tidak digunakan
import { EVENT_FACTORY_ADDRESS, EVENT_FACTORY_ABI } from '../contracts/EventFactory';
import { EVENT_ABI } from '../contracts/Event';
import { TICKET_NFT_ABI } from '../contracts/TicketNFT';
// Hapus import yang tidak digunakan

// Interface untuk Event yang dibuat 
export interface EventData {
  name: string;
  description: string;
  date: number;
  venue: string;
  ipfsMetadata: string;
  organizer: string;
}

// Interface untuk Ticket Tier
export interface TicketTierData {
  name: string;
  price: number;
  available: number;
  sold: number;
  maxPerPurchase: number;
  active: boolean;
}

export const useSmartContract = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Event
  const createEvent = useCallback(async (
    name: string,
    description: string,
    date: Date,
    venue: string,
    ipfsMetadata: string = "",
  ) => {
    if (!walletClient || !address || !publicClient) { // Tambahkan cek publicClient
      setError('Wallet not connected or provider not available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert date to unix timestamp in seconds
      const dateTimestamp = Math.floor(date.getTime() / 1000);

      // Persiapkan transaksi
      const hash = await walletClient.writeContract({
        address: EVENT_FACTORY_ADDRESS as `0x${string}`,
        abi: EVENT_FACTORY_ABI,
        functionName: 'createEvent',
        args: [name, description, BigInt(dateTimestamp), venue, ipfsMetadata],
      });

      // Tunggu receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Cari event EventCreated dari receipt
      const logs = receipt.logs;
      
      // Cara manual untuk menemukan event EventCreated
      for (const log of logs) {
        // EventCreated memiliki signature 'EventCreated(uint256,address)'
        // topic[0] adalah event signature hash
        if (log.topics[0] === '0x7a74ea23c916c344aa7bb079fa7db0cdb4964ade3d70c7f1c8694f9efa0b8abe') {
          // Decode eventId dan eventContract dari log
          // topics[1] adalah eventId (indexed)
          // topics[2] adalah eventContract (indexed)
          const eventAddress = `0x${log.topics[2]?.slice(26)}` as `0x${string}` || '';
          return eventAddress;
        }
      }

      return null;
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  // Get Events
  const getEvents = useCallback(async () => {
    if (!publicClient) {
      setError('Provider not available');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const events = await publicClient.readContract({
        address: EVENT_FACTORY_ADDRESS as `0x${string}`,
        abi: EVENT_FACTORY_ABI,
        functionName: 'getEvents',
      }) as `0x${string}`[];

      return events;
    } catch (err) {
      console.error('Error getting events:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  // Get Event Details
  const getEventDetails = useCallback(async (eventAddress: string) => {
    if (!publicClient) {
      setError('Provider not available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const details = await publicClient.readContract({
        address: EVENT_FACTORY_ADDRESS as `0x${string}`,
        abi: EVENT_FACTORY_ABI,
        functionName: 'getEventDetails',
        args: [eventAddress as `0x${string}`],
      }) as EventData;

      return details;
    } catch (err) {
      console.error('Error getting event details:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  // Get Ticket Tiers for an Event
  const getTicketTiers = useCallback(async (eventAddress: string) => {
    if (!publicClient) {
      setError('Provider not available');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Get tier count
      const tierCount = await publicClient.readContract({
        address: eventAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'tierCount',
      }) as bigint;

      // Get tier details for each tier
      const tiers: TicketTierData[] = [];
      for (let i = 0; i < Number(tierCount); i++) {
        const tier = await publicClient.readContract({
          address: eventAddress as `0x${string}`,
          abi: EVENT_ABI,
          functionName: 'ticketTiers',
          args: [BigInt(i)],
        }) as unknown as TicketTierData;

        tiers.push({
          ...tier,
          price: Number(tier.price),
          available: Number(tier.available),
          sold: Number(tier.sold),
          maxPerPurchase: Number(tier.maxPerPurchase),
        });
      }

      return tiers;
    } catch (err) {
      console.error('Error getting ticket tiers:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  // Add Ticket Tier to Event
  const addTicketTier = useCallback(async (
    eventAddress: string,
    name: string,
    price: number,
    available: number,
    maxPerPurchase: number
  ) => {
    if (!walletClient || !address || !publicClient) { // Tambahkan cek publicClient
      setError('Wallet not connected or provider not available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare and send the transaction
      const hash = await walletClient.writeContract({
        address: eventAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'addTicketTier',
        args: [
          name,
          BigInt(price),
          BigInt(available),
          BigInt(maxPerPurchase)
        ],
      });

      // Wait for receipt
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (err) {
      console.error('Error adding ticket tier:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  // Purchase Ticket
  const purchaseTicket = useCallback(async (
    eventAddress: string,
    tierId: number,
    quantity: number
  ) => {
    if (!walletClient || !address || !publicClient) { // Tambahkan cek publicClient
      setError('Wallet not connected or provider not available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // First approve IDRX token spending
      // Note: You'll need to implement IDRX token approval first

      // Then purchase ticket
      const hash = await walletClient.writeContract({
        address: eventAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'purchaseTicket',
        args: [BigInt(tierId), BigInt(quantity)],
      });

      // Wait for receipt
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (err) {
      console.error('Error purchasing ticket:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  // Get Ticket NFT Address
  const getTicketNFTAddress = useCallback(async (eventAddress: string) => {
    if (!publicClient) {
      setError('Provider not available');
      return null;
    }

    try {
      const nftAddress = await publicClient.readContract({
        address: eventAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'getTicketNFT',
      }) as `0x${string}`;

      return nftAddress;
    } catch (err) {
      console.error('Error getting ticket NFT address:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    }
  }, [publicClient]);

  // Transfer Ticket
  const transferTicket = useCallback(async (
    ticketNFTAddress: string,
    tokenId: number,
    toAddress: string
  ) => {
    if (!walletClient || !address || !publicClient) { // Tambahkan cek publicClient
      setError('Wallet not connected or provider not available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: ticketNFTAddress as `0x${string}`,
        abi: TICKET_NFT_ABI,
        functionName: 'transferTicket',
        args: [toAddress as `0x${string}`, BigInt(tokenId)],
      });

      // Wait for receipt
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (err) {
      console.error('Error transferring ticket:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  // List Ticket for Resale
  const listTicketForResale = useCallback(async (
    eventAddress: string,
    tokenId: number,
    price: number
  ) => {
    if (!walletClient || !address || !publicClient) { // Tambahkan cek publicClient
      setError('Wallet not connected or provider not available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // First need to approve the NFT transfer to the event contract
      // Get the NFT address
      const nftAddress = await getTicketNFTAddress(eventAddress);
      if (!nftAddress) {
        throw new Error('Could not get ticket NFT address');
      }

      // Approve 
      const approveHash = await walletClient.writeContract({
        address: nftAddress,
        abi: TICKET_NFT_ABI,
        functionName: 'approve',
        args: [eventAddress as `0x${string}`, BigInt(tokenId)],
      });

      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Now list for resale
      const hash = await walletClient.writeContract({
        address: eventAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'listTicketForResale',
        args: [BigInt(tokenId), BigInt(price)],
      });

      // Wait for receipt
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (err) {
      console.error('Error listing ticket for resale:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient, getTicketNFTAddress]);

  // Purchase Resale Ticket
  const purchaseResaleTicket = useCallback(async (
    eventAddress: string,
    tokenId: number
  ) => {
    if (!walletClient || !address || !publicClient) { // Tambahkan cek publicClient
      setError('Wallet not connected or provider not available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // First approve IDRX token spending
      // Note: You'll need to implement IDRX token approval first

      // Then purchase resale ticket
      const hash = await walletClient.writeContract({
        address: eventAddress as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'purchaseResaleTicket',
        args: [BigInt(tokenId)],
      });

      // Wait for receipt
      await publicClient.waitForTransactionReceipt({ hash });
      return true;
    } catch (err) {
      console.error('Error purchasing resale ticket:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, publicClient]);

  return {
    createEvent,
    getEvents,
    getEventDetails,
    getTicketTiers,
    addTicketTier,
    purchaseTicket,
    getTicketNFTAddress,
    transferTicket,
    listTicketForResale,
    purchaseResaleTicket,
    loading,
    error
  };
};