import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

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
        className='flex items-center space-x-2 self-start my-2'
      >
        <div className='w-2 h-2 bg-gray-500 rounded-full animate-pulse'></div>
        <div className='w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75'></div>
        <div className='w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150'></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-3 rounded-lg max-w-xs my-2',
        isUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 dark:bg-gray-700 self-start'
      )}
    >
      {text}
    </motion.div>
  );
}