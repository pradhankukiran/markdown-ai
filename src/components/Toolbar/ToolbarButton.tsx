import React, { useState } from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  disabled = false, 
  tooltip,
  className = '',
  children 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center transition-colors ${className || `p-2 rounded-md ${
          disabled 
            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
        }`}`}
        aria-label={tooltip}
      >
        {children}
      </button>
      
      {tooltip && showTooltip && (
        <div 
          className="absolute left-1/2 top-full mt-1 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50"
          style={{ 
            pointerEvents: 'none',
            opacity: showTooltip ? 1 : 0,
            transition: 'opacity 150ms ease-in-out'
          }}
        >
          {tooltip}
          <div 
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-solid"
            style={{
              borderWidth: '0 4px 4px 4px',
              borderColor: 'transparent transparent #1f2937 transparent'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ToolbarButton;