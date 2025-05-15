import React from "react";
import { Box, Image, Text, Flex, Badge, VStack } from "@chakra-ui/react";
import { Event } from "../../../types/Event";
import { Card } from "./Card";

// Simple formatter for dates
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const { title, date, location, imageUrl, price, category, status, currency } =
    event;

  return (
    <Card
      onClick={onClick}
      cursor="pointer"
      overflow="hidden"
      p={0}
      h="100%"
      display="flex"
      flexDirection="column"
      borderRadius="md"
      boxShadow="sm"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "md",
        transition: "all 0.3s ease",
      }}
      borderWidth="1px"
      borderColor="gray.100"
    >
      <Box position="relative">
        <Image
          src={imageUrl}
          alt={title}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        {status === "soldout" && (
          <Badge
            position="absolute"
            top="10px"
            right="10px"
            colorScheme="red"
            variant="solid"
            fontSize="xs"
            textTransform="uppercase"
          >
            Sold Out
          </Badge>
        )}
      </Box>

      <VStack p={4} align="flex-start" spacing={2} flex="1">
        <Text color="gray.500" fontSize="sm">
          {formatDate(date)}
        </Text>

        <Text
          fontWeight="semibold"
          fontSize="md"
          noOfLines={1}
          lineHeight="tight"
        >
          {title}
        </Text>

        <Text fontSize="sm" color="gray.600" noOfLines={1}>
          {location}
        </Text>

        <Flex
          mt="auto"
          pt={3}
          width="100%"
          justify="space-between"
          align="center"
        >
          <Badge colorScheme="purple" variant="subtle">
            {category}
          </Badge>

          <Text fontWeight="bold" color="lummy.purple.600" fontSize="md">
            {currency} {price.toLocaleString()}
          </Text>
        </Flex>
      </VStack>
    </Card>
  );
};

export default EventCard;
