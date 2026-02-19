import { ReactNode } from 'react';
import {SideNavbar} from './SideNavbar';
import {TopNavbar} from './TopNavbar';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <TopNavbar />
            <div className="flex flex-1 overflow-hidden">
                <SideNavbar />
                <main className="flex-1 p-8 bg-gray-50 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}