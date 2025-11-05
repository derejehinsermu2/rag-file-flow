import { Moon, Sun, Bot, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className='sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border'>
      <div className='flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8'>
        {/* Logo and Title */}
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg'>
            <Bot className='w-6 h-6 text-primary-foreground' />
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-bold text-foreground'>Rag AI Agent Assistant</h1>
              <Sparkles className='w-4 h-4 text-primary animate-pulse' />
            </div>
            <p className='text-xs text-muted-foreground'>Built by Gebeya Dala</p>
          </div>
        </div>

        {/* Theme Toggle - Far Right */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className='p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors ml-auto'
          aria-label='Toggle theme'
        >
          {theme === 'light' ? (
            <Moon className='w-5 h-5 text-secondary-foreground' />
          ) : (
            <Sun className='w-5 h-5 text-secondary-foreground' />
          )}
        </button>
      </div>
    </header>
  );
}