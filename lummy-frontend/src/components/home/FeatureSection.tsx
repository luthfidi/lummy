import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  Flex,
  Heading,
} from "@chakra-ui/react";
import {
  FaShieldAlt,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaQrcode,
  FaTicketAlt,
  FaUserShield,
} from "react-icons/fa";

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"purple.500"}
        mb={4}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize="lg">
        {title}
      </Text>
      <Text color={"gray.600"}>{text}</Text>
    </Stack>
  );
};

const FeatureSection: React.FC = () => {
  return (
    <Box bg={"gray.50"}>
      <Container maxW={"container.xl"} py={16}>
        <Stack spacing={12}>
          <Box textAlign={"center"}>
            <Heading
              as="h2"
              size="xl"
              fontWeight="bold"
              mb={4}
              bgGradient="linear(to-r, purple.500, pink.500)"
              bgClip="text"
            >
              Blockchain-Powered Ticketing
            </Heading>
            <Text fontSize="lg" color={"gray.600"} maxW="800px" mx="auto">
              Lummy revolutionizes how event tickets work with powerful
              blockchain technology providing benefits for both attendees and
              organizers.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={FaShieldAlt} w={10} h={10} />}
              title={"Secure & Authentic"}
              text={
                "Each ticket is a unique NFT on the Lisk blockchain, making it impossible to counterfeit or duplicate. Your tickets are 100% authentic, every time."
              }
            />
            <Feature
              icon={<Icon as={FaExchangeAlt} w={10} h={10} />}
              title={"Easy Transfers"}
              text={
                "Transfer your tickets to friends or family with just a few clicks. No more screenshot sharing or complicated handovers - just secure blockchain transfers."
              }
            />
            <Feature
              icon={<Icon as={FaMoneyBillWave} w={10} h={10} />}
              title={"Fair Reselling"}
              text={
                "Can't make it to an event? Resell your ticket on our marketplace with price limits set by organizers to prevent scalping and ensure fair prices."
              }
            />
            <Feature
              icon={<Icon as={FaQrcode} w={10} h={10} />}
              title={"Dynamic QR Codes"}
              text={
                "Your NFT ticket displays a secure QR code that changes periodically to prevent screenshot fraud, ensuring only the rightful owner can use the ticket."
              }
            />
            <Feature
              icon={<Icon as={FaTicketAlt} w={10} h={10} />}
              title={"Transparent History"}
              text={
                "Every ticket has a complete, transparent history tracked on the blockchain. See who owned it before, when it was transferred, and verify its authenticity."
              }
            />
            <Feature
              icon={<Icon as={FaUserShield} w={10} h={10} />}
              title={"Privacy Protected"}
              text={
                "Your personal information remains private while still allowing secure verification. Blockchain technology ensures your data is protected."
              }
            />
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};

export default FeatureSection;
