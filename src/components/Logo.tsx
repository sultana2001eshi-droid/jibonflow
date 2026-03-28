const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(45, 70%, 55%)" />
          <stop offset="1" stopColor="hsl(35, 60%, 45%)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M18 4C12 4 8 8 8 14C8 18 10 21 13 23C15 24.5 16 26 16 28L16 30C16 31.1 16.9 32 18 32C19.1 32 20 31.1 20 30L20 28C20 26 21 24.5 23 23C26 21 28 18 28 14C28 8 24 4 18 4Z"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />
      <path
        d="M14 14C14 11.8 15.8 10 18 10"
        stroke="url(#logoGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
    <div className="flex flex-col leading-none">
      <span className="font-display text-xl font-bold tracking-tight text-foreground">
        Jibon<span className="text-accent">Flow</span>
      </span>
      <span className="text-[10px] font-bangla text-muted-foreground tracking-wider">জীবনফ্লো</span>
    </div>
  </div>
);

export default Logo;
