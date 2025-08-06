interface LogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export default function Logo({ size = "md", animated = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg
        viewBox="0 0 64 64"
        className={`w-full h-full ${animated ? "animate-pulse" : ""}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle - represents security */}
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="url(#gradient1)"
          strokeWidth="2"
          className={animated ? "animate-spin" : ""}
          style={{ animationDuration: "8s" }}
        />
        
        {/* Inner hexagon - represents stability */}
        <path
          d="M32 8 L48 20 L48 44 L32 56 L16 44 L16 20 Z"
          fill="url(#gradient2)"
          className={animated ? "animate-pulse" : ""}
          style={{ animationDelay: "0.5s" }}
        />
        
        {/* Credit card icon in center */}
        <rect
          x="20"
          y="26"
          width="24"
          height="16"
          rx="2"
          fill="#00ff41"
          className={animated ? "animate-bounce" : ""}
          style={{ animationDuration: "2s", animationDelay: "1s" }}
        />
        
        {/* Card stripe */}
        <rect
          x="20"
          y="30"
          width="24"
          height="2"
          fill="#ffffff"
        />
        
        {/* Card chip */}
        <rect
          x="23"
          y="33"
          width="3"
          height="2"
          rx="0.5"
          fill="#ffffff"
        />
        
        {/* Signal waves - representing digital transactions */}
        <path
          d="M50 20 Q54 24 50 28"
          stroke="#00ff41"
          strokeWidth="2"
          fill="none"
          className={animated ? "animate-ping" : ""}
          style={{ animationDelay: "0.2s" }}
        />
        <path
          d="M52 22 Q55 24 52 26"
          stroke="#00ff41"
          strokeWidth="1.5"
          fill="none"
          className={animated ? "animate-ping" : ""}
          style={{ animationDelay: "0.4s" }}
        />
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff41" />
            <stop offset="100%" stopColor="#00cc33" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff41" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00cc33" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
