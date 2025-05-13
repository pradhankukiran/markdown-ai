import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import './preview-styles.css';

interface MarkdownPreviewProps {
  markdown: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
    });
    
    // Process any mermaid diagrams
    try {
      mermaid.contentLoaded();
    } catch (error) {
      console.error('Mermaid initialization error:', error);
    }
  }, [markdown]);

  return (
    <div id="markdown-preview" className="markdown-preview p-6 prose dark:prose-invert max-w-none">
      <ReactMarkdown
        children={markdown}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // Custom components for special rendering
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline" />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
                  {children}
                </code>
              );
            }

            // Check if this is a mermaid diagram
            const match = /language-(\w+)/.exec(className || '');
            if (match && match[1] === 'mermaid') {
              const mermaidCode = String(children).replace(/\n$/, '');
              const diagramId = `mermaid-diagram-${Math.random().toString(36).substr(2, 9)}`;
              
              // Use setTimeout to ensure the diagram renders after component mounts
              setTimeout(() => {
                try {
                  mermaid.render(diagramId, mermaidCode)
                    .then(({ svg }) => {
                      const container = document.getElementById(`mermaid-container-${diagramId}`);
                      if (container) {
                        container.innerHTML = svg;
                      }
                    })
                    .catch(error => {
                      console.error('Mermaid rendering error:', error);
                    });
                } catch (error) {
                  console.error('Mermaid rendering error:', error);
                }
              }, 0);
              
              return (
                <div id={`mermaid-container-${diagramId}`} className="my-4 mermaid-diagram">
                  <pre style={{ display: 'none' }}>{mermaidCode}</pre>
                </div>
              );
            }
            
            return (
              <div className="relative group">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                  <code className={`${className} text-gray-800 dark:text-gray-200`} {...props}>
                    {children}
                  </code>
                </pre>
                <button 
                  className="absolute top-2 right-2 hidden group-hover:block bg-gray-200 dark:bg-gray-700 p-1 rounded text-xs"
                  onClick={() => {
                    const code = children.toString();
                    navigator.clipboard.writeText(code);
                  }}
                >
                  Copy
                </button>
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default MarkdownPreview;