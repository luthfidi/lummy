import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Textarea,
  Divider,
  Flex,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";

export interface TicketTierInput {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  maxPerPurchase: number;
  benefits: string[];
}

interface TicketTierCreatorProps {
  tiers: TicketTierInput[];
  onChange: (tiers: TicketTierInput[]) => void;
  currency?: string;
}

const TicketTierCreator: React.FC<TicketTierCreatorProps> = ({
  tiers,
  onChange,
  currency = "IDRX",
}) => {
  const toast = useToast();
  const [benefitInput, setBenefitInput] = useState<{ [key: string]: string }>(
    {}
  );

  const bgColor = "white";
  const borderColor = "gray.200";

  const handleAddTier = () => {
    const newTier: TicketTierInput = {
      id: `tier-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      quantity: 100,
      maxPerPurchase: 4,
      benefits: [],
    };
    onChange([...tiers, newTier]);
  };

  const handleRemoveTier = (id: string) => {
    onChange(tiers.filter((tier) => tier.id !== id));
  };

  const handleTierChange = (
    id: string,
    field: keyof TicketTierInput,
    value: any
  ) => {
    const updatedTiers = tiers.map((tier) => {
      if (tier.id === id) {
        return { ...tier, [field]: value };
      }
      return tier;
    });
    onChange(updatedTiers);
  };

  const handleAddBenefit = (id: string) => {
    if (!benefitInput[id] || benefitInput[id].trim() === "") {
      toast({
        title: "Empty benefit",
        description: "Please enter a benefit description",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const tier = tiers.find((t) => t.id === id);
    if (tier) {
      const updatedTier = {
        ...tier,
        benefits: [...tier.benefits, benefitInput[id]],
      };

      handleTierChange(id, "benefits", updatedTier.benefits);
      setBenefitInput({ ...benefitInput, [id]: "" });
    }
  };

  const handleRemoveBenefit = (tierId: string, index: number) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (tier) {
      const updatedBenefits = [...tier.benefits];
      updatedBenefits.splice(index, 1);
      handleTierChange(tierId, "benefits", updatedBenefits);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">
          Ticket Tiers
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="purple"
          size="sm"
          onClick={handleAddTier}
        >
          Add Tier
        </Button>
      </Flex>

      {tiers.length === 0 ? (
        <Box
          p={8}
          borderWidth="1px"
          borderRadius="md"
          borderStyle="dashed"
          borderColor={borderColor}
          textAlign="center"
        >
          <Text color="gray.500">
            No ticket tiers added yet. Click "Add Tier" to create your first
            ticket tier.
          </Text>
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
          {tiers.map((tier, index) => (
            <Box
              key={tier.id}
              p={6}
              borderWidth="1px"
              borderRadius="md"
              bg={bgColor}
              shadow="sm"
            >
              <Flex justify="space-between" mb={4}>
                <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
                  Tier {index + 1}
                </Badge>
                <IconButton
                  aria-label="Remove tier"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemoveTier(tier.id)}
                />
              </Flex>

              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Tier Name</FormLabel>
                  <Input
                    value={tier.name}
                    onChange={(e) =>
                      handleTierChange(tier.id, "name", e.target.value)
                    }
                    placeholder="e.g. General Admission, VIP, Early Bird"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={tier.description}
                    onChange={(e) =>
                      handleTierChange(tier.id, "description", e.target.value)
                    }
                    placeholder="Describe what this ticket tier offers"
                    rows={2}
                  />
                </FormControl>

                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel>Price ({currency})</FormLabel>
                    <NumberInput
                      min={0}
                      value={tier.price}
                      onChange={(_, value) =>
                        handleTierChange(tier.id, "price", value)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Quantity Available</FormLabel>
                    <NumberInput
                      min={1}
                      value={tier.quantity}
                      onChange={(_, value) =>
                        handleTierChange(tier.id, "quantity", value)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Max Per Purchase</FormLabel>
                    <NumberInput
                      min={1}
                      max={10}
                      value={tier.maxPerPurchase}
                      onChange={(_, value) =>
                        handleTierChange(tier.id, "maxPerPurchase", value)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <Divider />

                <FormControl>
                  <FormLabel>Benefits (Optional)</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {tier.benefits.map((benefit, idx) => (
                      <Flex key={idx} align="center">
                        <Text flex="1" fontSize="sm">
                          {benefit}
                        </Text>
                        <IconButton
                          aria-label="Remove benefit"
                          icon={<DeleteIcon />}
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleRemoveBenefit(tier.id, idx)}
                        />
                      </Flex>
                    ))}

                    <HStack>
                      <Input
                        placeholder="Add a benefit (e.g. VIP access, merchandise)"
                        size="sm"
                        value={benefitInput[tier.id] || ""}
                        onChange={(e) =>
                          setBenefitInput({
                            ...benefitInput,
                            [tier.id]: e.target.value,
                          })
                        }
                      />
                      <Button
                        size="sm"
                        leftIcon={<AddIcon />}
                        onClick={() => handleAddBenefit(tier.id)}
                      >
                        Add
                      </Button>
                    </HStack>
                  </VStack>
                </FormControl>
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default TicketTierCreator;
