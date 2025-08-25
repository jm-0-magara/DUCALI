"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, ImageIcon, X, File } from 'lucide-react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useTheme } from '../../contexts/ThemeContext';

interface MessageInputProps {
  conversationId: string;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const { sendMessage, loading } = useMessaging();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [message, setMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    try {
      await sendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileUrl = URL.createObjectURL(file);
      const fileName = file.name;
      const fileSize = file.size;

      await sendMessage(
        `Sent file: ${fileName}`,
        'file',
        fileUrl,
        fileName,
        fileSize
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      e.target.value = '';
      setShowAttachmentMenu(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(file);
      const fileName = file.name;

      await sendMessage(
        'Sent an image',
        'image',
        imageUrl,
        fileName,
        file.size
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      e.target.value = '';
      setShowAttachmentMenu(false);
    }
  };



  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {/* Reply Preview */}
      {replyToMessage && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-2 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Replying to {replyToMessage.senderName}
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                {replyToMessage.content}
              </p>
            </div>
            <button
              onClick={() => setReplyToMessage(null)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Attachment Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Attachment Menu */}
          {showAttachmentMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Send image"
                >
                  <ImageIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Send file"
                >
                  <File className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-300 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500 resize-none transition-colors"
            rows={1}
            maxLength={1000}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
            {message.length}/1000
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />

      {/* Instructions */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
