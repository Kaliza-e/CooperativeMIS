import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface DotGridProps {
  variant?: 'subtle' | 'dense' | 'spacious' | 'accent' | 'hero' | 'light';
  mask?: 'center' | 'soft' | 'top' | 'tr' | 'bl' | 'linear' | 'fade-down' | 'none';
  className?: string;
  style?: React.CSSProperties;
}

const variantClasses: Record<NonNullable<DotGridProps['variant']>, string> = {
  subtle: 'dot-grid-subtle',
  dense: 'dot-grid-dense',
  spacious: 'dot-grid-spacious',
  accent: 'dot-grid-accent',
  hero: 'dot-grid-hero',
  light: 'dot-grid-light',
};

const maskClasses: Record<NonNullable<DotGridProps['mask']>, string> = {
  center: 'mask-radial-center',
  soft: 'mask-radial-soft',
  top: 'mask-radial-top',
  tr: 'mask-radial-tr',
  bl: 'mask-radial-bl',
  linear: 'mask-linear-fade',
  'fade-down': 'mask-fade-down',
  none: '',
};

export const DotGrid: React.FC<DotGridProps> = ({
  variant = 'subtle',
  mask = 'none',
  className = '',
  style,
}) => {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        clsx(
          'absolute inset-0 pointer-events-none select-none z-0',
          variantClasses[variant],
          maskClasses[mask],
          className
        )
      )}
      style={style}
    />
  );
};

export default DotGrid;

