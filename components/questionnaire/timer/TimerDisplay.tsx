interface TimerDisplayProps {
  hours: string;
  minutes: string;
  seconds: string;
  compact?: boolean;
}

export default function TimerDisplay({ hours, minutes, seconds, compact = false }: TimerDisplayProps) {
  return (
    <div className={`${compact ? 'flex items-center gap-2' : ''}`}>
      <div className={`flex items-center justify-center gap-1 ${compact ? '' : 'bg-black rounded-full px-4 py-3'}`}>
        <div className={`text-center ${compact ? 'flex items-center gap-1' : ''}`}>
          <span className={`font-mono font-bold text-white ${compact ? 'text-lg' : 'text-xl'}`}>{hours}</span>
          {!compact && <p className="text-[10px] text-gray-400 uppercase tracking-wider">Hours</p>}
        </div>
        <span className={`text-white font-bold ${compact ? 'text-lg' : 'text-xl mx-1'}`}>:</span>
        <div className={`text-center ${compact ? 'flex items-center gap-1' : ''}`}>
          <span className={`font-mono font-bold text-white ${compact ? 'text-lg' : 'text-xl'}`}>{minutes}</span>
          {!compact && <p className="text-[10px] text-gray-400 uppercase tracking-wider">Minutes</p>}
        </div>
        <span className={`text-white font-bold ${compact ? 'text-lg' : 'text-xl mx-1'}`}>:</span>
        <div className={`text-center ${compact ? 'flex items-center gap-1' : ''}`}>
          <span className={`font-mono font-bold text-white ${compact ? 'text-lg' : 'text-xl'}`}>{seconds}</span>
          {!compact && <p className="text-[10px] text-gray-400 uppercase tracking-wider">Seconds</p>}
        </div>
      </div>
    </div>
  );
}
