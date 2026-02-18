/**
 * TopNavbar Component
 * 
 * Horizontal bar at the top of the page
 * Shows: Logo, app title, and user info
 */

import logoImage from '../../assets/images/logo.jpg'

export function TopNavbar() {
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
            <h1 className="text-xl font-semibold text-gray-900">
              Inventory Management
            </h1>
          </div>

          {/* RIGHT: User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                 {/* User Avatar */}
              <img
                src="https://i.pravatar.cc/40"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              {/* User Name */}
              <span className="text-sm text-gray-700">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}