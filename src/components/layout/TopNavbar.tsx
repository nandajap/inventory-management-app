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
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={logoImage}
              alt="Logo"
              className="w-8 h-8 object-cover flex-shrink-0" 
            />
            <h1 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-900 truncate">
              <span className="hidden sm:inline">StockPulse Solutions</span>
              <span className="sm:hidden">StockPulse</span> 
            </h1>
          </div>

          {/* RIGHT: User Info */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="md:flex items-center gap-2">
                {/* User Avatar */}
                <img
                  src="https://i.pravatar.cc/40"
                  alt="User Avatar"
                  className="hidden md:block w-8 h-8 rounded-full"
                />
                <div className='flex flex-col'>
                  {/* User Name */}
                  <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                  <span className="text-xs text-gray-600">{user.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base text-gray-600 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}