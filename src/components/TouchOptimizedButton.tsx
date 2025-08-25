import React, { useState, useCallback, forwardRef } from 'react';
import { cn } from '../lib/utils';

interface TouchOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ripple?: boolean;
  touchFeedback?: boolean;
  children: React.ReactNode;
}

export const TouchOptimizedButton = forwardRef<HTMLButtonElement, TouchOptimizedButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      ripple = true,
      touchFeedback = true,
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number; id: number } | null>(null);

    // Handle touch/click with feedback
    const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      if (disabled || loading) return;

      // Create ripple effect
      if (ripple) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        
        setRippleEffect({ x, y, id: Date.now() });
        
        // Remove ripple after animation
        setTimeout(() => setRippleEffect(null), 600);
      }

      // Touch feedback
      if (touchFeedback) {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
      }

      onClick?.(e as React.MouseEvent<HTMLButtonElement>);
    }, [disabled, loading, ripple, touchFeedback, onClick]);

    // Handle touch events for better mobile experience
    const handleTouchStart = useCallback(() => {
      if (disabled || loading) return;
      if (touchFeedback) setIsPressed(true);
    }, [disabled, loading, touchFeedback]);

    const handleTouchEnd = useCallback(() => {
      if (disabled || loading) return;
      if (touchFeedback) {
        setTimeout(() => setIsPressed(false), 150);
      }
    }, [disabled, loading, touchFeedback]);

    // Variant styles
    const variantStyles = {
      primary: 'bg-muted-gold text-charcoal-black hover:bg-muted-gold/90 active:bg-muted-gold/80 shadow-lg hover:shadow-xl',
      secondary: 'bg-wine-red text-cream hover:bg-wine-red/90 active:bg-wine-red/80 shadow-lg hover:shadow-xl',
      outline: 'border-2 border-muted-gold text-muted-gold hover:bg-muted-gold hover:text-charcoal-black active:bg-muted-gold/90',
      ghost: 'text-muted-gold hover:bg-muted-gold/10 active:bg-muted-gold/20',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg hover:shadow-xl'
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm min-h-[32px]',
      md: 'px-4 py-2 text-base min-h-[40px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
      xl: 'px-8 py-4 text-xl min-h-[56px]'
    };

    // Base styles
    const baseStyles = cn(
      'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-muted-gold focus:ring-offset-2 focus:ring-offset-background',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'touch-manipulation select-none',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      isPressed && 'scale-95',
      loading && 'cursor-wait',
      className
    );

    return (
      <button
        ref={ref}
        className={baseStyles}
        disabled={disabled || loading}
        onClick={handleInteraction}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Ripple effect */}
        {rippleEffect && (
          <span
            className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
            style={{
              left: rippleEffect.x - 20,
              top: rippleEffect.y - 20,
              width: 40,
              height: 40,
              animation: 'ripple 0.6s ease-out'
            }}
          >
            <span className="absolute inset-0 bg-white/30 rounded-full scale-0 animate-ping" />
          </span>
        )}

        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icon and content */}
        <div className="flex items-center justify-center gap-2">
          {icon && iconPosition === 'left' && !loading && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
          {icon && iconPosition === 'right' && !loading && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </div>

        {/* Touch feedback overlay */}
        {touchFeedback && (
          <div
            className={cn(
              'absolute inset-0 rounded-lg transition-opacity duration-150 pointer-events-none',
              isPressed ? 'bg-black/10' : 'bg-transparent'
            )}
          />
        )}
      </button>
    );
  }
);

TouchOptimizedButton.displayName = 'TouchOptimizedButton';

// Specialized button variants
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<TouchOptimizedButtonProps, 'variant'>>(
  (props, ref) => <TouchOptimizedButton ref={ref} variant="primary" {...props} />
);

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<TouchOptimizedButtonProps, 'variant'>>(
  (props, ref) => <TouchOptimizedButton ref={ref} variant="secondary" {...props} />
);

export const OutlineButton = forwardRef<HTMLButtonElement, Omit<TouchOptimizedButtonProps, 'variant'>>(
  (props, ref) => <TouchOptimizedButton ref={ref} variant="outline" {...props} />
);

export const GhostButton = forwardRef<HTMLButtonElement, Omit<TouchOptimizedButtonProps, 'variant'>>(
  (props, ref) => <TouchOptimizedButton ref={ref} variant="ghost" {...props} />
);

export const DangerButton = forwardRef<HTMLButtonElement, Omit<TouchOptimizedButtonProps, 'variant'>>(
  (props, ref) => <TouchOptimizedButton ref={ref} variant="danger" {...props} />
);

// Floating action button for mobile
export const FloatingActionButton = forwardRef<HTMLButtonElement, Omit<TouchOptimizedButtonProps, 'size' | 'fullWidth'>>(
  ({ className, ...props }, ref) => (
    <TouchOptimizedButton
      ref={ref}
      size="lg"
      className={cn(
        'fixed bottom-6 right-6 z-50 rounded-full shadow-2xl hover:shadow-3xl',
        'w-14 h-14 p-0 min-h-[56px]',
        className
      )}
      {...props}
    />
  )
);

// Add ripple animation to global styles
const rippleStyles = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'touch-optimized-button-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = rippleStyles;
    document.head.appendChild(style);
  }
}
