import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  Text,
  Badge,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaUser, FaUserTie, FaUserShield } from 'react-icons/fa';
import { useRole, UserRole } from '../../context/RoleContext';

const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useRole();
  const menuBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const roles: { value: UserRole; label: string; icon: React.ElementType; color: string }[] = [
    { value: 'customer', label: 'Customer', icon: FaUser, color: 'blue' },
    { value: 'organizer', label: 'Organizer', icon: FaUserTie, color: 'purple' },
    { value: 'admin', label: 'Admin', icon: FaUserShield, color: 'red' },
  ];

  const currentRole = roles.find(r => r.value === role) || roles[0];

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="outline"
        colorScheme="purple"
        size={{ base: "sm", lg: "md" }}
        px={{ base: 2, md: 3, lg: 4 }}
        py={2}
        borderRadius="lg"
        leftIcon={<Icon as={currentRole.icon} />}
      >
        <Text display={{ base: "none", sm: "block" }}>
          {currentRole.label}
        </Text>
      </MenuButton>
      
      <MenuList 
        bg={menuBg} 
        borderColor={borderColor} 
        shadow="lg"
        minW="160px"
        py={2}
      >
        {roles.map((roleOption) => (
          <MenuItem
            key={roleOption.value}
            onClick={() => setRole(roleOption.value)}
            bg={role === roleOption.value ? `${roleOption.color}.50` : 'transparent'}
            _hover={{
              bg: `${roleOption.color}.50`,
            }}
            py={3}
            px={4}
          >
            <HStack spacing={3} width="100%">
              <Icon as={roleOption.icon} color={`${roleOption.color}.500`} boxSize={4} />
              <Text fontWeight={role === roleOption.value ? 'semibold' : 'normal'}>
                {roleOption.label}
              </Text>
              {role === roleOption.value && (
                <Badge colorScheme={roleOption.color} size="sm" ml="auto">
                  Active
                </Badge>
              )}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default RoleSwitcher;