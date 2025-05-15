import React from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaExchangeAlt,
  FaShoppingCart,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { QRCode } from "./QRCode";
import { TransferTicket } from "./TransferTicket";
import { ResellTicket } from "./ResellTicket";

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketType: string;
  price: number;
  currency: string;
  status: "valid" | "used" | "expired" | "transferred";
  purchaseDate: string;
  tokenId?: string;
  ownerAddress?: string;
}

interface TicketCardProps {
  ticket: Ticket;
  onShowDetails?: (ticketId: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onShowDetails,
}) => {
  const navigate = useNavigate();
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
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
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

  const getStatusLabel = (status: Ticket["status"]) => {
    switch (status) {
      case "valid":
        return "Active";
      case "used":
        return "Used";
      case "expired":
        return "Expired";
      case "transferred":
        return "Transferred";
      default:
        return status;
    }
  };

  const getStatusMessage = (status: Ticket["status"]) => {
    switch (status) {
      case "used":
        return "This ticket has been used for entry and is no longer valid.";
      case "expired":
        return "This ticket has expired and is no longer valid for entry.";
      case "transferred":
        return "This ticket has been transferred to another wallet and is no longer in your possession.";
      default:
        return `This ticket is ${status}.`;
    }
  };

  const isActive = ticket.status === "valid";

  const handleShowDetails = () => {
    if (onShowDetails) {
      onShowDetails(ticket.id);
    } else {
      navigate(`/tickets/${ticket.id}`);
    }
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        boxShadow="sm"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <Box
          bg="lummy.purple.500"
          color="white"
          py={1}
          px={4}
          borderBottomWidth="1px"
          borderBottomColor="lummy.purple.600"
        >
          <Flex justify="space-between" align="center">
            <HStack>
              <Icon as={FaTicketAlt} />
              <Text fontWeight="medium">{ticket.ticketType}</Text>
            </HStack>
            <Badge
              colorScheme={getStatusColor(ticket.status)}
              variant="solid"
              borderRadius="full"
              px={2}
            >
              {getStatusLabel(ticket.status)}
            </Badge>
          </Flex>
        </Box>

        <Box p={4} display="flex" flexDirection="column" flex="1">
          <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
            {ticket.eventName}
          </Text>

          <VStack mt={2} spacing={2} align="flex-start" color="gray.600">
            <HStack>
              <Icon as={FaCalendarAlt} size="sm" />
              <Text fontSize="sm" noOfLines={1} maxW="100%">
                {formatDate(ticket.eventDate)}
              </Text>
            </HStack>

            <HStack>
              <Icon as={FaMapMarkerAlt} size="sm" />
              <Text fontSize="sm" noOfLines={1} maxW="100%">
                {ticket.eventLocation}
              </Text>
            </HStack>
          </VStack>

          {/* Fixed height container for QR code or status message */}
          <Flex
            justify="center"
            my={4}
            flex="1"
            minHeight="150px"
            alignItems="center"
          >
            {isActive ? (
              <QRCode
                ticketId={ticket.id}
                eventId={ticket.eventId}
                size={150}
              />
            ) : (
              <Box
                p={4}
                bg="gray.100"
                borderRadius="md"
                textAlign="center"
                width="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Icon
                  as={FaInfoCircle}
                  color={`${getStatusColor(ticket.status)}.500`}
                  boxSize="24px"
                  mb={2}
                />
                <Text fontSize="sm" color="gray.600">
                  {getStatusMessage(ticket.status)}
                </Text>
              </Box>
            )}
          </Flex>

          {/* Footer actions with consistent positioning */}
          <Flex mt="auto" justify="space-between">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Icon as={FaInfoCircle} />}
              onClick={handleShowDetails}
            >
              Ticket Details
            </Button>

            {isActive ? (
              <HStack>
                <Button
                  size="sm"
                  colorScheme="purple"
                  variant="outline"
                  leftIcon={<Icon as={FaExchangeAlt} />}
                  onClick={onTransferOpen}
                >
                  Transfer
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  leftIcon={<Icon as={FaShoppingCart} />}
                  onClick={onResellOpen}
                >
                  Resell
                </Button>
              </HStack>
            ) : (
              <Button
                size="sm"
                colorScheme="gray"
                variant="ghost"
                isDisabled
                opacity="0"
                _hover={{ opacity: "0" }}
                cursor="default"
              ></Button>
            )}
          </Flex>
        </Box>
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

export default TicketCard;
