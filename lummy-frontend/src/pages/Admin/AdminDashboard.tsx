import React, { useState } from "react";
import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Icon,
  Badge,
  Divider,
  Select,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import { FaTicketAlt, FaChartLine, FaUserCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import SalesStatistics from "../../components/admin/SalesStatistics";
// import EventStats from "../../components/admin/EventStats"; // optional if used later

// Mock Events Data
const mockEvents = [
  {
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
  },
  {
    eventId: "2",
    eventName: "Tech Conference 2025",
    ticketsSold: 280,
    totalTickets: 400,
    revenue: 42000,
    currency: "IDRX",
    tierStats: [
      { tierName: "Standard Access", sold: 200, total: 250, price: 150 },
      { tierName: "Premium Access", sold: 80, total: 150, price: 300 },
    ],
    daysUntilEvent: 5,
  },
  {
    eventId: "3",
    eventName: "Blockchain Workshop",
    ticketsSold: 75,
    totalTickets: 100,
    revenue: 7500,
    currency: "IDRX",
    tierStats: [
      { tierName: "Workshop Ticket", sold: 65, total: 80, price: 100 },
      { tierName: "Workshop + Certification", sold: 10, total: 20, price: 200 },
    ],
    daysUntilEvent: -2,
  },
];

// Mock Sales Data
const mockSalesData = {
  totalRevenue: 72000,
  soldTickets: 805,
  availableTickets: 195,
  totalTransactions: 610,
  averageTicketPrice: 89.44,

  // Grouped by event name and ticket tier
  revenueByEventAndTier: {
    "Summer Music Festival": {
      "General Admission": 15000,
      "VIP Pass": 12000,
      "Backstage Experience": 4500,
    },
    "Tech Conference 2025": {
      "Standard Access": 30000,
      "Premium Access": 24000,
    },
    "Blockchain Workshop": {
      "Workshop Ticket": 6500,
      "Workshop + Certification": 2000,
    },
  },

  // Flat version (for backward compatibility)
  revenueByTier: {
    "General Admission": 15000,
    "VIP Pass": 12000,
    "Backstage Experience": 4500,
    "Standard Access": 30000,
    "Premium Access": 24000,
    "Workshop Ticket": 6500,
    "Workshop + Certification": 2000,
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

// Helper Functions
const getEventStatus = (daysUntilEvent: number) => {
  if (daysUntilEvent > 0) return "Upcoming";
  if (daysUntilEvent === 0) return "Ongoing";
  return "Completed";
};

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Upcoming":
      return "green";
    case "Ongoing":
      return "orange";
    case "Completed":
      return "gray";
    default:
      return "blue";
  }
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const cardBg = "white";

  const filteredSalesData =
    selectedEvent === "all" ? mockSalesData : { ...mockSalesData }; // Add real filter later

  const handleCreateEvent = () => {
    navigate("/admin/events/create");
  };

  const handleManageEvent = (eventId: string) => {
    navigate(`/admin/events/${eventId}`);
  };

  const renderEventCards = (events: typeof mockEvents) => (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
      {events.map((event) => {
        const status = getEventStatus(event.daysUntilEvent);
        return (
          <Box
            key={event.eventId}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg={cardBg}
            shadow="sm"
          >
            <Flex justify="space-between" align="center">
              <Box>
                <HStack mb={1}>
                  <Heading size="sm">{event.eventName}</Heading>
                  <Badge colorScheme={getBadgeColor(status)}>{status}</Badge>
                </HStack>
                <HStack spacing={4} color="gray.600">
                  <HStack>
                    <Icon as={FaTicketAlt} />
                    <Text>
                      {event.ticketsSold} / {event.totalTickets} sold
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={CalendarIcon} />
                    <Text>{new Date().toLocaleDateString()}</Text>
                  </HStack>
                </HStack>
              </Box>
              <HStack>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  leftIcon={<Icon as={FaUserCheck} />}
                  onClick={() =>
                    navigate(`/admin/events/${event.eventId}/check-in`)
                  }
                >
                  Check-in
                </Button>
                <Button
                  colorScheme="purple"
                  size="sm"
                  onClick={() => handleManageEvent(event.eventId)}
                >
                  Manage
                </Button>
              </HStack>
            </Flex>
          </Box>
        );
      })}
    </SimpleGrid>
  );

  const upcomingEvents = mockEvents.filter(
    (e) => getEventStatus(e.daysUntilEvent) === "Upcoming"
  );
  const ongoingEvents = mockEvents.filter(
    (e) => getEventStatus(e.daysUntilEvent) === "Ongoing"
  );
  const completedEvents = mockEvents.filter(
    (e) => getEventStatus(e.daysUntilEvent) === "Completed"
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg">Organizer Dashboard</Heading>
          <Text color="gray.600">Manage your events and track performance</Text>
        </Box>
        <Button
          colorScheme="purple"
          leftIcon={<AddIcon />}
          onClick={handleCreateEvent}
        >
          Create Event
        </Button>
      </Flex>

      <Tabs colorScheme="purple" variant="enclosed" mb={8}>
        <TabList>
          <Tab>
            <Icon as={FaChartLine} mr={2} /> Overview
          </Tab>
          <Tab>
            <Icon as={FaTicketAlt} mr={2} /> My Events
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Box mb={6}>
              <HStack mb={4} justify="space-between">
                <Heading size="md">Sales Overview</Heading>
                <Select
                  maxW="250px"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value="all">All Events</option>
                  {mockEvents.map((event) => (
                    <option key={event.eventId} value={event.eventId}>
                      {event.eventName}
                    </option>
                  ))}
                </Select>
              </HStack>
              {filteredSalesData && (
                <SalesStatistics
                  salesData={filteredSalesData}
                  eventName={
                    selectedEvent === "all"
                      ? "All Events"
                      : mockEvents.find((e) => e.eventId === selectedEvent)
                          ?.eventName || "Event"
                  }
                />
              )}
            </Box>
            <Divider my={2} />
          </TabPanel>

          <TabPanel px={0} py={6}>
            <VStack align="stretch" spacing={8}>
              <Box>
                <Heading size="md" mb={4}>
                  Upcoming Events
                </Heading>
                {renderEventCards(upcomingEvents)}
              </Box>
              <Box>
                <Heading size="md" mb={4}>
                  Ongoing Events
                </Heading>
                {renderEventCards(ongoingEvents)}
              </Box>
              <Box>
                <Heading size="md" mb={4}>
                  Completed Events
                </Heading>
                {renderEventCards(completedEvents)}
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;
