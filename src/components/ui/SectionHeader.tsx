import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${
        isCenter ? 'text-center md:text-center items-center' : ''
      } ${className}`}
    >
      <div className={isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        {eyebrow && (
          <span className="inline-block text-xs font-bold uppercase tracking-[0.16em] text-[#0E8FC9] mb-1.5">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-[#6B7280] mt-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

