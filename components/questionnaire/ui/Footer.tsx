interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`fixed bottom-0 left-64 right-80 py-4 flex items-center justify-center gap-8 text-sm ${isDarkMode ? 'bg-[#1a1a1a] text-gray-500' : 'bg-[#F5F5F5] text-gray-500'}`}>
      <span>Succession Story</span>
      <a href="#" className="hover:text-[#B5A692]">Terms</a>
      <a href="#" className="hover:text-[#B5A692]">Policy</a>
      <a href="#" className="hover:text-[#B5A692]">Privacy</a>
    </footer>
  );
}
