// src/hooks/useSmartContract.ts
import { useState, useCallback } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import {
  EVENT_FACTORY_ADDRESS,
  EVENT_FACTORY_ABI,
} from "../contracts/EventFactory";
import { EVENT_ABI } from "../contracts/Event";

/**
 * Interface for Event data returned from contracts
 */
export interface EventData {
  name: string;
  description: string;
  date: number;
  venue: string;
  ipfsMetadata: string;
  organizer: string;
}

/**
 * Interface for Ticket Tier data from contracts
 */
export interface TicketTierData {
  name: string;
  price: number;
  available: number;
  sold: number;
  maxPerPurchase: number;
  active: boolean;
}

/**
 * Custom hook for interacting with smart contracts.
 * Provides functions for:
 * - Creating and managing events
 * - Handling ticket tiers
 * - Processing ticket purchases and transfers
 */
export const useSmartContract = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Creates a new event on the blockchain
   * @param name Event name
   * @param description Event description
   * @param date Event date
   * @param venue Event venue
   * @param ipfsMetadata Additional metadata in IPFS
   * @returns Event contract address if successful, null otherwise
   */
  const createEvent = useCallback(
    async (
      name: string,
      description: string,
      date: Date,
      venue: string,
      ipfsMetadata: string = ""
    ) => {
      if (!walletClient || !address || !publicClient) {
        setError("Wallet not connected or provider not available");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        // Convert date to unix timestamp in seconds
        const dateTimestamp = Math.floor(date.getTime() / 1000);

        // Prepare transaction
        const hash = await walletClient.writeContract({
          address: EVENT_FACTORY_ADDRESS as `0x${string}`,
          abi: EVENT_FACTORY_ABI,
          functionName: "createEvent",
          args: [name, description, BigInt(dateTimestamp), venue, ipfsMetadata],
        });

        // Wait for receipt
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        // Find EventCreated event from receipt
        const logs = receipt.logs;

        // Manually find EventCreated event
        for (const log of logs) {
          // EventCreated has signature 'EventCreated(uint256,address)'
          // topic[0] is the event signature hash
          if (
            log.topics[0] ===
            "0x7a74ea23c916c344aa7bb079fa7db0cdb4964ade3d70c7f1c8694f9efa0b8abe"
          ) {
            // Decode eventId and eventContract from log
            // topics[1] is eventId (indexed)
            // topics[2] is eventContract (indexed)
            const eventAddress =
              (`0x${log.topics[2]?.slice(26)}` as `0x${string}`) || "";
            return eventAddress;
          }
        }

        return null;
      } catch (err) {
        console.error("Error creating event:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [walletClient, address, publicClient]
  );

  /**
   * Retrieves all events from the factory contract
   * @returns Array of event contract addresses
   */
  const getEvents = useCallback(async () => {
    if (!publicClient) {
      setError("Provider not available");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const events = (await publicClient.readContract({
        address: EVENT_FACTORY_ADDRESS as `0x${string}`,
        abi: EVENT_FACTORY_ABI,
        functionName: "getEvents",
      })) as `0x${string}`[];

      return events;
    } catch (err) {
      console.error("Error getting events:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  /**
   * Gets the details of a specific event
   * @param eventAddress Contract address of the event
   * @returns Event details or null if error
   */
  const getEventDetails = useCallback(
    async (eventAddress: string) => {
      if (!publicClient) {
        setError("Provider not available");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const details = (await publicClient.readContract({
          address: EVENT_FACTORY_ADDRESS as `0x${string}`,
          abi: EVENT_FACTORY_ABI,
          functionName: "getEventDetails",
          args: [eventAddress as `0x${string}`],
        })) as EventData;

        return details;
      } catch (err) {
        console.error("Error getting event details:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [publicClient]
  );

  /**
   * Gets all ticket tiers for an event
   * @param eventAddress Contract address of the event
   * @returns Array of ticket tiers
   */
  const getTicketTiers = useCallback(
    async (eventAddress: string) => {
      if (!publicClient) {
        setError("Provider not available");
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        // Get tier count
        const tierCount = (await publicClient.readContract({
          address: eventAddress as `0x${string}`,
          abi: EVENT_ABI,
          functionName: "tierCount",
        })) as bigint;

        // Get tier details for each tier
        const tiers: TicketTierData[] = [];
        for (let i = 0; i < Number(tierCount); i++) {
          const tier = (await publicClient.readContract({
            address: eventAddress as `0x${string}`,
            abi: EVENT_ABI,
            functionName: "ticketTiers",
            args: [BigInt(i)],
          })) as unknown as TicketTierData;

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
        console.error("Error getting ticket tiers:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [publicClient]
  );

  return {
    createEvent,
    getEvents,
    getEventDetails,
    getTicketTiers,
    loading,
    error,
  };
};