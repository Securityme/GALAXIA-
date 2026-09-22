'use client';

import React from 'react';
import { 
  Shield, 
  Cpu, 
  Users, 
  Coins, 
  Globe, 
  Truck, 
  Compass, 
  Anchor, 
  Sparkles, 
  Award, 
  Zap,
  Eye
} from 'lucide-react';

interface AvatarPortraitProps {
  id: string;
  name: string;
  roleOrTitle?: string;
  neonColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'leader' | 'council';
  poleId?: string;
  onClick?: () => void;
  className?: string;
  showBadge?: boolean;
}

export function AvatarPortrait({
  id,
  name,
  roleOrTitle,
  neonColor = '#00f3ff',
  size = 'md',
  variant = 'leader',
  poleId,
  onClick,
  className = '',
  showBadge = true
}: AvatarPortraitProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-12 h-12 text-[11px]',
    lg: 'w-20 h-20 text-xs',
    xl: 'w-32 h-32 text-sm'
  }[size];

  const getPoleIcon = () => {
    switch (poleId) {
      case 'military': return <Shield className="w-1/2 h-1/2" />;
      case 'scientific': return <Cpu className="w-1/2 h-1/2" />;
      case 'civilization': return <Users className="w-1/2 h-1/2" />;
      case 'economic': return <Coins className="w-1/2 h-1/2" />;
      case 'diplomatic': return <Globe className="w-1/2 h-1/2" />;
      case 'logistics': return <Truck className="w-1/2 h-1/2" />;
      default:
        return id.includes('unit7') ? <Cpu className="w-1/2 h-1/2" /> :
               id.includes('kael') ? <Compass className="w-1/2 h-1/2" /> :
               id.includes('malakor') ? <Shield className="w-1/2 h-1/2" /> :
               id.includes('seraphina') ? <Sparkles className="w-1/2 h-1/2" /> :
               id.includes('elena') ? <CrownIcon className="w-1/2 h-1/2" /> :
               <Anchor className="w-1/2 h-1/2" />;
    }
  };

  // Extract initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      style={{
        borderColor: neonColor,
        boxShadow: `0 0 12px ${neonColor}33`
      }}
      className={`relative select-none shrink-0 rounded-lg bg-[#030612] border flex flex-col items-center justify-center overflow-hidden transition-all duration-200 group ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
    >
      {/* Background Cybernetic Scanning Lines */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '100% 4px'
        }}
      />

      {/* Ambient Neon Radial Flare */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${neonColor} 0%, transparent 75%)`
        }}
      />

      {/* Stylized Holographic Silhouette / Icon */}
      <div
        className="relative z-10 flex flex-col items-center justify-center font-bold font-mono transition-transform duration-300 group-hover:scale-110"
        style={{ color: neonColor }}
      >
        {size === 'sm' ? (
          <span>{initials}</span>
        ) : (
          <>
            <div className="mb-0.5">{getPoleIcon()}</div>
            <span className="font-extrabold tracking-wider">{initials}</span>
          </>
        )}
      </div>

      {/* Cybernetic Corner Markers */}
      <div 
        className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l"
        style={{ borderColor: neonColor }}
      />
      <div 
        className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r"
        style={{ borderColor: neonColor }}
      />

      {/* Status Active Pulse Dot */}
      {showBadge && (
        <span 
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: neonColor }}
        />
      )}
    </div>
  );
}

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Award {...props} />
  );
}
