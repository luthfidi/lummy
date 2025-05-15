// Simulasi integrasi dengan Xellar Wallet SDK
// Dalam implementasi nyata, ini akan menggunakan SDK asli dari Xellar

export interface XellarWallet {
  address: string;
  network: string;
  chainId: number;
  isConnected: boolean;
}

export interface WalletBalance {
  IDRX: number;
  LSK: number;
  [key: string]: number;
}

export interface TransactionParams {
  to: string;
  amount: number;
  tokenType?: string;
  data?: string;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// Simulasi singleton wallet instance
class XellarSDK {
  private static instance: XellarSDK;
  private wallet: XellarWallet | null = null;
  private balances: WalletBalance = { IDRX: 0, LSK: 0 };
  private listeners: Array<(wallet: XellarWallet | null) => void> = [];

  private constructor() {
    // Private constructor untuk memastikan singleton pattern
  }

  public static getInstance(): XellarSDK {
    if (!XellarSDK.instance) {
      XellarSDK.instance = new XellarSDK();
    }
    return XellarSDK.instance;
  }

  public isAvailable(): boolean {
    // Simulasi pengecekan apakah Xellar tersedia di browser
    return true;
  }

  public async connect(): Promise<XellarWallet | null> {
    // Simulasi proses koneksi ke wallet
    return new Promise((resolve) => {
      setTimeout(() => {
        this.wallet = {
          address: "0x1234567890abcdef1234567890abcdef12345678",
          network: "Lisk Mainnet",
          chainId: 1,
          isConnected: true,
        };

        // Set demo balances
        this.balances = {
          IDRX: 1000,
          LSK: 5.5,
        };

        // Notify listeners
        this.notifyListeners();

        resolve(this.wallet);
      }, 1000);
    });
  }

  public async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.wallet = null;
        this.balances = { IDRX: 0, LSK: 0 };
        this.notifyListeners();
        resolve();
      }, 500);
    });
  }

  public getWallet(): XellarWallet | null {
    return this.wallet;
  }

  public async getBalance(tokenType: string = "IDRX"): Promise<number> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.balances[tokenType] || 0);
      }, 300);
    });
  }

  public async getAllBalances(): Promise<WalletBalance> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.balances });
      }, 300);
    });
  }

  public async sendTransaction(
    params: TransactionParams
  ): Promise<TransactionResult> {
    if (!this.wallet) {
      throw new Error("Wallet not connected");
    }

    // Simulate a transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if we have enough balance
        const tokenType = params.tokenType || "IDRX";
        const currentBalance = this.balances[tokenType] || 0;

        if (currentBalance < params.amount) {
          resolve({
            success: false,
            error: "Insufficient balance",
          });
          return;
        }

        // Simulate successful transaction
        this.balances[tokenType] = currentBalance - params.amount;
        this.notifyListeners();

        resolve({
          success: true,
          transactionHash: "0x" + Math.random().toString(16).substring(2, 42),
        });
      }, 2000);
    });
  }

  public addWalletListener(
    listener: (wallet: XellarWallet | null) => void
  ): void {
    this.listeners.push(listener);

    // Call with current state immediately
    listener(this.wallet);
  }

  public removeWalletListener(
    listener: (wallet: XellarWallet | null) => void
  ): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.wallet));
  }
}

export default XellarSDK;
