interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`fixed bottom-0 left-64 right-80 py-3 flex flex-col items-center justify-center gap-2 ${isDarkMode ? 'bg-[#1a1a1a] text-gray-500' : 'bg-[#F5F5F5] text-gray-500'}`}>
      <p className={`text-xs text-center px-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        I understand that Succession Story does not change my estate plan and that it is not a legal document. Anything I write here is personal expression only.
      </p>
      <div className="flex items-center gap-8 text-sm">
        <a href="/terms" className="hover:text-[#B5A692]">Terms</a>
        <a href="/privacy" className="hover:text-[#B5A692]">Privacy</a>
      </div>
    </footer>
  );
}
