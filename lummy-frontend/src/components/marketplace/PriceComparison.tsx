import React from "react";
import {
  Box,
  HStack,
  Text,
  Flex,
  Icon,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaEquals } from "react-icons/fa";

interface PriceComparisonProps {
  originalPrice: number;
  resalePrice: number;
  currency: string;
  showDetail?: boolean;
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({
  originalPrice,
  resalePrice,
  currency,
  showDetail = true,
}) => {
  const priceDifference = resalePrice - originalPrice;
  const percentageDifference = (priceDifference / originalPrice) * 100;

  const getPriceChangeIcon = () => {
    if (priceDifference > 0) return { icon: FaArrowUp, color: "red.500" };
    if (priceDifference < 0) return { icon: FaArrowDown, color: "green.500" };
    return { icon: FaEquals, color: "gray.500" };
  };

  const { icon, color } = getPriceChangeIcon();

  return (
    <Box>
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color="gray.500">
            Resale Price
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="blue.600">
            {currency} {resalePrice.toLocaleString()}
          </Text>
        </VStack>

        <Tooltip
          label={`Original price: ${currency} ${originalPrice.toLocaleString()}`}
          hasArrow
        >
          <HStack>
            <Icon as={icon} color={color} />
            <Text color={color} fontWeight="medium">
              {priceDifference > 0 ? "+" : ""}
              {percentageDifference.toFixed(0)}%
            </Text>
          </HStack>
        </Tooltip>
      </Flex>

      {showDetail && (
        <HStack mt={1} fontSize="xs" color="gray.500">
          <Text>Original price:</Text>
          <Text>
            {currency} {originalPrice.toLocaleString()}
          </Text>
        </HStack>
      )}
    </Box>
  );
};

export default PriceComparison;
