import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function DashboardLayout({ children, activeTab, onTabChange }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar
                activeTab={activeTab}
                onTabChange={onTabChange}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-4">
                    <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 text-slate-600">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="font-semibold text-slate-900">AadhaarPulse</h1>
                </header>

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
