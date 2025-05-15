import { useCallback } from "react";
import { useWalletContext } from "../context/WalletContext";
import TransactionService from "../services/TransactionService";
import { TransactionResult } from "../services/XellarIntegration";

export const useWallet = () => {
  const context = useWalletContext();
  const transactionService = new TransactionService();

  const formatAddress = useCallback((address?: string, length = 4) => {
    if (!address) return "";
    return `${address.substring(0, length + 2)}...${address.substring(
      address.length - length
    )}`;
  }, []);
  

  const isWalletReady = useCallback(() => {
    return context.isConnected && !context.isConnecting;
  }, [context.isConnected, context.isConnecting]);

  const hasEnoughBalance = useCallback(
    (amount: number, tokenType = "IDRX") => {
      return (context.balance[tokenType] || 0) >= amount;
    },
    [context.balance]
  );

  const buyTicket = useCallback(
    async (
      eventId: string,
      ticketTierId: string,
      price: number,
      quantity = 1
    ): Promise<TransactionResult> => {
      if (!isWalletReady()) {
        return {
          success: false,
          error: "Wallet not connected",
        };
      }

      if (!hasEnoughBalance(price * quantity)) {
        return {
          success: false,
          error: "Insufficient balance",
        };
      }

      const result = await transactionService.buyTicket(
        eventId,
        ticketTierId,
        price,
        quantity
      );

      if (result.success) {
        await context.refreshBalance();
      }

      return result;
    },
    [context, isWalletReady, hasEnoughBalance]
  );

  const resellTicket = useCallback(
    async (ticketId: string, price: number): Promise<TransactionResult> => {
      if (!isWalletReady()) {
        return {
          success: false,
          error: "Wallet not connected",
        };
      }

      const result = await transactionService.resellTicket(ticketId, price);

      if (result.success) {
        await context.refreshBalance();
      }

      return result;
    },
    [context, isWalletReady]
  );

  const transferTicket = useCallback(
    async (ticketId: string, toAddress: string): Promise<TransactionResult> => {
      if (!isWalletReady()) {
        return {
          success: false,
          error: "Wallet not connected",
        };
      }

      const result = await transactionService.transferTicket(
        ticketId,
        toAddress
      );

      if (result.success) {
        await context.refreshBalance();
      }

      return result;
    },
    [context, isWalletReady]
  );

  return {
    ...context,
    formatAddress,
    isWalletReady,
    hasEnoughBalance,
    buyTicket,
    resellTicket,
    transferTicket,
  };
};
