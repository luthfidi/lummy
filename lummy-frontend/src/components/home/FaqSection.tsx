import React from "react";
import {
  Box,
  Container,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Flex,
  Button,
  VStack,
} from "@chakra-ui/react";

const faqData = [
  {
    question: "What is an NFT ticket?",
    answer:
      "An NFT (Non-Fungible Token) ticket is a digital ticket that uses blockchain technology to ensure authenticity and ownership. Each ticket is unique, can't be duplicated, and offers secure transfer between users while maintaining a transparent history of ownership.",
  },
  {
    question: "How do I purchase tickets on Lummy?",
    answer:
      "To purchase tickets, you'll need to connect your Xellar Wallet, which stores your IDRX stablecoin and will hold your ticket NFTs. Once connected, simply browse events, select your preferred ticket tier, and complete the purchase. Your tickets will be minted directly to your wallet.",
  },
  {
    question: "Can I transfer my tickets to someone else?",
    answer:
      "Yes! One of the main benefits of NFT tickets is easy transferability. Navigate to your ticket in the 'My Tickets' section, choose the transfer option, and enter the recipient's wallet address. The ticket will be securely transferred to them on the blockchain.",
  },
  {
    question: "What if I can't attend an event after purchasing tickets?",
    answer:
      "If you can't attend, you have two options: transfer the ticket to someone else, or resell it on our marketplace. Organizers set price limits to prevent scalping, ensuring tickets are resold at fair prices. You'll receive the payment directly to your wallet when someone purchases your ticket.",
  },
  {
    question: "How do I get IDRX for purchasing tickets?",
    answer:
      "IDRX is a stablecoin pegged to the Indonesian Rupiah. You can purchase IDRX directly through your Xellar Wallet using various payment methods. The wallet setup process guides you through this when you first connect.",
  },
  {
    question: "How do I show my ticket at the event?",
    answer:
      "Your NFT ticket displays a QR code in the Lummy app that changes periodically for security. When you arrive at the event, venue staff will scan this QR code for entry. The dynamic nature prevents screenshots from being used by multiple people.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. While the blockchain records ticket transfers and ownership for verification purposes, your personal information remains private. Lummy implements decentralized identity solutions to verify eligibility without exposing your data.",
  },
  {
    question: "What if I lose access to my wallet?",
    answer:
      "Xellar Wallet provides recovery methods if you lose access. This is why it's crucial to save your backup phrases securely when setting up your wallet. Contact Xellar support for assistance with wallet recovery.",
  },
];

const FaqSection: React.FC = () => {
  const bgColor = "white";

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="start"
          justify="space-between"
          gap={10}
        >
          <VStack
            align="flex-start"
            spacing={6}
            flex="1"
            maxW={{ lg: "400px" }}
          >
            <Heading
              as="h2"
              size="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, purple.500, pink.500)"
              bgClip="text"
            >
              Frequently Asked Questions
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Got questions about Lummy, NFT tickets, or how our platform works?
              Find answers to common questions here.
            </Text>
            <Button colorScheme="purple" size="lg" mt={4}>
              Contact Support
            </Button>
          </VStack>

          <Box flex="1.5">
            <Accordion allowMultiple>
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  borderWidth="1px"
                  my={2}
                  borderRadius="md"
                >
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {faq.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text color="gray.600">{faq.answer}</Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default FaqSection;
