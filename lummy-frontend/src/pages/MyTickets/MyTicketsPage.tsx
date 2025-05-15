import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTicketAlt, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { TicketCard, Ticket } from "../../components/tickets/TicketCard";
import { TicketDetails } from "../../components/tickets/TicketDetails";

// Mock data for tickets
export const mockTickets: Ticket[] = [
  {
    id: "ticket-1",
    eventId: "event-1",
    eventName: "Summer Music Festival",
    eventDate: "2025-06-15T12:00:00",
    eventLocation: "Jakarta Convention Center",
    ticketType: "VIP Pass",
    price: 500,
    currency: "IDRX",
    status: "valid",
    purchaseDate: "2025-03-15T09:48:23",
    tokenId: "NFT-12345678",
    ownerAddress: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    id: "ticket-2",
    eventId: "event-2",
    eventName: "Tech Conference 2025",
    eventDate: "2025-07-25T09:00:00",
    eventLocation: "Digital Hub Bandung",
    ticketType: "Premium Access",
    price: 300,
    currency: "IDRX",
    status: "valid",
    purchaseDate: "2025-04-02T14:32:10",
    tokenId: "NFT-87654321",
    ownerAddress: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    id: "ticket-3",
    eventId: "event-3",
    eventName: "Blockchain Workshop",
    eventDate: "2025-05-10T10:00:00",
    eventLocation: "Blockchain Center Jakarta",
    ticketType: "Workshop Ticket",
    price: 100,
    currency: "IDRX",
    status: "used",
    purchaseDate: "2025-04-28T16:42:39",
    tokenId: "NFT-23456789",
    ownerAddress: "0x1234567890abcdef1234567890abcdef12345678",
  },
    {
    id: "ticket-4",
    eventId: "event-5",
    eventName: "Liga Indonesia Championship Finals",
    eventDate: "2025-05-30T19:00:00",
    eventLocation: "Gelora Bung Karno Stadium",
    ticketType: "VIP Box",
    price: 750,
    currency: "IDRX",
    status: "used",
    purchaseDate: "2025-05-10T10:15:33",
    tokenId: "NFT-C3456789",
    ownerAddress: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    id: "ticket-5",
    eventId: "event-4",
    eventName: "Art Exhibition: Future Visions",
    eventDate: "2025-06-05T11:00:00",
    eventLocation: "Modern Gallery Surabaya",
    ticketType: "Standard Entry",
    price: 75,
    currency: "IDRX",
    status: "transferred",
    purchaseDate: "2025-04-15T11:23:45",
    tokenId: "NFT-34567890",
    ownerAddress: "0x2345678901bcdef2345678901bcdef23456789",
  },
  {
    id: "ticket-6",
    eventId: "event-8",
    eventName: "Southeast Asian Film Festival 2025",
    eventDate: "2025-10-05T18:00:00",
    eventLocation: "CGV Cinemas Grand Indonesia",
    ticketType: "5-Film Pass",
    price: 325,
    currency: "IDRX",
    status: "transferred",
    purchaseDate: "2025-09-01T14:27:56",
    tokenId: "NFT-D4567890",
    ownerAddress: "0x1234567890abcdef1234567890abcdef12345678",
  },
];

export const MyTicketsPage: React.FC = () => {
  const [tickets, _setTickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredTickets(tickets);
    } else {
      const filtered = tickets.filter(
        (ticket) =>
          ticket.eventName.toLowerCase().includes(query) ||
          ticket.ticketType.toLowerCase().includes(query) ||
          ticket.eventLocation.toLowerCase().includes(query)
      );
      setFilteredTickets(filtered);
    }
  };

  const handleShowDetails = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      onOpen();
    }
  };

  const filterByStatus = (status: Ticket["status"] | "all") => {
    if (status === "all") {
      setFilteredTickets(tickets);
    } else {
      const filtered = tickets.filter((ticket) => ticket.status === status);
      setFilteredTickets(filtered);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">My Tickets</Heading>
            <Text color="gray.600">Manage your NFT tickets</Text>
          </Box>

          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </InputGroup>
        </HStack>

        <Tabs colorScheme="purple" variant="enclosed">
          <TabList>
            <Tab onClick={() => filterByStatus("all")}>All Tickets</Tab>
            <Tab onClick={() => filterByStatus("valid")}>
              <HStack>
                <Icon as={FaTicketAlt} />
                <Text>Active</Text>
              </HStack>
            </Tab>
            <Tab onClick={() => filterByStatus("used")}>Used</Tab>
            <Tab onClick={() => filterByStatus("transferred")}>Transferred</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {filteredTickets.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onShowDetails={handleShowDetails}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Icon as={FaTicketAlt} boxSize={10} color="gray.300" />
                  <Text mt={4} color="gray.500">
                    No tickets found
                  </Text>
                </Box>
              )}
            </TabPanel>

            <TabPanel>
              {filteredTickets.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onShowDetails={handleShowDetails}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Icon as={FaCalendarAlt} boxSize={10} color="gray.300" />
                  <Text mt={4} color="gray.500">
                    No active tickets
                  </Text>
                </Box>
              )}
            </TabPanel>

            {/* Used Tickets Tab */}
            <TabPanel>
              {filteredTickets.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onShowDetails={handleShowDetails}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Icon as={FaTicketAlt} boxSize={10} color="gray.300" />
                  <Text mt={4} color="gray.500">
                    No used tickets
                  </Text>
                </Box>
              )}
            </TabPanel>

            {/* Transferred Tickets Tab */}
            <TabPanel>
              {filteredTickets.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onShowDetails={handleShowDetails}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Icon as={FaTicketAlt} boxSize={10} color="gray.300" />
                  <Text mt={4} color="gray.500">
                    No transferred tickets
                  </Text>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Ticket Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ticket Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTicket && <TicketDetails ticket={selectedTicket} />}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default MyTicketsPage;
