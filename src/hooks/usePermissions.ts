import { hasPermission, Permission } from '../utils/permission';
import { useAuth } from './useAuth';
import { useMemo } from 'react';

export function usePermissions() {
  const {role} = useAuth();

  const can = (permission: Permission): boolean => {
    return hasPermission(permission, role);
  };

  const isAdmin = useMemo(()=> role === 'Admin', [role]);
  const isViewer = useMemo(() => role === 'Viewer', [role]);

  return {
    role,
    can,
    isAdmin,
    isViewer,
  };
}