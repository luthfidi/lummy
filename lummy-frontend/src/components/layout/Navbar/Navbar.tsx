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
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { FaWallet, FaCoins } from "react-icons/fa";
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
  { name: "Organizer", path: "/admin" },
  { name: "Profile", path: "/profile" },
];

// Group links for dropdown on medium screens
const LinkGroups = [
  [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Marketplace", path: "/marketplace" },
  ],
  [
    { name: "My Tickets", path: "/tickets" },
    { name: "Organizer", path: "/admin" },
    { name: "Profile", path: "/profile" },
  ],
];

// Final Improved Navbar Component
export const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const { address } = useAccount();

  // Responsive display modes
  const displayMode = useBreakpointValue({
    base: "mobile",
    sm: "compact",
    md: "grouped",
    lg: "full",
  });

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
        px={2}
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
        fontSize={{ base: "sm", lg: "md" }}
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

  // Connected wallet button - Responsive version
  const ConnectedButton: React.FC<{
    address: `0x${string}`;
    onClick: () => void;
  }> = ({ address, onClick }) => {
    // Compact version for small screens
    if (displayMode === "mobile" || displayMode === "compact") {
      // Manually truncate address for smaller display
      const shortAddress = address.slice(0, 6) + "..." + address.slice(-4);
      return (
        <Tooltip label={`${Number(formatted).toLocaleString()} IDRX`} hasArrow>
          <Button
            bg="purple.500"
            color="white"
            p={2}
            minW="auto"
            borderRadius="lg"
            onClick={onClick}
            size="sm"
          >
            {shortAddress}
          </Button>
        </Tooltip>
      );
    }

    // Medium screen version with just wallet icon + balance
    if (displayMode === "grouped") {
      return (
        <Popover trigger="hover" placement="bottom-end">
          <PopoverTrigger>
            <Button
              bg="purple.500"
              color="white"
              py={2}
              px={3}
              borderRadius="lg"
              onClick={onClick}
              size="sm"
            >
              <Icon as={FaWallet} mr={2} />
              {truncateAddress(address)}
            </Button>
          </PopoverTrigger>
          <PopoverContent width="auto" p={2}>
            <PopoverBody>
              <Flex align="center">
                <Icon as={FaCoins} color="yellow.500" mr={2} />
                <Text fontWeight="medium">
                  {Number(formatted).toLocaleString()} IDRX
                </Text>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    }

    // Full version for large screens
    return (
      <Button
        bg="purple.500"
        color="white"
        px={4}
        py={2}
        borderRadius="lg"
        onClick={onClick}
        size={{ base: "sm", lg: "md" }}
      >
        {truncateAddress(address)} - {Number(formatted).toLocaleString()} IDRX
      </Button>
    );
  };

  // Navigation Link Groups for medium screens
  const NavLinkGroup = ({ links }: { links: typeof Links }) => {
    const firstLink = links[0];
    const isAnyActive = links.some((link) => location.pathname === link.path);

    return (
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="ghost"
          fontWeight={isAnyActive ? "medium" : "normal"}
          color={isAnyActive ? "purple.600" : "gray.600"}
          _hover={{ bg: "purple.50" }}
          _active={{ bg: "purple.50" }}
          size="sm"
        >
          {firstLink.name}
        </MenuButton>
        <MenuList minW="160px">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <MenuItem
                key={link.name}
                as={RouterLink}
                to={link.path}
                fontWeight={isActive ? "medium" : "normal"}
                bg={isActive ? "purple.50" : "transparent"}
                color={isActive ? "purple.600" : "gray.600"}
                _hover={{ bg: "purple.50" }}
              >
                {link.name}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    );
  };

  return (
    <Box
      bg="white"
      px={2}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
        <Flex h="64px" align="center" justify="space-between">
          {/* Mobile Menu Button */}
          <IconButton
            size="sm"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Navigation"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />

          {/* Logo & Desktop Nav */}
          <HStack spacing={{ base: 2, md: 4, lg: 8 }} align="center">
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
                display="block"
              >
                Lummy
              </Text>
            </Box>

            {/* Full Navigation on Large Screens */}
            {displayMode === "full" && (
              <HStack
                as="nav"
                spacing={3}
                display={{ base: "none", lg: "flex" }}
              >
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.path}>
                    {link.name}
                  </NavLink>
                ))}
              </HStack>
            )}

            {/* Grouped Navigation on Medium Screens */}
            {displayMode === "grouped" && (
              <HStack
                as="nav"
                spacing={2}
                display={{ base: "none", md: "flex", lg: "none" }}
              >
                {LinkGroups.map((group, idx) => (
                  <NavLinkGroup key={idx} links={group} />
                ))}
              </HStack>
            )}
          </HStack>

          {/* Actions Area - Wallet Button */}
          <ConnectButton.Custom>
            {({ openConnectModal, isConnected, openProfileModal, account }) => {
              if (!isConnected) {
                return (
                  <Button
                    variant="outline"
                    colorScheme="purple"
                    size={{ base: "sm", lg: "md" }}
                    px={{ base: 2, md: 3, lg: 4 }}
                    py={2}
                    borderRadius="lg"
                    onClick={openConnectModal}
                    leftIcon={<Icon as={FaWallet} />}
                  >
                    <Text display={{ base: "none", sm: "block" }}>
                      Connect Wallet
                    </Text>
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
