import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Badge,
  Select,
  HStack,
  VStack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FaTicketAlt } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import QrScanner from "../../components/ticketManagement/QrScanner";
import AttendeeVerification from "../../components/ticketManagement/AttendeeVerification";

// Mock data for ticket verification result
interface MockAttendeeData {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  walletAddress: string;
  status: "valid" | "invalid" | "checked-in";
  checkInTime?: string;
}

const mockAttendeeData: MockAttendeeData = {
  id: "att-12345",
  name: "John Smith",
  email: "john.smith@example.com",
  ticketType: "VIP Pass",
  eventName: "Summer Music Festival",
  eventDate: "2025-06-15T12:00:00",
  eventLocation: "Jakarta Convention Center",
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
  status: "valid",
};

interface ScanResult {
  valid: boolean;
  ticketId: string;
  eventId: string;
  error?: string;
  attendeeData?: MockAttendeeData;
}

const ScannerPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attendeeData, setAttendeeData] = useState<MockAttendeeData | null>(
    null
  );
  const [scanHistory, setScanHistory] = useState<
    Array<{
      time: Date;
      attendee: string;
      status: "success" | "failed";
    }>
  >([]);

  const [filterStatus, setFilterStatus] = useState<string>("all");

  const cardBg = "white";

  // For demo purposes, let's simulate fetching event details
  const [eventDetails, setEventDetails] = useState<{
    name: string;
    date: string;
    totalAttendees: number;
    checkedIn: number;
  } | null>(null);

  useEffect(() => {
    // Simulate API call to get event details
    setTimeout(() => {
      setEventDetails({
        name: "Summer Music Festival",
        date: "June 15, 2025",
        totalAttendees: 500,
        checkedIn: 320,
      });
    }, 1000);
  }, [eventId]);

  const handleScan = (result: ScanResult) => {
    setIsLoading(true);

    // Simulate API call to verify ticket
    setTimeout(() => {
      if (result.valid) {
        const validAttendee: MockAttendeeData = {
          ...mockAttendeeData,
          name: `Attendee ${Math.floor(Math.random() * 100)}`,
          status: "valid",
        };
        setAttendeeData(validAttendee);

        // Add to scan history
        setScanHistory((prev) => [
          {
            time: new Date(),
            attendee: validAttendee.name,
            status: "success",
          },
          ...prev.slice(0, 9), // Keep only last 10 items
        ]);
      } else {
        const invalidAttendee: MockAttendeeData = {
          ...mockAttendeeData,
          name: `Attendee ${Math.floor(Math.random() * 100)}`,
          status: "invalid",
        };
        setAttendeeData(invalidAttendee);

        // Add to scan history
        setScanHistory((prev) => [
          {
            time: new Date(),
            attendee: invalidAttendee.name,
            status: "failed",
          },
          ...prev.slice(0, 9),
        ]);
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleCheckIn = () => {
    setIsLoading(true);

    // Simulate API call to check in
    setTimeout(() => {
      if (attendeeData) {
        const updatedAttendee: MockAttendeeData = {
          ...attendeeData,
          status: "checked-in",
          checkInTime: new Date().toLocaleTimeString(),
        };
        setAttendeeData(updatedAttendee);

        toast({
          title: "Check-in successful",
          description: `${attendeeData.name} has been checked in.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Add to scan history
        setScanHistory((prev) => [
          {
            time: new Date(),
            attendee: attendeeData.name,
            status: "success",
          },
          ...prev.slice(0, 9),
        ]);

        if (eventDetails) {
          setEventDetails({
            ...eventDetails,
            checkedIn: eventDetails.checkedIn + 1,
          });
        }
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleReject = (attendeeId: string, reason: string) => {
    // Simulate API call to mark ticket as rejected
    console.log(`Rejecting attendee ${attendeeId}, reason: ${reason}`);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredHistory =
    filterStatus === "all"
      ? scanHistory
      : scanHistory.filter((item) =>
          filterStatus === "success"
            ? item.status === "success"
            : item.status === "failed"
        );

  return (
    <Container maxW="container.xl" py={8}>
      <Flex mb={6} justify="space-between" align="center">
        <HStack>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => navigate(`/admin/events/${eventId}`)}
          >
            Back
          </Button>
          <Heading size="lg">Ticket Scanner</Heading>
        </HStack>

        {eventDetails && (
          <HStack>
            <Badge colorScheme="purple" p={2} borderRadius="md">
              {eventDetails.checkedIn} / {eventDetails.totalAttendees} Checked
              In
            </Badge>
          </HStack>
        )}
      </Flex>

      {eventDetails ? (
        <Text fontSize="lg" color="gray.600" mb={6}>
          {eventDetails.name} • {eventDetails.date}
        </Text>
      ) : (
        <Text fontSize="lg" color="gray.600" mb={6}>
          Loading event details...
        </Text>
      )}

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        <GridItem>
          <VStack spacing={6} align="stretch">
            <QrScanner onScan={handleScan} isLoading={isLoading} />

            <Box bg={cardBg} p={6} borderRadius="lg" shadow="sm">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">
                  <Icon as={FaTicketAlt} mr={2} />
                  Recent Scans
                </Heading>
                <Select
                  size="sm"
                  width="120px"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </Select>
              </Flex>

              {filteredHistory.length > 0 ? (
                <VStack spacing={3} align="stretch">
                  {filteredHistory.map((scan, index) => (
                    <Flex
                      key={index}
                      justify="space-between"
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={
                        scan.status === "success" ? "green.200" : "red.200"
                      }
                      bg={scan.status === "success" ? "green.50" : "red.50"}
                    >
                      <HStack>
                        <Badge
                          colorScheme={
                            scan.status === "success" ? "green" : "red"
                          }
                        >
                          {scan.status === "success" ? "Success" : "Failed"}
                        </Badge>
                        <Text fontWeight="medium">{scan.attendee}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        {formatTime(scan.time)}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>
                  No scan history available
                </Text>
              )}
            </Box>
          </VStack>
        </GridItem>

        <GridItem>
          <Box position="relative">
            <AttendeeVerification
              attendee={attendeeData}
              onCheckIn={handleCheckIn}
              onReject={handleReject}
              isLoading={isLoading}
            />
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ScannerPage;
