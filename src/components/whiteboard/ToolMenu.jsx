'use client';

import React from 'react';
import {
  Pencil,
  Eraser,
  MousePointer,
  Hand,
  Shapes,
  Type,
  Image,
  StickyNote,
} from 'lucide-react';
import { useToolStore } from '../../store/toolStore';

const iconMap = {
  MousePointer,
  Hand,
  Pencil,
  Eraser,
  Shapes,
  Type,
  Image,
  StickyNote,
};

const ToolMenu = () => {
  const { tools, activeTool, setActiveTool } = useToolStore();

  const handleToolClick = (title) => {
    setActiveTool(title);
    // Image upload removed since Fabric is no longer used
  };

  return (
    <div
      className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50 ml-4"
      role="toolbar"
      aria-label="Tool menu"
    >
      <div className="flex flex-col space-y-2">
        {tools.map(({ icon, title }) => {
          const Icon = iconMap[icon];
          return (
            <React.Fragment key={title}>
              <button
                onClick={() => handleToolClick(title)}
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                  activeTool === title
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
              {title === 'Image' && (
                <hr className="border-t border-gray-300 dark:border-gray-600 my-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ToolMenu;
