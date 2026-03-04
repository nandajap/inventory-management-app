import { STORAGE_KEYS } from '../constants/storage';
import { User } from '../types/auth';
import { UserRole } from '../types/auth';

export type Permission = 
  | 'product.create'
  | 'product.edit'
  | 'product.delete'
  | 'product.view'

// Define what each role can do
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Admin: [
    'product.create',
    'product.edit',
    'product.delete',
    'product.view',
  ],
  Viewer: [
    'product.view',
  ],
};

/**
 * Get the current user's role from localStorage
 */
export const getUserRole = (): UserRole | null=> {
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
  if (!storedUser) return null;
  try {
    const user: User = JSON.parse(storedUser);
    return user.role || null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

/**
 * Check if the current user has a specific permission
 */
export const hasPermission = (permission: Permission, role?: UserRole|null): boolean => {
  const userRole = role ?? getUserRole(); // Use provided role, or fallback to localStorage
  
  if (!userRole) return false;
  console.log(role + ` hasPermission ${permission}: `+ ROLE_PERMISSIONS[userRole].includes(permission));

  return ROLE_PERMISSIONS[userRole].includes(permission);
};

/**
 * Check if the current user has ALL of the specified permissions
 */
export const hasAllPermissions = (permissions: Permission[], role?: UserRole | null): boolean => {
  return permissions.every(permission => hasPermission(permission, role));
};

/**
 * Check if a role has ANY of the specified permissions
 */
export const hasAnyPermission = (permissions: Permission[], role?: UserRole | null): boolean => {
  return permissions.some(permission => hasPermission(permission, role));
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role];
};