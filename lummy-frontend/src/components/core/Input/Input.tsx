import React from "react";
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

export interface InputProps extends Omit<ChakraInputProps, "size"> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorMessage,
  isInvalid,
  size = "md",
  ...rest
}) => {
  return (
    <FormControl isInvalid={isInvalid}>
      {label && <FormLabel>{label}</FormLabel>}
      <ChakraInput
        size={size}
        borderRadius="md"
        focusBorderColor="lummy.purple"
        {...rest}
      />
      {helperText && !isInvalid && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {errorMessage && isInvalid && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default Input;
