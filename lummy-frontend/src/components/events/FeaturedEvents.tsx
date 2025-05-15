import React from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { EventCard } from "../core/Card";
import { Event } from "../../types/Event";

interface FeaturedEventsProps {
  events: Event[];
  onEventClick: (eventId: string) => void;
  onViewAllClick: () => void;
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  events,
  onEventClick,
  onViewAllClick,
}) => {
  // Take only the first 4 events for featured section
  const featuredEvents = events.slice(0, 4);

  const bgGradient = useColorModeValue(
    "linear(to-r, purple.50, pink.50)",
    "linear(to-r, purple.900, pink.900)"
  );

  return (
    <Box py={8} px={6} borderRadius="lg" bgGradient={bgGradient}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Featured Events</Heading>
        <Button
          rightIcon={<ChevronRightIcon />}
          variant="link"
          colorScheme="purple"
          onClick={onViewAllClick}
        >
          View all events
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {featuredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => onEventClick(event.id)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default FeaturedEvents;
