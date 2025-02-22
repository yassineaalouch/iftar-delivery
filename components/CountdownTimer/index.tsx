import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  startHour: number; // 8 for 8 AM
  endHour: number;   // 15 for 3 PM
}

const CountdownTimer = ({ startHour, endHour }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [status, setStatus] = useState<'before' | 'during' | 'after'>('during');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Before opening hours
      if (currentHour < startHour) {
        setStatus('before');
        const target = new Date(now);
        target.setHours(startHour, 0, 0, 0);
        return getTimeString(target.getTime() - now.getTime());
      }

      // After closing hours
      if (currentHour >= endHour) {
        setStatus('after');
        const target = new Date(now);
        target.setDate(target.getDate() + 1);
        target.setHours(startHour, 0, 0, 0);
        return getTimeString(target.getTime() - now.getTime());
      }

      // During operating hours
      setStatus('during');
      const target = new Date(now);
      target.setHours(endHour, 0, 0, 0);
      return getTimeString(target.getTime() - now.getTime());
    };

    const getTimeString = (diff: number) => {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startHour, endHour]);

  const getStatusContent = () => {
    switch (status) {
      case 'before':
        return {
          title: 'Orders Open In:',
          message: 'Orders start at 8 AM',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      case 'during':
        return {
          title: 'Orders Close In:',
          message: 'Order now for same-day delivery',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800'
        };
      case 'after':
        return {
          title: 'Next Order Window:',
          message: 'Orders resume tomorrow at 8 AM',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800'
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className={`text-center ${content.bgColor} rounded-lg p-3 border ${content.borderColor}`}>
      <p className={`${content.textColor} text-sm font-medium mb-1`}>
        {content.title}
      </p>
      <div className={`font-mono text-2xl font-bold ${content.textColor}`}>
        {timeLeft}
      </div>
      <p className={`${content.textColor} text-xs mt-1 opacity-75`}>
        {content.message}
      </p>
    </div>
  );
};

export default CountdownTimer; 