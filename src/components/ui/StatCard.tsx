import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  isHighlight?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  isHighlight = false,
  className = '',
}: StatCardProps) {
  if (isHighlight) {
    return (
      <Card
        variant="highlight"
        padding="lg"
        hoverLift
        className={`flex flex-col justify-between min-h-[170px] overflow-hidden ${className}`}
      >
        {/* Subtle decorative background circles */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none blur-[1px]" />
        <div className="absolute right-8 top-3 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-white/80 text-xs font-bold uppercase tracking-wider block">
              {title}
            </span>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-black text-white mt-1 tracking-tight"
            >
              {value}
            </motion.div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
            {icon}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
          {trend ? (
            <div className="flex items-center gap-1.5 font-bold text-white">
              {trend.isPositive !== false ? (
                <TrendingUp size={14} className="text-emerald-300" />
              ) : (
                <TrendingDown size={14} className="text-rose-300" />
              )}
              <span>{trend.value}</span>
              {trend.label && (
                <span className="text-white/70 font-normal ml-0.5">{trend.label}</span>
              )}
            </div>
          ) : (
            <span className="text-white/75 text-[11px] font-medium">
              {subtitle || 'Real-time cooperative ledger'}
            </span>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="white"
      padding="lg"
      hoverLift
      className={`flex flex-col justify-between min-h-[170px] ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
            {title}
          </span>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-black text-[#1F2A37] mt-1 tracking-tight"
          >
            {value}
          </motion.div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center shrink-0 shadow-2xs">
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs">
        {trend ? (
          <div className="flex items-center gap-1.5 font-bold">
            {trend.isPositive !== false ? (
              <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                <TrendingUp size={14} />
                {trend.value}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-500 font-extrabold">
                <TrendingDown size={14} />
                {trend.value}
              </span>
            )}
            {trend.label && (
              <span className="text-[#6B7280] font-normal">{trend.label}</span>
            )}
          </div>
        ) : (
          <span className="text-[#6B7280] text-[11px] font-medium">
            {subtitle || 'System records updated'}
          </span>
        )}
      </div>
    </Card>
  );
}
