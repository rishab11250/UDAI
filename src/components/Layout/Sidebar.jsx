import React from 'react';
import { Home, Activity, Fingerprint, Map, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
    { label: 'Overview', icon: Home, id: 'overview' },
    { label: 'Demographic Decay', icon: Activity, id: 'demographic' },
    { label: 'Biometric Health', icon: Fingerprint, id: 'biometric' },
    { label: 'Migration Map', icon: Map, id: 'migration' },
];

export function Sidebar({ activeTab, onTabChange, isMobileOpen, onCloseMobile }) {
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
                "fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Fingerprint className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Aadhaar<span className="text-teal-500">Pulse</span></h1>
                </div>

                <nav className="p-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onTabChange(item.id);
                                    onCloseMobile();
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-teal-600/10 text-teal-400 border border-teal-600/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-teal-400" : "text-slate-500")} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-800/50 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-slate-300">Live Data Feed</span>
                    </div>
                </div>
            </div>
        </>
    );
}
