import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Progress,
  HStack,
  VStack,
  Badge,
  Divider,
} from "@chakra-ui/react";

export interface EventStatsData {
  eventId: string;
  eventName: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  currency: string;
  tierStats: Array<{
    tierName: string;
    sold: number;
    total: number;
    price: number;
  }>;
  daysUntilEvent: number;
}

interface EventStatsProps {
  stats: EventStatsData;
}

const EventStats: React.FC<EventStatsProps> = ({ stats }) => {
  const cardBg = "white";
  const progressTrackBg = "gray.100";

  const calculatePercentage = (sold: number, total: number): number => {
    return total > 0 ? (sold / total) * 100 : 0;
  };

  const totalSoldPercentage = calculatePercentage(
    stats.ticketsSold,
    stats.totalTickets
  );

  return (
    <Box bg={cardBg} borderRadius="md" p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">{stats.eventName}</Heading>
        <Badge
          colorScheme={
            stats.daysUntilEvent > 30
              ? "green"
              : stats.daysUntilEvent > 7
              ? "orange"
              : "red"
          }
        >
          {stats.daysUntilEvent} days to go
        </Badge>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
        <VStack align="start">
          <Text fontSize="sm" color="gray.500">
            Tickets Sold
          </Text>
          <Text fontWeight="bold" fontSize="xl">
            {stats.ticketsSold} / {stats.totalTickets}
          </Text>
          <Progress
            value={totalSoldPercentage}
            size="sm"
            width="100%"
            colorScheme={
              totalSoldPercentage < 50
                ? "red"
                : totalSoldPercentage < 80
                ? "orange"
                : "green"
            }
            bg={progressTrackBg}
            borderRadius="full"
          />
          <Text fontSize="xs" color="gray.500">
            {totalSoldPercentage.toFixed(1)}% sold
          </Text>
        </VStack>

        <VStack align="start">
          <Text fontSize="sm" color="gray.500">
            Revenue
          </Text>
          <Text fontWeight="bold" fontSize="xl">
            {stats.currency} {stats.revenue.toLocaleString()}
          </Text>
          <Text fontSize="xs" color="gray.500">
            Total sales
          </Text>
        </VStack>

        <VStack align="start">
          <Text fontSize="sm" color="gray.500">
            Average Price
          </Text>
          <Text fontWeight="bold" fontSize="xl">
            {stats.currency}{" "}
            {stats.ticketsSold > 0
              ? (stats.revenue / stats.ticketsSold).toFixed(2)
              : 0}
          </Text>
          <Text fontSize="xs" color="gray.500">
            Per ticket
          </Text>
        </VStack>
      </SimpleGrid>

      <Divider my={4} />

      <Heading size="sm" mb={3}>
        Ticket Tier Performance
      </Heading>
      <VStack spacing={4} align="stretch">
        {stats.tierStats.map((tier, index) => {
          const percentage = calculatePercentage(tier.sold, tier.total);

          return (
            <Box key={index}>
              <Flex justify="space-between" mb={1}>
                <Text fontWeight="medium">{tier.tierName}</Text>
                <HStack>
                  <Text fontSize="sm">
                    {tier.sold} / {tier.total}
                  </Text>
                  <Badge
                    colorScheme={
                      percentage < 50
                        ? "red"
                        : percentage < 80
                        ? "orange"
                        : "green"
                    }
                  >
                    {percentage.toFixed(0)}%
                  </Badge>
                </HStack>
              </Flex>
              <Progress
                value={percentage}
                size="sm"
                colorScheme={
                  percentage < 50 ? "red" : percentage < 80 ? "orange" : "green"
                }
                bg={progressTrackBg}
                borderRadius="full"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {stats.currency} {tier.price} per ticket
              </Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default EventStats;
