import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
  HStack,
  Box,
  Icon,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { FaExclamationTriangle } from "react-icons/fa";

interface DevelopmentNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevelopmentNoticeModal: React.FC<DevelopmentNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="md"
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent borderRadius="xl" overflow="hidden">
        <ModalHeader
          bg="orange.50"
          borderBottomWidth="1px"
          borderColor="orange.200"
        >
          <HStack spacing={3}>
            <Box p={2} bg="orange.100" borderRadius="full" color="orange.600">
              <Icon as={FaExclamationTriangle} boxSize={5} />
            </Box>
            <Text fontSize="lg" fontWeight="bold" color="orange.800">
              🚧 Development Notice
            </Text>
          </HStack>
        </ModalHeader>

        <ModalCloseButton color="orange.600" />

        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <Text color="gray.700" fontSize="md">
              This website is currently in development phase and uses sample
              data for demonstration purposes.
            </Text>

            <Box>
              <Text fontWeight="medium" mb={3} color="gray.800">
                Key Points:
              </Text>
              <List spacing={2}>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon as={CheckIcon} color="orange.500" mt={1} />
                  <Text fontSize="sm">
                    All events, tickets, and transactions shown are mock data
                  </Text>
                </ListItem>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon as={CheckIcon} color="orange.500" mt={1} />
                  <Text fontSize="sm">
                    Smart contract integration is being actively developed
                  </Text>
                </ListItem>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon as={CheckIcon} color="orange.500" mt={1} />
                  <Text fontSize="sm">
                    Some features may not work as expected
                  </Text>
                </ListItem>
              </List>
            </Box>

            <Box
              bg="blue.50"
              p={4}
              borderRadius="md"
              borderLeftWidth="4px"
              borderLeftColor="blue.400"
            >
              <Text fontSize="sm" color="blue.700" fontWeight="medium">
                💡 We're working hard to integrate with the Lisk blockchain!
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" borderTopWidth="1px" borderColor="gray.200">
          <Button
            colorScheme="orange"
            onClick={onClose}
            size="md"
            px={8}
            borderRadius="lg"
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "md",
            }}
          >
            I Understand
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DevelopmentNoticeModal;
