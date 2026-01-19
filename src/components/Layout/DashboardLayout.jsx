import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function DashboardLayout({ children, activeTab, onTabChange }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-transparent transition-colors duration-300">
            <Sidebar
                activeTab={activeTab}
                onTabChange={onTabChange}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 transition-colors">
                    <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="font-semibold text-slate-900 dark:text-white">AadhaarPulse</h1>
                </header>

                {/* Desktop Header for Profile */}
                <div className="hidden md:flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 transition-colors">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        {/* Dynamic Title based on activeTab could go here if managed by parent */}
                        Dashboard
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.href = '/profile'}
                            className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        >
                            <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-none">{user?.name || 'Guest User'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">View Profile</p>
                            </div>
                        </button>
                    </div>
                </div>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Pass activeTab to children if needed, or handle routing here */}
                        {/* For now, we assume children handles the content or we cloneElement. 
                 But better to let the App manage state or Context. 
                 Since the prompt asked for a Dashboard, I'll pass activeTab via context or props?
                 Actually, let's make the Layout accept specific slots or just children.
                 Ideally, the App component should hold the state.
                 I'll modify this to accept activeTab/onTabChange from props if needed, 
                 but for simplicity, I'll export a context or just pass props down?
                 Let's stick to simple props for 'activeTab'.
              */}
                        {React.Children.map(children, child =>
                            React.cloneElement(child, { activeTab })
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
