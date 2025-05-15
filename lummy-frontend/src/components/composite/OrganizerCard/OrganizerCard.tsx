import React from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  HStack,
  Button,
  VStack,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Organizer } from "../../../types/Event";

interface OrganizerCardProps {
  organizer: Organizer;
  onViewMoreEvents?: () => void;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({
  organizer,
  onViewMoreEvents,
}) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      bg="white"
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <Avatar
              src={organizer.imageUrl || ""}
              name={organizer.name}
              size="md"
              bg="purple.500"
            />
            <Box>
              <HStack>
                <Text fontWeight="bold" fontSize="md">
                  {organizer.name}
                </Text>
                {organizer.verified && (
                  <Badge colorScheme="green" variant="subtle">
                    <HStack spacing={1}>
                      <CheckCircleIcon />
                      <Text fontSize="xs">Verified</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>
              {organizer.eventsHosted && (
                <Text fontSize="sm" color="gray.500">
                  {organizer.eventsHosted} events hosted
                </Text>
              )}
            </Box>
          </HStack>
        </Flex>

        {organizer.description && (
          <Text fontSize="sm" color="gray.600" mt={2}>
            {organizer.description}
          </Text>
        )}

        {organizer.website && (
          <Button
            as="a"
            href={organizer.website}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            variant="outline"
            colorScheme="purple"
            mt={2}
          >
            Visit Website
          </Button>
        )}

        {onViewMoreEvents && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="purple"
            onClick={onViewMoreEvents}
            mt={1}
          >
            View More Events by this Organizer
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default OrganizerCard;
