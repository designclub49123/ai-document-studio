import { useEffect, useRef } from 'react';
import { useDocStore } from '@/state/useDocStore';
import { ONLYOFFICE_CONFIG } from '@/constants';
import { FileText } from 'lucide-react';

/**
 * EditorWrapper component
 * 
 * This component provides the container for the ONLYOFFICE Docs editor.
 * In production, it will initialize the ONLYOFFICE editor with proper configuration.
 * 
 * TODO: Integrate with actual ONLYOFFICE Document Server
 * - Replace placeholder with actual DocsAPI initialization
 * - Configure proper document callbacks for save/load operations
 * - Set up collaborative editing features
 */
export function EditorWrapper() {
  const editorRef = useRef<HTMLDivElement>(null);
  const { currentDocument, saveStatus } = useDocStore();

  useEffect(() => {
    // Placeholder for ONLYOFFICE initialization
    // In production, this would be:
    //
    // if (window.DocsAPI && editorRef.current && currentDocument) {
    //   new window.DocsAPI.DocEditor(editorRef.current.id, {
    //     ...ONLYOFFICE_CONFIG.EDITOR_CONFIG,
    //     document: {
    //       fileType: 'docx',
    //       key: currentDocument.id,
    //       title: currentDocument.title,
    //       url: `${API_URL}/documents/${currentDocument.id}/content`,
    //     },
    //     events: {
    //       onDocumentStateChange: (event) => {
    //         // Handle document state changes
    //       },
    //       onSave: async (event) => {
    //         // Handle save
    //       },
    //     },
    //   });
    // }

    console.log('[EditorWrapper] Would initialize ONLYOFFICE with config:', {
      documentId: currentDocument?.id,
      title: currentDocument?.title,
      config: ONLYOFFICE_CONFIG.EDITOR_CONFIG,
    });
  }, [currentDocument]);

  return (
    <div className="flex-1 flex flex-col bg-editor-bg overflow-hidden">
      {/* Editor Container */}
      <div
        ref={editorRef}
        id="onlyoffice-editor"
        className="flex-1 flex items-center justify-center"
      >
        {/* Placeholder UI - Replace with actual ONLYOFFICE iframe in production */}
        <div className="w-full h-full max-w-4xl mx-auto p-8 flex flex-col">
          {/* Paper simulation */}
          <div className="flex-1 bg-card rounded-lg shadow-elevated border border-border p-12 overflow-auto">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Document Header */}
              <div className="flex items-center gap-3 pb-6 border-b border-border">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {currentDocument?.title || 'Untitled Document'}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Last edited:{' '}
                    {currentDocument?.updatedAt
                      ? new Date(currentDocument.updatedAt).toLocaleDateString()
                      : 'Just now'}
                  </p>
                </div>
              </div>

              {/* Placeholder Content */}
              <div className="prose prose-sm dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed">
                  This is a placeholder for the ONLYOFFICE Docs editor. In the production
                  environment, this area will contain the fully-featured document editor
                  with the following capabilities:
                </p>

                <ul className="text-muted-foreground space-y-2 mt-4">
                  <li>Full word processing capabilities</li>
                  <li>Real-time collaborative editing</li>
                  <li>Track changes and comments</li>
                  <li>Rich formatting options</li>
                  <li>Table creation and editing</li>
                  <li>Image and media insertion</li>
                  <li>Templates and styles</li>
                </ul>

                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Integration Note:</strong>
                  </p>
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    ONLYOFFICE Document Server URL: {ONLYOFFICE_CONFIG.DOCUMENT_SERVER_URL}
                  </code>
                </div>
              </div>

              {/* Typing Cursor Animation */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-sm">Start typing here</span>
                <span className="w-0.5 h-5 bg-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Footer Status */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>Page 1 of 1</span>
            <span>Words: 0</span>
            <span className="capitalize">{saveStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
