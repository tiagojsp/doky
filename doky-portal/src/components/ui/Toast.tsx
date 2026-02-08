'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
};

const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
};

const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
};

export const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 3000, onClose }) => {
    const Icon = icons[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <div className={`
      flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-black/5
      pointer-events-auto transition-all duration-500 animate-slide-in-right
      ${styles[type]}
      min-w-[300px] max-w-md
    `}>
            <Icon className={`shrink-0 mt-0.5 ${iconStyles[type]}`} size={18} />
            <p className="flex-1 text-sm font-medium leading-tight">{message}</p>
            <button onClick={() => onClose(id)} className="p-0.5 hover:bg-black/5 rounded-full transition-colors opacity-60 hover:opacity-100">
                <X size={14} />
            </button>
        </div>
    );
};
