import React from 'react';
import { 
  Sun, 
  Moon, 
  Layout as LayoutIcon, 
  Download, 
  Code, 
  FileText, 
  Eye, 
  Edit,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Layout } from '../types';

interface HeaderProps {
  toggleLayout: () => void;
  layout: Layout;
  exportMarkdown: () => void;
  exportHtml: () => void;
  togglePreview: () => void;
  toggleEditor: () => void;
  isPreviewVisible: boolean;
  isEditorVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
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

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center space-x-2">
        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Markdown Editor</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* View toggle buttons for tab view */}
        <div className={`flex ${layout === 'tabs' ? 'block' : 'hidden'}`}>
          <button 
            onClick={toggleEditor}
            className={`p-2 rounded-l-md ${isEditorVisible && !isPreviewVisible ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'} text-gray-700 dark:text-gray-200 transition-colors`}
            aria-label="Show editor"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={togglePreview}
            className={`p-2 rounded-r-md ${isPreviewVisible && !isEditorVisible ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'} text-gray-700 dark:text-gray-200 transition-colors`}
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

        {/* Export dropdown */}
        <div className="relative group">
          <button 
            className="flex items-center p-2 w-28 justify-center rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            aria-label="Export options"
          >
            <Download size={18} className="mr-1" />
            <span className="text-sm">Export</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
            <button 
              onClick={exportMarkdown}
              className="flex items-center w-full p-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText size={16} className="mr-2" />
              Export as Markdown
            </button>
            <button 
              onClick={exportHtml}
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
    </header>
  );
};

export default Header;