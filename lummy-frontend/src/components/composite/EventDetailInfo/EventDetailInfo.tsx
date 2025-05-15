import React from "react";
import { VStack, HStack, Text, Badge, Icon } from "@chakra-ui/react";
import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import { FaMapMarkerAlt } from "react-icons/fa";

interface EventDetailInfoProps {
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address?: string;
  status: string;
  category: string;
}

export const EventDetailInfo: React.FC<EventDetailInfoProps> = ({
  date,
  time,
  endTime,
  location,
  address,
  status,
  category,
}) => {
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

  // Status color mapping
  const statusColorMap: Record<string, string> = {
    available: "green",
    limited: "orange",
    soldout: "red",
  };

  return (
    <VStack
      align="stretch"
      spacing={4}
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="sm"
    >
      <HStack>
        <Badge
          colorScheme={statusColorMap[status.toLowerCase()] || "gray"}
          fontSize="sm"
          px={2}
          py={1}
        >
          {status}
        </Badge>
        <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
          {category}
        </Badge>
      </HStack>

      <HStack spacing={4} align="center">
        <Icon as={CalendarIcon} color="purple.500" boxSize={5} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="medium">Date</Text>
          <Text color="gray.600">{formatDate(date)}</Text>
        </VStack>
      </HStack>

      <HStack spacing={4} align="center">
        <Icon as={TimeIcon} color="purple.500" boxSize={5} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="medium">Time</Text>
          <Text color="gray.600">
            {time} {endTime ? `- ${endTime}` : ""}
          </Text>
        </VStack>
      </HStack>

      <HStack spacing={4} align="center">
        <Icon as={FaMapMarkerAlt} color="purple.500" boxSize={5} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="medium">Location</Text>
          <Text color="gray.600">{location}</Text>
          {address && (
            <Text fontSize="sm" color="gray.500">
              {address}
            </Text>
          )}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default EventDetailInfo;
