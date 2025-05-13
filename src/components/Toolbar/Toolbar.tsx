import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import {
  Sun,
  Moon,
  FilePlus,
  Users,
  Layout as LayoutIcon,
  Download,
  Code,
  FileText,
  Eye,
  Edit,
  ChevronDown,
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3, 
  ImageIcon,
  Undo2,
  Redo2,
  Strikethrough,
  CheckSquare,
  GitBranch,
  RefreshCw
} from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import { useTheme } from '../../context/ThemeContext';
import { Layout } from '../../types';

interface ToolbarProps {
  insertMarkdown: (markdownBefore: string, markdownAfter: string, placeholder?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedText: string;
  toggleLayout: () => void;
  layout: Layout;
  exportMarkdown: () => void;
  exportHtml: () => void;
  togglePreview: () => void;
  toggleEditor: () => void;
  isPreviewVisible: boolean;
  isEditorVisible: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  insertMarkdown, 
  undo, 
  redo,
  canUndo,
  canRedo,
  selectedText,
  toggleLayout,
  layout,
  exportMarkdown,
  exportHtml,
  togglePreview,
  toggleEditor,
  isPreviewVisible,
  isEditorVisible
}) => {
  const { theme, toggleTheme } = useTheme();
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleCreateNew = () => {
    const newId = nanoid(10); // Generate a 10-character unique ID
    navigate(`/doc/${newId}`);
    // Clear localStorage for the new document
    localStorage.removeItem('markdown');
  };

  // Toggle export dropdown
  const toggleExportDropdown = () => {
    setExportDropdownOpen(!exportDropdownOpen);
  };

  // Close export dropdown when an option is clicked
  const handleExportOption = (exportFn: () => void) => {
    exportFn();
    setExportDropdownOpen(false);
  };

  // Mermaid diagram templates
  const insertFlowchart = () => {
    const flowchartTemplate = `\`\`\`mermaid
graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Action 1]
  B -->|No| D[Action 2]
  C --> E[Result]
  D --> E
\`\`\``;
    insertMarkdown(flowchartTemplate, '');
  };

  const insertSequenceDiagram = () => {
    const sequenceTemplate = `\`\`\`mermaid
sequenceDiagram
  participant A as Alice
  participant B as Bob
  A->>B: Hello Bob
  B->>A: Hi Alice
  A->>B: How are you?
  B-->>A: I'm good, thanks!
\`\`\``;
    insertMarkdown(sequenceTemplate, '');
  };

  const insertPieChart = () => {
    const pieChartTemplate = `\`\`\`mermaid
pie title Distribution
  "Segment A" : 40
  "Segment B" : 30
  "Segment C" : 20
  "Segment D" : 10
\`\`\``;
    insertMarkdown(pieChartTemplate, '');
  };
  
  // Reset to default content with examples
  const resetToDefaultContent = () => {
    localStorage.removeItem('markdown');
    window.location.reload();
  };

  return (
    <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center space-x-1">
      {/* History controls */}
      <div className="flex mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
        <ToolbarButton 
          onClick={undo} 
          disabled={!canUndo}
          tooltip="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={redo} 
          disabled={!canRedo}
          tooltip="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
        </ToolbarButton>
      </div>
      
      {/* Headings */}
      <div className="flex mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
        <ToolbarButton 
          onClick={() => insertMarkdown('# ', '')}
          tooltip="Heading 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('## ', '')}
          tooltip="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('### ', '')}
          tooltip="Heading 3"
        >
          <Heading3 size={18} />
        </ToolbarButton>
      </div>
      
      {/* Text formatting */}
      <div className="flex mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
        <ToolbarButton 
          onClick={() => insertMarkdown('**', '**', selectedText || 'bold text')}
          tooltip="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('*', '*', selectedText || 'italic text')}
          tooltip="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('~~', '~~', selectedText || 'strikethrough text')}
          tooltip="Strikethrough"
        >
          <Strikethrough size={18} />
        </ToolbarButton>
      </div>
      
      {/* Lists */}
      <div className="flex mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
        <ToolbarButton 
          onClick={() => insertMarkdown('- ', '')}
          tooltip="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('1. ', '')}
          tooltip="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('- [ ] ', '')}
          tooltip="Task List"
        >
          <CheckSquare size={18} />
        </ToolbarButton>
      </div>
      
      {/* Other elements */}
      <div className="flex mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
        <ToolbarButton 
          onClick={() => insertMarkdown('> ', '')}
          tooltip="Blockquote"
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('`', '`', selectedText || 'code')}
          tooltip="Inline Code"
        >
          <Code size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('\n```\n', '\n```\n', selectedText || 'code block')}
          tooltip="Code Block"
        >
          <Code size={18} className="border border-current rounded" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('[', '](https://example.com)', selectedText || 'link text')}
          tooltip="Link"
        >
          <Link size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => insertMarkdown('![', '](https://example.com/image.jpg)', selectedText || 'image alt text')}
          tooltip="Image"
        >
          <ImageIcon size={18} />
        </ToolbarButton>
      </div>
      
      {/* Mermaid Diagrams */}
      <div className="flex relative group">
        <ToolbarButton 
          onClick={() => {}}
          tooltip="Mermaid Diagrams"
        >
          <GitBranch size={18} />
        </ToolbarButton>
        
        <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <button 
            onClick={insertFlowchart}
            className="flex items-center w-full p-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <GitBranch size={16} className="mr-2" />
            Flow Chart
          </button>
          <button 
            onClick={insertSequenceDiagram}
            className="flex items-center w-full p-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <GitBranch size={16} className="mr-2" />
            Sequence Diagram
          </button>
          <button 
            onClick={insertPieChart}
            className="flex items-center w-full p-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <GitBranch size={16} className="mr-2" />
            Pie Chart
          </button>
        </div>
      </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Create and Collab buttons */}
        <ToolbarButton 
          onClick={handleCreateNew}
          tooltip="Create a new document"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold"
        >
          <FilePlus size={18} className="mr-1" />
          <span>Create</span>
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => {}}
          tooltip="Collab with another user's document"
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
        >
          <Users size={18} className="mr-1" />
          <span>Collab</span>
        </ToolbarButton>

        {/* Reset button */}
        <ToolbarButton 
          onClick={resetToDefaultContent}
          tooltip="Reset to Example Content"
        >
          <RefreshCw size={18} />
        </ToolbarButton>
        
        {/* View toggle buttons for tab view */}
        <div className={`flex ${layout === 'tabs' ? 'block' : 'hidden'}`}>
          <button 
            onClick={toggleEditor}
            className={`p-2 rounded-l-md w-10 justify-center ${isEditorVisible && !isPreviewVisible ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'} text-gray-700 dark:text-gray-200 transition-colors`}
            aria-label="Show editor"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={togglePreview}
            className={`p-2 rounded-r-md w-10 justify-center ${isPreviewVisible && !isEditorVisible ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'} text-gray-700 dark:text-gray-200 transition-colors`}
            aria-label="Show preview"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Layout toggle button for desktop */}
        <div className="hidden md:block">
          <button 
            onClick={toggleLayout}
            className="flex items-center p-2 w-32 justify-center rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            aria-label="Toggle layout"
          >
            <LayoutIcon size={18} className="mr-1" />
            <span className="text-sm">{layout === 'split' ? 'Split View' : 'Tab View'}</span>
          </button>
        </div>

        {/* Export dropdown - Changed to use click instead of hover */}
        <div className="relative">
          <button 
            onClick={toggleExportDropdown}
            className="flex items-center p-2 w-28 justify-center rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            aria-label="Export options"
            aria-expanded={exportDropdownOpen}
          >
            <Download size={18} className="mr-1" />
            <span className="text-sm">Export</span>
            <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          <div 
            className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 z-10 ${
              exportDropdownOpen 
                ? 'opacity-100 visible' 
                : 'opacity-0 invisible'
            }`}
          >
            <button 
              onClick={() => handleExportOption(exportMarkdown)}
              className="flex items-center w-full p-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText size={16} className="mr-2" />
              Export as Markdown
            </button>
            <button 
              onClick={() => handleExportOption(exportHtml)}
              className="flex items-center w-full p-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Code size={16} className="mr-2" />
              Export as HTML
            </button>
          </div>
        </div>

        {/* Theme toggle */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;