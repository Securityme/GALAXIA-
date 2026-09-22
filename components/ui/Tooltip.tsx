'use client';

import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TacticalTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  disabled?: boolean;
}

export function TacticalTooltip({
  children,
  content,
  title,
  side = 'top',
  align = 'center',
  className,
  disabled = false
}: TacticalTooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            className={twMerge(
              'z-50 max-w-xs sm:max-w-sm rounded-md p-2.5 font-mono text-xs shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150',
              'bg-[#060a1a]/95 border border-purple-500/30 text-slate-200',
              'before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-br before:from-purple-500/10 before:via-cyan-500/5 before:to-rose-500/10 before:pointer-events-none',
              className
            )}
          >
            {title && (
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-300 to-rose-300 border-b border-purple-500/20 pb-1 mb-1.5 uppercase tracking-wider text-[10px]">
                {title}
              </div>
            )}
            <div className="text-[11px] leading-snug text-slate-300 relative z-10">
              {content}
            </div>
            <TooltipPrimitive.Arrow className="fill-[#060a1a] stroke-purple-500/40" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
