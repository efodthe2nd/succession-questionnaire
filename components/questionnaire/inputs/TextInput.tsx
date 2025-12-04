interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDarkMode: boolean;
}

export default function TextInput({ value, onChange, placeholder, isDarkMode }: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3.5 rounded-xl transition-all duration-200 ${
        isDarkMode
          ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
          : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
      } focus:outline-none focus:border-[#B5A692]`}
    />
  );
}
