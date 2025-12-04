interface LoadingScreenProps {
  isDarkMode: boolean;
}

export default function LoadingScreen({ isDarkMode }: LoadingScreenProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#F5F5F5]'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#B5A692] border-t-transparent rounded-full animate-spin" />
        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading your progress...</p>
      </div>
    </div>
  );
}
