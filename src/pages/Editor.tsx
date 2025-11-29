import { useEffect } from 'react';
import { MainLayout } from '@/layout/MainLayout';
import { useDocStore } from '@/state/useDocStore';
import { useUserStore } from '@/state/useUserStore';

/**
 * Editor Page
 * 
 * Main document editing interface with ONLYOFFICE integration.
 * Uses MainLayout which includes:
 * - Top bar with document controls
 * - Left sidebar for templates and tools
 * - Center area for document editing
 * - Right sidebar for AI assistance
 */
export default function Editor() {
  const { currentDocument, createNewDocument, loadAllDocuments } = useDocStore();
  const { theme, setTheme } = useUserStore();

  // Initialize theme on mount
  useEffect(() => {
    setTheme(theme);
  }, []);

  // Load documents and create new if none exists
  useEffect(() => {
    loadAllDocuments();
    if (!currentDocument) {
      createNewDocument();
    }
  }, []);

  return <MainLayout />;
}
