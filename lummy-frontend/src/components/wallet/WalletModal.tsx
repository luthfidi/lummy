import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Box,
  Heading,
  Divider,
  useClipboard,
} from "@chakra-ui/react";
import { useBalance } from "wagmi";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: `0x${string}`;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  address,
}) => {
  const { data: balanceData } = useBalance({ address });
  const { hasCopied, onCopy } = useClipboard(address);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Wallet Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Heading size="sm" mb={2}>
                Address
              </Heading>
              <HStack>
                <Text fontSize="sm" fontFamily="monospace">
                  {address}
                </Text>
                <Button size="xs" onClick={onCopy}>
                  {hasCopied ? "Copied!" : "Copy"}
                </Button>
              </HStack>
            </Box>

            <Divider />

            <Box>
              <Heading size="sm" mb={2}>
                Balance
              </Heading>
              <Text>
                {balanceData
                  ? `${balanceData.formatted} ${balanceData.symbol}`
                  : "Loading..."}
              </Text>
            </Box>

            <Divider />

            <Box>
              <Heading size="sm" mb={2}>
                Recent Transactions
              </Heading>
              <Text>Transaction history not available</Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
