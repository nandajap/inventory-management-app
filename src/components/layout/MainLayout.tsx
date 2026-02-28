import { SideNavbar } from './SideNavbar';
import { TopNavbar } from './TopNavbar';
import { Outlet } from 'react-router-dom';


export default function MainLayout() {

    return (
        <div className="h-dvh flex flex-col bg-gray-50">
            <TopNavbar />
            <div className="flex flex-1 overflow-hidden">
                <SideNavbar />
                <main className="flex-1 min-w-0 p-4 md:p-8 bg-gray-50 overflow-auto">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}