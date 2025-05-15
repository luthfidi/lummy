import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  FormHelperText,
  SimpleGrid,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import TicketTierCreator, {
  TicketTierInput,
} from "../../components/admin/TicketTierCreator";
import ResellSettings, {
  ResellSettingsData,
} from "../../components/admin/ResellSettings";
import { useSmartContract } from "../../hooks/useSmartContract";

const CreateEventForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const cardBg = "white";

  // Form state
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    venue: "",
    address: "",
    date: "",
    time: "",
    endTime: "",
    category: "",
    bannerImage: null as File | null,
    featuredImage: null as File | null,
  });

  // Ticket tiers state
  const [ticketTiers, setTicketTiers] = useState<TicketTierInput[]>([
    {
      id: "tier-1",
      name: "General Admission",
      description: "Standard festival access",
      price: 50,
      quantity: 300,
      maxPerPurchase: 4,
      benefits: [],
    },
  ]);

  // Resell settings state
  const [resellSettings, setResellSettings] = useState<ResellSettingsData>({
    allowResell: true,
    maxMarkupPercentage: 20,
    organizerFeePercentage: 2.5,
    restrictResellTiming: false,
    minDaysBeforeEvent: 1,
    requireVerification: false,
  });

  // Handle form input changes
  const handleInputChange = (field: string, value: string | File | null) => {
    setEventData({
      ...eventData,
      [field]: value,
    });
  };

  // Handle file uploads
  const handleFileChange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange(field, e.target.files[0]);
    }
  };

  const { createEvent, loading, error } = useSmartContract();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    if (
      !eventData.title ||
      !eventData.date ||
      !eventData.time ||
      ticketTiers.length === 0
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventDate = new Date(`${eventData.date}T${eventData.time}`);

    // Panggil fungsi createEvent dari hook
    try {
      const eventAddress = await createEvent(
        eventData.title,
        eventData.description,
        eventDate,
        eventData.venue || eventData.address,
        "" // ipfsMetadata (kosong untuk saat ini)
      );

      if (eventAddress) {
        toast({
          title: "Event created",
          description: `Your event has been created successfully at ${eventAddress}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Untuk demo, kita langsung redirect ke dashboard
        navigate("/admin");
      } else {
        toast({
          title: "Error creating event",
          description: "There was an error creating your event",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error creating event:", err);
      toast({
        title: "Transaction failed",
        description: error || "There was an error processing your transaction",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    // Would handle actual form submission to API in real application
    toast({
      title: "Event created",
      description: "Your event has been created successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    console.log("Event Data:", eventData);
    console.log("Ticket Tiers:", ticketTiers);
    console.log("Resell Settings:", resellSettings);

    // Redirect to admin dashboard
    navigate("/admin");
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack align="stretch" spacing={6}>
        <HStack>
          <IconButton
            aria-label="Go back"
            icon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => navigate("/admin")}
          />
          <Heading size="lg">Create New Event</Heading>
        </HStack>

        {/* Event Info */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.300"
        >
          <Heading size="md" mb={4}>
            Event Info
          </Heading>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={eventData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter event title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={eventData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Event description"
                rows={4}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select category"
                value={eventData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="music">Music</option>
                <option value="technology">Technology</option>
                <option value="sport">Sport</option>
                <option value="arts">Arts & Theater</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
          </VStack>
        </Box>

        {/* Date & Time */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.300"
        >
          <Heading size="md" mb={4}>
            Date & Time
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={eventData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                value={eventData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                value={eventData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <FormControl mt={4}>
            <FormLabel>Venue</FormLabel>
            <Input
              value={eventData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
            />
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Address</FormLabel>
            <Textarea
              value={eventData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
            />
          </FormControl>
        </Box>

        {/* Images */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.300"
        >
          <Heading size="md" mb={4}>
            Images
          </Heading>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Banner Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("bannerImage", e)}
              />
              <FormHelperText>Recommended: 1200x400px</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Featured Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("featuredImage", e)}
              />
              <FormHelperText>Recommended: 600x400px</FormHelperText>
            </FormControl>
          </VStack>
        </Box>

        {/* Tickets */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.300"
        >
          <TicketTierCreator
            tiers={ticketTiers}
            onChange={setTicketTiers}
            currency="IDRX"
          />
        </Box>

        {/* Resell Settings */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.300"
        >
          <ResellSettings
            settings={resellSettings}
            onSave={setResellSettings}
          />
        </Box>

        {/* Submit Buttons */}
        <form onSubmit={handleSubmit}>
          <Flex justify="flex-end">
            <HStack spacing={4}>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Cancel
              </Button>
              <Button colorScheme="purple" type="submit" isLoading={loading}>
                Create Event
              </Button>
            </HStack>
          </Flex>
        </form>
      </VStack>
    </Container>
  );
};
export default CreateEventForm;
