import { cn } from '../../utils/cn';

interface ProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  label,
  className,
  showPercentage = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm text-white/70 font-medium">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-white tabular-nums">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
