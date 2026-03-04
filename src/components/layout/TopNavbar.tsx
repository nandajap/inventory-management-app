/**
 * TopNavbar Component
 * 
 * Horizontal bar at the top of the page
 * Shows: Logo, app title, and user info
 */

import { useAuth } from '../../hooks/useAuth'
import logoImage from '../../assets/images/logo.jpg'
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    const confirmed = window.confirm(
      `Are you sure you want to logout?`
    );
    if (!confirmed) return;
    logout();
    navigate(`/login`, { replace: true })
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LEFT: Logo and Title */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <img
              src={logoImage}
              alt="Logo"
              className="w-8 h-8 object-cover"
            />
            {/* Title */}
            <h1 className="lg:text-xl sm:text-xs font-semibold text-gray-900">
              Inventory Management
            </h1>
          </div>

          {/* RIGHT: User Info */}
          {user &&
            (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {/* User Avatar */}
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className='flex flex-col'>
                    {/* User Name */}
                    <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                    <span className="text-sm font-normal text-gray-600">{user.role}</span>

                  </div>

                </div>
                <button
                  onClick={handleLogout}
                  className="flex flex-row items-center lg:text-base sm:text-xs text-gray-600 hover:text-red-400 transition-colors"
                >
                  <LogOut className="mx-2 w-5 h-5" /> Logout
                </button>
              </div>
            )
          }
        </div>
      </div>
    </header>
  )
}