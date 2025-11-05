import { useState } from 'react';
import { Paperclip, Send, X, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onFileUpload: (files: File[]) => void;
}

export function ChatInput({ onSendMessage, onFileUpload }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;
    
    setUploadedFiles(prev => [...prev, ...files]);
    onFileUpload(files);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    noClick: true,
    accept: {
      'text/*': ['.txt', '.md'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      setUploadedFiles([]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='border-t border-border bg-background'>
      <div className='max-w-4xl mx-auto w-full p-4'>
        {/* File Upload Area */}
        <div 
          {...getRootProps()} 
          className={`transition-all duration-200 ${
            isDragActive 
              ? 'border-2 border-dashed border-primary bg-primary/5 rounded-lg p-4 mb-3' 
              : ''
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive && (
            <div className='text-center py-2'>
              <p className='text-sm text-primary font-medium'>Drop your files here...</p>
            </div>
          )}

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-3'>
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index}
                  className='flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 text-sm'
                >
                  <FileText className='w-4 h-4 text-primary' />
                  <span className='text-secondary-foreground max-w-[150px] truncate'>
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className='ml-1 hover:bg-background rounded-full p-0.5'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className='flex items-end gap-2'>
            {/* File Upload Button */}
            <label 
              htmlFor='file-upload' 
              className='cursor-pointer p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors flex-shrink-0'
            >
              <Paperclip className='w-5 h-5 text-secondary-foreground' />
              <input 
                id='file-upload' 
                type='file' 
                className='hidden' 
                multiple
                onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))} 
              />
            </label>

            {/* Text Input */}
            <div className='flex-1 bg-secondary rounded-xl border border-border focus-within:border-primary transition-colors'>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as any);
                  }
                }}
                placeholder='Type your message... (Shift+Enter for new line)'
                className='w-full px-4 py-3 bg-transparent focus:outline-none text-sm resize-none max-h-32'
                rows={1}
              />
            </div>

            {/* Send Button */}
            <button 
              type='submit' 
              disabled={!inputValue.trim()}
              className='p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-lg hover:shadow-xl'
            >
              <Send className='w-5 h-5' />
            </button>
          </form>
        </div>

          {/* Helper Text */}
        <p className='text-xs text-muted-foreground text-center mt-2'>
          Press Enter to send • Shift+Enter for new line • Drag & drop files to upload
        </p>
      </div>
    </div>
  );
}
