import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
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
  Select,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowBackIcon,
  ChevronRightIcon,
  DownloadIcon,
  EmailIcon,
} from "@chakra-ui/icons";
import { FaQrcode, FaChartBar, FaUserCheck, FaUsers } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { CheckInStats } from "../../components/ticketManagement";

// Mock data
const mockEventData = {
  id: "event-1",
  name: "Summer Music Festival",
  date: "June 15, 2025",
  location: "Jakarta Convention Center",
  status: "upcoming",
};

const mockCheckInStats = {
  totalAttendees: 500,
  checkedIn: 320,
  checkInRate: 64,
  peakCheckInTime: "14:30 - 15:30",
  recentActivity: 28,
  tierStats: [
    { name: "General Admission", total: 300, checkedIn: 210 },
    { name: "VIP Pass", total: 150, checkedIn: 98 },
    { name: "Backstage Experience", total: 50, checkedIn: 12 },
  ],
};

const mockRecentCheckins: RecentCheckin[] = [
  {
    id: "att-1",
    name: "John Smith",
    ticketType: "VIP Pass",
    time: "15:45",
    status: "success",
  },
  {
    id: "att-2",
    name: "Jane Doe",
    ticketType: "General Admission",
    time: "15:42",
    status: "success",
  },
  {
    id: "att-3",
    name: "Mike Johnson",
    ticketType: "General Admission",
    time: "15:38",
    status: "failed",
  },
  {
    id: "att-4",
    name: "Sarah Williams",
    ticketType: "VIP Pass",
    time: "15:35",
    status: "success",
  },
  {
    id: "att-5",
    name: "David Lee",
    ticketType: "Backstage Experience",
    time: "15:30",
    status: "success",
  },
];

// Generate more attendee data
const generateMockAttendees = (count: number) => {
  const statuses = ["confirmed", "checked-in", "cancelled"];
  const ticketTypes = ["General Admission", "VIP Pass", "Backstage Experience"];

  return Array.from({ length: count }, (_, i) => ({
    id: `att-${i + 10}`,
    name: `Attendee ${i + 10}`,
    email: `attendee${i + 10}@example.com`,
    ticketType: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
    checkInTime:
      Math.random() > 0.6
        ? `${Math.floor(Math.random() * 12 + 12)}:${Math.floor(
            Math.random() * 60
          )
            .toString()
            .padStart(2, "0")}`
        : null,
    purchaseDate: new Date(
      2025,
      3,
      Math.floor(Math.random() * 30) + 1
    ).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

const mockAttendees = generateMockAttendees(50);

// Define types for our mock data
interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  status: string;
}

interface CheckInStatsData {
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
}

interface RecentCheckin {
  id: string;
  name: string;
  ticketType: string;
  time: string;
  status: "success" | "failed";
}

const CheckInDashboard: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [stats, setStats] = useState<CheckInStatsData | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<RecentCheckin[]>([]);
  const [attendees, setAttendees] = useState<typeof mockAttendees>([]);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const cardBg = "white";
  const tableBg = "white";
  const tableHeadBg = "gray.50";

  useEffect(() => {
    // Simulate API calls to fetch data
    setTimeout(() => {
      setEvent(mockEventData);
      setStats(mockCheckInStats);
      setRecentCheckins(mockRecentCheckins);
      setAttendees(mockAttendees);
      setIsLoading(false);
    }, 1500);
  }, [eventId]);

  const handleExportData = () => {
    toast({
      title: "Exporting check-in data",
      description: "The data will be downloaded as CSV",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStartScanning = () => {
    navigate(`/admin/events/${eventId}/scanner`);
  };

  const handleSendReminders = () => {
    toast({
      title: "Sending reminders",
      description: "Check-in reminders will be sent to all attendees",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Filter attendees based on filters
  const filteredAttendees = attendees.filter((attendee) => {
    // Status filter
    if (statusFilter !== "all" && attendee.status !== statusFilter) {
      return false;
    }

    // Ticket type filter
    if (typeFilter !== "all" && attendee.ticketType !== typeFilter) {
      return false;
    }

    return true;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <HStack mb={6}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => navigate(`/admin/events/${eventId}`)}
        >
          Back
        </Button>
        <Heading size="lg">Check-in Dashboard</Heading>
      </HStack>

      {isLoading ? (
        <Box textAlign="center" py={10}>
          <Text>Loading check-in data...</Text>
        </Box>
      ) : event ? (
        <>
          <Flex
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            mb={6}
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <VStack align="flex-start" spacing={1}>
              <Heading size="md">{event.name}</Heading>
              <Text color="gray.600">
                {event.date} • {event.location}
              </Text>
            </VStack>

            <HStack spacing={4}>
              <Button
                leftIcon={<EmailIcon />}
                colorScheme="blue"
                variant="outline"
                onClick={handleSendReminders}
              >
                Send Reminders
              </Button>
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="purple"
                variant="outline"
                onClick={handleExportData}
              >
                Export Data
              </Button>
              <Button
                leftIcon={<Icon as={FaQrcode} />}
                colorScheme="purple"
                onClick={handleStartScanning}
              >
                Start Scanning
              </Button>
            </HStack>
          </Flex>

          <Tabs colorScheme="purple" variant="enclosed">
            <TabList>
              <Tab>
                <Icon as={FaChartBar} mr={2} />
                Overview
              </Tab>
              <Tab>
                <Icon as={FaUsers} mr={2} />
                Attendees
              </Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel p={0} pt={6}>
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                  <GridItem>
                    {stats && (
                      <CheckInStats eventId={eventId || ""} stats={stats} />
                    )}
                  </GridItem>

                  <GridItem>
                    <Box
                      bg={cardBg}
                      p={6}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="gray.200"
                    >
                      <Heading size="md" mb={4}>
                        <Icon as={FaUserCheck} mr={2} />
                        Recent Check-ins
                      </Heading>

                      {recentCheckins.length > 0 ? (
                        <VStack spacing={3} align="stretch">
                          {recentCheckins.map((checkin, index) => (
                            <Flex
                              key={index}
                              justify="space-between"
                              p={3}
                              borderWidth="1px"
                              borderRadius="md"
                              borderColor={
                                checkin.status === "success"
                                  ? "green.200"
                                  : "red.200"
                              }
                              bg={
                                checkin.status === "success"
                                  ? "green.50"
                                  : "red.50"
                              }
                            >
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">{checkin.name}</Text>
                                <Badge colorScheme="purple" mt={1}>
                                  {checkin.ticketType}
                                </Badge>
                              </VStack>
                              <VStack align="end" spacing={0}>
                                <Text fontWeight="medium">{checkin.time}</Text>
                                <Badge
                                  colorScheme={
                                    checkin.status === "success"
                                      ? "green"
                                      : "red"
                                  }
                                  mt={1}
                                >
                                  {checkin.status.toUpperCase()}
                                </Badge>
                              </VStack>
                            </Flex>
                          ))}
                        </VStack>
                      ) : (
                        <Text color="gray.500" textAlign="center" py={4}>
                          No recent check-ins
                        </Text>
                      )}

                      <Button
                        variant="link"
                        colorScheme="purple"
                        rightIcon={<ChevronRightIcon />}
                        mt={4}
                        alignSelf="flex-end"
                      >
                        View all check-ins
                      </Button>
                    </Box>

                    <Box
                      bg={cardBg}
                      p={6}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="gray.200"
                      mt={6}
                    >
                      <Heading size="md" mb={4}>
                        <Icon as={FaQrcode} mr={2} />
                        Check-in Methods
                      </Heading>

                      <VStack spacing={4} align="stretch">
                        <Button
                          leftIcon={<Icon as={FaQrcode} />}
                          onClick={handleStartScanning}
                          colorScheme="purple"
                          size="lg"
                          width="100%"
                        >
                          Scan QR Codes
                        </Button>

                        <Button
                          leftIcon={<AddIcon />}
                          colorScheme="purple"
                          variant="outline"
                          size="lg"
                          width="100%"
                        >
                          Manual Check-in
                        </Button>
                      </VStack>
                    </Box>
                  </GridItem>
                </Grid>
              </TabPanel>

              {/* Attendees Tab */}
              <TabPanel p={0} pt={6}>
                <Box
                  bg={tableBg}
                  borderRadius="lg"
                  border="2px solid"
                  borderColor="gray.200"
                  overflow="hidden"
                >
                  <Flex
                    bg={tableHeadBg}
                    p={4}
                    justify="space-between"
                    align={{ base: "flex-start", md: "center" }}
                    direction={{ base: "column", md: "row" }}
                    gap={4}
                  >
                    <Heading size="md">Attendee List</Heading>

                    <HStack>
                      <Select
                        placeholder="All Statuses"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        width="150px"
                      >
                        <option value="all">All Statuses</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="checked-in">Checked In</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>

                      <Select
                        placeholder="All Ticket Types"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        width="180px"
                      >
                        <option value="all">All Ticket Types</option>
                        <option value="General Admission">
                          General Admission
                        </option>
                        <option value="VIP Pass">VIP Pass</option>
                        <option value="Backstage Experience">
                          Backstage Experience
                        </option>
                      </Select>
                    </HStack>
                  </Flex>

                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg={tableHeadBg}>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Ticket Type</Th>
                          <Th>Status</Th>
                          <Th>Check-in Time</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredAttendees.length > 0 ? (
                          filteredAttendees.map((attendee) => (
                            <Tr key={attendee.id}>
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium">
                                    {attendee.name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {attendee.email}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Badge colorScheme="purple">
                                  {attendee.ticketType}
                                </Badge>
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    attendee.status === "checked-in"
                                      ? "green"
                                      : attendee.status === "confirmed"
                                      ? "blue"
                                      : "red"
                                  }
                                >
                                  {attendee.status}
                                </Badge>
                              </Td>
                              <Td>
                                {attendee.checkInTime
                                  ? attendee.checkInTime
                                  : "-"}
                              </Td>
                              <Td>
                                <HStack>
                                  <Button
                                    size="sm"
                                    colorScheme="purple"
                                    variant="outline"
                                    isDisabled={
                                      attendee.status === "checked-in" ||
                                      attendee.status === "cancelled"
                                    }
                                  >
                                    Check In
                                  </Button>
                                </HStack>
                              </Td>
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan={5} textAlign="center" py={4}>
                              <Text color="gray.500">
                                No attendees found matching the filters
                              </Text>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      ) : (
        <Box textAlign="center" py={10}>
          <Text>Event not found</Text>
          <Button mt={4} onClick={() => navigate("/admin")}>
            Back to Dashboard
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CheckInDashboard;
