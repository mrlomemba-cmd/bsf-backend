import React from 'react';
import { cn } from '../../utils/cn';

interface BSFLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { container: 'gap-0.5', bsf: 'text-2xl', tag: 'text-[6px]', sub: 'text-[5px]', border: 'p-2' },
  md: { container: 'gap-1', bsf: 'text-4xl', tag: 'text-[8px]', sub: 'text-[7px]', border: 'p-3' },
  lg: { container: 'gap-1.5', bsf: 'text-6xl', tag: 'text-[10px]', sub: 'text-[9px]', border: 'p-4' },
  xl: { container: 'gap-2', bsf: 'text-8xl', tag: 'text-[13px]', sub: 'text-[11px]', border: 'p-6' },
};

export function BSFLogo({ size = 'md', className }: BSFLogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn('flex flex-col items-center', s.container, className)}>
      {/* Outer border container */}
      <div
        className={cn(
          'relative border border-white/80 flex flex-col items-center',
          s.border,
          'select-none'
        )}
      >
        {/* MULTISERVICE tag */}
        <span
          className={cn(
            'tracking-[0.4em] font-light text-white/90 uppercase',
            s.tag
          )}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          MULTISERVICE
        </span>

        {/* BSF main letters */}
        <span
          className={cn(
            'font-black text-white leading-none tracking-widest',
            s.bsf
          )}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          BSF
        </span>

        {/* Divider */}
        <div className="w-full border-t border-white/60 my-1" />

        {/* BANQUE SOLOLA FOREVER */}
        <span
          className={cn(
            'tracking-[0.25em] font-medium text-white/90 uppercase',
            s.sub
          )}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          BANQUE • SOLOLA • FOREVER
        </span>
      </div>
    </div>
  );
}
