import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'white' | 'highlight' | 'soft' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverLift?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'white',
    padding = 'lg',
    hoverLift = false,
    className = '',
    children,
    ...props
  },
  ref
) {
  const baseClasses = 'rounded-[26px] relative transition-shadow duration-300';

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-7',
    xl: 'p-8 sm:p-10',
  };

  const variantClasses = {
    white: 'bg-white border border-[#E2EEF7] shadow-soft text-[#1F2A37]',
    highlight:
      'bg-gradient-to-br from-[#0E8FC9] to-[#35B6E8] text-white shadow-card-blue border border-white/20',
    soft: 'bg-[#E8F4FB] border border-[#D3E8F5] text-[#1F2A37]',
    glass: 'glass shadow-soft text-[#1F2A37]',
  };

  const liftHoverProps = hoverLift
    ? {
        whileHover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' as const } },
      }
    : {};

  return (
    <motion.div
      ref={ref}
      {...liftHoverProps}
      className={twMerge(clsx(baseClasses, paddingClasses[padding], variantClasses[variant], hoverLift ? 'hover:shadow-soft-lg cursor-pointer' : '', className))}
      {...props}
    >
      {children}
    </motion.div>
  );
});
