import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  Grid,
  GridItem,
  Flex,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaExchangeAlt,
  FaShoppingCart,
  FaLink,
  FaUser,
  FaClock,
} from "react-icons/fa";
import { QRCode } from "./QRCode";
import { TransferTicket } from "./TransferTicket";
import { ResellTicket } from "./ResellTicket";
import { Ticket } from "./TicketCard";

interface TicketDetailsProps {
  ticket: Ticket;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket }) => {
  const {
    isOpen: isTransferOpen,
    onOpen: onTransferOpen,
    onClose: onTransferClose,
  } = useDisclosure();

  const {
    isOpen: isResellOpen,
    onOpen: onResellOpen,
    onClose: onResellClose,
  } = useDisclosure();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "valid":
        return "green";
      case "used":
        return "gray";
      case "expired":
        return "red";
      case "transferred":
        return "blue";
      default:
        return "gray";
    }
  };

  const isActive = ticket.status === "valid";

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        boxShadow="md"
      >
        <Box bg="lummy.purple.500" color="white" py={3} px={6}>
          <HStack justify="space-between">
            <Box>
              <HStack mb={1}>
                <Icon as={FaTicketAlt} />
                <Text fontWeight="medium">Ticket Details</Text>
              </HStack>
              <Text fontSize="xl" fontWeight="bold">
                {ticket.eventName}
              </Text>
            </Box>
            <Badge
              colorScheme={getStatusColor(ticket.status)}
              variant="solid"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="md"
            >
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
          </HStack>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} p={6}>
          <GridItem>
            <VStack align="start" spacing={4}>
              <Box width="100%">
                <Text fontWeight="medium" mb={2}>
                  Event Information
                </Text>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FaCalendarAlt} color="gray.500" />
                    <Box>
                      <Text fontWeight="medium">Date</Text>
                      <Text color="gray.600">
                        {formatDate(ticket.eventDate)}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Icon as={FaClock} color="gray.500" />
                    <Box>
                      <Text fontWeight="medium">Time</Text>
                      <Text color="gray.600">
                        {formatTime(ticket.eventDate)}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="gray.500" />
                    <Box>
                      <Text fontWeight="medium">Location</Text>
                      <Text color="gray.600">{ticket.eventLocation}</Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              <Box width="100%">
                <Text fontWeight="medium" mb={2}>
                  Ticket Information
                </Text>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={FaTicketAlt} color="gray.500" />
                    <Box>
                      <Text fontWeight="medium">Type</Text>
                      <Text color="gray.600">{ticket.ticketType}</Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Icon as={FaUser} color="gray.500" />
                    <Box>
                      <Text fontWeight="medium">Owner</Text>
                      <Text color="gray.600">
                        {ticket.ownerAddress
                          ? `${ticket.ownerAddress.substring(
                              0,
                              6
                            )}...${ticket.ownerAddress.substring(38)}`
                          : "You"}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Icon as={FaLink} color="gray.500" />
                    <Box>
                      <Text fontWeight="medium">Token ID</Text>
                      <Text color="gray.600">
                        {ticket.tokenId || `NFT-${ticket.id.substring(0, 8)}`}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Icon as={FaClock} color="gray.500" />
                    <Box>
                      <Text fontWeight="medium">Purchase Date</Text>
                      <Text color="gray.600">
                        {formatDate(ticket.purchaseDate)}
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack spacing={4} align="center" justify="center" height="100%">
              <Box
                borderWidth="1px"
                borderRadius="lg"
                p={6}
                bg={isActive ? "white" : "gray.100"}
                width="100%"
                textAlign="center"
              >
                {isActive ? (
                  <>
                    <Text fontWeight="medium" mb={4}>
                      Scan this QR code at the event
                    </Text>
                    <Flex justify="center">
                      <QRCode
                        ticketId={ticket.id}
                        eventId={ticket.eventId}
                        size={200}
                      />
                    </Flex>
                  </>
                ) : (
                  <Text color="gray.600" py={8}>
                    This ticket is {ticket.status}.
                    {ticket.status === "transferred" &&
                      " QR code is no longer valid."}
                  </Text>
                )}
              </Box>

              {isActive && (
                <HStack spacing={4} width="100%" justify="center">
                  <Button
                    leftIcon={<Icon as={FaExchangeAlt} />}
                    colorScheme="purple"
                    variant="outline"
                    onClick={onTransferOpen}
                    flex={1}
                  >
                    Transfer
                  </Button>
                  <Button
                    leftIcon={<Icon as={FaShoppingCart} />}
                    colorScheme="green"
                    onClick={onResellOpen}
                    flex={1}
                  >
                    Resell
                  </Button>
                </HStack>
              )}

              <Box
                borderWidth="1px"
                borderRadius="md"
                p={4}
                bg="blue.50"
                width="100%"
              >
                <Text fontSize="sm" color="blue.700">
                  This ticket is an NFT on the Lisk blockchain, ensuring
                  authenticity and preventing counterfeiting. You can transfer
                  it to another wallet or resell it through the marketplace.
                </Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      <TransferTicket
        isOpen={isTransferOpen}
        onClose={onTransferClose}
        ticket={ticket}
      />

      <ResellTicket
        isOpen={isResellOpen}
        onClose={onResellClose}
        ticket={ticket}
      />
    </>
  );
};

export default TicketDetails;
