import { hasPermission, Permission } from '../utils/permission';
import { useAuth } from './useAuth';

export function usePermissions() {
  const {role} = useAuth();

  const can = (permission: Permission): boolean => {
    return hasPermission(permission, role);
  };

  const isAdmin = role === 'Admin';
  const isViewer = role === 'Viewer';

  return {
    role,
    can,
    isAdmin,
    isViewer,
  };
}