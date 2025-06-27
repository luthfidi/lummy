import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'customer' | 'organizer' | 'admin';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  getRoleLabel: (role: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'customer': return 'Customer';
      case 'organizer': return 'Organizer';
      case 'admin': return 'Admin';
      default: return 'Customer';
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, getRoleLabel }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};