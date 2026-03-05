import React from 'react';
import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  className?: string;
  online?: boolean;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const onlineStyles: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5 bottom-0 right-0',
  sm: 'w-2 h-2 bottom-0 right-0',
  md: 'w-2.5 h-2.5 bottom-0 right-0',
  lg: 'w-3 h-3 bottom-0.5 right-0.5',
  xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
};

// Random but consistent colors per user initials
const avatarColors = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-indigo-500',
];

function getColorForInitials(initials: string): string {
  const index = initials.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

export function Avatar({ src, firstName = '', lastName = '', size = 'md', className, online }: AvatarProps) {
  const initials = getInitials(firstName || '?', lastName || '?');
  const colorClass = getColorForInitials(initials);

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      {src ? (
        <div className={cn('rounded-full overflow-hidden', sizeStyles[size])}>
          <Image src={src} alt={`${firstName} ${lastName}`} fill className="object-cover" />
        </div>
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0',
            sizeStyles[size],
            colorClass
          )}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className={cn(
            'absolute rounded-full bg-green-400 border-2 border-white',
            onlineStyles[size]
          )}
        />
      )}
    </div>
  );
}
