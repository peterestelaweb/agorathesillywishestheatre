
import React, { useState, useEffect } from 'react';

interface Props {
  isActive: boolean;
  onTick?: (seconds: number) => void;
}

const Timer: React.FC<Props> = ({ isActive, onTick }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Sync parent state safely after render
  useEffect(() => {
    if (onTick) {
      onTick(seconds);
    }
  }, [seconds, onTick]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="clay-card clay-blue px-10 py-4 flex items-center gap-4 animate-float-slow">
      <span className="text-4xl">⏱️</span>
      <span className="text-4xl font-black font-display text-[#0369A1]">{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;
