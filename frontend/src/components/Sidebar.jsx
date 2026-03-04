import { NavLink } from 'react-router-dom';
import {
    HiOutlineChartBar,
    HiOutlineCollection,
    HiOutlinePlusCircle,
} from 'react-icons/hi';

const navItems = [
    { to: '/', label: 'Dashboard', icon: HiOutlineChartBar },
    { to: '/problems', label: 'Problems', icon: HiOutlineCollection },
    { to: '/problems/new', label: 'Add Problem', icon: HiOutlinePlusCircle },
];

const Sidebar = () => {
    return (
        <aside className="hidden lg:flex flex-col w-60 border-r border-surface-800 bg-surface-950 h-screen fixed top-0 left-0 z-30">
            <div className="px-6 py-5 border-b border-surface-800">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-semibold text-white text-sm tracking-tight">
                        Algory
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-surface-800 text-white'
                                : 'text-surface-400 hover:text-white hover:bg-surface-900'
                            }`
                        }
                    >
                        <Icon className="w-[18px] h-[18px]" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 py-4 border-t border-surface-800">
                <p className="text-[11px] text-surface-600 font-medium">
                    Algory
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
