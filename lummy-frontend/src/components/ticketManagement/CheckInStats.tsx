import React from "react";
import {
  Box,
  Flex,
  Text,
  Progress,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import { FaUsers, FaUserCheck, FaPercentage, FaClock } from "react-icons/fa";

interface CheckInStatsProps {
  eventId?: string;
  stats: {
    totalAttendees: number;
    checkedIn: number;
    checkInRate: number;
    peakCheckInTime: string;
    recentActivity: number;
    tierStats: Array<{
      name: string;
      total: number;
      checkedIn: number;
    }>;
  };
}

// StatCard component for displaying stat metrics
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  helpText?: string;
  isPercentage?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
  helpText,
  isPercentage = false,
}) => {
  const cardBg = "white";

  return (
    <Box
      px={3}
      pt={3}
      pb={1}
      bg={cardBg}
      borderRadius="lg"
      border="2px solid"
      borderColor="gray.200"
    >
      <Stat>
        <Flex justify="space-between" align="center">
          <StatLabel fontWeight="medium" color="gray.600">
            {label}
          </StatLabel>
          <Icon as={icon} color={`${color}.500`} boxSize={6} />
        </Flex>
        <StatNumber fontSize="2xl" fontWeight="bold" mt={2}>
          {isPercentage ? `${value}%` : value}
        </StatNumber>
        {helpText && (
          <StatHelpText>
            <StatArrow type="increase" />
            {helpText}
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

const CheckInStats: React.FC<CheckInStatsProps> = ({ stats }) => {
  const cardBg = "white";
  const progressTrackBg = "gray.100";

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <StatCard
          label="Total Attendees"
          value={stats.totalAttendees}
          icon={FaUsers}
          color="blue"
        />
        <StatCard
          label="Checked In"
          value={stats.checkedIn}
          icon={FaUserCheck}
          color="green"
          helpText={`${stats.recentActivity} in the last hour`}
        />
        <StatCard
          label="Check-in Rate"
          value={stats.checkInRate}
          icon={FaPercentage}
          color="purple"
          isPercentage={true}
        />
        <StatCard
          label="Peak Time"
          value={stats.peakCheckInTime}
          icon={FaClock}
          color="orange"
        />
      </SimpleGrid>

      <Box
        bg={cardBg}
        p={5}
        borderRadius="lg"
        border="2px solid"
        borderColor="gray.200"
        mb={8}
      >
        <Text fontWeight="medium" fontSize="lg" mb={4}>
          Check-in Progress
        </Text>

        <VStack spacing={6} align="stretch">
          {stats.tierStats.map((tier, index) => {
            const percentage =
              tier.total > 0
                ? Math.round((tier.checkedIn / tier.total) * 100)
                : 0;

            return (
              <Box key={index}>
                <Flex justify="space-between" mb={2}>
                  <Text fontWeight="medium">{tier.name}</Text>
                  <HStack>
                    <Text>
                      {tier.checkedIn} / {tier.total}
                    </Text>
                    <Text
                      fontWeight="bold"
                      color={
                        percentage > 80
                          ? "green.500"
                          : percentage > 50
                          ? "blue.500"
                          : "gray.500"
                      }
                    >
                      {percentage}%
                    </Text>
                  </HStack>
                </Flex>
                <Progress
                  value={percentage}
                  size="md"
                  colorScheme={
                    percentage > 80
                      ? "green"
                      : percentage > 50
                      ? "blue"
                      : "gray"
                  }
                  bg={progressTrackBg}
                  borderRadius="full"
                />
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};

export default CheckInStats;
