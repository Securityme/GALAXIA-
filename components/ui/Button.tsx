'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'amber' | 'emerald' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  glow = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium transition-all duration-200 uppercase tracking-wider select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-sm gap-1.5',
    md: 'text-sm px-4 py-2 rounded-sm gap-2',
    lg: 'text-base px-6 py-3 rounded gap-2.5',
  };

  const variantStyles = {
    primary: clsx(
      'bg-cyan-500/10 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-400/20 hover:border-cyan-300 active:bg-cyan-400/30',
      glow && 'shadow-[0_0_15px_rgba(0,243,255,0.3)]'
    ),
    amber: clsx(
      'bg-amber-500/10 text-amber-300 border border-amber-400/40 hover:bg-amber-400/20 hover:border-amber-300 active:bg-amber-400/30',
      glow && 'shadow-[0_0_15px_rgba(255,183,0,0.3)]'
    ),
    emerald: clsx(
      'bg-emerald-500/10 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-400/20 hover:border-emerald-300 active:bg-emerald-400/30',
      glow && 'shadow-[0_0_15px_rgba(0,255,136,0.3)]'
    ),
    secondary: 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-500 active:bg-slate-700',
    ghost: 'bg-transparent text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/20',
    danger: clsx(
      'bg-rose-500/10 text-rose-300 border border-rose-400/40 hover:bg-rose-400/20 hover:border-rose-300 active:bg-rose-400/30',
      glow && 'shadow-[0_0_15px_rgba(244,63,94,0.3)]'
    ),
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  );
};
