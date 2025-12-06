
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type VerifiedBadgeProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  inline?: boolean;
}

export default function VerifiedBadge({ size = 'sm', className, inline }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const badge = (
    <div className={cn(
      'bg-blue-500 rounded-full flex items-center justify-center text-white',
      sizeClasses[size],
      inline && 'inline-block align-middle ml-1',
      className
    )}>
      <Check className={cn('stroke-current', size === 'sm' && 'h-3 w-3', size === 'md' && 'h-4 w-4', size === 'lg' && 'h-5 w-5')} strokeWidth={3} />
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent>
        <p>Verified Account</p>
      </TooltipContent>
    </Tooltip>
  )
}
