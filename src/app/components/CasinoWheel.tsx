import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CasinoWheelProps {
  options: string[];
  onSpinComplete?: (result: string) => void;
  spinTrigger?: number;
}

export function CasinoWheel({ options, onSpinComplete, spinTrigger }: CasinoWheelProps) {
  const [offset, setOffset] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalIndex, setFinalIndex] = useState(0);

  // Create a long repeating array for smooth scrolling
  const repeatedOptions = [...options, ...options, ...options, ...options, ...options];

  useEffect(() => {
    if (spinTrigger && spinTrigger > 0) {
      spinWheel();
    }
  }, [spinTrigger]);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Random final position
    const randomIndex = Math.floor(Math.random() * options.length);
    setFinalIndex(randomIndex);
    
    // Calculate total distance to travel
    // We want to spin through many items and land on the selected one
    const itemHeight = 120; // Height of each item in pixels
    const visibleStart = 2; // Start from the 3rd item in repeated array
    const spinsBeforeLanding = 60; // Number of items to pass before landing
    const targetPosition = (visibleStart + spinsBeforeLanding + randomIndex) * itemHeight;
    
    setOffset(targetPosition);
  };

  const handleAnimationComplete = () => {
    if (isSpinning) {
      setIsSpinning(false);
      const result = options[finalIndex];
      if (onSpinComplete) {
        onSpinComplete(result);
      }
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Casino display box */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border-8 border-yellow-500">
        {/* Top decorative lights */}
        <div className="absolute top-0 left-0 right-0 flex justify-around p-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                isSpinning
                  ? 'bg-yellow-400 animate-pulse'
                  : 'bg-yellow-600/50'
              }`}
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Display window with mask */}
        <div className="relative bg-black rounded-2xl p-4 mt-6 mb-6 h-[400px] overflow-hidden border-4 border-yellow-600/30">
          {/* Scanlines effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent pointer-events-none z-10"></div>
          
          {/* Selection indicator - red box in the middle */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[120px] border-4 border-red-500 bg-red-500/10 z-10 pointer-events-none rounded-lg"></div>

          {/* Top fade mask */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
          
          {/* Bottom fade mask */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>

          {/* Scrolling list */}
          <motion.div
            className="relative"
            initial={{ y: 0 }}
            animate={{ y: -offset }}
            transition={{
              duration: isSpinning ? 20 : 0,
              ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing that slows down at the end
            }}
            onAnimationComplete={handleAnimationComplete}
            style={{
              paddingTop: '140px', // Center the first item
            }}
          >
            {repeatedOptions.map((pub, index) => {
              const isMiddleItem = offset > 0 && Math.abs((offset - index * 120) % 120) < 10;
              
              return (
                <div
                  key={`${pub}-${index}`}
                  className="flex items-center justify-center h-[120px] transition-all duration-200"
                >
                  <p
                    className={`font-bold text-yellow-300 transition-all duration-300 ${
                      isMiddleItem && !isSpinning ? 'scale-110' : ''
                    }`}
                    style={{
                      fontSize: '2.5rem',
                      textShadow: isMiddleItem && !isSpinning
                        ? '0 0 30px rgba(250,204,21,1), 0 0 60px rgba(250,204,21,0.5)'
                        : '0 0 10px rgba(250,204,21,0.5)',
                      opacity: 0.9,
                    }}
                  >
                    {pub}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom decorative lights */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around p-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                isSpinning
                  ? 'bg-yellow-400 animate-pulse'
                  : 'bg-yellow-600/50'
              }`}
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Spinning indicator */}
        {isSpinning && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div className="text-red-500 text-6xl animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
              🎰
            </div>
          </div>
        )}
      </div>

      {/* Side decorations */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-40 bg-gradient-to-r from-red-600 to-red-700 rounded-l-full shadow-lg"></div>
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-40 bg-gradient-to-l from-red-600 to-red-700 rounded-r-full shadow-lg"></div>
    </div>
  );
}
