import { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import { Message, MessageProps } from './Message';
import { ChatInput } from './ChatInput';
import { AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import { toast } from 'sonner';

// Generate unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export function ChatLayout() {
  const [messages, setMessages] = useState<Omit<MessageProps, 'typing'>[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const n8nWebhookUrl = 'https://n8n.tools.gebeya.io/webhook/9cdd3ba7-b50f-4550-959e-80f4cdae6ba7';

  // Initialize session ID on mount
  useEffect(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    console.log('New session started:', newSessionId);
  }, []);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { isUser: true, text }]);
    setIsTyping(true);

    try {
      // Send text message to n8n with session ID
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          type: 'text',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsTyping(false);
        // Add AI response to chat (n8n returns "output" or "out" field)
        const aiResponse = data.output || data.out;
        if (aiResponse) {
          setMessages((prev) => [...prev, { 
            isUser: false, 
            text: aiResponse 
          }]);
        } else {
          throw new Error('No response from AI');
        }
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        isUser: false, 
        text: "I'm sorry, I'm having trouble connecting right now. Please try again." 
      }]);
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = async (files: File[]) => {
    const fileNames = files.map(f => f.name).join(', ');
    setMessages(prev => [...prev, { isUser: true, text: `📎 Uploaded: ${fileNames}` }]);
    setIsTyping(true);

    try {
      // Send files to n8n with session ID
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('type', 'file');
      formData.append('timestamp', new Date().toISOString());
      
      // Append all files with their names
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
        formData.append(`file_name_${index}`, file.name);
      });
      formData.append('file_count', files.length.toString());

      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // File upload returns response with output or out field
        const text = await response.text();
        let message = `✅ I've successfully processed your files: ${fileNames}. Feel free to ask me questions about the content!`;
        
        if (text) {
          try {
            const data = JSON.parse(text);
            // Handle both "output" and "out" field from n8n
            if (data.output || data.out) {
              message = data.output || data.out;
            }
          } catch (e) {
            // If not JSON, ignore and use default message
            console.error('Error parsing file upload response:', e);
          }
        }
        
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          isUser: false, 
          text: message
        }]);
        toast.success('Files processed successfully!');
      } else {
        throw new Error('Failed to upload files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        isUser: false, 
        text: "I'm sorry, I couldn't process your files. Please try again." 
      }]);
      toast.error('Failed to upload files');
    }
  };

  return (
    <div className='flex flex-col h-screen bg-background'>
      <Header />
      
      {/* Chat Messages Area */}
      <div 
        ref={chatAreaRef} 
        className='flex-1 overflow-y-auto px-4 py-6 space-y-4'
      >
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center space-y-6'>
            <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center'>
              <Bot className='w-10 h-10 text-primary' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold text-foreground'>Welcome to Rag AI Agent Assistant</h2>
              <p className='text-muted-foreground max-w-md'>
                Upload documents and ask questions. I'll help you analyze and extract insights from your files.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full px-4'>
              <div className='p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors'>
                <p className='text-sm text-muted-foreground'>💡 Try asking:</p>
                <p className='text-sm font-medium mt-1'>"Summarize this document"</p>
              </div>
              <div className='p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors'>
                <p className='text-sm text-muted-foreground'>📄 Supported formats:</p>
                <p className='text-sm font-medium mt-1'>PDF, TXT, DOCX, and more</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='max-w-4xl mx-auto w-full space-y-4'>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <Message key={i} {...msg} />
              ))}
              {isTyping && <Message isUser={false} text='' typing />}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Chat Input Area */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}