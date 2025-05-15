import React from "react";
import { Button, Icon } from "@chakra-ui/react";
import { FaWallet } from "react-icons/fa";
import { useWallet } from "../../hooks/useWallet";

interface ConnectButtonProps {
  onSuccess?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  colorScheme?: string;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  onSuccess,
  size = "md",
  variant = "outline",
  colorScheme = "purple",
}) => {
  const { connect, isConnecting } = useWallet();

  const handleConnect = async () => {
    await connect();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Button
      leftIcon={<Icon as={FaWallet} />}
      onClick={handleConnect}
      isLoading={isConnecting}
      loadingText="Connecting..."
      size={size}
      variant={variant}
      colorScheme={colorScheme}
      borderRadius="full"
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
