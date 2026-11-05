import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'primary',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3.5 py-1 text-xs font-semibold',
  };

  const variantClasses = {
    primary: 'bg-[#E8F4FB] text-[#0E8FC9] border border-[#CDE6F7]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
  };

  const dotColorClasses = {
    primary: 'bg-[#0E8FC9]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-gray-500',
    info: 'bg-sky-500',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full capitalize select-none',
          sizeClasses[size],
          variantClasses[variant],
          className
        )
      )}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColorClasses[variant]}`} />}
      {children}
    </span>
  );
}

