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
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  HStack,
  Box,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { Ticket } from "./TicketCard";

interface TransferTicketProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
}

export const TransferTicket: React.FC<TransferTicketProps> = ({
  isOpen,
  onClose,
  ticket,
}) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const toast = useToast();

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setRecipientAddress(address);
    // Simple validation - in a real app, you'd do proper blockchain address validation
    setIsValid(address.startsWith("0x") && address.length === 42);
  };

  const handleTransfer = () => {
    setIsLoading(true);

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Ticket Transferred",
        description: `Ticket successfully transferred to ${recipientAddress.substring(
          0,
          8
        )}...${recipientAddress.substring(38)}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="bold">{ticket.eventName}</Text>
              <Text fontSize="sm" color="gray.600">
                {ticket.ticketType}
              </Text>
            </Box>

            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Transferring a ticket will make it invalid for you. The
                recipient will receive the NFT ticket in their wallet.
              </Text>
            </Alert>

            <FormControl isRequired>
              <FormLabel>Recipient Wallet Address</FormLabel>
              <Input
                placeholder="0x..."
                value={recipientAddress}
                onChange={handleAddressChange}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              isLoading={isLoading}
              loadingText="Transferring..."
              isDisabled={!isValid}
              onClick={handleTransfer}
              _hover={{
                bg: isLoading ? "purple.500" : "purple.600",
              }}
            >
              Transfer Ticket
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransferTicket;
