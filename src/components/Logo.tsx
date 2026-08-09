import React from 'react';
import logoImg from '../assets/images/OUR LOGO.png';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-12 sm:h-16',
    md: 'h-16 sm:h-24',
    lg: 'h-24 sm:h-32',
    xl: 'h-36 sm:h-44',
  }[size];

  return (
    <div className={`flex items-center justify-center group cursor-pointer select-none ${className}`}>
      <img
        src={logoImg}
        alt="Riad Fine Art Logo"
        decoding="async"
        referrerPolicy="no-referrer"
        className={`${sizeClasses} w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-sm`}
      />
    </div>
  );
};




