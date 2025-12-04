interface TextareaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDarkMode: boolean;
  rows?: number;
}

export default function TextareaInput({ value, onChange, placeholder, isDarkMode, rows = 4 }: TextareaInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3.5 rounded-xl resize-none transition-all duration-200 ${
        isDarkMode
          ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
          : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
      } focus:outline-none focus:border-[#B5A692]`}
    />
  );
}
