import React from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Divider,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaShoppingCart,
  FaUserAlt,
  FaTags,
} from "react-icons/fa";
import { BuyResaleTicket } from "./BuyResaleTicket";
import { PriceComparison } from "./PriceComparison";
import { mockEvents } from "../../data/mockEvents";

export interface ResaleTicket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketType: string;
  originalPrice: number;
  resalePrice: number;
  currency: string;
  listedDate: string;
  sellerAddress: string;
  sellerRating?: number;
  tokenId: string;
  originalOwner?: string;
  transferCount?: number;
  imageUrl?: string;
}

interface ResaleTicketCardProps {
  ticket: ResaleTicket;
  onShowDetails?: (ticketId: string) => void;
}

export const ResaleTicketCard: React.FC<ResaleTicketCardProps> = ({
  ticket,
  onShowDetails,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get the image URL from the mockEvents data
  const getEventImageUrl = (eventId: string): string => {
    const event = mockEvents.find((e) => e.id === eventId);
    return event?.imageUrl || "https://via.placeholder.com/120";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShowDetails = () => {
    if (onShowDetails) {
      onShowDetails(ticket.id);
    }
  };

  // Use the image from mockEvents based on eventId or use the ticket's imageUrl if available
  const imageUrl = ticket.imageUrl || getEventImageUrl(ticket.eventId);

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
        cursor="default"
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
              <Icon as={FaTags} />
              <Text fontWeight="medium">Resale</Text>
            </HStack>
          </Flex>
        </Box>

        <Box p={4} display="flex" flexDirection="column" flex="1">
          <Flex justify="space-between" alignItems="flex-start" mb={1}>
            <Box flex="1" mr={2}>
              <Text fontSize="lg" fontWeight="bold" noOfLines={1} mb={1}>
                {ticket.eventName}
              </Text>

              <VStack mt={2} spacing={2} align="flex-start" color="gray.600">
                <HStack>
                  <Icon as={FaCalendarAlt} boxSize={3.5} />
                  <Text fontSize="sm" noOfLines={1}>
                    {formatDate(ticket.eventDate)}
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FaMapMarkerAlt} boxSize={3.5} />
                  <Text fontSize="sm" noOfLines={1}>
                    {ticket.eventLocation}
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FaTicketAlt} color="blue.500" boxSize={3.5} />
                  <Text fontSize="sm" fontWeight="medium">
                    {ticket.ticketType}
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <Box width="110px" height="110px" flexShrink={0}>
              <Image
                src={imageUrl}
                alt={`${ticket.eventName}`}
                borderRadius="md"
                objectFit="cover"
                width="150%"
                height="100%"
              />
            </Box>
          </Flex>

          <Divider my={3} />

          <PriceComparison
            originalPrice={ticket.originalPrice}
            resalePrice={ticket.resalePrice}
            currency={ticket.currency}
          />

          <HStack mt={2} spacing={2} fontSize="xs" color="gray.500">
            <Icon as={FaUserAlt} boxSize={3} />
            <Text>
              Seller: {ticket.sellerAddress.substring(0, 6)}...
              {ticket.sellerAddress.substring(ticket.sellerAddress.length - 4)}
            </Text>
          </HStack>

          <Flex mt="auto" pt={4} justify="space-between">
            <Button size="sm" variant="outline" onClick={handleShowDetails}>
              View Details
            </Button>

            <Button
              size="sm"
              colorScheme="blue"
              leftIcon={<Icon as={FaShoppingCart} />}
              onClick={onOpen}
            >
              Buy Now
            </Button>
          </Flex>
        </Box>
      </Box>

      <BuyResaleTicket isOpen={isOpen} onClose={onClose} ticket={ticket} />
    </>
  );
};

export default ResaleTicketCard;
