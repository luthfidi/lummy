// src/pages/EventDetail/EventDetailPage.tsx
import React, { useState, useEffect, useRef, JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useToast,
  Flex,
  Badge,
  Avatar,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Divider,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  SimpleGrid,
  Skeleton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaInfoCircle,
  FaTicketAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { mockEvents } from "../../data/mockEvents";
import { Event, TicketTier } from "../../types/Event";
import { CountdownTimer } from "../../components/core/CountdownTimer";
import { TicketTierCard } from "../../components/composite/TicketTierCard";
import { useSmartContract } from "../../hooks/useSmartContract"; // Import hook smart contract

// Helper function to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Function to format bullet points in description text
const formatDescription = (text: string): JSX.Element => {
  if (!text) return <></>;

  // Split text into paragraphs
  const paragraphs = text.split("\n\n");

  return (
    <>
      {paragraphs.map((paragraph, pIndex) => {
        // Check if paragraph contains bullet points
        if (paragraph.includes("- ")) {
          const lines = paragraph.split("\n");
          const title = lines[0].endsWith(":") ? lines[0] : null;
          const bulletPoints = lines.filter((line) =>
            line.trim().startsWith("- ")
          );

          return (
            <Box key={`p-${pIndex}`} mb={4}>
              {title && (
                <Text fontWeight="medium" mb={2}>
                  {title}
                </Text>
              )}
              <List spacing={2}>
                {bulletPoints.map((point, bIndex) => (
                  <ListItem key={`bullet-${pIndex}-${bIndex}`} display="flex">
                    <ListIcon as={CheckIcon} color="green.500" mt={1} />
                    <Text>{point.replace("- ", "")}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          );
        }

        // Regular paragraph
        return (
          <Text key={`p-${pIndex}`} mb={4}>
            {paragraph}
          </Text>
        );
      })}
    </>
  );
};

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const ticketSectionRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null!);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTier, setSelectedTier] = useState<{
    id: string;
    quantity: number;
  } | null>(null);
  const [_showStickyButton, setShowStickyButton] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Import smart contract hooks
  const {
    getEventDetails,
    getTicketTiers,
    loading: contractLoading,
    error: contractError,
  } = useSmartContract();

  // State for tier change confirmation dialog
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTierSelection, setNewTierSelection] = useState<{
    id: string;
    quantity: number;
    name: string;
  } | null>(null);
  const [currentTierName, setCurrentTierName] = useState<string>("");
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([]);

  // Fetch event details from blockchain
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;

      setLoading(true);
      setErrorMsg(null);

      try {
        // Check if id is a blockchain address
        if (id.startsWith("0x") && id.length === 42) {
          // Get event details from blockchain
          const details = await getEventDetails(id);

          if (details) {
            // Convert blockchain data to Event
            const blockchainEvent: Event = {
              id,
              title: details.name,
              description: details.description,
              longDescription: details.description, // Use same description for now
              date: new Date(Number(details.date) * 1000).toISOString(),
              time: new Date(Number(details.date) * 1000).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
              location: details.venue,
              venue: details.venue,
              imageUrl:
                "https://images.unsplash.com/photo-1459865264687-595d652de67e", // Default image
              bannerUrl:
                "https://images.unsplash.com/photo-1459865264687-595d652de67e", // Default banner
              price: 0, // Will be updated from ticket tiers
              currency: "IDRX",
              category: "Event", // Default category
              status: "available",
              organizer: {
                id: details.organizer,
                name: "Event Organizer",
                verified: true,
                description: "Organizer of this event",
              },
              ticketsAvailable: 0, // Will be updated from ticket tiers
              ticketTiers: [], // Will be fetched separately
            };

            // Fetch ticket tiers
            const tiers = await getTicketTiers(id);

            if (tiers && tiers.length > 0) {
              // Convert blockchain ticket tiers to frontend format
              const formattedTiers: TicketTier[] = tiers.map((tier, index) => ({
                id: index.toString(),
                name: tier.name,
                price: Number(tier.price),
                currency: "IDRX",
                description: tier.name, // No description in contract, use name
                available: Number(tier.available) - Number(tier.sold),
                maxPerPurchase: Number(tier.maxPerPurchase),
                benefits: [], // No benefits in contract data
              }));

              // Update event with tiers and lowest price
              blockchainEvent.ticketTiers = formattedTiers;
              setTicketTiers(formattedTiers);

              // Update event price to lowest tier price
              if (formattedTiers.length > 0) {
                const lowestPrice = Math.min(
                  ...formattedTiers.map((t) => t.price)
                );
                blockchainEvent.price = lowestPrice;

                // Update total available tickets
                blockchainEvent.ticketsAvailable = formattedTiers.reduce(
                  (total, tier) => total + tier.available,
                  0
                );
              }
            }

            setEvent(blockchainEvent);
          } else {
            throw new Error("Event not found on blockchain");
          }
        } else {
          // Fallback to mock events for non-blockchain IDs
          const mockEvent = mockEvents.find((e) => e.id === id);
          setEvent(mockEvent || null);

          if (mockEvent?.ticketTiers) {
            setTicketTiers(mockEvent.ticketTiers);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setErrorMsg(
          contractError ||
            "Failed to load event from blockchain. Using sample data if available."
        );

        // Fallback to mock events
        const mockEvent = mockEvents.find((e) => e.id === id);
        setEvent(mockEvent || null);

        if (mockEvent?.ticketTiers) {
          setTicketTiers(mockEvent.ticketTiers);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, getEventDetails, getTicketTiers, contractError]);

  // Add scroll listener for sticky button
  useEffect(() => {
    const handleScroll = () => {
      if (ticketSectionRef.current) {
        const ticketSectionTop =
          ticketSectionRef.current.getBoundingClientRect().top;
        const ticketSectionBottom =
          ticketSectionRef.current.getBoundingClientRect().bottom;

        // Show sticky button when ticket section is not fully visible and there's a selected tier
        setShowStickyButton(
          (ticketSectionTop < 0 || ticketSectionBottom < 0) &&
            selectedTier !== null
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedTier]);

  const handleTierSelect = (
    tierId: string,
    quantity: number,
    tierName: string
  ) => {
    // If no tier selected yet, just select this one
    if (!selectedTier) {
      setSelectedTier({ id: tierId, quantity });
      return;
    }

    // If same tier, update quantity
    if (selectedTier.id === tierId) {
      setSelectedTier({ ...selectedTier, quantity });
      return;
    }

    // If different tier, show confirmation dialog
    setCurrentTierName(
      ticketTiers?.find((t) => t.id === selectedTier.id)?.name || ""
    );
    setNewTierSelection({ id: tierId, quantity, name: tierName });
    onOpen();
  };

  const handleTierChange = () => {
    if (newTierSelection) {
      setSelectedTier({
        id: newTierSelection.id,
        quantity: newTierSelection.quantity,
      });
      setNewTierSelection(null);
      onClose();
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedTier) {
      navigate(`/checkout/${event?.id}`, {
        state: {
          tierId: selectedTier.id,
          quantity: selectedTier.quantity,
        },
      });
    } else {
      toast({
        title: "Please select a ticket tier",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const scrollToTickets = () => {
    ticketSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const calculateTotalPrice = () => {
    if (!selectedTier || !ticketTiers) return 0;

    const tier = ticketTiers.find((t) => t.id === selectedTier.id);
    if (!tier) return 0;

    return tier.price * selectedTier.quantity;
  };

  if (loading || contractLoading) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4}>
          <Skeleton height="400px" width="100%" />
          <Skeleton height="40px" width="60%" />
          <Skeleton height="20px" width="40%" />
          <Skeleton height="300px" width="100%" />
        </VStack>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={4}>
          <Heading>Event Not Found</Heading>
          <Text>
            Sorry, the event you're looking for doesn't exist or has been
            removed.
          </Text>
          <Button colorScheme="purple" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </VStack>
      </Container>
    );
  }

  const selectedTicketTier = ticketTiers?.find(
    (tier) => tier.id === selectedTier?.id
  );

  return (
    <Box>
      {/* Display error message if any */}
      {errorMsg && (
        <Container maxW="container.xl" mt={4}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            {errorMsg}
          </Alert>
        </Container>
      )}

      {/* Hero Section with Event Banner */}
      <Box position="relative" height="400px" overflow="hidden">
        <Image
          src={event.bannerUrl || event.imageUrl}
          alt={event.title}
          width="100%"
          height="100%"
          objectFit="cover"
          filter="brightness(0.8)"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)"
          p={8}
          color="white"
        >
          <Container maxW="container.xl">
            <HStack spacing={3} mb={2}>
              <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
                {event.category}
              </Badge>
              <Badge
                colorScheme={
                  event.status === "available"
                    ? "green"
                    : event.status === "limited"
                    ? "orange"
                    : "red"
                }
                fontSize="sm"
                px={2}
                py={1}
              >
                {event.status.toUpperCase()}
              </Badge>
            </HStack>
            <Heading size="xl">{event.title}</Heading>
            <HStack mt={2} spacing={6}>
              <HStack>
                <Icon as={FaCalendarAlt} color="purple.300" />
                <Text>{formatDate(event.date)}</Text>
              </HStack>
              <HStack>
                <Icon as={FaMapMarkerAlt} color="purple.300" />
                <Text>{event.venue || event.location}</Text>
              </HStack>
            </HStack>
          </Container>
        </Box>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Main Content Section */}
        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Left Column - Event Info */}
          <Box w={{ base: "100%", lg: "70%" }}>
            {/* Countdown Timer */}
            <Box
              mb={8}
              bg="purple.50"
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="purple.100"
            >
              <HStack justify="space-between" mb={4}>
                <Heading size="md" color="purple.700">
                  Event starts in
                </Heading>
                <HStack>
                  <Icon as={FaClock} color="purple.500" />
                  <Text color="purple.700" fontWeight="medium">
                    {event.time} {event.endTime ? `- ${event.endTime}` : ""}
                  </Text>
                </HStack>
              </HStack>
              <CountdownTimer targetDate={event.date} />
            </Box>

            {/* Event Description */}
            <Box mb={8}>
              <Heading
                size="md"
                mb={4}
                pb={2}
                borderBottomWidth="1px"
                borderColor="gray.200"
              >
                About This Event
              </Heading>
              <Box fontSize="lg" lineHeight="tall">
                {formatDescription(event.longDescription || event.description)}
              </Box>
            </Box>

            {/* Event Information Section */}
            <Box mb={10}>
              <Heading
                size="md"
                mb={6}
                pb={2}
                borderBottomWidth="1px"
                borderColor="gray.200"
              >
                Event Information
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {/* Duration */}
                <HStack spacing={4} align="start">
                  <Box
                    p={2}
                    bg="lummy.purple.50"
                    borderRadius="full"
                    color="lummy.purple.500"
                  >
                    <Icon as={FaClock} boxSize={5} />
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>
                      Duration
                    </Text>
                    <Text color="gray.600">
                      {event.time} {event.endTime ? `- ${event.endTime}` : ""}
                    </Text>
                  </Box>
                </HStack>

                {/* Audience */}
                <HStack spacing={4} align="start">
                  <Box
                    p={2}
                    bg="lummy.blue.50"
                    borderRadius="full"
                    color="lummy.blue.500"
                  >
                    <Icon as={FaUsers} boxSize={5} />
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>
                      Audience
                    </Text>
                    <Text color="gray.600">Suitable for all ages</Text>
                  </Box>
                </HStack>

                {/* Special Notes */}
                <HStack spacing={4} align="start">
                  <Box
                    p={2}
                    bg="lummy.pink.50"
                    borderRadius="full"
                    color="lummy.pink.500"
                  >
                    <Icon as={FaInfoCircle} boxSize={5} />
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>
                      Important Info
                    </Text>
                    <Text color="gray.600">Digital ticket via blockchain.</Text>
                  </Box>
                </HStack>
              </SimpleGrid>
            </Box>

            {/* Ticket Selection - Single Column Layout */}
            <Box my={10} ref={ticketSectionRef} id="tickets-section">
              <Heading
                size="md"
                mb={6}
                pb={2}
                borderBottomWidth="1px"
                borderColor="gray.200"
              >
                Select Tickets
              </Heading>

              {ticketTiers && ticketTiers.length > 0 ? (
                <VStack spacing={6} align="stretch">
                  {ticketTiers.map((tier) => (
                    <TicketTierCard
                      key={tier.id}
                      tier={tier}
                      onSelect={(tierId, quantity) =>
                        handleTierSelect(tierId, quantity, tier.name)
                      }
                      isSelected={selectedTier?.id === tier.id}
                      selectedQuantity={
                        selectedTier?.id === tier.id ? selectedTier.quantity : 0
                      }
                      onCheckout={handleProceedToCheckout}
                    />
                  ))}
                </VStack>
              ) : (
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text>No ticket tiers available for this event.</Text>
                </Box>
              )}
            </Box>

            {/* Terms & Conditions Accordion */}
            <Box my={10}>
              <Accordion allowToggle>
                <AccordionItem
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      Terms & Conditions
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Text>1. All tickets are NFTs on the Lisk blockchain.</Text>
                    <Text mt={2}>
                      2. Tickets are subject to availability and are
                      non-refundable except in case of event cancellation.
                    </Text>
                    <Text mt={2}>
                      3. Tickets can be transferred to other users through the
                      Lummy platform.
                    </Text>
                    <Text mt={2}>
                      4. Resale of tickets is allowed only through the official
                      Lummy marketplace, with price caps set by event
                      organizers.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </Box>

          {/* Right Column - Sidebar */}
          <Box w={{ base: "100%", lg: "30%" }}>
            {/* Sticky Ticket Info Card */}
            <Box
              position="sticky"
              top="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              boxShadow="sm"
              p={6}
              zIndex={2}
            >
              <VStack spacing={4} align="stretch">
                <Text fontWeight="medium" color="gray.500">
                  Tickets starting at
                </Text>
                <Heading size="lg" color="lummy.gray.800">
                  {event.currency} {event.price.toLocaleString()}
                </Heading>
                <Button
                  colorScheme="purple"
                  size="lg"
                  width="100%"
                  onClick={scrollToTickets}
                  leftIcon={<Icon as={FaTicketAlt} />}
                >
                  View Tickets
                </Button>

                {/* Selected Ticket Summary */}
                {selectedTier && selectedTicketTier && (
                  <Box
                    mt={4}
                    pt={4}
                    borderTopWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text fontWeight="bold" mb={2}>
                      Your Selection
                    </Text>
                    <HStack justify="space-between" mb={1}>
                      <Text>{selectedTicketTier.name}</Text>
                      <Text>x {selectedTier.quantity}</Text>
                    </HStack>
                    <HStack justify="space-between" mb={4}>
                      <Text>Price per ticket</Text>
                      <Text>
                        {event.currency}{" "}
                        {selectedTicketTier.price.toLocaleString()}
                      </Text>
                    </HStack>
                    <Divider mb={4} />
                    <HStack justify="space-between" fontWeight="bold">
                      <Text>Total</Text>
                      <Text color="purple.600">
                        {event.currency}{" "}
                        {calculateTotalPrice().toLocaleString()}
                      </Text>
                    </HStack>
                    <Button
                      colorScheme="green"
                      width="100%"
                      mt={4}
                      onClick={handleProceedToCheckout}
                      rightIcon={<Icon as={FaShoppingCart} />}
                    >
                      Proceed to Checkout
                    </Button>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Organizer Information */}
            <Box
              mt={8}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              boxShadow="sm"
              p={6}
            >
              <Heading size="md" mb={4}>
                Organizer
              </Heading>

              <HStack spacing={4} align="center">
                <Avatar
                  src={event.organizer.imageUrl || ""}
                  name={event.organizer.name}
                  size="lg"
                  bg="lummy.purple.500"
                />
                <Box>
                  <HStack>
                    <Text fontWeight="bold" fontSize="lg">
                      {event.organizer.name}
                    </Text>
                    {event.organizer.verified && (
                      <Badge colorScheme="green" variant="subtle">
                        <HStack spacing={1}>
                          <CheckIcon />
                          <Text fontSize="xs">Verified</Text>
                        </HStack>
                      </Badge>
                    )}
                  </HStack>
                  {event.organizer.description && (
                    <Text color="gray.600" mt={1} fontSize="sm">
                      {event.organizer.description}
                    </Text>
                  )}
                </Box>
              </HStack>

              {event.organizer.website && (
                <Button
                  as="a"
                  href={event.organizer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="outline"
                  colorScheme="purple"
                  mt={4}
                  width="100%"
                >
                  Visit Website
                </Button>
              )}
            </Box>
          </Box>
        </Flex>
      </Container>

      {/* Tier Change Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change Ticket Selection
            </AlertDialogHeader>

            <AlertDialogBody>
              You can only select one ticket type at a time. Do you want to
              change your selection from "{currentTierName}" to "
              {newTierSelection?.name}"?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="purple" onClick={handleTierChange} ml={3}>
                Yes, Change Ticket
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default EventDetailPage;
