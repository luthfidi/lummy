import React from "react";
import {
  Box,
  VStack,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  Select,
  Button,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { FaFilter, FaSearch } from "react-icons/fa";

interface EventsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  categories: string[];
  locations: string[];
  statuses: string[];
  onReset: () => void;
}

const EventsFilter: React.FC<EventsFilterProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  locationFilter,
  onLocationChange,
  dateFilter,
  onDateChange,
  statusFilter,
  onStatusChange,
  categories,
  locations,
  statuses,
  onReset,
}) => {
  const bgColor = "white";
  const borderColor = "gray.200";
  const resetBgColor = "purple.50";
  const resetColor = "purple.600";

  return (
    <Box bg={bgColor} borderRadius="lg">
      <VStack spacing={4}>
        {/* Search Bar */}
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search events, artists, or venues"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </InputGroup>

        {/* Filter Controls */}
        <Flex
          direction={{ base: "column", md: "row" }}
          width="100%"
          gap={4}
          align="center"
          justify="space-between"
        >
          <Flex gap={4} direction={{ base: "column", md: "row" }} flex="1">
            <Select
              placeholder="Category"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              flex="1"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => onLocationChange(e.target.value)}
              flex="1"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>

            <Input
              type="date"
              placeholder="Date"
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              flex="1"
            />
          </Flex>

          <HStack spacing={4}>
            <Box position="relative" width={{ base: "full", md: "200px" }}>
              <Select
                placeholder="Status"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                pr="10"
                icon={<Icon as={FaFilter} color="gray.500" />}
                borderColor={borderColor}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Select>
            </Box>

            <Button
              bg={resetBgColor}
              color={resetColor}
              _hover={{ bg: "purple.100" }}
              borderWidth="1px"
              borderColor={borderColor}
              fontWeight="medium"
              onClick={onReset}
              borderRadius="md"
              px={6}
            >
              Reset
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default EventsFilter;
