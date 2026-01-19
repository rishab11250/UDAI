import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, clickable, onClick }) {
    return (
        <div
            className={cn("bg-white dark:bg-slate-900/50 dark:backdrop-blur-md rounded-xl shadow-sm border border-slate-200 dark:border-white/10 p-6 transition-all", clickable && "cursor-pointer hover:shadow-md", className)}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, className, action }) {
    return (
        <div className={cn("mb-4 flex justify-between items-start", className)}>
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
