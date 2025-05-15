import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  SimpleGrid,
  Divider,
  Button,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepSeparator,
  useSteps,
  Text,
} from "@chakra-ui/react";
import { OrderSummary } from "../../components/checkout/OrderSummary";
import { PaymentMethod } from "../../components/checkout/PaymentMethod";
import { WalletConnect } from "../../components/checkout/WalletConnect";
import { PaymentConfirmation } from "../../components/checkout/PaymentConfirmation";
import { mockEvents } from "../../data/mockEvents";
import { Event, TicketTier } from "../../types/Event";
import { useWallet } from "../../hooks/useWallet";
import { TokenBalance } from "../../components/wallet";

// This will be replaced with an API call in a real application
const fetchEventById = (id: string): Promise<Event | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find((e) => e.id === id);
      resolve(event);
    }, 300);
  });
};

// Steps for the checkout process
const steps = [
  { title: "Connect Wallet" },
  { title: "Review Order" },
  { title: "Payment" },
  { title: "Confirmation" },
];

export interface CheckoutState {
  tierId: string;
  quantity: number;
  isCompact?: boolean;
  showRefresh?: boolean;
}

export const CheckoutPage: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Get checkout state from navigation or fallback
  const checkoutState = location.state as CheckoutState | null;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [quantity, setQuantity] = useState<number>(
    checkoutState?.quantity || 1
  );
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");

  // Stepper control
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Wallet integration - using only what we need and removing unused variables
  const { isConnected, wallet } = useWallet();
  // Removed unused variables: hasEnoughBalance, buyTicket

  // Update stepper when wallet is connected
  useEffect(() => {
    if (isConnected && wallet && activeStep === 0) {
      setIsWalletConnected(true);
      setActiveStep(1); // Skip to review step if wallet is already connected
    }
  }, [isConnected, wallet, activeStep, setActiveStep]);

  useEffect(() => {
    const getEvent = async () => {
      if (eventId) {
        try {
          const eventData = await fetchEventById(eventId);
          setEvent(eventData || null);

          // Set the selected tier if we have one from navigation
          if (eventData && checkoutState?.tierId) {
            const tier = eventData.ticketTiers?.find(
              (t) => t.id === checkoutState.tierId
            );
            if (tier) {
              setSelectedTier(tier);
            }
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching event:", error);
          toast({
            title: "Error loading event",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
        }
      }
    };

    getEvent();
  }, [eventId, checkoutState, toast]);

  // If no checkout state, redirect back to event
  useEffect(() => {
    if (!loading && !checkoutState) {
      navigate(`/event/${eventId}`);
      toast({
        title: "Please select tickets first",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [loading, checkoutState, navigate, eventId, toast]);

  // Mock wallet connection for development purposes
  const handleConnectWallet = async () => {
    setIsWalletLoading(true);

    // Simulate wallet connection
    setTimeout(() => {
      setIsWalletConnected(true);
      setIsWalletLoading(false);
      setActiveStep(1); // Move to Review Order step

      toast({
        title: "Wallet connected",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };

  const handleBackToReview = () => {
    setActiveStep(1); // Go back to review step
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);

    if (!eventId || !selectedTier) {
      toast({
        title: "Error processing payment",
        description: "Missing event or ticket information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsProcessingPayment(false);
      return;
    }

    // Check if we have enough balance (simulation)
    const simulatedBalance = 1000; // Example value
    const totalPrice = getTotalPrice();

    if (simulatedBalance < totalPrice) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${selectedTier.currency} ${totalPrice} to complete this purchase`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsProcessingPayment(false);
      return;
    }

    // Simulate transaction for development
    setTimeout(() => {
      // Generate a mock transaction hash
      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 62);
      setTransactionHash(mockTxHash);
      setIsProcessingPayment(false);
      setActiveStep(3); // Move to confirmation step

      toast({
        title: "Payment successful",
        description: "Your tickets have been minted as NFTs",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }, 3000);
  };

  const handleGoToTickets = () => {
    navigate("/tickets");
  };

  const getTotalPrice = (): number => {
    if (selectedTier) {
      return selectedTier.price * quantity;
    }
    return 0;
  };

  if (loading || !event || !selectedTier) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8}>
          <Heading size="lg">Loading checkout...</Heading>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Checkout</Heading>

        {/* Stepper */}
        <Box>
          <Stepper index={activeStep} colorScheme="purple">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink={0}>
                  <StepTitle>{step.title}</StepTitle>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 3 ? (
          // Full width confirmation step
          <Box width="100%">
            <PaymentConfirmation
              event={event}
              tier={selectedTier}
              quantity={quantity}
              transactionHash={transactionHash}
              onViewTickets={handleGoToTickets}
            />
          </Box>
        ) : (
          // Two-column layout for other steps
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {/* Left side - Step content */}
            <Box>
              {activeStep === 0 && (
                <WalletConnect
                  onConnect={handleConnectWallet}
                  isLoading={isWalletLoading}
                  isConnected={isWalletConnected}
                  walletAddress={wallet?.address}
                />
              )}

              {activeStep === 1 && (
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Review Your Order</Heading>
                  <OrderSummary
                    event={event}
                    tier={selectedTier}
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                  />
                  <Button
                    colorScheme="purple"
                    size="lg"
                    onClick={() => setActiveStep(2)}
                    mt={4}
                  >
                    Continue to Payment
                  </Button>
                </VStack>
              )}

              {activeStep === 2 && (
                <PaymentMethod
                  totalAmount={getTotalPrice()}
                  currency={selectedTier.currency}
                  onPay={handlePayment}
                  isProcessing={isProcessingPayment}
                  onBack={handleBackToReview}
                />
              )}
            </Box>

            {/* Right side - Order summary */}
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              bg="white"
              boxShadow="sm"
            >
              <VStack spacing={4} align="stretch">
                <Heading size="md">Order Summary</Heading>
                <HStack justify="space-between">
                  <Box>
                    <Heading size="sm">{event.title}</Heading>
                    <Box fontSize="sm" color="gray.600">
                      {selectedTier.name} × {quantity}
                    </Box>
                  </Box>
                  <Box fontWeight="bold">
                    {selectedTier.currency}{" "}
                    {(selectedTier.price * quantity).toLocaleString()}
                  </Box>
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <Box fontWeight="bold">Total</Box>
                  <Box fontWeight="bold">
                    {selectedTier.currency} {getTotalPrice().toLocaleString()}
                  </Box>
                </HStack>

                {isWalletConnected && (
                  <Box mt={2} bg="gray.50" p={3} borderRadius="md">
                    <HStack justify="space-between">
                      <Text fontSize="sm">Your Balance:</Text>
                      <TokenBalance />
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default CheckoutPage;
