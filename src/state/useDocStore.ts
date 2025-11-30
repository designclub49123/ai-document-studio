import { create } from 'zustand';

export interface Document {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  templateId?: string;
}

interface DocState {
  currentDocument: Document | null;
  documents: Document[];
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isLoading: boolean;
  
  setCurrentDocument: (doc: Document | null) => void;
  updateDocumentTitle: (title: string) => void;
  updateDocument: (updates: Partial<Document>) => void;
  createNewDocument: () => void;
  saveDocument: () => Promise<void>;
  loadDocument: (id: string) => Promise<void>;
  loadAllDocuments: () => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

const DUMMY_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Project Proposal Q1 2025',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: '2',
    title: 'Meeting Notes - Product Team',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-27'),
  },
  {
    id: '3',
    title: 'Technical Documentation Draft',
    createdAt: new Date('2025-01-22'),
    updatedAt: new Date('2025-01-26'),
  },
  {
    id: '4',
    title: 'Marketing Strategy 2025',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-25'),
  },
];

export const useDocStore = create<DocState>((set, get) => ({
  currentDocument: null,
  documents: DUMMY_DOCUMENTS,
  saveStatus: 'saved',
  isLoading: false,

  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  updateDocumentTitle: (title) => {
    const current = get().currentDocument;
    if (current) {
      set({
        currentDocument: { ...current, title, updatedAt: new Date() },
        saveStatus: 'unsaved',
      });
    }
  },

  updateDocument: (updates) => {
    const current = get().currentDocument;
    if (current) {
      set({
        currentDocument: { ...current, ...updates, updatedAt: new Date() },
        saveStatus: 'unsaved',
      });
    }
  },

  createNewDocument: () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: 'Untitled Document',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      currentDocument: newDoc,
      documents: [newDoc, ...state.documents],
      saveStatus: 'unsaved',
    }));
  },

  saveDocument: async () => {
    set({ saveStatus: 'saving' });
    // Placeholder - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ saveStatus: 'saved' });
  },

  loadDocument: async (id) => {
    set({ isLoading: true });
    // Placeholder - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const doc = get().documents.find((d) => d.id === id);
    set({ currentDocument: doc || null, isLoading: false });
  },

  loadAllDocuments: async () => {
    set({ isLoading: true });
    // Placeholder - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ documents: DUMMY_DOCUMENTS, isLoading: false });
  },

  deleteDocument: async (id) => {
    // Placeholder - simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
      currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
    }));
  },
}));
