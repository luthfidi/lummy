// src/pages/Events/EventsPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EventCard } from "../../components/core/Card";
import { mockEvents } from "../../data/mockEvents";
import { Event } from "../../types/Event";
import { EventsFilter, EventsSorter } from "../../components/events";

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useBlockchain, setUseBlockchain] = useState(false);
  const [hasTriedBlockchain, setHasTriedBlockchain] = useState(false);

  // Extract URL parameters
  const categoryFromUrl = searchParams.get("category") || "";
  const searchFromUrl = searchParams.get("search") || "";

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl);
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");

  // Simple one-time blockchain attempt
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);

      // If we haven't tried blockchain yet, try once
      if (!hasTriedBlockchain && !useBlockchain) {
        try {

          
          // Try to get events from blockchain - but only once
          setHasTriedBlockchain(true);
          
          // For now, just use mock data to prevent loops
          // In production, you would implement proper blockchain fetching here
          console.log("Attempting blockchain connection...");
          
          // Simulate blockchain attempt
          setTimeout(() => {
            console.log("Blockchain connection failed, using mock data");
            setEvents(mockEvents);
            setFilteredEvents(mockEvents);
            setIsLoading(false);
          }, 1000);
          
        } catch (error) {
          console.log("Blockchain not available, using mock data");
          setEvents(mockEvents);
          setFilteredEvents(mockEvents);
          setIsLoading(false);
        }
      } else {
        // Use mock data directly
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []); // Empty dependency array - only run once

  // Handle manual blockchain retry
  const handleRetryBlockchain = async () => {
    setIsLoading(true);
    setUseBlockchain(true);
    
    try {
      // Here you would implement actual blockchain fetching
      // For now, just show mock data after delay
      setTimeout(() => {
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Blockchain retry failed:", error);
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }
  };

  // Filter events whenever filter criteria changes
  useEffect(() => {
    if (events.length === 0) return;

    let filtered = [...events];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter((event) => event.location === locationFilter);
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toISOString().split("T")[0];
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date).toISOString().split("T")[0];
        return eventDate === filterDate;
      });
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // Apply sorting
    filtered = sortEvents(filtered, sortBy);

    setFilteredEvents(filtered);
  }, [
    events,
    searchQuery,
    categoryFilter,
    locationFilter,
    dateFilter,
    statusFilter,
    sortBy,
  ]);

  const sortEvents = (eventsToSort: Event[], sortMethod: string): Event[] => {
    const sorted = [...eventsToSort];

    switch (sortMethod) {
      case "date-asc":
        return sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "date-desc":
        return sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setLocationFilter("");
    setDateFilter("");
    setStatusFilter("");
  };

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (categoryFilter) params.set("category", categoryFilter);
    if (locationFilter) params.set("location", locationFilter);
    if (dateFilter) params.set("date", dateFilter);
    if (statusFilter) params.set("status", statusFilter);

    const newParams = params.toString();
    const currentParams = searchParams.toString();
    
    if (newParams !== currentParams) {
      setSearchParams(params, { replace: true });
    }
  }, [
    searchQuery,
    categoryFilter,
    locationFilter,
    dateFilter,
    statusFilter,
    setSearchParams,
    searchParams,
  ]);

  // Extract unique values for filters from current events
  const categories = Array.from(
    new Set(events.map((event) => event.category))
  );

  const locations = Array.from(
    new Set(events.map((event) => event.location))
  );

  const statuses = ["available", "limited", "soldout"];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg">Discover Events</Heading>
          <Text color="gray.600">
            Find and book blockchain-verified tickets for the best events
          </Text>
        </Box>

        {/* Show info about data source */}
        {!useBlockchain && hasTriedBlockchain && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Using Demo Data</AlertTitle>
              <AlertDescription>
                Blockchain connection not available. Showing sample events for demonstration.
              </AlertDescription>
            </Box>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleRetryBlockchain}
              ml={3}
            >
              Try Blockchain
            </Button>
          </Alert>
        )}

        {/* Search and Filter Section */}
        <EventsFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categories={categories}
          locations={locations}
          statuses={statuses}
          onReset={resetFilters}
        />

        {/* Results section */}
        <Box>
          <EventsSorter
            isLoading={isLoading}
            totalCount={filteredEvents.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {isLoading ? (
            // Loading state
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Box key={index} height="380px">
                  <Skeleton height="200px" mb={2} />
                  <Skeleton height="20px" width="80%" mb={2} />
                  <Skeleton height="20px" width="60%" mb={2} />
                  <Skeleton height="20px" width="40%" mb={2} />
                </Box>
              ))}
            </SimpleGrid>
          ) : filteredEvents.length > 0 ? (
            // Events grid
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event.id)}
                />
              ))}
            </SimpleGrid>
          ) : (
            // No results state
            <Box
              py={12}
              textAlign="center"
              borderWidth="1px"
              borderRadius="lg"
              borderStyle="dashed"
            >
              <VStack spacing={3}>
                <Text fontSize="xl" fontWeight="medium">
                  No events found
                </Text>
                <Text color="gray.600">
                  Try adjusting your search or filter criteria
                </Text>
                <Button
                  mt={4}
                  colorScheme="purple"
                  variant="outline"
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              </VStack>
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default EventsPage;