import React from 'react';
import { PermissionsProvider } from '@/contexts/PermissionsContext';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <PermissionsProvider>
      {children}
    </PermissionsProvider>
  );
}
