// src/pages/Profile/ProfilePage.tsx
import React from "react";
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Text,
  Icon,
  Box,
  Button,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { FaUser, FaWallet, FaHistory } from "react-icons/fa";
import { useAccount, useBalance } from "wagmi"; // Tambahkan useBalance
import { ConnectButton } from "@xellar/kit";
import {
  PersonalInfo,
  TransactionHistory,
  WalletDetails,
} from "../../components/profile";
import { IDRX_SEPOLIA } from "../../constants"; // Import token address

// Mock transaction data
const mockTransactions = Array.from({ length: 15 }, (_, i) => ({
  id: `tx-${i + 1}`,
  date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  type: ["purchase", "sale", "transfer"][Math.floor(Math.random() * 3)] as
    | "purchase"
    | "sale"
    | "transfer",
  eventName: [
    "Summer Music Festival",
    "Tech Conference 2025",
    "Blockchain Workshop",
    "Art Exhibition: Future Visions",
  ][Math.floor(Math.random() * 4)],
  amount: Math.floor(Math.random() * 500) + 50,
  currency: "IDRX",
  status: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)] as
    | "completed"
    | "pending"
    | "failed",
  txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
}));

const WalletConnectionRequired: React.FC<{ message?: string }> = ({
  message,
}) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      p={6}
      textAlign="center"
    >
      <Flex direction="column" align="center" justify="center" py={10}>
        <Heading size="md" mb={2}>
          Wallet Not Connected
        </Heading>
        <Text color="gray.500" mb={6} textAlign="center">
          {message || "Connect your Xellar wallet to access this feature"}
        </Text>
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <Button
              colorScheme="purple"
              size="lg"
              leftIcon={<Icon as={FaWallet} />}
              borderRadius="lg"
              boxShadow="sm"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              onClick={openConnectModal}
            >
              Connect Wallet
            </Button>
          )}
        </ConnectButton.Custom>
      </Flex>
    </Box>
  );
};

const ProfilePage: React.FC = () => {
  const { address, isConnected } = useAccount();
  // Get IDRX balance
  const { data: balanceData } = useBalance({
    address,
    token: IDRX_SEPOLIA, // IDRX token address
  });

  const toast = useToast();

  const handleSavePersonalInfo = (data: any) => {
    console.log("Saving personal info:", data);
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg">My Profile</Heading>
      <Text color="gray.600" mb={8}>
        Manage your personal information, wallet, and preferences
      </Text>

      <Tabs variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab>
            <Icon as={FaUser} mr={2} /> Personal Info
          </Tab>
          <Tab>
            <Icon as={FaWallet} mr={2} /> Wallet
          </Tab>
          <Tab>
            <Icon as={FaHistory} mr={2} /> Transactions
          </Tab>
        </TabList>

        <TabPanels>
          {/* Personal Info Tab */}
          <TabPanel px={0} py={4}>
            {isConnected && address ? (
              <PersonalInfo
                initialData={{
                  name: "",
                  email: "",
                  phone: "",
                  walletAddress: address,
                }}
                onSave={handleSavePersonalInfo}
              />
            ) : (
              <WalletConnectionRequired message="Connect your Xellar wallet to view and edit your personal information" />
            )}
          </TabPanel>

          {/* Wallet Tab */}
          <TabPanel px={0} py={4}>
            {isConnected && address ? (
              <WalletDetails balanceData={balanceData} />
            ) : (
              <WalletConnectionRequired message="Connect your Xellar wallet to view your balance and wallet details" />
            )}
          </TabPanel>

          {/* Transactions Tab */}
          <TabPanel px={0} py={4}>
            {isConnected && address ? (
              <TransactionHistory
                transactions={mockTransactions.map((tx) => ({
                  ...tx,
                  // Ensure event name is properly formatted without ellipsis
                  eventName: tx.eventName.replace("...", "").trim(),
                }))}
                isConnected={true}
              />
            ) : (
              <WalletConnectionRequired message="Connect your Xellar wallet to view your transaction history" />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
