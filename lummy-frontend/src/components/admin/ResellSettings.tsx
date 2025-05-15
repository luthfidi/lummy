import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Divider,
  Button,
  useToast,
} from "@chakra-ui/react";

export interface ResellSettingsData {
  allowResell: boolean;
  maxMarkupPercentage: number;
  organizerFeePercentage: number;
  restrictResellTiming: boolean;
  minDaysBeforeEvent: number;
  requireVerification: boolean;
}

interface ResellSettingsProps {
  settings: ResellSettingsData;
  onSave: (settings: ResellSettingsData) => void;
}

const ResellSettings: React.FC<ResellSettingsProps> = ({
  settings,
  onSave,
}) => {
  const [currentSettings, setCurrentSettings] =
    useState<ResellSettingsData>(settings);
  const [isChanged, setIsChanged] = useState(false);
  const toast = useToast();

  const cardBg = "white";

  const handleChange = (field: keyof ResellSettingsData, value: any) => {
    setCurrentSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsChanged(true);
  };

  const handleSave = () => {
    onSave(currentSettings);
    toast({
      title: "Settings updated",
      description: "Resale settings have been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setIsChanged(false);
  };

  return (
    <Box bg={cardBg} borderRadius="md" p={6} border="2px solid" borderColor="gray.200" rounded="xl">
      <VStack spacing={6} align="stretch" >
        <Text fontSize="xl" fontWeight="bold">
          Ticket Resale Settings
        </Text>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Allow ticket resale</FormLabel>
          <Switch
            colorScheme="purple"
            isChecked={currentSettings.allowResell}
            onChange={(e) => handleChange("allowResell", e.target.checked)}
          />
        </FormControl>

        {currentSettings.allowResell && (
          <>
            <Divider />

            <Box>
              <FormLabel>Maximum Markup Percentage</FormLabel>
              <Text fontSize="sm" color="gray.500" mb={2}>
                Set the maximum percentage above original price that tickets can
                be resold for.
              </Text>
              <Flex>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={currentSettings.maxMarkupPercentage}
                  onChange={(val) => handleChange("maxMarkupPercentage", val)}
                  mr={4}
                  flex={1}
                  colorScheme="purple"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <NumberInput
                  maxW="100px"
                  min={0}
                  max={100}
                  value={currentSettings.maxMarkupPercentage}
                  onChange={(_, val) =>
                    handleChange("maxMarkupPercentage", val)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text ml={2} alignSelf="center">
                  %
                </Text>
              </Flex>
            </Box>

            <Box>
              <FormLabel>Organizer Fee Percentage</FormLabel>
              <Text fontSize="sm" color="gray.500" mb={2}>
                Set the percentage fee you'll receive from each resale
                transaction.
              </Text>
              <Flex>
                <Slider
                  min={0}
                  max={10}
                  step={0.5}
                  value={currentSettings.organizerFeePercentage}
                  onChange={(val) =>
                    handleChange("organizerFeePercentage", val)
                  }
                  mr={4}
                  flex={1}
                  colorScheme="purple"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <NumberInput
                  maxW="100px"
                  min={0}
                  max={10}
                  step={0.5}
                  value={currentSettings.organizerFeePercentage}
                  onChange={(_, val) =>
                    handleChange("organizerFeePercentage", val)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text ml={2} alignSelf="center">
                  %
                </Text>
              </Flex>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Note: Lummy platform fee (1%) is applied automatically to all
                resales.
              </Text>
            </Box>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Restrict resale timing</FormLabel>
              <Switch
                colorScheme="purple"
                isChecked={currentSettings.restrictResellTiming}
                onChange={(e) =>
                  handleChange("restrictResellTiming", e.target.checked)
                }
              />
            </FormControl>

            {currentSettings.restrictResellTiming && (
              <Box pl={4}>
                <FormLabel>Minimum Days Before Event</FormLabel>
                <Text fontSize="sm" color="gray.500" mb={2}>
                  Prevent resales too close to the event date.
                </Text>
                <NumberInput
                  maxW="100px"
                  min={0}
                  max={30}
                  value={currentSettings.minDaysBeforeEvent}
                  onChange={(_, val) => handleChange("minDaysBeforeEvent", val)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            )}

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Require ID verification for resale</FormLabel>
              <Switch
                colorScheme="purple"
                isChecked={currentSettings.requireVerification}
                onChange={(e) =>
                  handleChange("requireVerification", e.target.checked)
                }
              />
            </FormControl>

            <Text fontSize="sm" color="gray.500">
              Enabling verification helps prevent scalping and ensures tickets
              are resold to genuine fans.
            </Text>
          </>
        )}

        <HStack justify="flex-end">
          <Button
            colorScheme="purple"
            isDisabled={!isChanged}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ResellSettings;
