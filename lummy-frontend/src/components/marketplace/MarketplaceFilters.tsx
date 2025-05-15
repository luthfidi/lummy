import React, { useState } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaSearch, FaTimes } from "react-icons/fa";

export interface MarketplaceFiltersValue {
  search: string;
  category: string;
  date: string;
  location: string;
  sortBy: string;
}

interface MarketplaceFiltersProps {
  onFilterChange: (filters: MarketplaceFiltersValue) => void;
  categories: string[];
  locations: string[];
}

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  onFilterChange,
  categories,
  locations,
}) => {
  const [filters, setFilters] = useState<MarketplaceFiltersValue>({
    search: "",
    category: "",
    date: "",
    location: "",
    sortBy: "newest",
  });

  const bgColor = "white";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setFilters((prev) => ({ ...prev, search }));
    onFilterChange({ ...filters, search });
  };

  const handleSelectChange = (
    field: keyof MarketplaceFiltersValue,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    onFilterChange({ ...filters, [field]: value });
  };

  const resetFilters = () => {
    const resetFilters: MarketplaceFiltersValue = {
      search: "",
      category: "",
      date: "",
      location: "",
      sortBy: "newest",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Box mb={6}>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search resale tickets..."
          value={filters.search}
          onChange={handleSearchChange}
          bg={bgColor}
          borderRadius="md"
        />
      </InputGroup>

      <Flex
        gap={3}
        flexWrap={{ base: "wrap", md: "nowrap" }}
        justify="space-between"
        align="center"
      >
        <Select
          placeholder="All Categories"
          value={filters.category}
          onChange={(e) => handleSelectChange("category", e.target.value)}
          bg={bgColor}
          size="md"
          borderRadius="md"
          flex={{ base: "1 0 100%", md: 1 }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Select
          placeholder="All Locations"
          value={filters.location}
          onChange={(e) => handleSelectChange("location", e.target.value)}
          bg={bgColor}
          size="md"
          borderRadius="md"
          flex={{ base: "1 0 100%", md: 1 }}
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>

        <Input
          type="date"
          value={filters.date}
          onChange={(e) => handleSelectChange("date", e.target.value)}
          bg={bgColor}
          size="md"
          borderRadius="md"
          flex={{ base: "1 0 100%", md: 1 }}
        />

        <Select
          value={filters.sortBy}
          onChange={(e) => handleSelectChange("sortBy", e.target.value)}
          bg={bgColor}
          size="md"
          borderRadius="md"
          flex={{ base: "1 0 100%", md: 1 }}
        >
          <option value="newest">Newest Listings</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="date_close">Event Date: Soonest</option>
          <option value="best_deal">Best Deal</option>
        </Select>

        <Button
          variant="outline"
          colorScheme="blue"
          leftIcon={<Icon as={FaTimes} />}
          onClick={resetFilters}
          size="md"
          borderRadius="md"
          flex={{ base: "1 0 auto", md: "0 0 auto" }}
          ml={{ base: "auto", md: 0 }}
        >
          Reset
        </Button>
      </Flex>
    </Box>
  );
};

export default MarketplaceFilters;
