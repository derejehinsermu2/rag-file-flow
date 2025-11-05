import { ChatLayout } from './components/ChatLayout';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <div className='flex flex-col h-screen bg-background'>
      <Toaster position="top-center" />
      <ChatLayout />
    </div>
  );
}
