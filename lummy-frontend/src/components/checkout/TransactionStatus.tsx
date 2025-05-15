import React from "react";
import {
  Box,
  VStack,
  Text,
  Progress,
  Flex,
  CircularProgress,
  Spinner,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

export type TransactionStatusType =
  | "processing"
  | "confirming"
  | "confirmed"
  | "failed";

interface TransactionStatusProps {
  status: TransactionStatusType;
  message?: string;
  transactionHash?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  message,
  transactionHash,
}) => {
  const getStatusContent = () => {
    switch (status) {
      case "processing":
        return {
          title: "Processing Your Payment",
          description:
            "Please wait while we process your payment. This might take a few moments.",
          icon: <Spinner size="xl" color="lummy.purple.500" thickness="4px" />,
          color: "lummy.purple",
          progress: 33,
        };
      case "confirming":
        return {
          title: "Confirming Transaction",
          description:
            "Your transaction is being confirmed on the blockchain. This usually takes 15-30 seconds.",
          icon: (
            <CircularProgress
              isIndeterminate
              color="blue.500"
              size="60px"
              thickness="4px"
            />
          ),
          color: "blue",
          progress: 66,
        };
      case "confirmed":
        return {
          title: "Transaction Confirmed!",
          description:
            "Your payment has been confirmed, and your tickets are being minted as NFTs.",
          icon: <CheckCircleIcon color="green.500" boxSize="60px" />,
          color: "green",
          progress: 100,
        };
      case "failed":
        return {
          title: "Transaction Failed",
          description:
            message ||
            "There was an issue processing your transaction. Please try again.",
          icon: <WarningIcon color="red.500" boxSize="60px" />,
          color: "red",
          progress: 100,
        };
      default:
        return {
          title: "Processing",
          description: "Please wait...",
          icon: <Spinner color="lummy.purple.500" />,
          color: "lummy.purple",
          progress: 33,
        };
    }
  };

  const content = getStatusContent();

  return (
    <VStack spacing={6} align="center" textAlign="center" p={4}>
      <Flex
        width="100px"
        height="100px"
        borderRadius="full"
        bg={`${content.color}.50`}
        align="center"
        justify="center"
      >
        {content.icon}
      </Flex>

      <Box>
        <Text fontWeight="bold" fontSize="xl">
          {content.title}
        </Text>
        <Text color="gray.600" mt={2}>
          {content.description}
        </Text>
      </Box>

      <Box w="100%">
        <Progress
          value={content.progress}
          size="xs"
          colorScheme={content.color as any}
          borderRadius="full"
          hasStripe={status !== "confirmed" && status !== "failed"}
          isAnimated={status !== "confirmed" && status !== "failed"}
        />
      </Box>

      {transactionHash && (
        <Box fontSize="sm" color="gray.500">
          <Text>Transaction Hash:</Text>
          <Text fontFamily="monospace" wordBreak="break-all">
            {transactionHash}
          </Text>
        </Box>
      )}
    </VStack>
  );
};
export default TransactionStatus;
