import { create } from 'zustand';

export const useToolStore = create((set) => ({
  activeTool: 'Mouse Pointer',
  setActiveTool: (tool) => set({ activeTool: tool }),
  tools: [
    { icon: 'MousePointer', title: 'Mouse Pointer' },
    { icon: 'Hand', title: 'Hand' },
    { icon: 'Pencil', title: 'Pencil' },
    { icon: 'Eraser', title: 'Eraser' },
    { icon: 'Shapes', title: 'Shapes' },
    { icon: 'Type', title: 'Text' },
    { icon: 'Image', title: 'Image' },
    { icon: 'StickyNote', title: 'Sticky Note' },
  ],
}));