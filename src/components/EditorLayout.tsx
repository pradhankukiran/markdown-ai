import React, { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor/MarkdownEditor';
import MarkdownPreview from './MarkdownPreview/MarkdownPreview';
import Toolbar from './Toolbar/Toolbar';
import useMarkdownState from '../hooks/useMarkdownState';
import { Layout } from '../types';

const EditorLayout: React.FC = () => {
  const {
    markdown,
    setMarkdown,
    insertMarkdown,
    history,
    undo,
    redo,
    saveToLocalStorage,
    handleTextSelect,
    selectedText,
  } = useMarkdownState();

  const [layout, setLayout] = useState<Layout>('split');
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isEditorVisible, setIsEditorVisible] = useState(true);

  // Set default layout based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayout('tabs');
        // On mobile, default to editor view
        setIsPreviewVisible(false);
        setIsEditorVisible(true);
      } else {
        setLayout('split');
        setIsPreviewVisible(true);
        setIsEditorVisible(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLayout = () => {
    if (layout === 'split') {
      setLayout('tabs');
      // In tabs mode, show only one view at a time
      if (isPreviewVisible && isEditorVisible) {
        setIsPreviewVisible(false);
      }
    } else {
      setLayout('split');
      // In split mode, always show both views
      setIsPreviewVisible(true);
      setIsEditorVisible(true);
    }
  };

  const togglePreview = () => {
    if (layout === 'tabs') {
      setIsPreviewVisible(true);
      setIsEditorVisible(false);
    } else {
      // In split mode, toggle editor visibility
      setIsEditorVisible(!isEditorVisible);
    }
  };

  const toggleEditor = () => {
    if (layout === 'tabs') {
      setIsEditorVisible(true);
      setIsPreviewVisible(false);
    } else {
      // In split mode, toggle preview visibility
      setIsPreviewVisible(!isPreviewVisible);
    }
  };

  const exportMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportHtml = () => {
    // Get the HTML content from the preview div
    const previewContent = document.getElementById('markdown-preview');
    if (!previewContent) return;
    
    const htmlContent = previewContent.innerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toolbar 
        insertMarkdown={insertMarkdown} 
        undo={undo} 
        redo={redo}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        selectedText={selectedText}
        toggleLayout={toggleLayout} 
        layout={layout} 
        exportMarkdown={exportMarkdown}
        exportHtml={exportHtml}
        togglePreview={togglePreview}
        toggleEditor={toggleEditor}
        isPreviewVisible={isPreviewVisible}
        isEditorVisible={isEditorVisible}
      />
      
      <div className={`flex-1 flex ${layout === 'split' ? 'flex-row' : 'flex-col'} overflow-hidden`}>
        {isEditorVisible && (
          <div className={`${
            layout === 'split' && isPreviewVisible ? 'w-1/2' : 'w-full'
          } h-full overflow-hidden transition-all duration-300`}>
            <MarkdownEditor 
              value={markdown} 
              onChange={setMarkdown}
              onSelect={handleTextSelect}
              onBlur={saveToLocalStorage}
            />
          </div>
        )}
        
        {isPreviewVisible && (
          <div className={`${
            layout === 'split' && isEditorVisible ? 'w-1/2' : 'w-full'
          } h-full overflow-auto transition-all duration-300 bg-white dark:bg-gray-800`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <MarkdownPreview markdown={markdown} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorLayout;