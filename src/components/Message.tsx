import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

export interface MessageProps {
  isUser: boolean;
  text: string;
  typing?: boolean;
}

export function Message({ isUser, text, typing }: MessageProps) {
  if (typing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className='flex items-start gap-3'
      >
        <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0'>
          <Bot className='w-5 h-5 text-primary-foreground' />
        </div>
        <div className='flex items-center space-x-1.5 mt-1.5'>
          <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
          <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
          <div className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        'flex items-start gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-primary'
      )}>
        {isUser ? (
          <User className='w-5 h-5 text-white' />
        ) : (
          <Bot className='w-5 h-5 text-primary-foreground' />
        )}
      </div>

      {/* Message Bubble */}
      <div className={cn(
        'rounded-2xl px-4 py-3 max-w-[75%] shadow-sm',
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
          : 'bg-card border border-border text-card-foreground'
      )}>
        <p className='text-sm leading-relaxed whitespace-pre-wrap break-words'>
          {text}
        </p>
      </div>
    </motion.div>
  );
}