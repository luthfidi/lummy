import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Divider,
  useToast,
  Textarea,
  IconButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { SearchIcon, ViewIcon, EmailIcon } from "@chakra-ui/icons";

// Mock data for organizer requests
interface OrganizerRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organizerType: string;
  eventCategories: string[];
  experience: string;
  status: "submitted" | "under_review" | "need_more_info" | "approved" | "rejected";
  submittedDate: string;
  description: string;
  estimatedBudget: string;
  estimatedEventsPerYear: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  website?: string;
  address: string;
  previousEvents?: string;
  references?: string;
}

const mockRequests: OrganizerRequest[] = [
  {
    id: "org-req-1",
    fullName: "Jakarta Music Productions",
    email: "info@jakartamusic.com",
    phone: "+62 821 1234 5678",
    organizerType: "PT",
    eventCategories: ["Music", "Art"],
    experience: "3-5 years",
    status: "submitted",
    submittedDate: "2025-01-10T09:30:00",
    description: "We are a music production company specializing in live concerts and music festivals in Jakarta area.",
    estimatedBudget: "100M - 500M",
    estimatedEventsPerYear: "6-12",
    bankName: "Bank BCA",
    accountNumber: "1234567890",
    accountHolder: "Jakarta Music Productions PT",
    website: "https://jakartamusic.com",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    previousEvents: "Jakarta Music Festival 2024, Rock Concert Series",
  },
  {
    id: "org-req-2",
    fullName: "TechHub Indonesia",
    email: "organizer@techhub.id",
    phone: "+62 812 9876 5432",
    organizerType: "CV",
    eventCategories: ["Technology", "Education"],
    experience: "5+ years",
    status: "under_review",
    submittedDate: "2025-01-08T14:20:00",
    description: "Leading technology event organizer focused on startup and innovation conferences.",
    estimatedBudget: "50M - 100M",
    estimatedEventsPerYear: "13-24",
    bankName: "Bank Mandiri",
    accountNumber: "0987654321",
    accountHolder: "TechHub Indonesia CV",
    address: "Jl. Gatot Subroto, Jakarta Selatan",
  },
  {
    id: "org-req-3",
    fullName: "Sarah Wijaya",
    email: "sarah.wijaya@email.com",
    phone: "+62 856 1111 2222",
    organizerType: "Individual",
    eventCategories: ["Workshop", "Education"],
    experience: "1-3 years",
    status: "need_more_info",
    submittedDate: "2025-01-05T11:45:00",
    description: "Individual organizer specializing in creative workshops and educational seminars.",
    estimatedBudget: "< 10M",
    estimatedEventsPerYear: "1-5",
    bankName: "Bank BNI",
    accountNumber: "5555666677",
    accountHolder: "Sarah Wijaya",
    address: "Jl. Kemang Raya, Jakarta Selatan",
  },
];

const OrganizerRequestsAdmin: React.FC = () => {
  const [requests, setRequests] = useState<OrganizerRequest[]>(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState<OrganizerRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<OrganizerRequest | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = [...requests];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.fullName.toLowerCase().includes(query) ||
        req.email.toLowerCase().includes(query) ||
        req.organizerType.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "blue";
      case "under_review": return "orange";
      case "need_more_info": return "yellow";
      case "approved": return "green";
      case "rejected": return "red";
      default: return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted": return "Submitted";
      case "under_review": return "Under Review";
      case "need_more_info": return "Need More Info";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  const handleViewDetails = (request: OrganizerRequest) => {
    setSelectedRequest(request);
    setReviewNote("");
    onOpen();
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (!selectedRequest) return;

    setRequests(prev => prev.map(req =>
      req.id === selectedRequest.id
        ? { ...req, status: newStatus as any }
        : req
    ));

    toast({
      title: "Status Updated",
      description: `Request status changed to ${getStatusLabel(newStatus)}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

  const handleSendMessage = () => {
    if (!selectedRequest || !reviewNote.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedRequest.fullName}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setReviewNote("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">Organizer Requests</Heading>
            <Text color="gray.600">Review and manage organizer applications</Text>
          </Box>
          <Badge colorScheme="purple" p={2} borderRadius="md" fontSize="md">
            {filteredRequests.length} Requests
          </Badge>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
          {[
            { label: "Total", count: requests.length, color: "gray" },
            { label: "Submitted", count: requests.filter(r => r.status === "submitted").length, color: "blue" },
            { label: "Under Review", count: requests.filter(r => r.status === "under_review").length, color: "orange" },
            { label: "Approved", count: requests.filter(r => r.status === "approved").length, color: "green" },
            { label: "Rejected", count: requests.filter(r => r.status === "rejected").length, color: "red" },
          ].map((stat) => (
            <Box key={stat.label} p={4} bg="white" borderRadius="lg" borderWidth="1px">
              <Text fontSize="2xl" fontWeight="bold" color={`${stat.color}.500`}>
                {stat.count}
              </Text>
              <Text fontSize="sm" color="gray.600">{stat.label}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Filters */}
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <InputGroup maxW="400px">
            <InputLeftElement>
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by name, email, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select
            maxW="200px"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="need_more_info">Need More Info</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </Flex>

        {/* Requests Table */}
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Organizer</Th>
                <Th>Type</Th>
                <Th>Categories</Th>
                <Th>Experience</Th>
                <Th>Status</Th>
                <Th>Submitted</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <Tr key={request.id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{request.fullName}</Text>
                        <Text fontSize="sm" color="gray.500">{request.email}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue" variant="subtle">
                        {request.organizerType}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        {request.eventCategories.slice(0, 2).map(cat => (
                          <Badge key={cat} colorScheme="purple" variant="outline" size="sm">
                            {cat}
                          </Badge>
                        ))}
                        {request.eventCategories.length > 2 && (
                          <Text fontSize="xs" color="gray.500">
                            +{request.eventCategories.length - 2} more
                          </Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>{request.experience}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{formatDate(request.submittedDate)}</Text>
                    </Td>
                    <Td>
                      <IconButton
                        icon={<ViewIcon />}
                        aria-label="View Details"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
                    <Text color="gray.500">No requests found</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      {/* Detail Modal */}
      {selectedRequest && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <VStack align="start" spacing={1}>
                <Text>{selectedRequest.fullName}</Text>
                <Badge colorScheme={getStatusColor(selectedRequest.status)}>
                  {getStatusLabel(selectedRequest.status)}
                </Badge>
              </VStack>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <VStack spacing={6} align="stretch">
                {/* Basic Information */}
                <Box>
                  <Heading size="sm" mb={3}>Basic Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Email</Text>
                      <Text fontWeight="medium">{selectedRequest.email}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Phone</Text>
                      <Text fontWeight="medium">{selectedRequest.phone}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Type</Text>
                      <Badge colorScheme="blue">{selectedRequest.organizerType}</Badge>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Experience</Text>
                      <Text fontWeight="medium">{selectedRequest.experience}</Text>
                    </Box>
                  </SimpleGrid>

                  <Box mt={4}>
                    <Text fontSize="sm" color="gray.600">Address</Text>
                    <Text fontWeight="medium">{selectedRequest.address}</Text>
                  </Box>

                  {selectedRequest.website && (
                    <Box mt={4}>
                      <Text fontSize="sm" color="gray.600">Website</Text>
                      <Text fontWeight="medium" color="purple.500">
                        {selectedRequest.website}
                      </Text>
                    </Box>
                  )}
                </Box>

                <Divider />

                {/* Business Information */}
                <Box>
                  <Heading size="sm" mb={3}>Business Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Event Categories</Text>
                      <HStack spacing={1} wrap="wrap">
                        {selectedRequest.eventCategories.map(cat => (
                          <Badge key={cat} colorScheme="purple" variant="outline">
                            {cat}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Events per Year</Text>
                      <Text fontWeight="medium">{selectedRequest.estimatedEventsPerYear}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Budget Range</Text>
                      <Text fontWeight="medium">{selectedRequest.estimatedBudget}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Submitted</Text>
                      <Text fontWeight="medium">{formatDate(selectedRequest.submittedDate)}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Description */}
                <Box>
                  <Heading size="sm" mb={3}>About</Heading>
                  <Text>{selectedRequest.description}</Text>
                </Box>

                {selectedRequest.previousEvents && (
                  <>
                    <Divider />
                    <Box>
                      <Heading size="sm" mb={3}>Previous Events</Heading>
                      <Text>{selectedRequest.previousEvents}</Text>
                    </Box>
                  </>
                )}

                {selectedRequest.references && (
                  <>
                    <Divider />
                    <Box>
                      <Heading size="sm" mb={3}>References</Heading>
                      <Text>{selectedRequest.references}</Text>
                    </Box>
                  </>
                )}

                <Divider />

                {/* Financial Information */}
                <Box>
                  <Heading size="sm" mb={3}>Financial Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Bank</Text>
                      <Text fontWeight="medium">{selectedRequest.bankName}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Account Number</Text>
                      <Text fontWeight="medium" fontFamily="monospace">
                        {selectedRequest.accountNumber}
                      </Text>
                    </Box>
                    <Box gridColumn={{ base: 1, md: "1 / 3" }}>
                      <Text fontSize="sm" color="gray.600">Account Holder</Text>
                      <Text fontWeight="medium">{selectedRequest.accountHolder}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Admin Actions */}
                <Box>
                  <Heading size="sm" mb={3}>Admin Actions</Heading>
                  
                  <VStack spacing={3} align="stretch">
                    <Textarea
                      placeholder="Add a note or message to the organizer..."
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      rows={3}
                    />

                    <HStack spacing={2}>
                      <Button
                        leftIcon={<EmailIcon />}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        onClick={handleSendMessage}
                      >
                        Send Message
                      </Button>
                    </HStack>

                    {selectedRequest.status !== "approved" && selectedRequest.status !== "rejected" && (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Text fontSize="sm">
                          Review the application details and update the status accordingly.
                        </Text>
                      </Alert>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <HStack spacing={3}>
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
                
                {(selectedRequest.status === "submitted" || selectedRequest.status === "under_review") && (
                  <>
                    <Button
                      colorScheme="yellow"
                      onClick={() => handleStatusUpdate("need_more_info")}
                    >
                      Need More Info
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleStatusUpdate("rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      colorScheme="green"
                      onClick={() => handleStatusUpdate("approved")}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default OrganizerRequestsAdmin;