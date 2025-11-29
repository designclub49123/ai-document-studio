import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type WizardType = 'letter' | 'report' | 'proposal' | 'essay' | null;

export interface WizardStep {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface AISidebarState {
  isOpen: boolean;
  mode: 'chat' | 'wizard';
  messages: Message[];
  isGenerating: boolean;
  
  // Wizard state
  wizardType: WizardType;
  wizardStep: number;
  wizardData: Record<string, string>;
  
  // Actions
  toggle: () => void;
  setMode: (mode: 'chat' | 'wizard') => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  
  // AI Actions
  generateSection: () => Promise<void>;
  rewriteFormal: () => Promise<void>;
  fixGrammar: () => Promise<void>;
  condense: () => Promise<void>;
  expand: () => Promise<void>;
  summarize: () => Promise<void>;
  
  // Wizard Actions
  startWizard: (type: WizardType) => void;
  setWizardData: (key: string, value: string) => void;
  nextWizardStep: () => void;
  prevWizardStep: () => void;
  finishWizard: () => Promise<void>;
  cancelWizard: () => void;
}

const WIZARD_STEPS: Record<string, WizardStep[]> = {
  letter: [
    { id: 'recipient', label: 'Recipient Name', type: 'text', placeholder: 'John Smith', required: true },
    { id: 'recipientTitle', label: 'Recipient Title', type: 'text', placeholder: 'HR Manager' },
    { id: 'purpose', label: 'Purpose of Letter', type: 'select', options: ['Job Application', 'Resignation', 'Recommendation', 'Complaint', 'Thank You', 'Other'], required: true },
    { id: 'keyPoints', label: 'Key Points to Include', type: 'textarea', placeholder: 'List the main points you want to cover...' },
    { id: 'tone', label: 'Tone', type: 'select', options: ['Formal', 'Semi-formal', 'Friendly', 'Professional'] },
  ],
  report: [
    { id: 'title', label: 'Report Title', type: 'text', placeholder: 'Q1 Sales Report', required: true },
    { id: 'reportType', label: 'Report Type', type: 'select', options: ['Progress Report', 'Research Report', 'Annual Report', 'Incident Report', 'Technical Report'], required: true },
    { id: 'period', label: 'Reporting Period', type: 'text', placeholder: 'January - March 2025' },
    { id: 'keyFindings', label: 'Key Findings', type: 'textarea', placeholder: 'Summarize main findings...' },
    { id: 'recommendations', label: 'Recommendations', type: 'textarea', placeholder: 'List your recommendations...' },
  ],
  proposal: [
    { id: 'projectName', label: 'Project Name', type: 'text', placeholder: 'Website Redesign', required: true },
    { id: 'client', label: 'Client/Recipient', type: 'text', placeholder: 'ABC Corporation' },
    { id: 'objective', label: 'Project Objective', type: 'textarea', placeholder: 'What do you aim to achieve?', required: true },
    { id: 'budget', label: 'Budget Range', type: 'text', placeholder: '$10,000 - $15,000' },
    { id: 'timeline', label: 'Timeline', type: 'text', placeholder: '3 months' },
    { id: 'deliverables', label: 'Key Deliverables', type: 'textarea', placeholder: 'List main deliverables...' },
  ],
  essay: [
    { id: 'topic', label: 'Essay Topic', type: 'text', placeholder: 'Climate Change Impact', required: true },
    { id: 'essayType', label: 'Essay Type', type: 'select', options: ['Argumentative', 'Expository', 'Narrative', 'Descriptive', 'Compare/Contrast'], required: true },
    { id: 'thesis', label: 'Thesis Statement', type: 'textarea', placeholder: 'Your main argument or point...' },
    { id: 'wordCount', label: 'Target Word Count', type: 'text', placeholder: '1500' },
    { id: 'sources', label: 'Key Sources/References', type: 'textarea', placeholder: 'List your sources...' },
  ],
};

export const useAISidebar = create<AISidebarState>((set, get) => ({
  isOpen: true,
  mode: 'chat',
  messages: [],
  isGenerating: false,
  wizardType: null,
  wizardStep: 0,
  wizardData: {},

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  setMode: (mode) => set({ mode }),

  sendMessage: async (content) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, userMessage],
      isGenerating: true,
    }));

    // Placeholder - simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `I understand you want to "${content}". This is a placeholder response. In the production version, this will be connected to an AI backend to provide intelligent document assistance.`,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, assistantMessage],
      isGenerating: false,
    }));
  },

  clearMessages: () => set({ messages: [] }),

  generateSection: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Placeholder - would generate content and insert into document
    set({ isGenerating: false });
  },

  rewriteFormal: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isGenerating: false });
  },

  fixGrammar: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isGenerating: false });
  },

  condense: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isGenerating: false });
  },

  expand: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    set({ isGenerating: false });
  },

  summarize: async () => {
    set({ isGenerating: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isGenerating: false });
  },

  startWizard: (type) => set({ wizardType: type, wizardStep: 0, wizardData: {}, mode: 'wizard' }),

  setWizardData: (key, value) =>
    set((state) => ({ wizardData: { ...state.wizardData, [key]: value } })),

  nextWizardStep: () => {
    const { wizardType, wizardStep } = get();
    if (wizardType && wizardStep < WIZARD_STEPS[wizardType].length - 1) {
      set({ wizardStep: wizardStep + 1 });
    }
  },

  prevWizardStep: () => {
    const { wizardStep } = get();
    if (wizardStep > 0) {
      set({ wizardStep: wizardStep - 1 });
    }
  },

  finishWizard: async () => {
    set({ isGenerating: true });
    // Placeholder - would send wizard data to AI API
    await new Promise((resolve) => setTimeout(resolve, 3000));
    set({ isGenerating: false, wizardType: null, wizardStep: 0, wizardData: {}, mode: 'chat' });
  },

  cancelWizard: () => set({ wizardType: null, wizardStep: 0, wizardData: {}, mode: 'chat' }),
}));

export { WIZARD_STEPS };
