import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Divider,
  Flex,
  Badge,
  Radio,
  RadioGroup,
  Icon,
} from "@chakra-ui/react";
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
import { FaCoins } from "react-icons/fa";
import { TransactionStatus } from "./TransactionStatus";

interface PaymentMethodProps {
  totalAmount: number;
  currency: string;
  onPay: () => void;
  isProcessing: boolean;
  onBack: () => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  totalAmount,
  currency,
  onPay,
  isProcessing,
  onBack,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("idrx");
  const bgColor = "white";
  const borderColor = "gray.200";

  // Mock wallet balance
  const walletBalance = 1000; // IDRX

  return (
    <VStack
      spacing={6}
      align="stretch"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      boxShadow="sm"
    >
      <Heading size="md">Complete Your Purchase</Heading>

      {isProcessing ? (
        <TransactionStatus status="processing" />
      ) : (
        <>
          <Box>
            <Heading size="sm" mb={3}>
              Payment Method
            </Heading>

            <RadioGroup
              onChange={setPaymentMethod}
              value={paymentMethod}
              name="payment-methods"
            >
              <VStack spacing={3} align="stretch">
                {/* IDRX Payment Option */}
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={
                    paymentMethod === "idrx" ? "lummy.purple.300" : borderColor
                  }
                  p={4}
                  cursor="pointer"
                  _hover={{ borderColor: "lummy.purple.300" }}
                  position="relative"
                  bg={paymentMethod === "idrx" ? "lummy.purple.50" : "white"}
                >
                  <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Radio
                        value="idrx"
                        colorScheme="purple"
                        isChecked={paymentMethod === "idrx"}
                      />
                      <Box
                        boxSize="32px"
                        borderRadius="full"
                        bg="blue.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaCoins} color="blue.500" />
                      </Box>
                      <Text fontWeight="medium">IDRX Stablecoin</Text>
                    </HStack>

                    <Badge colorScheme="green" variant="subtle">
                      Recommended
                    </Badge>
                  </Flex>

                  {paymentMethod === "idrx" && (
                    <Box mt={3} px={8}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" color="gray.600">
                          Wallet Balance:
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={
                            walletBalance >= totalAmount
                              ? "green.500"
                              : "red.500"
                          }
                        >
                          {currency} {walletBalance.toLocaleString()}
                        </Text>
                      </HStack>

                      {walletBalance < totalAmount && (
                        <HStack
                          bg="red.50"
                          p={2}
                          borderRadius="md"
                          fontSize="xs"
                          color="red.600"
                          mt={2}
                        >
                          <InfoIcon />
                          <Text>
                            Insufficient balance. Please top up your wallet
                            before proceeding.
                          </Text>
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="outline"
                            as="a"
                            href="https://xellar.co"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Top Up
                          </Button>
                        </HStack>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Other payment options could be added here */}
              </VStack>
            </RadioGroup>
          </Box>

          <Divider />

          <Box>
            <Heading size="sm" mb={3}>
              Payment Details
            </Heading>

            <VStack
              spacing={3}
              align="stretch"
              bg="gray.50"
              p={4}
              borderRadius="md"
            >
              <HStack justify="space-between">
                <Text>Amount</Text>
                <Text fontWeight="medium">
                  {currency} {totalAmount.toLocaleString()}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text>Network Fee</Text>
                <Text fontSize="sm" color="gray.600">
                  Free
                </Text>
              </HStack>

              <Divider borderColor="gray.300" />

              <HStack justify="space-between">
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold" color="lummy.purple.600">
                  {currency} {totalAmount.toLocaleString()}
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Box bg="blue.50" p={4} borderRadius="md">
            <HStack spacing={3} align="start">
              <InfoIcon boxSize={5} color="blue.500" mt={1} />
              <Box>
                <Text fontWeight="medium" color="blue.700">
                  Secure Blockchain Transaction
                </Text>
                <Text fontSize="sm" color="blue.600">
                  Your payment will be processed on the Lisk blockchain with
                  IDRX stablecoin. This ensures a secure and transparent
                  transaction with verification on the blockchain.
                </Text>
              </Box>
            </HStack>
          </Box>

          <Flex justify="space-between" mt={2}>
            <Button
              variant="outline"
              colorScheme="purple"
              size="lg"
              onClick={onBack}
              isDisabled={isProcessing}
              leftIcon={<ArrowBackIcon />}
            >
              Back to Review
            </Button>
            <Button
              colorScheme="purple"
              size="lg"
              onClick={onPay}
              isDisabled={walletBalance < totalAmount}
              isLoading={isProcessing}
              loadingText="Processing..."
              _hover={{
                bg: isProcessing ? "purple.500" : "purple.600",
              }}
            >
              Complete Payment
            </Button>
          </Flex>
        </>
      )}
    </VStack>
  );
};

export default PaymentMethod;
