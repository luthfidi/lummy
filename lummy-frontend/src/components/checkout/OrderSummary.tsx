import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
} from "@chakra-ui/react";
import { Event, TicketTier } from "../../types/Event";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface OrderSummaryProps {
  event: Event;
  tier: TicketTier;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

// Format date for display
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  event,
  tier,
  quantity,
  onQuantityChange,
}) => {
  const handleQuantityChange = (
    _valueAsString: string,
    valueAsNumber: number
  ) => {
    onQuantityChange(valueAsNumber);
  };

  const subtotal = tier.price * quantity;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
    >
      {/* Event info with image */}
      <Flex p={4} borderBottomWidth="1px" borderColor="gray.100">
        <Box
          width="120px"
          height="90px"
          overflow="hidden"
          borderRadius="md"
          mr={4}
          flexShrink={0}
        >
          <Image
            src={event.imageUrl}
            alt={event.title}
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </Box>

        <VStack align="start" spacing={1} flex="1">
          <Text fontWeight="bold" fontSize="md">
            {event.title}
          </Text>
          <HStack fontSize="sm" color="gray.600">
            <FaCalendarAlt />
            <Text>{formatDate(event.date)}</Text>
          </HStack>
          <HStack fontSize="sm" color="gray.600">
            <FaMapMarkerAlt />
            <Text>{event.location}</Text>
          </HStack>
        </VStack>
      </Flex>

      {/* Ticket details */}
      <VStack spacing={4} p={4} align="stretch">
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontWeight="medium">{tier.name}</Text>
            <Text fontSize="sm" color="gray.600">
              {tier.description}
            </Text>
          </VStack>
          <Text fontWeight="medium">
            {tier.currency} {tier.price.toLocaleString()}
          </Text>
        </Flex>

        <HStack justify="space-between" align="center">
          <Text>Quantity</Text>
          <NumberInput
            size="sm"
            maxW={28}
            min={1}
            max={Math.min(tier.maxPerPurchase, tier.available)}
            value={quantity}
            onChange={handleQuantityChange}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>

        <Divider />

        <HStack justify="space-between">
          <Text>Subtotal</Text>
          <Text fontWeight="medium">
            {tier.currency} {subtotal.toLocaleString()}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text>Blockchain fee</Text>
          <Text fontSize="sm" color="gray.600">
            Free
          </Text>
        </HStack>

        <Divider />

        <HStack justify="space-between">
          <Text fontWeight="bold">Total</Text>
          <Text fontWeight="bold" fontSize="lg" color="lummy.purple.600">
            {tier.currency} {subtotal.toLocaleString()}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default OrderSummary;
