import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, clickable, onClick }) {
    return (
        <div
            className={cn("bg-brand-surface rounded-2xl shadow-[0_4px_20px_-2px_rgba(36,36,35,0.1)] border border-brand-base/50 p-6 transition-all text-brand-darker", clickable && "cursor-pointer hover:shadow-[0_8px_30px_-4px_rgba(36,36,35,0.15)] hover:-translate-y-0.5 hover:border-brand-accent/50", className)}
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
