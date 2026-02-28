import { cn } from "../../utils/cn";
import { NavLink } from "react-router-dom";
import { LayoutDashboardIcon, ClipboardListIcon, ShoppingCartIcon, TruckIcon, ChartNoAxesCombinedIcon, LucideIcon } from 'lucide-react';

interface NavItem {
    id: string
    label: string
    icon: LucideIcon
    path: string
}
// All NavItems will redirect to /inventory for now
const navItems: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboardIcon,
        path: '/dashboard'
    },
    {
        id: 'inventory',
        label: 'Inventory',
        icon: ClipboardListIcon,
        path: '/inventory'
    },
    {
        id: 'orders',
        label: 'Orders',
        icon: ShoppingCartIcon,
        path: '/orders'
    },
    {
        id: 'suppliers',
        label: 'Suppliers',
        icon: TruckIcon,
        path: '/suppliers'
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: ChartNoAxesCombinedIcon,
        path: '/reports'
    }
];

export function SideNavbar() {

    return (
        <aside className="h-full shrink-0 w-16 md:w-64 bg-white border-r border-gray-200">
            <nav className="p-2 md:p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const NavIcon = item.icon;
                        return (
                            <li key={item.id}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        cn(
                                            // Base styles
                                            "w-full flex items-center gap-3 rounded-lg transition-colors text-sm font-medium",
                                            "justify-center md:justify-start px-2 md:px-4 py-2.5",
                                            // Conditional styles based on active route
                                            isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        )
                                    }
                                >
                                    <NavIcon className="w-5 h-5" />
                                    <span className="hidden md:inline">{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    )
}