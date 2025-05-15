import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export interface CardProps extends BoxProps {
  children: React.ReactNode;
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  isHoverable = false,
  ...rest
}) => {
  return (
    <Box
      p={4}
      borderRadius="xl"
      bg="white"
      boxShadow="base"
      transition="all 0.3s"
      _hover={
        isHoverable
          ? {
              transform: "translateY(-4px)",
              boxShadow: "md",
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;
