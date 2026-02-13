import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface SpinningWheelProps {
  options: string[];
  onSpinComplete?: (result: string) => void;
  spinTrigger?: number;
}

export function SpinningWheel({ options, onSpinComplete, spinTrigger }: SpinningWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B195', '#C06C84'
  ];

  const segmentAngle = 360 / options.length;

  useEffect(() => {
    if (spinTrigger && spinTrigger > 0) {
      spinWheel();
    }
  }, [spinTrigger]);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedOption(null);

    // Random rotation between 1440 and 2160 degrees (4-6 full spins)
    const minRotation = 1440;
    const maxRotation = 2160;
    const randomRotation = Math.random() * (maxRotation - minRotation) + minRotation;
    
    // Calculate final position to determine which option is selected
    const finalRotation = (rotation + randomRotation) % 360;
    const normalizedRotation = (360 - finalRotation) % 360;
    const selectedIndex = Math.floor(normalizedRotation / segmentAngle) % options.length;
    
    setRotation(rotation + randomRotation);

    // After animation completes
    setTimeout(() => {
      setIsSpinning(false);
      const result = options[selectedIndex];
      setSelectedOption(result);
      if (onSpinComplete) {
        onSpinComplete(result);
      }
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {/* Pointer/Arrow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
        </div>

        {/* Spinning Wheel */}
        <motion.div
          ref={wheelRef}
          className="relative w-[400px] h-[400px] rounded-full shadow-2xl"
          animate={{ rotate: rotation }}
          transition={{
            duration: 4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <svg width="400" height="400" viewBox="0 0 400 400" className="rounded-full">
            {options.map((option, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;

              const x1 = 200 + 200 * Math.cos(startAngle);
              const y1 = 200 + 200 * Math.sin(startAngle);
              const x2 = 200 + 200 * Math.cos(endAngle);
              const y2 = 200 + 200 * Math.sin(endAngle);

              const textAngle = (index * segmentAngle + segmentAngle / 2) * (Math.PI / 180);
              const textX = 200 + 130 * Math.cos(textAngle - Math.PI / 2);
              const textY = 200 + 130 * Math.sin(textAngle - Math.PI / 2);
              const textRotation = index * segmentAngle + segmentAngle / 2;

              return (
                <g key={index}>
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 200 200 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  >
                    {option}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx="200" cy="200" r="30" fill="white" stroke="#333" strokeWidth="3" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}