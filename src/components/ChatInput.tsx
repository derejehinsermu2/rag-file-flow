import { Paperclip, Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const n8nWebhookUrl = 'https://n8n.tools.gebeya.io/webhook/9cdd3ba7-b50f-4550-959e-80f4cdae6ba7';

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    const toastId = toast.loading('Uploading file...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('File uploaded successfully!', { id: toastId });
      } else {
        toast.error('Error uploading file.', { id: toastId });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file.', { id: toastId });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    noClick: true,
  });

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.message as HTMLInputElement;
    if (input.value.trim()) {
      onSendMessage(input.value);
      input.value = '';
    }
  };

  return (
    <div {...getRootProps()} className={`p-4 border-t ${isDragActive ? 'bg-blue-100' : ''}`}>
      <form onSubmit={handleSendMessage} className='flex items-center space-x-4'>
        <input {...getInputProps()} />
        <label htmlFor='file-upload' className='cursor-pointer'>
          <Paperclip size={24} />
          <input id='file-upload' type='file' className='hidden' onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))} />
        </label>
        <input
          name='message'
          placeholder='Type a message...'
          className='flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button type='submit' className='p-2 rounded-full bg-blue-500 text-white'>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
