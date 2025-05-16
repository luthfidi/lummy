import React, { useEffect, useState } from "react";
import { Box, VStack, Text } from "@chakra-ui/react";

interface QRCodeProps {
  ticketId: string;
  eventId: string;
  size?: number;
}

export const QRCode: React.FC<QRCodeProps> = ({
  ticketId,
  eventId,
  size = 200,
}) => {
  // In a real implementation, this would be replaced with actual QR code generation
  // using libraries like qrcode.react
  const [timeKey, setTimeKey] = useState<number>(Date.now());

  // For demo purposes, we'll change the QR code every 10 seconds
  // This simulates dynamic QR codes that change periodically for security
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeKey(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Placeholder for QR code
  return (
    <VStack spacing={2}>
      <Box
        width={`${size}px`}
        height={`${size}px`}
        bg="gray.100"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        {/* QR code visual placeholder */}
        <Box
          position="absolute"
          width="80%"
          height="80%"
          bg="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Ticket QR Code
            <br />
            ID: {ticketId.substring(0, 8)}
            <br />
            Key: {timeKey.toString().substring(8)}
          </Text>
        </Box>

        {/* QR code pattern placeholder */}
        <Box position="absolute" width="100%" height="100%">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <Box key={`row-${rowIndex}`} display="flex">
              {Array.from({ length: 5 }).map((_, colIndex) => {
                // Pseudo-random pattern based on ticketId, eventId and timestamp
                const isBlock =
                  (parseInt(ticketId.charAt(rowIndex % ticketId.length), 16) +
                    parseInt(eventId.charAt(colIndex % eventId.length), 16) +
                    (timeKey % 10)) %
                    3 ===
                  0;

                return (
                  <Box
                    key={`cell-${rowIndex}-${colIndex}`}
                    width={`${size / 5}px`}
                    height={`${size / 5}px`}
                    bg={isBlock ? "black" : "transparent"}
                  />
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
      <Text fontSize="xs" color="gray.500">
        Updates every 10 seconds
      </Text>
    </VStack>
  );
};

export default QRCode;
