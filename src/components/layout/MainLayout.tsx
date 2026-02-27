import { ReactNode } from 'react';
import { SideNavbar } from './SideNavbar';
import { TopNavbar } from './TopNavbar';
import { useAuth } from '../../hooks/useAuth';
import { Login } from '../../pages/Login';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { isAuthenticated, isLoading } = useAuth();
    // Show loading while checking auth
    if (isLoading) {
       return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-sm text-gray-600">Loading...</p>
            </div>
        </div>
    );
    }

    // Show login if not authenticated
    if (!isAuthenticated) {
        return <Login />;
    }

     // Show app if authenticated
    return (
        <div className="h-dvh flex flex-col bg-gray-50">
            <TopNavbar />
            <div className="flex flex-1 overflow-hidden">
                <SideNavbar />
                <main className="flex-1 min-w-0 p-4 md:p-8 bg-gray-50 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}