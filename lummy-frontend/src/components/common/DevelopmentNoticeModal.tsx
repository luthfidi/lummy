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
      size={{ base: "sm", md: "md" }}
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent
        borderRadius={{ base: "lg", md: "xl" }}
        overflow="hidden"
        mx={{ base: 4, md: 0 }}
        my={{ base: 4, md: 0 }}
        maxH={{ base: "calc(100vh - 2rem)", md: "auto" }}
      >
        <ModalHeader
          bg="orange.50"
          borderBottomWidth="1px"
          borderColor="orange.200"
          py={{ base: 4, md: 6 }}
          px={{ base: 4, md: 6 }}
        >
          <HStack spacing={{ base: 2, md: 3 }}>
            <Box
              p={{ base: 1.5, md: 2 }}
              bg="orange.100"
              borderRadius="full"
              color="orange.600"
              flexShrink={0}
            >
              <Icon as={FaExclamationTriangle} boxSize={{ base: 4, md: 5 }} />
            </Box>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color="orange.800"
              lineHeight="short"
            >
              🚧 Development Notice
            </Text>
          </HStack>
        </ModalHeader>

        <ModalCloseButton
          color="orange.600"
          size={{ base: "sm", md: "md" }}
          top={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
        />

        <ModalBody
          py={{ base: 4, md: 6 }}
          px={{ base: 4, md: 6 }}
          overflowY="auto"
        >
          <VStack spacing={{ base: 3, md: 4 }} align="stretch">
            <Text
              color="gray.700"
              fontSize={{ base: "sm", md: "md" }}
              lineHeight="relaxed"
            >
              This website is currently in development phase and uses sample
              data for demonstration purposes.
            </Text>

            <Box>
              <Text
                fontWeight="medium"
                mb={{ base: 2, md: 3 }}
                color="gray.800"
                fontSize={{ base: "sm", md: "md" }}
              >
                Key Points:
              </Text>
              <List spacing={{ base: 1.5, md: 2 }}>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon
                    as={CheckIcon}
                    color="orange.500"
                    mt={0.5}
                    boxSize={{ base: 3, md: 4 }}
                    flexShrink={0}
                  />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    lineHeight="relaxed"
                  >
                    All events, tickets, and transactions shown are mock data
                  </Text>
                </ListItem>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon
                    as={CheckIcon}
                    color="orange.500"
                    mt={0.5}
                    boxSize={{ base: 3, md: 4 }}
                    flexShrink={0}
                  />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    lineHeight="relaxed"
                  >
                    Smart contract integration is being actively developed
                  </Text>
                </ListItem>
                <ListItem display="flex" alignItems="flex-start">
                  <ListIcon
                    as={CheckIcon}
                    color="orange.500"
                    mt={0.5}
                    boxSize={{ base: 3, md: 4 }}
                    flexShrink={0}
                  />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    lineHeight="relaxed"
                  >
                    Some features may not work as expected
                  </Text>
                </ListItem>
              </List>
            </Box>

            <Box
              bg="blue.50"
              p={{ base: 3, md: 4 }}
              borderRadius="md"
              borderLeftWidth="4px"
              borderLeftColor="blue.400"
            >
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="blue.700"
                fontWeight="medium"
                lineHeight="relaxed"
              >
                💡 We're working hard to integrate with the Lisk blockchain!
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter
          bg="gray.50"
          borderTopWidth="1px"
          borderColor="gray.200"
          py={{ base: 3, md: 4 }}
          px={{ base: 4, md: 6 }}
          justifyContent="center"
        >
          <Button
            colorScheme="orange"
            onClick={onClose}
            size={{ base: "md", md: "md" }}
            px={{ base: 6, md: 8 }}
            py={{ base: 2, md: 3 }}
            borderRadius="lg"
            width={{ base: "100%", md: "auto" }}
            fontSize={{ base: "sm", md: "md" }}
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "md",
            }}
            _active={{
              transform: "translateY(0)",
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
