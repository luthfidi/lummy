import React from "react";
import { Box, Flex, Text, Icon, SimpleGrid } from "@chakra-ui/react";
import {
  FaMusic,
  FaLaptopCode,
  FaFootballBall,
  FaPaintBrush,
  FaGraduationCap,
  FaUtensils,
  FaFilm,
  FaTheaterMasks,
} from "react-icons/fa";

interface CategoryItem {
  name: string;
  icon: React.ElementType;
  color: string;
}

interface CategoryNavProps {
  onCategorySelect: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ onCategorySelect }) => {
  const categories: CategoryItem[] = [
    { name: "Music", icon: FaMusic, color: "purple.500" },
    { name: "Technology", icon: FaLaptopCode, color: "blue.500" },
    { name: "Sports", icon: FaFootballBall, color: "green.500" },
    { name: "Art", icon: FaPaintBrush, color: "pink.500" },
    { name: "Education", icon: FaGraduationCap, color: "yellow.500" },
    { name: "Food", icon: FaUtensils, color: "orange.500" },
    { name: "Movies", icon: FaFilm, color: "red.500" },
    { name: "Theater", icon: FaTheaterMasks, color: "teal.500" },
  ];

  const borderColor = "gray.300";
  const hoverBorder = "gray.500";
  const bgHover = "gray.50";

  return (
    <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
      {categories.map((category) => (
        <Box
          key={category.name}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          p={4}
          textAlign="center"
          cursor="pointer"
          transition="all 0.3s"
          boxShadow="sm"
          _hover={{
            transform: "translateY(-4px)",
            borderColor: hoverBorder,
            boxShadow: "md",
            bg: bgHover,
          }}
          onClick={() => onCategorySelect(category.name)}
        >
          <Flex
            justify="center"
            align="center"
            h="50px"
            w="50px"
            borderRadius="full"
            border="2px solid"
            borderColor={category.color}
            color={category.color}
            mx="auto"
            mb={2}
          >
            <Icon as={category.icon} boxSize={5} />
          </Flex>
          <Text fontWeight="medium" mt={2}>
            {category.name}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default CategoryNav;
