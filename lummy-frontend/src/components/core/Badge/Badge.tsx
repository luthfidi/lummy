import React from "react";
import { Badge as ChakraBadge, BadgeProps } from "@chakra-ui/react";

export interface LummyBadgeProps extends BadgeProps {
  variant?: "solid" | "subtle" | "outline";
  colorScheme?: string;
}

export const Badge: React.FC<LummyBadgeProps> = ({
  children,
  variant = "subtle",
  colorScheme = "gray",
  ...rest
}) => {
  return (
    <ChakraBadge
      variant={variant}
      colorScheme={colorScheme}
      borderRadius="full"
      px={2}
      py={1}
      {...rest}
    >
      {children}
    </ChakraBadge>
  );
};

export default Badge;
