import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { useState } from 'react';
import {
    HiOutlineChartBar,
    HiOutlineCollection,
    HiOutlinePlusCircle,
    HiOutlineLogout,
    HiOutlineMenu,
    HiOutlineX,
} from 'react-icons/hi';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const mobileLinks = [
        { to: '/', label: 'Dashboard', icon: HiOutlineChartBar },
        { to: '/problems', label: 'Problems', icon: HiOutlineCollection },
        { to: '/problems/new', label: 'Add Problem', icon: HiOutlinePlusCircle },
    ];

    return (
        <header className="sticky top-0 z-20 border-b border-surface-800 bg-surface-950/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 lg:px-8 h-14">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden text-surface-400 hover:text-white transition-colors"
                >
                    {mobileOpen ? (
                        <HiOutlineX className="w-5 h-5" />
                    ) : (
                        <HiOutlineMenu className="w-5 h-5" />
                    )}
                </button>

                <div className="lg:hidden flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">A</span>
                    </div>
                    <span className="font-semibold text-white text-sm">
                        Algory
                    </span>
                </div>

                <div className="hidden lg:block" />

                {user && (
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                <span className="text-indigo-400 text-xs font-semibold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm text-surface-300 font-medium">
                                {user.name}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-surface-500 hover:text-white text-sm transition-colors duration-200"
                        >
                            <HiOutlineLogout className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                )}
            </div>

            {mobileOpen && (
                <nav className="lg:hidden border-t border-surface-800 bg-surface-950 px-4 py-3 space-y-1 animate-slide-up">
                    {mobileLinks.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-400 hover:text-white hover:bg-surface-900 transition-colors"
                        >
                            <Icon className="w-[18px] h-[18px]" />
                            {label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default Navbar;
