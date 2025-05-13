import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';

// Sample Markdown to show when the editor first loads
const DEFAULT_MARKDOWN = `# Welcome to the Markdown Editor

This is a simple **WYSIWYG** editor that supports _Markdown_ syntax.

## Features

- Live preview
- Toolbar for formatting
- Light and dark themes
- Export to Markdown or HTML
- Support for Mermaid diagrams, charts, and graphs

## How to use

1. Type in the editor
2. Use the toolbar buttons to format your text
3. See the preview update in real-time
4. Export your document when you're done

> Here's a blockquote to show how they look

\`\`\`javascript
// Here's a code block
function greeting(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Mermaid Diagrams

You can create various diagrams using Mermaid syntax:

### Flow Chart

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Enjoy!]
\`\`\`

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant System
    User->>System: Enter Markdown
    System->>User: Preview Rendered Content
    User->>System: Edit Content
    System->>User: Update Preview
\`\`\`

### Pie Chart

\`\`\`mermaid
pie title Productivity Distribution
    "Writing" : 40
    "Research" : 25
    "Meetings" : 20
    "Coffee Breaks" : 15
\`\`\`

![Markdown Logo](https://markdown-here.com/img/icon256.png)

Enjoy writing!
`;

interface HistoryState {
  past: string[];
  present: string;
  future: string[];
}

interface UseMarkdownStateReturn {
  markdown: string;
  setMarkdown: (value: string) => void;
  insertMarkdown: (before: string, after: string, placeholder?: string) => void;
  history: HistoryState;
  undo: () => void;
  redo: () => void;
  saveToLocalStorage: () => void;
  handleTextSelect: (selectedText: string, selectionStart: number, selectionEnd: number) => void;
  selectedText: string;
  selectionRange: { start: number; end: number } | null;
}

const useMarkdownState = (): UseMarkdownStateReturn => {
  // Initialize with saved content or default
  const { id } = useParams();
  const storageKey = useRef(`markdown-${id || 'default'}`);

  // Initialize with empty content for new documents, default content for home page
  const [markdown, setMarkdownInternal] = useState<string>(() => {
    if (id) {
      // For new documents, start empty
      return '';
    }
    // For home page, use saved content or default
    const saved = localStorage.getItem(storageKey.current);
    return saved || DEFAULT_MARKDOWN;
  });

  // Track the selected text
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);

  // Track history for undo/redo
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: markdown,
    future: [],
  });

  // Handle selection
  const handleTextSelect = useCallback((
    selectedText: string, 
    selectionStart: number, 
    selectionEnd: number
  ) => {
    setSelectedText(selectedText);
    setSelectionRange({ start: selectionStart, end: selectionEnd });
  }, []);

  // Update markdown with history tracking
  const setMarkdown = useCallback((value: string) => {
    setMarkdownInternal(value);
    setHistory(prevHistory => ({
      past: [...prevHistory.past, prevHistory.present],
      present: value,
      future: [],
    }));
  }, []);

  // Insert markdown at cursor position or around selected text
  const insertMarkdown = useCallback((before: string, after: string, placeholder?: string) => {
    if (!selectionRange) {
      // If no selection, insert at the end
      const newValue = markdown + before + (placeholder || '') + after;
      setMarkdown(newValue);
      return;
    }

    const { start, end } = selectionRange;
    const selected = selectedText || '';
    const text = placeholder && selected.length === 0 ? placeholder : selected;
    
    const newValue = 
      markdown.substring(0, start) + 
      before + 
      text + 
      after + 
      markdown.substring(end);
    
    setMarkdown(newValue);
  }, [markdown, selectedText, selectionRange, setMarkdown]);

  // Undo the last change
  const undo = useCallback(() => {
    setHistory(prevHistory => {
      if (prevHistory.past.length === 0) return prevHistory;
      
      const previous = prevHistory.past[prevHistory.past.length - 1];
      const newPast = prevHistory.past.slice(0, prevHistory.past.length - 1);
      
      setMarkdownInternal(previous);
      
      return {
        past: newPast,
        present: previous,
        future: [prevHistory.present, ...prevHistory.future],
      };
    });
  }, []);

  // Redo the last undone change
  const redo = useCallback(() => {
    setHistory(prevHistory => {
      if (prevHistory.future.length === 0) return prevHistory;
      
      const next = prevHistory.future[0];
      const newFuture = prevHistory.future.slice(1);
      
      setMarkdownInternal(next);
      
      return {
        past: [...prevHistory.past, prevHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // Save to localStorage
  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem(storageKey.current, markdown);
  }, [markdown, storageKey]);

  // Auto-save on changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [markdown, saveToLocalStorage]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }

      // Bold: Ctrl+B
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        insertMarkdown('**', '**', selectedText || 'bold text');
      }

      // Italic: Ctrl+I
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        insertMarkdown('*', '*', selectedText || 'italic text');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, insertMarkdown, selectedText]);

  return {
    markdown,
    setMarkdown,
    insertMarkdown,
    history,
    undo,
    redo,
    saveToLocalStorage,
    handleTextSelect,
    selectedText,
    selectionRange,
  };
};

export default useMarkdownState;