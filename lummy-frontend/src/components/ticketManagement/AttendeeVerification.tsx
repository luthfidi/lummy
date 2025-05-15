import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Divider,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import {
  FaTicketAlt,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface AttendeeData {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  profileImage?: string;
  walletAddress: string;
  status: "valid" | "used" | "invalid" | "checked-in";
  checkInTime?: string;
}

interface AttendeeVerificationProps {
  attendee: AttendeeData | null;
  onCheckIn: (attendeeId: string) => void;
  onReject: (attendeeId: string, reason: string) => void;
  isLoading?: boolean;
}

const AttendeeVerification: React.FC<AttendeeVerificationProps> = ({
  attendee,
  onCheckIn,
  onReject,
  isLoading = false,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rejectionReason, setRejectionReason] =
    useState<string>("Invalid ticket");

  const cardBg = "white";
  const successBg = "green.50";
  const dangerBg = "red.50";

  const handleCheckIn = () => {
    if (attendee) {
      onCheckIn(attendee.id);
      toast({
        title: "Attendee checked in",
        description: `${attendee.name} has been successfully checked in.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReject = () => {
    if (attendee) {
      onReject(attendee.id, rejectionReason);
      onClose();
      toast({
        title: "Check-in rejected",
        description: `${attendee.name}'s check-in has been rejected.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!attendee) {
    return (
      <Box
        bg={cardBg}
        borderRadius="lg"
        p={6}
        shadow="sm"
        height="500px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack>
          <Icon as={FaTicketAlt} boxSize={12} color="gray.300" />
          <Text color="gray.500" fontSize="lg">
            Scan a ticket to verify attendee
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Box bg={cardBg} borderRadius="lg" overflow="hidden" shadow="sm">
        {/* Status banner */}
        <Box
          py={3}
          px={6}
          bg={
            attendee.status === "valid"
              ? "green.500"
              : attendee.status === "checked-in"
              ? "blue.500"
              : "red.500"
          }
          color="white"
        >
          <Flex justify="space-between" align="center">
            <HStack>
              <Icon
                as={
                  attendee.status === "valid" ||
                  attendee.status === "checked-in"
                    ? CheckIcon
                    : CloseIcon
                }
                boxSize={5}
              />
              <Text fontWeight="bold">
                {attendee.status === "valid"
                  ? "Valid Ticket"
                  : attendee.status === "checked-in"
                  ? "Already Checked In"
                  : "Invalid Ticket"}
              </Text>
            </HStack>
            <Badge
              colorScheme={
                attendee.status === "valid"
                  ? "green"
                  : attendee.status === "checked-in"
                  ? "blue"
                  : "red"
              }
              color="white"
              bg="whiteAlpha.300"
            >
              {attendee.status === "checked-in" && attendee.checkInTime
                ? `Checked in at ${attendee.checkInTime}`
                : attendee.status}
            </Badge>
          </Flex>
        </Box>

        <Box p={6}>
          {/* Attendee info */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "center", sm: "flex-start" }}
            gap={6}
            mb={6}
          >
            <VStack align="flex-start" spacing={1} flex="1">
              <Text fontSize="2xl" fontWeight="bold">
                {attendee.name}
              </Text>
              <Text color="gray.600">{attendee.email}</Text>
              <HStack mt={2}>
                <Badge colorScheme="purple" px={2} py={1}>
                  {attendee.ticketType}
                </Badge>
              </HStack>
            </VStack>
          </Flex>

          <Divider mb={6} />

          {/* Event details */}
          <VStack align="stretch" spacing={4} mb={6}>
            <HStack>
              <Icon as={FaCalendarAlt} color="purple.500" />
              <Text fontWeight="medium">Event</Text>
              <Text flex="1">{attendee.eventName}</Text>
            </HStack>

            <HStack>
              <Icon as={FaMapMarkerAlt} color="purple.500" />
              <Text fontWeight="medium">Location</Text>
              <Text flex="1">{attendee.eventLocation}</Text>
            </HStack>

            <HStack>
              <Icon as={FaUser} color="purple.500" />
              <Text fontWeight="medium">Wallet Address</Text>
              <Text flex="1" fontFamily="monospace" fontSize="sm">
                {attendee.walletAddress.substring(0, 8)}...
                {attendee.walletAddress.substring(
                  attendee.walletAddress.length - 8
                )}
              </Text>
            </HStack>
          </VStack>

          {attendee.status === "valid" ? (
            <Box bg={successBg} p={4} borderRadius="md" mb={6}>
              <Flex align="center" gap={2}>
                <Icon as={InfoIcon} color="green.500" />
                <Text color="green.700">
                  This ticket is valid and ready for check-in.
                </Text>
              </Flex>
            </Box>
          ) : attendee.status === "checked-in" ? (
            <Box bg="blue.50" p={4} borderRadius="md" mb={6}>
              <Flex align="center" gap={2}>
                <Icon as={InfoIcon} color="blue.500" />
                <Text color="blue.700">
                  This ticket has already been checked in at{" "}
                  {attendee.checkInTime}.
                </Text>
              </Flex>
            </Box>
          ) : (
            <Box bg={dangerBg} p={4} borderRadius="md" mb={6}>
              <Flex align="center" gap={2}>
                <Icon as={InfoIcon} color="red.500" />
                <Text color="red.700">
                  This ticket is invalid or has been revoked.
                </Text>
              </Flex>
            </Box>
          )}

          {/* Action buttons */}
          <Flex justify="space-between" gap={4} mt={4}>
            <Button
              colorScheme="red"
              leftIcon={<CloseIcon />}
              onClick={onOpen}
              isDisabled={attendee.status === "checked-in"}
            >
              Reject
            </Button>
            <Button
              colorScheme="green"
              leftIcon={<CheckIcon />}
              onClick={handleCheckIn}
              isLoading={isLoading}
              isDisabled={attendee.status !== "valid"}
            >
              Check In
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* Reject Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Check-in</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Are you sure you want to reject this attendee's check-in?
            </Text>
            {/* In a real app, you'd have a form here to select rejection reasons */}
            <VStack align="start" spacing={2}>
              {[
                "Invalid ticket",
                "Fake ticket",
                "Already used",
                "Wrong date/event",
                "Other issue",
              ].map((reason) => (
                <Button
                  key={reason}
                  variant={rejectionReason === reason ? "solid" : "outline"}
                  colorScheme={rejectionReason === reason ? "red" : "gray"}
                  size="sm"
                  onClick={() => setRejectionReason(reason)}
                >
                  {reason}
                </Button>
              ))}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AttendeeVerification;
