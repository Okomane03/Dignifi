import React from 'react';

interface DignifiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const DignifiLogo: React.FC<DignifiLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: { text: 'text-2xl', bubbleSize: 'w-4 h-4', bubbleTop: '-top-1.5', bubbleRight: '-right-1.5', dots: 'w-0.5 h-0.5 gap-0.5' },
    md: { text: 'text-3xl', bubbleSize: 'w-5 h-5', bubbleTop: '-top-2.5', bubbleRight: '-right-2', dots: 'w-0.5 h-0.5 gap-0.5' },
    lg: { text: 'text-5xl sm:text-6xl', bubbleSize: 'w-7 sm:w-8 h-7 sm:h-8', bubbleTop: '-top-3 sm:-top-4', bubbleRight: '-right-2 sm:-right-3', dots: 'w-1 h-1 gap-0.5 sm:gap-1' },
    xl: { text: 'text-6xl sm:text-7xl', bubbleSize: 'w-9 sm:w-11 h-9 sm:h-11', bubbleTop: '-top-4 sm:-top-5', bubbleRight: '-right-3 sm:-right-4', dots: 'w-1 h-1 gap-1' },
  }[size];

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="flex items-baseline font-bold tracking-tight text-[#162740] font-sans select-none leading-none">
        <span className={`${sizeStyles.text} font-black tracking-tight`}>Dignif</span>
        
        {/* The last 'i' with custom speech bubble dot */}
        <div className="relative inline-flex flex-col items-center ml-0.5">
          {/* Speech bubble replacing the dot */}
          <div
            className={`absolute ${sizeStyles.bubbleTop} ${sizeStyles.bubbleRight} ${sizeStyles.bubbleSize} bg-[#368579] rounded-full flex items-center justify-center shadow-xs`}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 65% 75%, 45% 100%, 50% 75%, 0% 75%)',
              paddingBottom: '2px'
            }}
          >
            <div className={`flex items-center ${sizeStyles.dots}`}>
              <div className="rounded-full bg-white opacity-95 aspect-square" />
              <div className="rounded-full bg-white opacity-95 aspect-square" />
              <div className="rounded-full bg-white opacity-95 aspect-square" />
            </div>
          </div>

          {/* Stem of the lowercase 'i' (dotless i) */}
          <span className={`${sizeStyles.text} font-black leading-none`}>ı</span>
        </div>
      </div>

      {showTagline && (
        <div className="mt-2">
          <p className="text-sm sm:text-base font-semibold text-[#1F334D] tracking-wide">
            Document. Reflect. Decide.
          </p>
          <p className="text-xs text-[#5D6F80] mt-0.5">
            Your workplace experiences. Your records. Your choice.
          </p>
        </div>
      )}
    </div>
  );
};
