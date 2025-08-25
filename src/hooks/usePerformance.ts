import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

interface UsePerformanceOptions {
  enableLazyLoading?: boolean;
  enableIntersectionObserver?: boolean;
  enablePerformanceMonitoring?: boolean;
  threshold?: number;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    enableLazyLoading = true,
    enableIntersectionObserver = true,
    enablePerformanceMonitoring = true,
    threshold = 0.1
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring || typeof window === 'undefined') return;

    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        
        // Use PerformanceObserver for LCP to avoid deprecated API warning
        let largestContentfulPaint = 0;
        if ('PerformanceObserver' in window) {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              largestContentfulPaint = lastEntry.startTime;
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        }
        
        // Calculate Cumulative Layout Shift
        let cumulativeLayoutShift = 0;
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                cumulativeLayoutShift += (entry as any).value;
              }
            }
          });
          observer.observe({ entryTypes: ['layout-shift'] });
        }

        setPerformanceMetrics({
          loadTime,
          firstContentfulPaint,
          largestContentfulPaint,
          cumulativeLayoutShift
        });
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [enablePerformanceMonitoring]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableIntersectionObserver || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsInViewport(true);
        }
      },
      {
        threshold,
        rootMargin: '50px'
      }
    );

    observer.observe(elementRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableIntersectionObserver, threshold]);

  // Lazy loading utility
  const lazyLoad = useCallback((src: string, placeholder?: string) => {
    if (!enableLazyLoading) return src;

    return isInViewport ? src : placeholder || '';
  }, [enableLazyLoading, isInViewport]);

  // Debounced scroll handler
  const useDebouncedScroll = useCallback((callback: () => void, delay: number = 16) => {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    return useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(callback, delay);
    }, [callback, delay]);
  }, []);

  // Throttled resize handler
  const useThrottledResize = useCallback((callback: () => void, delay: number = 100) => {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const lastRun = useRef<number>(0);

    return useCallback(() => {
      const now = Date.now();
      if (lastRun.current && now - lastRun.current < delay) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastRun.current = now;
          callback();
        }, delay - (now - lastRun.current));
      } else {
        lastRun.current = now;
        callback();
      }
    }, [callback, delay]);
  }, []);

  // Preload critical resources
  const preloadResource = useCallback((href: string, as: string = 'fetch') => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }, []);

  // Optimize images for mobile
  const getOptimizedImageSrc = useCallback((src: string, width?: number) => {
    if (!src) return src;
    
    // Add responsive image parameters
    const params = new URLSearchParams();
    if (width) {
      params.append('w', width.toString());
    }
    params.append('q', '80'); // Quality
    params.append('f', 'auto'); // Format auto
    
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}${params.toString()}`;
  }, []);

  // Check if device is mobile
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  // Check if device supports touch
  const isTouchDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Get device pixel ratio
  const getPixelRatio = useCallback(() => {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
  }, []);

  // Optimize for mobile performance
  const optimizeForMobile = useCallback(() => {
    if (!isMobile()) return;

    // Reduce animations on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
    
    // Optimize touch scrolling
    (document.body.style as any).webkitOverflowScrolling = 'touch';
    
    // Reduce motion if user prefers
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }
  }, [isMobile]);

  useEffect(() => {
    optimizeForMobile();
  }, [optimizeForMobile]);

  return {
    elementRef,
    isVisible,
    isInViewport,
    performanceMetrics,
    lazyLoad,
    useDebouncedScroll,
    useThrottledResize,
    preloadResource,
    getOptimizedImageSrc,
    isMobile,
    isTouchDevice,
    getPixelRatio,
    optimizeForMobile
  };
}

// Hook for monitoring scroll performance
export function useScrollPerformance() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          setIsScrolling(true);
          
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 150);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return { scrollY, isScrolling };
}

// Hook for monitoring network performance
export function useNetworkPerformance() {
  const [connection, setConnection] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null>(null);

  useEffect(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setConnection({
        effectiveType: conn.effectiveType || 'unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0
      });

      const handleChange = () => {
        setConnection({
          effectiveType: conn.effectiveType || 'unknown',
          downlink: conn.downlink || 0,
          rtt: conn.rtt || 0
        });
      };

      conn.addEventListener('change', handleChange);
      return () => conn.removeEventListener('change', handleChange);
    }
  }, []);

  return connection;
}
