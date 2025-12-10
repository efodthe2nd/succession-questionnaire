interface TimerDisplayProps {
  hours: string;
  minutes: string;
  seconds: string;
  compact?: boolean;
  timeRemaining?: number; // in seconds
}

export default function TimerDisplay({ hours, minutes, seconds, compact = false, timeRemaining }: TimerDisplayProps) {
  // Determine timer color based on time remaining
  // Green when expired (0), Orange when 20 minutes or less (1200 seconds), Black otherwise
  const getTimerColor = () => {
    if (timeRemaining === undefined) return 'bg-black';
    if (timeRemaining <= 0) return 'bg-green-600';
    if (timeRemaining <= 1200) return 'bg-orange-500'; // 20 minutes = 1200 seconds
    return 'bg-black';
  };

  const timerColor = getTimerColor();

  return (
    <div className={`${compact ? 'flex items-center gap-2' : ''}`}>
      <div className={`flex items-center justify-center gap-1 ${compact ? '' : `${timerColor} rounded-lg px-5 py-2`}`}>
        <div className={`text-center ${compact ? 'flex items-center gap-1' : ''}`}>
          <span className={`font-mono font-medium text-white ${compact ? 'text-lg' : 'text-sm'}`}>{hours}</span>
        </div>
        <span className={`text-white font-medium ${compact ? 'text-lg' : 'text-sm'}`}>:</span>
        <div className={`text-center ${compact ? 'flex items-center gap-1' : ''}`}>
          <span className={`font-mono font-medium text-white ${compact ? 'text-lg' : 'text-sm'}`}>{minutes}</span>
        </div>
        <span className={`text-white font-medium ${compact ? 'text-lg' : 'text-sm'}`}>:</span>
        <div className={`text-center ${compact ? 'flex items-center gap-1' : ''}`}>
          <span className={`font-mono font-medium text-white ${compact ? 'text-lg' : 'text-sm'}`}>{seconds}</span>
        </div>
      </div>
    </div>
  );
}
