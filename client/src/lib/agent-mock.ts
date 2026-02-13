// Mock AI Agent Logic
import { ComponentRegistry } from '../components/fixed';

export type ComponentNode = {
  type: keyof typeof ComponentRegistry | 'div' | 'span' | 'h1' | 'p';
  props?: Record<string, any>;
  children?: (ComponentNode | string)[];
};

export type UIPlan = {
  layout: string;
  components: ComponentNode[];
  modificationType: 'create' | 'update';
};

export type GenerationResult = {
  plan: UIPlan;
  code: string;
  explanation: string;
  timestamp: number;
};

// Initial state
export const INITIAL_CODE = `// Ready to generate UI...`;

// Mock Planner
export const mockPlanner = async (input: string, currentPlan?: UIPlan): Promise<UIPlan> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking

  const lowerInput = input.toLowerCase();

  // Scenario 1: Dashboard
  if (lowerInput.includes('dashboard') || lowerInput.includes('analytics')) {
    return {
      layout: 'sidebar-main',
      modificationType: 'create',
      components: [
        {
          type: 'div',
          props: { style: { display: 'flex', height: '100vh' } },
          children: [
            {
              type: 'Sidebar',
              props: {
                items: [
                  { label: 'Overview', active: true },
                  { label: 'Analytics', active: false },
                  { label: 'Settings', active: false }
                ]
              }
            },
            {
              type: 'div',
              props: { style: { flex: 1, display: 'flex', flexDirection: 'column' } },
              children: [
                {
                  type: 'Navbar',
                  props: { brand: 'Analytics Pro', links: ['Profile', 'Logout'] }
                },
                {
                  type: 'div',
                  props: { style: { padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' } },
                  children: [
                    {
                      type: 'Card',
                      props: { title: 'Revenue' },
                      children: [{ type: 'Chart', props: { type: 'line' } }]
                    },
                    {
                      type: 'Card',
                      props: { title: 'Users' },
                      children: [{ type: 'Chart', props: { type: 'bar' } }]
                    },
                    {
                      type: 'Card',
                      props: { title: 'Recent Transactions', style: { gridColumn: 'span 2' } },
                      children: [
                        {
                          type: 'Table',
                          props: {
                            headers: ['ID', 'User', 'Amount', 'Status'],
                            rows: [
                              ['#123', 'Alice Smith', '$450.00', 'Completed'],
                              ['#124', 'Bob Jones', '$120.50', 'Pending'],
                              ['#125', 'Charlie Day', '$850.00', 'Completed']
                            ]
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // Scenario 2: Login Form
  if (lowerInput.includes('login') || lowerInput.includes('sign in')) {
    return {
      layout: 'centered',
      modificationType: 'create',
      components: [
        {
          type: 'div',
          props: { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' } },
          children: [
            {
              type: 'Card',
              props: { title: 'Welcome Back', style: { width: '400px' } },
              children: [
                { type: 'Input', props: { label: 'Email Address', placeholder: 'you@example.com' } },
                { type: 'Input', props: { label: 'Password', type: 'password', placeholder: '••••••••' } },
                {
                  type: 'div',
                  props: { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' } },
                  children: [
                    { type: 'Button', props: { children: 'Sign In' } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }
  
    // Scenario 3: Settings Modal (Update)
  if (lowerInput.includes('modal') || lowerInput.includes('settings')) {
     // If we are updating, we would merge. For mock, we'll just return a modal example.
     return {
      layout: 'centered',
      modificationType: 'create', // mocking as create for simplicity in this demo
      components: [
        {
          type: 'div',
          props: { style: { padding: '2rem' } },
          children: [
            { type: 'Button', props: { children: 'Open Settings', variant: 'secondary' } },
            {
               type: 'Modal',
               props: { 
                 isOpen: true, 
                 title: 'Application Settings' 
               },
               children: [
                 { type: 'Input', props: { label: 'Display Name', placeholder: 'John Doe' } },
                 { type: 'Input', props: { label: 'Email', placeholder: 'john@example.com' } },
                 { 
                   type: 'div', 
                   props: { style: { marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' } },
                   children: [
                     { type: 'Button', props: { children: 'Cancel', variant: 'secondary' } },
                     { type: 'Button', props: { children: 'Save Changes' } }
                   ]
                 }
               ]
            }
          ]
        }
      ]
     }
  }

  // Default: Empty/Error
  return {
    layout: 'blank',
    modificationType: 'create',
    components: []
  };
};

// Mock Generator (Converts Plan to JSX String)
export const mockGenerator = (plan: UIPlan): string => {
  // Simple recursive function to stringify the tree
  const stringifyNode = (node: ComponentNode | string, depth = 0): string => {
    if (typeof node === 'string') return `"${node}"`;
    
    const indent = '  '.repeat(depth);
    const propsStr = node.props 
      ? Object.entries(node.props)
          .map(([k, v]) => {
            if (k === 'style') return `style={${JSON.stringify(v)}}`;
            if (typeof v === 'string') return `${k}="${v}"`;
            if (typeof v === 'boolean') return v ? k : '';
            return `${k}={${JSON.stringify(v)}}`;
          })
          .join(' ')
      : '';
    
    if (!node.children || node.children.length === 0) {
      return `\n${indent}<${node.type} ${propsStr} />`;
    }

    const childrenStr = node.children.map(c => stringifyNode(c, depth + 1)).join('');
    return `\n${indent}<${node.type} ${propsStr}>${childrenStr}\n${indent}</${node.type}>`;
  };

  return plan.components.map(c => stringifyNode(c)).join('\n');
};

// Mock Explainer
export const mockExplainer = (plan: UIPlan): string => {
  if (plan.layout === 'sidebar-main') {
    return "I've generated a dashboard layout with a collapsible sidebar and a main content area. \n\nRationale:\n- **Sidebar**: Provides persistent navigation for complex apps.\n- **Cards**: Used to group related metrics (Revenue, Users) for better scanability.\n- **Charts**: Visual data representation for quick insights.\n- **Table**: Detailed transaction history in a structured format.";
  }
  if (plan.layout === 'centered') {
     return "I've created a focused, centered layout typically used for authentication or single-action pages.\n\nRationale:\n- **Centering**: Draws full attention to the form.\n- **Card Container**: Groups input fields visually against the background.\n- **Primary Button**: clear call-to-action for the user.";
  }
  
  if (plan.layout === 'blank') {
      return "I couldn't understand the request fully. Please try asking for a 'dashboard', 'login form', or 'settings modal'.";
  }

  return "I've updated the UI based on your request, ensuring all components adhere to the strict design system.";
};
