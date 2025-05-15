import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Avatar,
  Flex,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { FaQuoteLeft } from "react-icons/fa";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const testimonials: TestimonialProps[] = [
  {
    name: "Sarah Johnson",
    role: "Music Festival Attendee",
    content:
      "I love how easy it is to buy and transfer tickets on Lummy. When my friend couldn't make it to the festival, I was able to send her ticket to someone else in seconds without any complicated processes.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Michael Chen",
    role: "Tech Conference Organizer",
    content:
      "As an event organizer, Lummy has transformed how we handle tickets. No more counterfeits, easy check-ins, and the ability to set resale limits has virtually eliminated scalping at our conferences.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Aditya Pratama",
    role: "Blockchain Enthusiast",
    content:
      "The transparency of seeing each ticket's history on the blockchain gives me confidence. I bought a resale ticket and could verify it was legitimate and see exactly how much the original buyer paid.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Rini Hartati",
    role: "Regular Concert-goer",
    content:
      "I used to worry about fake tickets when buying from resellers. With Lummy, that concern is gone. Plus, the dynamic QR codes make me feel secure that no one else can use a screenshot of my ticket.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "Budi Santoso",
    role: "Festival Producer",
    content:
      "The analytics we get from Lummy help us understand our audience better. We can see real-time sales data, check-in patterns, and even track resales - all valuable insights for planning future events.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "Maya Indira",
    role: "First-time NFT User",
    content:
      "I was new to blockchain and NFTs, but Lummy made it incredibly simple. The wallet setup was straightforward, and I love being able to see all my past event tickets in my collection.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
  },
];

const Testimonial = ({ name, role, content, avatar }: TestimonialProps) => {
  const bgColor = "white";
  const borderColor = "gray.200";

  return (
    <Box
      boxShadow={"lg"}
      maxW={"440px"}
      width={"full"}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      position={"relative"}
    >
      <Icon
        as={FaQuoteLeft}
        color={"purple.200"}
        position="absolute"
        top={2}
        left={2}
        fontSize="xl"
      />
      <Stack mt={6} direction={"column"} spacing={4}>
        <Text color={"gray.700"} fontSize={"md"} fontStyle="italic">
          {content}
        </Text>
        <Flex align={"center"} mt={4}>
          <Avatar src={avatar} name={name} mr={4} />
          <Stack direction={"column"} spacing={0}>
            <Text fontWeight={600}>{name}</Text>
            <Text fontSize={"sm"} color={"gray.500"}>
              {role}
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </Box>
  );
};

const TestimonialSection: React.FC = () => {
  return (
    <Box bg={"purple.50"}>
      <Container maxW={"container.xl"} py={16}>
        <Stack spacing={8} align={"center"}>
          <Heading
            textAlign={"center"}
            as="h2"
            size="xl"
            fontWeight="bold"
            mb={2}
            bgGradient="linear(to-r, purple.500, pink.500)"
            bgClip="text"
          >
            What People Are Saying
          </Heading>
          <Text
            fontSize={"lg"}
            textAlign={"center"}
            maxW={"800px"}
            color={"gray.600"}
          >
            Hear from event-goers and organizers who are already enjoying the
            benefits of blockchain tickets.
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={10}
            width={"full"}
          >
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};

export default TestimonialSection;
