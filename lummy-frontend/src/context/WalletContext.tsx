import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import XellarSDK, {
  XellarWallet,
  WalletBalance,
} from "../services/XellarIntegration";

interface WalletContextType {
  wallet: XellarWallet | null;
  isConnecting: boolean;
  isConnected: boolean;
  balance: WalletBalance;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wallet, setWallet] = useState<XellarWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState<WalletBalance>({ IDRX: 0, LSK: 0 });
  const sdk = XellarSDK.getInstance();

  useEffect(() => {
    // Register wallet listener
    const walletListener = (newWallet: XellarWallet | null) => {
      setWallet(newWallet);
    };

    sdk.addWalletListener(walletListener);

    // Check if wallet is already connected
    const checkConnection = async () => {
      const currentWallet = sdk.getWallet();
      if (currentWallet && currentWallet.isConnected) {
        setWallet(currentWallet);
        await refreshBalance();
      }
    };

    checkConnection();

    return () => {
      sdk.removeWalletListener(walletListener);
    };
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      const connectedWallet = await sdk.connect();
      setWallet(connectedWallet);
      if (connectedWallet) {
        await refreshBalance();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await sdk.disconnect();
      setWallet(null);
      setBalance({ IDRX: 0, LSK: 0 });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const refreshBalance = async () => {
    if (!wallet) return;

    try {
      const balances = await sdk.getAllBalances();
      setBalance(balances);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const value = {
    wallet,
    isConnecting,
    isConnected: !!wallet,
    balance,
    connect,
    disconnect,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};
