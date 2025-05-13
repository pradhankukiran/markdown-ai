import React, { useRef, useEffect } from 'react';
import './editor-styles.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (selectedText: string, selectionStart: number, selectionEnd: number) => void;
  onBlur?: () => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  value, 
  onChange, 
  onSelect,
  onBlur
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSelect = () => {
    if (!textareaRef.current || !onSelect) return;
    
    const { selectionStart, selectionEnd } = textareaRef.current;
    const selectedText = value.substring(selectionStart, selectionEnd);
    
    onSelect(selectedText, selectionStart, selectionEnd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key to insert spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const { selectionStart, selectionEnd } = textarea;
      const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
      
      onChange(newValue);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
        }
      }, 0);
    }
  };

  // Handle auto-pairing of markdown symbols
  const handleAutoPair = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
      '*': '*',
      '_': '_',
    };

    const openChar = e.key;
    const closeChar = pairs[openChar];

    // Skip auto-pairing if this isn't a pair character
    if (!closeChar) return;

    // Check if we have a selection that we're wrapping
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    
    // If there's selected text, wrap it in the pair
    if (selectionStart !== selectionEnd) {
      e.preventDefault();
      const selectedText = value.substring(selectionStart, selectionEnd);
      const newText = 
        value.substring(0, selectionStart) + 
        openChar + selectedText + closeChar + 
        value.substring(selectionEnd);
      
      onChange(newText);
      
      // Set cursor position after the wrapped text
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = selectionEnd + 2;
          textarea.selectionEnd = selectionEnd + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="editor-container flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onSelect={handleSelect}
          onKeyDown={(e) => {
            handleKeyDown(e);
            handleAutoPair(e);
          }}
          onBlur={onBlur}
          className="w-full h-full p-6 font-mono text-base resize-none focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          placeholder="Type Markdown here..."
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;