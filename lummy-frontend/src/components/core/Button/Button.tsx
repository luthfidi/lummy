import React from "react";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

export interface LummyButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<LummyButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  ...rest
}) => {
  return (
    <ChakraButton variant={variant} size={size} {...rest}>
      {children}
    </ChakraButton>
  );
};

export default Button;
