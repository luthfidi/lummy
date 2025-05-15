import XellarSDK, { TransactionResult } from "./XellarIntegration";

class TransactionService {
  private sdk: XellarSDK;

  constructor() {
    this.sdk = XellarSDK.getInstance();
  }

  public async sendPayment(
    address: string,
    amount: number,
    tokenType: string = "IDRX"
  ): Promise<TransactionResult> {
    try {
      const result = await this.sdk.sendTransaction({
        to: address,
        amount,
        tokenType,
      });

      return result;
    } catch (error) {
      console.error("Transaction failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async buyTicket(
    eventId: string,
    ticketTierId: string,
    price: number,
    quantity: number = 1
  ): Promise<TransactionResult> {
    try {
      // In a real implementation, this would include contract data
      // for the NFT minting process
      const data = JSON.stringify({
        action: "buyTicket",
        eventId,
        ticketTierId,
        quantity,
      });

      const result = await this.sdk.sendTransaction({
        to: "0xevent_contract_address",
        amount: price * quantity,
        tokenType: "IDRX",
        data,
      });

      return result;
    } catch (error) {
      console.error("Ticket purchase failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async resellTicket(
    ticketId: string,
    price: number
  ): Promise<TransactionResult> {
    try {
      const data = JSON.stringify({
        action: "resellTicket",
        ticketId,
        price,
      });

      // This would be a contract call, not an actual token transfer
      const result = await this.sdk.sendTransaction({
        to: "0xmarketplace_contract_address",
        amount: 0, // No tokens transferred for listing
        data,
      });

      return result;
    } catch (error) {
      console.error("Ticket listing failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public async transferTicket(
    ticketId: string,
    toAddress: string
  ): Promise<TransactionResult> {
    try {
      const data = JSON.stringify({
        action: "transferTicket",
        ticketId,
        to: toAddress,
      });

      // This is an NFT transfer operation
      const result = await this.sdk.sendTransaction({
        to: "0xticket_contract_address",
        amount: 0, // No tokens transferred for NFT transfer
        data,
      });

      return result;
    } catch (error) {
      console.error("Ticket transfer failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export default TransactionService;
