import React from "react";
import { Flex, Text, Select } from "@chakra-ui/react";

interface EventsSorterProps {
  isLoading: boolean;
  totalCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const EventsSorter: React.FC<EventsSorterProps> = ({
  isLoading,
  totalCount,
  sortBy,
  onSortChange,
}) => {
  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Text fontWeight="medium" color="gray.600">
        {isLoading ? "Loading events..." : `Showing ${totalCount} events`}
      </Text>
      <Select
        width="200px"
        placeholder="Sort by"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        size="sm"
      >
        <option value="date-asc">Date: Soonest first</option>
        <option value="date-desc">Date: Latest first</option>
        <option value="price-asc">Price: Low to high</option>
        <option value="price-desc">Price: High to low</option>
        <option value="name-asc">Name: A to Z</option>
      </Select>
    </Flex>
  );
};

export default EventsSorter;
