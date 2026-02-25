import { cn } from "../../utils/cn";
import { useState } from "react";
import {LayoutDashboardIcon, ClipboardListIcon, ShoppingCartIcon, TruckIcon, ChartNoAxesCombinedIcon, LucideIcon} from 'lucide-react';

interface NavItem {
    id: string
    label: string
    icon: LucideIcon
    active?: boolean
}

const navItems: NavItem[] = [
    {
        id: 'Dashboard',
        label: 'Dashboard',
        icon: LayoutDashboardIcon,
        active: false
    },
    {
        id: 'inventory',
        label: 'Inventory',
        icon: ClipboardListIcon,
        active: false, 
    },
    { id: 'orders', label: 'Orders', icon: ShoppingCartIcon, active: false },
    { id: 'suppliers', label: 'Suppliers', icon: TruckIcon, active: false },
    { id: 'reports', label: 'Reports', icon: ChartNoAxesCombinedIcon, active: false },
]

export function SideNavbar() {

    const [activeTabId, setActiveTabId] = useState<string>('inventory') //set default active tab to 'inventory'
    const handleTabClick = (tabId: string) => {
        setActiveTabId(tabId)
    }
    return (
       <aside className="h-full shrink-0 w-16 md:w-64 bg-white border-r border-gray-200">
            <nav className="p-2 md:p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const NavIcon = item.icon;
                        return (
                            <li key={item.id}>
                                <button
                                    className={cn(
                                        // Base styles (always applied)
                                        "w-full flex items-center gap-3 rounded-lg transition-colors text-sm font-medium", "justify-center md:justify-start px-2 md:px-4 py-2.5",

                                        // Conditional styles (based on active state)
                                        activeTabId === item.id
                                            ? 'bg-blue-50 text-blue-700'          // Active state
                                            : 'text-gray-700 hover:bg-gray-50'    // Inactive state
                                    )}
                                    onClick={()=>handleTabClick(item.id)}
                                >
                                    <NavIcon className="w-5 h-5"/>
                                    <span className="hidden md:inline">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    )
}