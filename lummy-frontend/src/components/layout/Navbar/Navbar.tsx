import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Container,
  Text,
  Button,
  Icon,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaWallet } from "react-icons/fa";
import { ConnectButton } from "@xellar/kit";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { IDRX_SEPOLIA } from "../../../constants";
import { truncateAddress } from "../../../utils/string";

// Navigation links
const Links = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "My Tickets", path: "/tickets" },
  { name: "Admin", path: "/admin" },
  { name: "Profile", path: "/profile" },
];

// Final Improved Navbar Component
export const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const { address } = useAccount();

  // Get IDRX balance
  const { data } = useBalance({
    address,
    token: IDRX_SEPOLIA,
    query: { enabled: !!address },
  });

  const formatted = data ? formatUnits(data.value, 2) : "0";

  // Individual navigation item with improved active indicator
  const NavLink = ({
    children,
    to,
  }: {
    children: React.ReactNode;
    to: string;
  }) => {
    const isActive = location.pathname === to;

    return (
      <Box
        as={RouterLink}
        to={to}
        px={3}
        py={2}
        rounded="md"
        fontWeight={isActive ? "medium" : "normal"}
        color={isActive ? "purple.600" : "gray.600"}
        bg={isActive ? "purple.50" : "transparent"}
        position="relative"
        _hover={{
          textDecoration: "none",
          bg: "purple.50",
        }}
        onClick={() => {
          // Close mobile menu if open when clicking on a link
          if (isOpen) onClose();
        }}
      >
        {children}
        {isActive && (
          <Box
            position="absolute"
            bottom="-1px"
            left="0"
            right="0"
            height="2px"
            bg="purple.500"
            borderRadius="2px"
          />
        )}
      </Box>
    );
  };

  // Connected wallet button - Kept similar to original
  const ConnectedButton: React.FC<{
    address: `0x${string}`;
    onClick: () => void;
  }> = ({ address, onClick }) => {
    return (
      <Button
        bg="purple.500"
        color="white"
        px={4}
        py={2}
        borderRadius="lg"
        onClick={onClick}
      >
        {truncateAddress(address)} - {Number(formatted).toLocaleString()} IDRX
      </Button>
    );
  };

  return (
    <Box
      bg="white"
      px={4}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Container maxW="container.xl">
        <Flex h="64px" align="center" justify="space-between">
          {/* Mobile Menu Button */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Navigation"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />

          {/* Logo & Desktop Nav */}
          <HStack spacing={8} align="center">
            <Box as={RouterLink} to="/" display="flex" alignItems="center">
              <Image
                src="/lummy-icon.png"
                alt="Lummy Logo"
                boxSize="32px"
                objectFit="contain"
                mr={2}
              />
              <Text
                fontSize="2xl"
                fontWeight="extrabold"
                bgGradient="linear(to-r, purple.500, pink.400)"
                bgClip="text"
                display={{ base: "none", sm: "block" }}
              >
                Lummy
              </Text>
            </Box>

            <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.path}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>

          {/* Actions Area - Wallet Button */}
          <ConnectButton.Custom>
            {({ openConnectModal, isConnected, openProfileModal, account }) => {
              if (!isConnected) {
                return (
                  <Button
                    variant="outline"
                    colorScheme="purple"
                    size="md"
                    px={4}
                    py={2}
                    borderRadius="lg"
                    onClick={openConnectModal}
                    leftIcon={<Icon as={FaWallet} />}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              return (
                <ConnectedButton
                  address={account?.address as `0x${string}`}
                  onClick={openProfileModal}
                />
              );
            }}
          </ConnectButton.Custom>
        </Flex>

        {/* Mobile Navigation - Improved active indicators */}
        {isOpen && (
          <Box
            pb={4}
            display={{ md: "none" }}
            bg="white"
            position="absolute"
            left={0}
            right={0}
            boxShadow="md"
            borderBottomRadius="md"
            zIndex={99}
            px={4}
          >
            <Stack as="nav" spacing={2}>
              {Links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Box
                    key={link.name}
                    as={RouterLink}
                    to={link.path}
                    px={4}
                    py={3}
                    rounded="md"
                    fontWeight={isActive ? "medium" : "normal"}
                    bg={isActive ? "purple.50" : "transparent"}
                    color={isActive ? "purple.600" : "gray.600"}
                    _hover={{
                      bg: "purple.50",
                      textDecoration: "none",
                    }}
                    onClick={() => {
                      // Always close menu when clicking a link on mobile
                      onClose();
                    }}
                    position="relative"
                    borderLeft={isActive ? "3px solid" : "none"}
                    borderLeftColor="purple.500"
                    pl={isActive ? "5" : "4"}
                  >
                    {link.name}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Navbar;
