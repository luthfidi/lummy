import React, { useState, useEffect } from "react";
import { Box, HStack, Text, VStack, Flex } from "@chakra-ui/react";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
}) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (new Date(targetDate).getTime() <= new Date().getTime()) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      const calculated = calculateTimeLeft();
      setTimeLeft(calculated);
      
      // Check if countdown has reached zero
      if (calculated.days === 0 && calculated.hours === 0 && 
          calculated.minutes === 0 && calculated.seconds === 0) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  if (isExpired) {
    return (
      <Box textAlign="center" py={4} bg="red.50" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" color="red.600">
          This event has already started or ended
        </Text>
      </Box>
    );
  }

  return (
    <Flex 
      justify="center" 
      width="100%" 
      my={2}
    >
      <HStack spacing={{ base: 2, md: 4 }} justify="center" width="100%">
        {timeUnits.map((unit, index) => (
          <VStack 
            key={index} 
            spacing={0} 
            flex="1"
            maxW="100px"
          >
            <Box
              bg="purple.100"
              borderRadius="md"
              p={3}
              width="100%"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="purple.200"
              textAlign="center"
            >
              <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }} color="purple.700">
                {unit.value.toString().padStart(2, "0")}
              </Text>
            </Box>
            <Text fontSize={{ base: "xs", md: "sm" }} color="purple.600" mt={1} fontWeight="medium">
              {unit.label}
            </Text>
          </VStack>
        ))}
      </HStack>
    </Flex>
  );
};

export default CountdownTimer;