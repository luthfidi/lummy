import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  Image,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const gradientStart = "purple.500";
  const gradientEnd = "pink.400";

  return (
    <Box position="relative" overflow="hidden" bg="white">
      {/* Background shapes */}
      <Box
        position="absolute"
        top="-10%"
        right="-10%"
        zIndex={0}
        opacity={0.15}
        width="70%"
        height="70%"
        borderRadius="full"
        bg={`linear-gradient(45deg, ${gradientStart}, ${gradientEnd})`}
        filter="blur(60px)"
      />

      <Container maxW="container.xl" py={{ base: 12, md: 20 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 8, md: 12 }}
        >
          <Stack spacing={6} maxW={{ base: "100%", md: "50%" }} zIndex={1}>
            <Heading
              as="h1"
              size="3xl"
              fontWeight="bold"
              lineHeight="1.2"
              bgGradient={`linear(to-r, ${gradientStart}, ${gradientEnd})`}
              bgClip="text"
            >
              Discover Events, Secure with Blockchain
            </Heading>

            <Text fontSize="xl" color="gray.600">
              Lummy is a revolutionary NFT ticketing platform that ensures your
              tickets are authentic, secure, and easy to use or transfer.
            </Text>

            <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
              <Button
                colorScheme="purple"
                size="lg"
                height="56px"
                fontSize="lg"
                px={8}
                onClick={() => navigate("/events")}
              >
                Explore Events
              </Button>
              <Button
                variant="outline"
                colorScheme="purple"
                size="lg"
                height="56px"
                fontSize="lg"
                px={8}
                onClick={() => navigate("/marketplace")}
              >
                Browse Marketplace
              </Button>
            </Stack>

            <Text fontSize="sm" color="gray.500">
              Powered by Lisk blockchain technology • 100% secure and authentic
              tickets
            </Text>
          </Stack>

          <Box
            width={{ base: "100%", md: "45%" }}
            position="relative"
            zIndex={1}
          >
            <Box
              position="relative"
              height={{ base: "300px", md: "400px", lg: "500px" }}
              overflow="hidden"
              borderRadius="xl"
              boxShadow="2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Concert crowd with smartphone tickets"
                objectFit="cover"
                width="100%"
                height="100%"
              />

              {/* Ticket Mock Overlays */}
              <Box
                position="absolute"
                top="15%"
                left="10%"
                width="60%"
                height="auto"
                bg="white"
                p={4}
                borderRadius="md"
                boxShadow="xl"
                transform="rotate(-10deg)"
              >
                <Text fontWeight="bold">Summer Music Festival</Text>
                <Text fontSize="sm">VIP Pass • NFT Secured</Text>
                <Box
                  height="40px"
                  width="40px"
                  bg="gray.200"
                  mt={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  QR
                </Box>
              </Box>

              <Box
                position="absolute"
                bottom="15%"
                right="10%"
                width="70%"
                height="auto"
                bg="white"
                p={4}
                borderRadius="md"
                boxShadow="xl"
                transform="rotate(5deg)"
              >
                <Text fontWeight="bold">Tech Conference 2025</Text>
                <Text fontSize="sm">Premium Access • Blockchain Verified</Text>
                <Box
                  height="40px"
                  width="40px"
                  bg="gray.200"
                  mt={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  QR
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;
