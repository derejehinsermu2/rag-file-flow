import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className='flex items-center justify-between p-4 border-b'>
      <h1 className='text-2xl font-bold'>RAG Assistant</h1>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className='p-2 rounded-full bg-gray-200 dark:bg-gray-700'
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </header>
  );
}