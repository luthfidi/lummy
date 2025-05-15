import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Divider,
  Flex,
  Badge,
  Icon,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ResaleTicket } from "./ResaleTicketCard";
import { PriceComparison } from "./PriceComparison";

interface BuyResaleTicketProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ResaleTicket;
}

export const BuyResaleTicket: React.FC<BuyResaleTicketProps> = ({
  isOpen,
  onClose,
  ticket,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const toast = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleBuyTicket = () => {
    setIsLoading(true);

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsLoading(false);
      setIsPurchaseComplete(true);
      setTransactionHash(
        "0x4a8e7591fb9384e46ce0fc35f37f1379158ed0baa19e22bf9ffdf396dce47db5"
      );

      toast({
        title: "Purchase Successful",
        description: "The ticket has been transferred to your wallet",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }, 3000);
  };

  const handleViewTickets = () => {
    onClose();
    // In a real app, we would redirect to the tickets page here
    window.location.href = "/tickets";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        {!isPurchaseComplete ? (
          <>
            <ModalHeader>Purchase Resale Ticket</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="lg" fontWeight="bold">
                    {ticket.eventName}
                  </Text>
                  <HStack mt={1} color="gray.600">
                    <Icon as={FaCalendarAlt} />
                    <Text fontSize="sm">{formatDate(ticket.eventDate)}</Text>
                  </HStack>
                  <HStack mt={1} color="gray.600">
                    <Icon as={FaMapMarkerAlt} />
                    <Text fontSize="sm">{ticket.eventLocation}</Text>
                  </HStack>
                </Box>

                <Divider />

                <Box>
                  <HStack>
                    <Icon as={FaTicketAlt} color="blue.500" />
                    <Text fontWeight="medium">{ticket.ticketType}</Text>
                  </HStack>

                  <Box mt={3}>
                    <PriceComparison
                      originalPrice={ticket.originalPrice}
                      resalePrice={ticket.resalePrice}
                      currency={ticket.currency}
                      showDetail={true}
                    />
                  </Box>
                </Box>

                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box fontSize="sm">
                    <Text>
                      This is a resale ticket. The NFT will be transferred
                      directly to your wallet upon purchase.
                    </Text>
                    <Text mt={1}>
                      All transactions are verified on the Lisk blockchain
                      ensuring authenticity.
                    </Text>
                  </Box>
                </Alert>

                {ticket.transferCount && ticket.transferCount > 0 && (
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon as={FaExclamationTriangle} />
                    <Text fontSize="sm">
                      This ticket has been transferred {ticket.transferCount}{" "}
                      time
                      {ticket.transferCount > 1 ? "s" : ""} before.
                    </Text>
                  </Alert>
                )}

                <Divider />

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Price Breakdown
                  </Text>
                  <VStack spacing={2} align="stretch">
                    <Flex justify="space-between">
                      <Text fontSize="sm">Resale Price</Text>
                      <Text fontSize="sm">
                        {ticket.currency} {ticket.resalePrice.toLocaleString()}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontSize="sm">Platform Fee (1%)</Text>
                      <Text fontSize="sm">
                        {ticket.currency}{" "}
                        {(ticket.resalePrice * 0.01).toLocaleString()}
                      </Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between" fontWeight="bold">
                      <Text>Total</Text>
                      <Text>
                        {ticket.currency}{" "}
                        {(ticket.resalePrice * 1.01).toLocaleString()}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <HStack spacing={3}>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleBuyTicket}
                  isLoading={isLoading}
                  loadingText="Processing..."
                  _hover={{
                    bg: isLoading ? "purple.500" : "purple.600",
                  }}
                >
                  Confirm Purchase
                </Button>
              </HStack>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalHeader>Purchase Complete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6} align="center" py={4}>
                <Flex
                  width="80px"
                  height="80px"
                  borderRadius="full"
                  bg="green.100"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaCheck} color="green.500" boxSize="40px" />
                </Flex>

                <Text fontSize="xl" fontWeight="bold" color="green.600">
                  Ticket Purchased Successfully!
                </Text>

                <VStack spacing={1} align="center">
                  <Text>{ticket.eventName}</Text>
                  <Badge colorScheme="blue">{ticket.ticketType}</Badge>
                </VStack>

                <Box width="100%" bg="gray.50" p={4} borderRadius="md">
                  <Text fontSize="sm" mb={2}>
                    Transaction has been confirmed on the blockchain:
                  </Text>
                  <Box
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    fontFamily="monospace"
                    fontSize="xs"
                    wordBreak="break-all"
                  >
                    {transactionHash}
                  </Box>
                </Box>

                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="medium">
                      The ticket has been transferred to your wallet
                    </Text>
                    <Text fontSize="sm">
                      You can view and manage your tickets in the My Tickets
                      section
                    </Text>
                  </Box>
                </Alert>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={handleViewTickets}>
                View My Tickets
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BuyResaleTicket;
