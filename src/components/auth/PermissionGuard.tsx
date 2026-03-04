import { ReactNode } from 'react';
import { Permission } from '../../utils/permission';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that renders children only if user has permission.
 * Does NOT render anything in DOM if permission check fails.
 */
export default function PermissionGuard({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { can } = usePermissions();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
