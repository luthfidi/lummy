import { useAccount } from "wagmi";

// Export the component so it can be used elsewhere if needed
export const WalletInfoComponent = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return <div>Connected Wallet: {address}</div>;
};

// Export by default for easy importing
export default WalletInfoComponent;
