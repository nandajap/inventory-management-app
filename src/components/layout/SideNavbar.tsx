import { cn } from "../../utils/cn";
import { useState } from "react";

interface NavItem {
    id: string
    label: string
    icon: string
    active?: boolean
}

const navItems: NavItem[] = [
    {
        id: 'Dashboard',
        label: 'Dashboard',
        icon: '📊',
        active: false
    },
    {
        id: 'inventory',
        label: 'Inventory',
        icon: '📦',
        active: false, 
    },
    { id: 'orders', label: 'Orders', icon: '🛒', active: false },
    { id: 'suppliers', label: 'Suppliers', icon: '🏢', active: false },
    { id: 'reports', label: 'Reports', icon: '📈', active: false },
]

export function SideNavbar() {

    const [activeTabId, setActiveTabId] = useState<string>('inventory') //set default active tab to 'inventory'
    const handleTabClick = (tabId: string) => {
        setActiveTabId(tabId)
    }
    return (
       <aside className="w-64 bg-white border-r border-gray-200 h-full">
            <nav className="p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button
                                className={cn(
                                    // Base styles (always applied)
                                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                                    'text-left text-sm font-medium',

                                    // Conditional styles (based on active state)
                                    activeTabId === item.id
                                        ? 'bg-blue-50 text-blue-700'          // Active state
                                        : 'text-gray-700 hover:bg-gray-50'    // Inactive state
                                )}
                                onClick={()=>handleTabClick(item.id)}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span >{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}