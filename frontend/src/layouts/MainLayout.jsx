import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-surface-950">
            <Sidebar />
            <div className="lg:ml-60">
                <Navbar />
                <main className="px-4 lg:px-8 py-6 max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
