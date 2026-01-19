import React from 'react';
import { Home, Activity, Fingerprint, Map, Menu, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
    { label: 'Overview', icon: Home, id: 'overview' },
    { label: 'Demographic Decay', icon: Activity, id: 'demographic' },
    { label: 'Biometric Health', icon: Fingerprint, id: 'biometric' },
    { label: 'Migration Map', icon: Map, id: 'migration' },
    { label: 'My Profile', icon: User, id: 'profile', path: '/profile' },
];

export function Sidebar({ activeTab, onTabChange, isMobileOpen, onCloseMobile }) {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onCloseMobile}
                />
            )}

            <div className={cn(
                "fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 text-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 shadow-xl md:shadow-none",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Fingerprint className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Aadhaar<span className="text-teal-600">Pulse</span></h1>
                </div>

                <nav className="p-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        // Active if:
                        // 1. We are on the dashboard ('/') AND this tab is active
                        // 2. OR We are on the specific path defined by the item
                        const isDashboardItem = !item.path;
                        const isActive = isDashboardItem
                            ? activeTab === item.id && location.pathname === '/'
                            : location.pathname === item.path;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.path) {
                                        // Navigate to specific route (e.g. /profile)
                                        navigate(item.path);
                                    } else {
                                        // Dashboard tab
                                        if (location.pathname !== '/') {
                                            navigate('/');
                                        }
                                        onTabChange(item.id);
                                    }
                                    onCloseMobile();
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-teal-600" : "text-slate-400")} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4 p-4 space-y-4">
                    <div className="bg-slate-800/50 rounded-xl border border-slate-800 p-4">
                        <p className="text-xs text-slate-500 mb-1">System Status</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm text-slate-300">Live Data Feed</span>
                        </div>
                    </div>



                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors border border-transparent hover:border-red-900/30"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
