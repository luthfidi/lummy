import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Icon,
  Divider,
  Flex,
  Container,
} from "@chakra-ui/react";
import { CheckCircleIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { FaTicketAlt } from "react-icons/fa";
import { Event, TicketTier } from "../../types/Event";

interface PaymentConfirmationProps {
  event: Event;
  tier: TicketTier;
  quantity: number;
  transactionHash: string;
  onViewTickets: () => void;
}

export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  event,
  tier,
  quantity,
  transactionHash,
  onViewTickets,
}) => {
  const bgColor = "white";

  return (
    <Container maxW="container.sm">
      <VStack
        spacing={6}
        align="stretch"
        bg={bgColor}
        borderWidth="1px"
        borderColor="green.200"
        borderRadius="lg"
        p={6}
        boxShadow="sm"
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          py={3}
        >
          <Flex
            width="80px"
            height="80px"
            borderRadius="full"
            bg="green.50"
            align="center"
            justify="center"
            mb={3}
          >
            <CheckCircleIcon color="green.500" boxSize="50px" />
          </Flex>

          <Heading size="md" color="green.600">
            Payment Successful!
          </Heading>
          <Text color="gray.600" fontSize="sm" mt={2}>
            Your tickets have been successfully minted as NFTs to your wallet
          </Text>
        </Flex>

        <Divider />

        <Box>
          <Heading size="sm" mb={3}>
            Order Details
          </Heading>

          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium">
                Event
              </Text>
              <Text fontSize="sm">{event.title}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium">
                Ticket Type
              </Text>
              <Text fontSize="sm">{tier.name}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium">
                Quantity
              </Text>
              <Text fontSize="sm">{quantity}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium">
                Total Paid
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {tier.currency} {(tier.price * quantity).toLocaleString()}
              </Text>
            </HStack>
          </VStack>
        </Box>

        <Box bg="blue.50" p={3} borderRadius="md">
          <VStack align="stretch" spacing={1}>
            <Text fontSize="sm" fontWeight="medium" color="blue.700">
              Transaction Details
            </Text>
            <Text fontSize="xs" color="blue.600">
              Your transaction has been recorded on the blockchain.
            </Text>
            <HStack fontSize="xs" color="gray.600" spacing={1}>
              <Text>Transaction Hash:</Text>
              <Box
                fontFamily="monospace"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}
              </Box>
              <Button
                as="a"
                href={`https://explorer.lisk.com/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                variant="link"
                colorScheme="blue"
                leftIcon={<ExternalLinkIcon />}
              >
                View
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Box
          borderWidth="1px"
          borderRadius="md"
          borderColor="purple.200"
          p={3}
          bg="purple.50"
        >
          <HStack spacing={2}>
            <Icon as={FaTicketAlt} color="lummy.purple.500" />
            <Text fontSize="sm" fontWeight="medium" color="lummy.purple.700">
              Your Tickets Are Ready!
            </Text>
          </HStack>
          <Text fontSize="xs" color="lummy.purple.600" mt={1}>
            You can view, manage, and transfer your tickets in your ticket
            wallet.
          </Text>
        </Box>

        <Button
          colorScheme="purple"
          size="md"
          onClick={onViewTickets}
          leftIcon={<Icon as={FaTicketAlt} />}
        >
          View My Tickets
        </Button>
      </VStack>
    </Container>
  );
};

export default PaymentConfirmation;
