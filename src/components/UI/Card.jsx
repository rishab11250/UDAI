import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, clickable, onClick }) {
    return (
        <div
            className={cn("bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100/50 p-6 transition-all", clickable && "cursor-pointer hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5", className)}
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
