import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Heading,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { FaEthereum } from "react-icons/fa";
import { ConnectButton } from "@xellar/kit";

interface WalletConnectProps {
  onConnect: () => void;
  isLoading: boolean;
  isConnected?: boolean;
  walletAddress?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  isLoading,
  isConnected = false,
  walletAddress,
}) => {
  const bgColor = "white";
  const borderColor = "gray.200";

  return (
    <VStack
      spacing={6}
      align="stretch"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      boxShadow="sm"
    >
      <Heading size="md">Connect Your Wallet</Heading>
      <Text color="gray.600">
        To purchase tickets on Lummy, you need to connect your Xellar Wallet
        which will be used for the IDRX payment and to store your ticket NFTs.
      </Text>

      <Box
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        p={4}
        bg={"lummy.purple.50"}
      >
        <VStack align="center" spacing={4}>
          <Box
            boxSize="80px"
            borderRadius="full"
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="sm"
          >
            <Text fontSize="4xl">🔒</Text>
          </Box>
          <Text fontWeight="medium">Your NFT tickets are secure</Text>
          <Text fontSize="sm" textAlign="center" color="gray.600">
            NFT tickets cannot be counterfeited or duplicated, ensuring your
            tickets are authentic and valid for entry.
          </Text>
        </VStack>
      </Box>

      <Divider />

      <VStack align="stretch" spacing={4}>
        <Heading size="sm">Available Wallets</Heading>

        {/* Xellar Wallet Option */}
        <Box
          borderWidth="1px"
          borderRadius="md"
          borderColor={isConnected ? "lummy.purple.300" : borderColor}
          p={4}
          boxShadow={
            isConnected ? "0 0 0 2px rgba(138, 110, 247, 0.3)" : "none"
          }
          cursor="pointer"
          _hover={{ borderColor: "lummy.purple.300" }}
        >
          <HStack spacing={4} justify="space-between">
            <HStack spacing={4}>
              {/* Placeholder for Xellar logo */}
              <Box
                boxSize="40px"
                borderRadius="full"
                bg="lummy.purple.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaEthereum} fontSize="xl" color="lummy.purple.500" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">Xellar Wallet</Text>
                <Text fontSize="xs" color="gray.500">
                  Recommended
                </Text>
              </VStack>
            </HStack>

            {isConnected ? (
              <Badge
                colorScheme="green"
                variant="subtle"
                borderRadius="full"
                px={2}
              >
                <HStack spacing={1}>
                  <CheckCircleIcon />
                  <Text>Connected</Text>
                </HStack>
              </Badge>
            ) : (
              <Button
                colorScheme="purple"
                size="sm"
                onClick={onConnect}
                isLoading={isLoading}
                loadingText="Connecting..."
                _hover={{
                  bg: isLoading ? "purple.500" : "purple.600",
                }}
              >
                Connect
              </Button>
            )}
          </HStack>

          {isConnected && walletAddress && (
            <HStack mt={3} spacing={2}>
              <Text fontSize="xs" color="gray.500">
                Wallet:
              </Text>
              <Text fontSize="xs">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Text>
            </HStack>
          )}
        </Box>

        {/* New to blockchain section */}
        <Box mt={4} p={4} bg="gray.50" borderRadius="md">
          <VStack align="stretch" spacing={3}>
            <Text fontWeight="medium">New to blockchain?</Text>
            <Text fontSize="sm" color="gray.600">
              Don't have a wallet yet? No problem! Download the Xellar Wallet
              app to get started with crypto and NFT tickets.
            </Text>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button
                  variant="outline"
                  colorScheme="purple"
                  px={4}
                  py={2}
                  borderRadius="lg"
                  onClick={openConnectModal}
                >
                  Get Xellar Wallet
                </Button>
              )}
            </ConnectButton.Custom>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
};

export default WalletConnect;
