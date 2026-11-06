import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    icon,
    iconRight,
    loading = false,
    disabled,
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none relative overflow-hidden whitespace-nowrap flex-nowrap shrink-0';

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-xs gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
    lg: 'px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base gap-2 rounded-xl sm:rounded-2xl',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#0E8FC9] to-[#35B6E8] text-white shadow-[0_8px_20px_-4px_rgba(14,143,201,0.35)] hover:shadow-[0_12px_24px_-4px_rgba(14,143,201,0.5)]',
    secondary:
      'bg-[#E8F4FB] text-[#0E8FC9] border border-[#D1E8F6] hover:bg-[#DCEEF9]',
    outline:
      'bg-white text-[#1F2A37] border border-[#D8ECF8] hover:border-[#0E8FC9] hover:text-[#0E8FC9] hover:bg-[#F4F9FD] shadow-xs',
    ghost:
      'bg-transparent text-[#6B7280] hover:text-[#0E8FC9] hover:bg-[#E8F4FB]/60',
    danger:
      'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || loading ? 1 : 1.02, y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98, y: 0 }}
      transition={{ duration: 0.12 }}
      className={twMerge(
        clsx(baseClasses, sizeClasses[size], variantClasses[variant], className)
      )}
      disabled={disabled || loading}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap flex-nowrap shrink-0">
        {loading && (
          <Loader2 size={16} className="animate-spin shrink-0" />
        )}
        {!loading && icon && <span className="shrink-0 inline-flex items-center">{icon}</span>}
        <span className="whitespace-nowrap inline-flex items-center gap-2">{children}</span>
        {!loading && iconRight && <span className="shrink-0 inline-flex items-center">{iconRight}</span>}
      </span>
    </motion.button>
  );
});
