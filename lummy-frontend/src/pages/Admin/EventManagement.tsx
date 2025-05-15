import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Flex,
  Badge,
  Divider,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  Skeleton,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftAddon,
  Stack,
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { FaTicketAlt, FaChartBar, FaUsers, FaCog } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import SalesStatistics, {
  SalesData,
} from "../../components/admin/SalesStatistics";
import EventStats, { EventStatsData } from "../../components/admin/EventStats";
import ResellSettings, {
  ResellSettingsData,
} from "../../components/admin/ResellSettings";
import AttendeeList, { Attendee } from "../../components/admin/AttendeeList";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Mock event data - would be fetched from API in real application
const mockEvent: EventStatsData = {
  eventId: "1",
  eventName: "Summer Music Festival",
  ticketsSold: 450,
  totalTickets: 500,
  revenue: 22500,
  currency: "IDRX",
  tierStats: [
    { tierName: "General Admission", sold: 300, total: 300, price: 50 },
    { tierName: "VIP Pass", sold: 120, total: 150, price: 100 },
    { tierName: "Backstage Experience", sold: 30, total: 50, price: 150 },
  ],
  daysUntilEvent: 45,
};

// Mock sales data
const mockSalesData: SalesData = {
  totalRevenue: 22500,
  soldTickets: 450,
  availableTickets: 50,
  totalTransactions: 380,
  averageTicketPrice: 50,
  revenueByTier: {
    "General Admission": 15000,
    "VIP Pass": 12000,
    "Backstage Experience": 4500,
  },
  salesByDay: [
    { date: "2025-03-01", sales: 20 },
    { date: "2025-03-02", sales: 35 },
    { date: "2025-03-03", sales: 42 },
    { date: "2025-03-04", sales: 28 },
    { date: "2025-03-05", sales: 15 },
    { date: "2025-03-06", sales: 30 },
    { date: "2025-03-07", sales: 25 },
  ],
  currency: "IDRX",
  percentChange: 12.5,
};

// Mock attendees data
const mockAttendees: Attendee[] = Array.from({ length: 30 }, (_, i) => ({
  id: `att-${i + 1}`,
  name: `Attendee ${i + 1}`,
  email: `attendee${i + 1}@example.com`,
  ticketType:
    i % 3 === 0
      ? "General Admission"
      : i % 3 === 1
      ? "VIP Pass"
      : "Backstage Experience",
  purchaseDate: new Date(2025, 2, Math.floor(i / 6) + 1).toISOString(),
  status:
    i % 10 === 0
      ? "checked-in"
      : i % 15 === 0
      ? "cancelled"
      : i % 20 === 0
      ? "refunded"
      : "confirmed",
  walletAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
}));

// Mock resell settings
const mockResellSettings: ResellSettingsData = {
  allowResell: true,
  maxMarkupPercentage: 20,
  organizerFeePercentage: 2.5,
  restrictResellTiming: false,
  minDaysBeforeEvent: 1,
  requireVerification: false,
};

// Interface untuk Ticket Tier yang akan diedit
interface EditableTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  available: number;
  maxPerPurchase: number;
  benefits?: string[];
}

const EventManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null!);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventStatsData | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [resellSettings, setResellSettings] =
    useState<ResellSettingsData | null>(null);

  // State dan handler untuk modal form ticket tier
  const [editingTier, setEditingTier] = useState<EditableTier | null>(null);
  const [isNewTier, setIsNewTier] = useState(false);
  const {
    isOpen: isTierModalOpen,
    onOpen: openTierModal,
    onClose: closeTierModal,
  } = useDisclosure();

  // Fetch event data on mount
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API calls
      setTimeout(() => {
        setEvent(mockEvent);
        setSalesData(mockSalesData);
        setAttendees(mockAttendees);
        setResellSettings(mockResellSettings);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [id]);

  // Handle check-in
  const handleCheckIn = (attendeeId: string) => {
    setAttendees(
      attendees.map((att) =>
        att.id === attendeeId ? { ...att, status: "checked-in" } : att
      )
    );

    toast({
      title: "Attendee checked in",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle export
  const handleExport = () => {
    toast({
      title: "Exporting attendees",
      description: "Attendee list is being exported to CSV",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle resell settings update
  const handleResellSettingsUpdate = (settings: ResellSettingsData) => {
    setResellSettings(settings);

    toast({
      title: "Settings updated",
      description: "Resale settings have been successfully updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle event cancellation
  const handleCancelEvent = () => {
    onClose();

    toast({
      title: "Event cancelled",
      description: "The event has been cancelled successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    navigate("/admin");
  };

  // Handlers untuk mengedit dan menambah tier
  const handleEditTier = (tier: any) => {
    setEditingTier({
      id: tier.id || `tier-${Date.now()}`,
      name: tier.tierName,
      price: tier.price,
      currency: tier.currency || "IDRX",
      description: "Ticket description", // Mock value since it's not in the data model
      available: tier.total,
      maxPerPurchase: 4, // Mock value since it's not in the data model
      benefits: [], // Mock value since it's not in the data model
    });
    setIsNewTier(false);
    openTierModal();
  };

  const handleAddNewTier = () => {
    setEditingTier({
      id: `tier-${Date.now()}`,
      name: "",
      price: 0,
      currency: "IDRX",
      description: "",
      available: 100,
      maxPerPurchase: 4,
      benefits: [],
    });
    setIsNewTier(true);
    openTierModal();
  };

  // Handler untuk perubahan pada form
  const handleTierInputChange = (field: keyof EditableTier, value: any) => {
    if (editingTier) {
      setEditingTier({
        ...editingTier,
        [field]: value,
      });
    }
  };

  // Handler untuk menyimpan perubahan
  const handleSaveTier = () => {
    if (!editingTier || !event) return;

    let updatedTierStats = [...event.tierStats];

    if (isNewTier) {
      // Add new tier
      updatedTierStats.push({
        tierName: editingTier.name,
        sold: 0,
        total: editingTier.available,
        price: editingTier.price,
      });

      toast({
        title: "Ticket tier added",
        description: `${editingTier.name} has been added successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Update existing tier
      updatedTierStats = updatedTierStats.map((tier) =>
        tier.tierName === editingTier.name
          ? {
              ...tier,
              price: editingTier.price,
              total: editingTier.available,
            }
          : tier
      );

      toast({
        title: "Ticket tier updated",
        description: `${editingTier.name} has been updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    // Update event data
    setEvent({
      ...event,
      tierStats: updatedTierStats,
      // Update total tickets and revenue
      totalTickets: updatedTierStats.reduce(
        (total, tier) => total + tier.total,
        0
      ),
      ticketsSold: updatedTierStats.reduce(
        (total, tier) => total + tier.sold,
        0
      ),
      revenue: updatedTierStats.reduce(
        (total, tier) => total + tier.sold * tier.price,
        0
      ),
    });

    closeTierModal();
  };

  // Handle delete tier
  const handleDeleteTier = (tierName: string) => {
    if (!event) return;

    const updatedTierStats = event.tierStats.filter(
      (tier) => tier.tierName !== tierName
    );

    // Update event data
    setEvent({
      ...event,
      tierStats: updatedTierStats,
      // Update total tickets and revenue
      totalTickets: updatedTierStats.reduce(
        (total, tier) => total + tier.total,
        0
      ),
      ticketsSold: updatedTierStats.reduce(
        (total, tier) => total + tier.sold,
        0
      ),
      revenue: updatedTierStats.reduce(
        (total, tier) => total + tier.sold * tier.price,
        0
      ),
    });

    toast({
      title: "Ticket tier deleted",
      description: `${tierName} has been deleted successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <HStack mb={6}>
          <IconButton
            aria-label="Go back"
            icon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => navigate("/admin")}
          />
          <Skeleton height="40px" width="300px" />
        </HStack>

        <Skeleton height="200px" my={6} />
        <Skeleton height="400px" />
      </Container>
    );
  }

  if (!event || !salesData || !resellSettings) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Event not found</Text>
        <Button mt={4} onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <HStack mb={2}>
        <IconButton
          aria-label="Go back"
          icon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => navigate("/admin")}
        />
        <Heading size="lg">Manage Event</Heading>
      </HStack>

      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="xl">{event.eventName}</Heading>
          <HStack>
            <Badge
              colorScheme={
                event.daysUntilEvent > 30
                  ? "green"
                  : event.daysUntilEvent > 7
                  ? "orange"
                  : "red"
              }
            >
              {event.daysUntilEvent} days to go
            </Badge>
            <Text color="gray.600">
              Tickets: {event.ticketsSold} / {event.totalTickets} sold
            </Text>
          </HStack>
        </Box>

        <HStack>
          <Button
            leftIcon={<EditIcon />}
            colorScheme="purple"
            variant="outline"
            onClick={() => navigate(`/admin/events/${id}/edit`)}
          >
            Edit Event
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            variant="outline"
            onClick={onOpen}
          >
            Cancel Event
          </Button>
        </HStack>
      </Flex>

      <Tabs colorScheme="purple" variant="enclosed">
        <TabList>
          <Tab>
            <Icon as={FaChartBar} mr={2} /> Analytics
          </Tab>
          <Tab>
            <Icon as={FaTicketAlt} mr={2} /> Tickets
          </Tab>
          <Tab>
            <Icon as={FaUsers} mr={2} /> Attendees
          </Tab>
          <Tab>
            <Icon as={FaCog} mr={2} /> Settings
          </Tab>
        </TabList>

        <TabPanels>
          {/* Analytics Tab */}
          <TabPanel px={0}>
            <VStack spacing={8} align="stretch">
              <SalesStatistics
                salesData={salesData}
                eventName={event.eventName}
              />

              <Divider />
              <MotionBox
                border="2px solid"
                borderColor={"gray.200"}
                p={4}
                rounded="xl"
              >
                <Box>
                  <Heading size="md" mb={4}>
                    Ticket Sales Performance
                  </Heading>
                  <EventStats stats={event} />
                </Box>
              </MotionBox>
            </VStack>
          </TabPanel>

          {/* Tickets Tab */}
          <TabPanel px={0} py={6}>
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Ticket Tiers</Heading>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="purple"
                  onClick={handleAddNewTier}
                >
                  Add New Tier
                </Button>
              </Flex>

              {event.tierStats.map((tier, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="2px"
                  borderRadius="md"
                  shadow="sm"
                  transition="all 0.3s"
                  _hover={{ boxShadow: "md" }}
                >
                  <Flex justify="space-between" align="start">
                    <Box flex="1">
                      <HStack mb={2} align="center">
                        <Text fontWeight="bold" fontSize="lg">
                          {tier.tierName}
                        </Text>
                        <Badge colorScheme="purple">
                          {tier.price} {event.currency}
                        </Badge>
                      </HStack>

                      <Text fontSize="sm" color="gray.600" mb={2}>
                        {tier.sold} / {tier.total} sold (
                        {((tier.sold / tier.total) * 100).toFixed(0)}%)
                      </Text>

                      <Progress
                        value={(tier.sold / tier.total) * 100}
                        size="sm"
                        colorScheme={
                          (tier.sold / tier.total) * 100 >= 75
                            ? "green"
                            : "blue"
                        }
                        borderRadius="full"
                        mb={2}
                      />

                      <HStack mt={3} spacing={4}>
                        <Text fontSize="sm" color="gray.500">
                          Max Per Purchase: 4
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Revenue: {event.currency}{" "}
                          {(tier.sold * tier.price).toLocaleString()}
                        </Text>
                      </HStack>
                    </Box>

                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<EditIcon />}
                        colorScheme="purple"
                        variant="outline"
                        onClick={() => handleEditTier(tier)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDeleteTier(tier.tierName)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              ))}

              {event.tierStats.length === 0 && (
                <Box
                  p={8}
                  borderWidth="1px"
                  borderRadius="md"
                  borderStyle="dashed"
                  textAlign="center"
                >
                  <Text color="gray.500">No ticket tiers added yet.</Text>
                  <Button
                    mt={4}
                    colorScheme="purple"
                    onClick={handleAddNewTier}
                  >
                    Add Your First Tier
                  </Button>
                </Box>
              )}
            </VStack>
          </TabPanel>

          {/* Attendees Tab */}
          <TabPanel px={0} py={4}>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md">Attendee Management</Heading>
              <HStack>
                <Button
                  colorScheme="purple"
                  onClick={() => navigate(`/admin/events/${id}/check-in`)}
                >
                  Check-in Dashboard
                </Button>
              </HStack>
            </Flex>
            <AttendeeList
              attendees={attendees}
              onCheckIn={handleCheckIn}
              onExport={handleExport}
            />
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel px={0} py={4}>
            <VStack spacing={8} align="stretch">
              <ResellSettings
                settings={resellSettings}
                onSave={handleResellSettingsUpdate}
              />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Cancel Event Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will cancel the event and notify all ticket
              holders. This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No, Keep Event
              </Button>
              <Button colorScheme="red" onClick={handleCancelEvent} ml={3}>
                Yes, Cancel Event
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Ticket Tier Edit/Add Modal */}
      <Modal isOpen={isTierModalOpen} onClose={closeTierModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isNewTier ? "Add New Ticket Tier" : "Edit Ticket Tier"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingTier && (
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Tier Name</FormLabel>
                  <Input
                    value={editingTier.name}
                    onChange={(e) =>
                      handleTierInputChange("name", e.target.value)
                    }
                    placeholder="e.g. VIP, General Admission, Early Bird"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>{editingTier.currency}</InputLeftAddon>
                    <NumberInput
                      value={editingTier.price}
                      onChange={(_, value) =>
                        handleTierInputChange("price", value)
                      }
                      min={0}
                      w="full"
                    >
                      <NumberInputField borderLeftRadius={0} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={editingTier.description}
                    onChange={(e) =>
                      handleTierInputChange("description", e.target.value)
                    }
                    placeholder="Describe what this ticket tier offers"
                    rows={3}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Available Quantity</FormLabel>
                  <NumberInput
                    value={editingTier.available}
                    onChange={(_, value) =>
                      handleTierInputChange("available", value)
                    }
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Maximum Per Purchase</FormLabel>
                  <NumberInput
                    value={editingTier.maxPerPurchase}
                    onChange={(_, value) =>
                      handleTierInputChange("maxPerPurchase", value)
                    }
                    min={1}
                    max={10}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Maximum number of tickets that can be purchased in a single
                    transaction
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Benefits (Optional)</FormLabel>
                  <VStack align="start" spacing={2}>
                    {editingTier.benefits?.map((benefit, index) => (
                      <HStack key={index} width="full">
                        <Input
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [
                              ...(editingTier.benefits || []),
                            ];
                            newBenefits[index] = e.target.value;
                            handleTierInputChange("benefits", newBenefits);
                          }}
                          placeholder={`Benefit ${index + 1}`}
                        />
                        <IconButton
                          aria-label="Remove benefit"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => {
                            const newBenefits = [
                              ...(editingTier.benefits || []),
                            ];
                            newBenefits.splice(index, 1);
                            handleTierInputChange("benefits", newBenefits);
                          }}
                        />
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newBenefits = [
                          ...(editingTier.benefits || []),
                          "",
                        ];
                        handleTierInputChange("benefits", newBenefits);
                      }}
                    >
                      Add Benefit
                    </Button>
                  </VStack>
                </FormControl>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeTierModal}>
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={handleSaveTier}>
              {isNewTier ? "Add Tier" : "Save Changes"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EventManagement;
