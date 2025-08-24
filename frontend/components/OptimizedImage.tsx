import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getPlaceholderSVG } from "@/lib/placeholderSVG";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Generate WebP and fallback URLs
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.startsWith("data:") || originalSrc.startsWith("blob:")) {
      return originalSrc;
    }

    // If it's already a WebP image, return as is
    if (originalSrc.includes(".webp")) {
      return originalSrc;
    }

    // Try to convert to WebP by replacing extension
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    return webpSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const shouldLoad = priority || isInView;

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
          aria-hidden="true"
        />
      )}

      {/* Main image with WebP support */}
      {shouldLoad && (
        <picture>
          {/* WebP source for modern browsers */}
          <source
            srcSet={getOptimizedSrc(src)}
            type="image/webp"
          />
          {/* Fallback for browsers that don't support WebP */}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        </picture>
      )}

      {/* Error state - provider baş harfiyle SVG gösterimi */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(getPlaceholderSVG(alt))}`}
            alt={alt}
            width={width}
            height={height}
            className="w-12 h-12"
          />
        </div>
      )}

      {/* Loading indicator */}
      {shouldLoad && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
