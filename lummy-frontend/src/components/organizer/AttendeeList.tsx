import React, { useState } from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Text,
  Button,
  Select,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import {
  SearchIcon,
  ChevronDownIcon,
  CheckIcon,
  DownloadIcon,
  EmailIcon,
  CopyIcon,
  ViewIcon,
} from "@chakra-ui/icons";

export interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  purchaseDate: string;
  status: "confirmed" | "checked-in" | "cancelled" | "refunded";
  walletAddress: string;
}

interface AttendeeListProps {
  attendees: Attendee[];
  onCheckIn: (attendeeId: string) => void;
  onExport: () => void;
}

const AttendeeList: React.FC<AttendeeListProps> = ({
  attendees,
  onCheckIn,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const tableHeadBg = "gray.50";
  const hoverBg = "gray.50";

  // Get unique ticket types for filter
  const ticketTypes = [...new Set(attendees.map((a) => a.ticketType))];

  // Filter attendees based on search and filters
  const filteredAttendees = attendees.filter((attendee) => {
    // Search filter
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.walletAddress.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || attendee.status === statusFilter;

    // Type filter
    const matchesType =
      typeFilter === "all" || attendee.ticketType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge color
  const getStatusColor = (status: Attendee["status"]): string => {
    switch (status) {
      case "confirmed":
        return "blue";
      case "checked-in":
        return "green";
      case "cancelled":
        return "red";
      case "refunded":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Box overflowX="auto">
      <Flex
        justify="space-between"
        mb={4}
        direction={{ base: "column", md: "row" }}
        gap={2}
      >
        <InputGroup maxW={{ base: "100%", md: "320px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name, email, or wallet"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <HStack spacing={2}>
          <Select
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            maxW="150px"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked-in">Checked In</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </Select>

          <Select
            placeholder="All Ticket Types"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            maxW="170px"
          >
            <option value="all">All Ticket Types</option>
            {ticketTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Button
            leftIcon={<DownloadIcon />}
            onClick={onExport}
            colorScheme="purple"
            variant="outline"
          >
            Export
          </Button>
        </HStack>
      </Flex>

      <Box borderWidth="1px" borderRadius="md" overflow="hidden">
        <Table variant="simple" size="sm">
          <Thead bg={tableHeadBg}>
            <Tr>
              <Th>Attendee</Th>
              <Th>Ticket</Th>
              <Th>Purchase Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee) => {
                // For wallet address copy to clipboard
                const { hasCopied, onCopy } = useClipboard(
                  attendee.walletAddress
                );

                return (
                  <Tr key={attendee.id} _hover={{ bg: hoverBg }}>
                    <Td>
                      <Box>
                        <Text fontWeight="medium">{attendee.name}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {attendee.email}
                        </Text>
                        <HStack fontSize="xs" color="gray.500" mt={1}>
                          <Text isTruncated maxW="120px">
                            {attendee.walletAddress}
                          </Text>
                          <Tooltip
                            label={hasCopied ? "Copied!" : "Copy address"}
                          >
                            <IconButton
                              icon={<CopyIcon />}
                              aria-label="Copy wallet address"
                              size="xs"
                              variant="ghost"
                              onClick={onCopy}
                            />
                          </Tooltip>
                        </HStack>
                      </Box>
                    </Td>
                    <Td>
                      <Badge colorScheme="purple">{attendee.ticketType}</Badge>
                    </Td>
                    <Td>{formatDate(attendee.purchaseDate)}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(attendee.status)}>
                        {attendee.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          size="xs"
                          variant="outline"
                        >
                          Actions
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            icon={<ViewIcon />}
                            onClick={() => {
                              /* View details */
                            }}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<EmailIcon />}
                            onClick={() => {
                              /* Send email */
                            }}
                          >
                            Send Email
                          </MenuItem>
                          {attendee.status === "confirmed" && (
                            <MenuItem
                              icon={<CheckIcon />}
                              onClick={() => onCheckIn(attendee.id)}
                            >
                              Check In
                            </MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" py={4}>
                  <Text color="gray.500">No attendees found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Text fontSize="sm" color="gray.500" mt={2}>
        Showing {filteredAttendees.length} of {attendees.length} attendees
      </Text>
    </Box>
  );
};

export default AttendeeList;
