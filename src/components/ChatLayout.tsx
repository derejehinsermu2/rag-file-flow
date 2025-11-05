import { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import { Message, MessageProps } from './Message';
import { ChatInput } from './ChatInput';
import { AnimatePresence } from 'framer-motion';

export function ChatLayout() {
  const [messages, setMessages] = useState<Omit<MessageProps, 'typing'>[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { isUser: true, text }]);
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { isUser: false, text: `Echo: ${text}` }]);
    }, 2000);
  };

  const handleFileUpload = (files: File[]) => {
    const fileNames = files.map(f => f.name).join(', ');
    setMessages(prev => [...prev, { isUser: true, text: `Uploaded: ${fileNames}` }]);
    setIsTyping(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { isUser: false, text: `I've received your files: ${fileNames}` }]);
    }, 2000);
  };

  return (
    <div className='flex flex-col h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'>
      <Header />
      <div ref={chatAreaRef} className='flex-1 overflow-y-auto p-4 flex flex-col'>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <Message key={i} {...msg} />
          ))}
          {isTyping && <Message isUser={false} text='' typing />}
        </AnimatePresence>
      </div>
      <ChatInput onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} />
    </div>
  );
}