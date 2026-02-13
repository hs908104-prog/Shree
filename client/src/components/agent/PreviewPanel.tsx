import React from 'react';
import { ComponentRegistry } from '../fixed';
import { ComponentNode, UIPlan } from '../../lib/agent-mock';
import '../../preview.css'; // Ensure styles are loaded

interface PreviewPanelProps {
  plan: UIPlan | null;
}

// Recursive renderer
const NodeRenderer = ({ node }: { node: ComponentNode | string }) => {
  if (typeof node === 'string') {
    return <>{node}</>;
  }

  const { type, props, children } = node;
  
  // Resolve component
  const Component = type === 'div' ? 'div' : 
                    type === 'span' ? 'span' : 
                    type === 'p' ? 'p' : 
                    type === 'h1' ? 'h1' : 
                    ComponentRegistry[type];

  if (!Component) {
    return <div className="text-red-500 border border-red-500 p-2">Error: Unknown component {type}</div>;
  }

  return (
    <Component {...props}>
      {children?.map((child, i) => (
        <React.Fragment key={i}>
          <NodeRenderer node={child} />
        </React.Fragment>
      ))}
    </Component>
  );
};

export function PreviewPanel({ plan }: PreviewPanelProps) {
  if (!plan || !plan.components || plan.components.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
        <p className="font-medium">Live Preview</p>
        <p className="text-sm">Generated UI will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white overflow-auto relative custom-scrollbar">
      {/* 
        We use a wrapper to ensure the preview CSS doesn't bleed out too much 
        if we were not using scoped classes, but we are using .fc- prefixes.
        However, for layout like 'sidebar-main', we need full height.
      */}
      <div className="min-h-full">
         {plan.components.map((node, i) => (
           <NodeRenderer key={i} node={node} />
         ))}
      </div>
    </div>
  );
}
