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
 * Simplified custom hook for interacting with smart contracts.
 * Removes automatic retries and infinite loops.
 */
export const useSmartContract = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error when starting new operation
  const clearError = () => setError(null);

  /**
   * Creates a new event on the blockchain - single attempt only
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
        const errorMsg = "Wallet not connected or provider not available";
        setError(errorMsg);
        return null;
      }

      setLoading(true);
      clearError();

      try {
        const dateTimestamp = Math.floor(date.getTime() / 1000);

        const hash = await walletClient.writeContract({
          address: EVENT_FACTORY_ADDRESS as `0x${string}`,
          abi: EVENT_FACTORY_ABI,
          functionName: "createEvent",
          args: [name, description, BigInt(dateTimestamp), venue, ipfsMetadata],
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        const logs = receipt.logs;

        for (const log of logs) {
          if (
            log.topics[0] ===
            "0x7a74ea23c916c344aa7bb079fa7db0cdb4964ade3d70c7f1c8694f9efa0b8abe"
          ) {
            const eventAddress =
              (`0x${log.topics[2]?.slice(26)}` as `0x${string}`) || "";
            return eventAddress;
          }
        }

        return null;
      } catch (err) {
        console.error("Error creating event:", err);
        const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [walletClient, address, publicClient]
  );

  /**
   * Retrieves all events from the factory contract - single attempt only
   */
  const getEvents = useCallback(async () => {
    if (!publicClient) {
      const errorMsg = "Provider not available";
      setError(errorMsg);
      return [];
    }

    setLoading(true);
    clearError();

    try {
      const events = (await publicClient.readContract({
        address: EVENT_FACTORY_ADDRESS as `0x${string}`,
        abi: EVENT_FACTORY_ABI,
        functionName: "getEvents",
      })) as `0x${string}`[];

      return events;
    } catch (err) {
      console.error("Error getting events:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  /**
   * Gets the details of a specific event - single attempt only
   */
  const getEventDetails = useCallback(
    async (eventAddress: string) => {
      if (!publicClient) {
        const errorMsg = "Provider not available";
        setError(errorMsg);
        return null;
      }

      setLoading(true);
      clearError();

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
        const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [publicClient]
  );

  /**
   * Gets all ticket tiers for an event - single attempt only
   */
  const getTicketTiers = useCallback(
    async (eventAddress: string) => {
      if (!publicClient) {
        const errorMsg = "Provider not available";
        setError(errorMsg);
        return [];
      }

      setLoading(true);
      clearError();

      try {
        const tierCount = (await publicClient.readContract({
          address: eventAddress as `0x${string}`,
          abi: EVENT_ABI,
          functionName: "tierCount",
        })) as bigint;

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
        const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMsg);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [publicClient]
  );

  /**
   * Adds a new ticket tier to an event - single attempt only
   */
  const addTicketTier = useCallback(
    async (
      eventAddress: string,
      name: string,
      price: number,
      available: number,
      maxPerPurchase: number
    ) => {
      if (!walletClient || !address || !publicClient) {
        const errorMsg = "Wallet not connected or provider not available";
        setError(errorMsg);
        return false;
      }

      setLoading(true);
      clearError();

      try {
        const hash = await walletClient.writeContract({
          address: eventAddress as `0x${string}`,
          abi: EVENT_ABI,
          functionName: "addTicketTier",
          args: [
            name,
            BigInt(price),
            BigInt(available),
            BigInt(maxPerPurchase),
          ],
        });

        await publicClient.waitForTransactionReceipt({ hash });
        return true;
      } catch (err) {
        console.error("Error adding ticket tier:", err);
        const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [walletClient, address, publicClient]
  );

  /**
   * Manual retry function - users can call this explicitly
   */
  const retryLastOperation = useCallback(() => {
    clearError();
    // This would need to be implemented based on what operation failed
    console.log("Retry functionality - implement based on last failed operation");
  }, []);

  return {
    createEvent,
    getEvents,
    getEventDetails,
    getTicketTiers,
    addTicketTier,
    retryLastOperation,
    loading,
    error,
    clearError,
  };
};