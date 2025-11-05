import { useState } from 'react';
import { ChatInput } from './components/ChatInput';
import { ChatLayout } from './components/ChatLayout';
import { Header } from './components/Header';
import { Message, Message as MessageType } from './components/Message';
import { Toaster } from 'sonner';

export default function App() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), text, sender: 'user' }]);
    setIsTyping(true);
    // Simulate a bot response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now(), text: 'This is a sample response.', sender: 'bot' }]);
    }, 2000);
  };

  return (
    <div className='flex flex-col h-screen'>
      <Toaster />
      <Header />
      <ChatLayout>
        {messages.map((msg) => (
          <Message key={msg.id} {...msg} />
        ))}
        {isTyping && <Message text='...' sender='bot' isTyping />}
      </ChatLayout>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
