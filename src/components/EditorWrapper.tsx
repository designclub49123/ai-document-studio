import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useDocStore } from '@/state/useDocStore';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Download,
  FileText,
  Loader2,
  ZoomIn,
  ZoomOut,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { exportToPDF, exportToDocx } from '@/utils/exportDocument';

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 25.4; // 1 inch margins

// Convert mm to pixels (96 DPI standard)
const MM_TO_PX = 3.7795275591;
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;
const MARGIN_PX = MARGIN_MM * MM_TO_PX;
const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - (MARGIN_PX * 2);

/**
 * EditorWrapper component
 * 
 * Word-like paginated A4 document editor with proper page breaks and export
 */
export function EditorWrapper() {
  const { currentDocument, saveStatus, updateDocument } = useDocStore();
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isExporting, setIsExporting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing your document here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: currentDocument?.content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateDocument({ content: html });
      // Recalculate pages after content update
      requestAnimationFrame(calculatePages);
    },
    editorProps: {
      attributes: {
        class: 'document-editor focus:outline-none',
      },
    },
  });

  // Calculate number of pages based on content height
  const calculatePages = useCallback(() => {
    if (!editorContainerRef.current) return;
    
    const contentElement = editorContainerRef.current.querySelector('.ProseMirror');
    if (!contentElement) return;
    
    const contentHeight = contentElement.scrollHeight;
    const pages = Math.max(1, Math.ceil(contentHeight / CONTENT_HEIGHT_PX));
    setPageCount(pages);
  }, []);

  // Update editor content when document changes
  useEffect(() => {
    if (editor && currentDocument?.content && editor.getHTML() !== currentDocument.content) {
      editor.commands.setContent(currentDocument.content);
      requestAnimationFrame(calculatePages);
    }
  }, [currentDocument?.id, editor, calculatePages]);

  // Calculate pages on mount and resize
  useEffect(() => {
    calculatePages();
    window.addEventListener('resize', calculatePages);
    return () => window.removeEventListener('resize', calculatePages);
  }, [calculatePages]);

  // Track current page based on scroll position
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const pageHeight = (A4_HEIGHT_PX * (zoom / 100)) + 32; // Include gap
    const current = Math.floor(scrollTop / pageHeight) + 1;
    setCurrentPage(Math.min(current, pageCount));
  }, [zoom, pageCount]);

  // Export handlers
  const handleExportPDF = async () => {
    if (!editor) return;
    setIsExporting(true);
    try {
      await exportToPDF(editor.getHTML(), currentDocument?.title || 'document');
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDocx = async () => {
    if (!editor) return;
    setIsExporting(true);
    try {
      await exportToDocx(editor.getHTML(), currentDocument?.title || 'document');
      toast.success('DOCX exported successfully!');
    } catch (error) {
      toast.error('Failed to export DOCX');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children,
    title
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 w-8 p-0",
        isActive && "bg-muted text-primary"
      )}
    >
      {children}
    </Button>
  );

  // Generate page elements
  const renderPages = () => {
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(
        <div
          key={i}
          className="a4-page-marker"
          style={{
            position: 'absolute',
            top: `${(i + 1) * CONTENT_HEIGHT_PX}px`,
            left: 0,
            right: 0,
            height: '1px',
            borderTop: '1px dashed hsl(var(--border))',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <span 
            className="absolute -top-3 right-0 text-xs text-muted-foreground bg-card px-2 py-0.5 rounded"
            style={{ transform: 'translateY(-50%)' }}
          >
            Page {i + 1}
          </span>
        </div>
      );
    }
    return pages;
  };

  return (
    <div className="flex-1 flex flex-col bg-editor-bg overflow-hidden print:bg-white">
      {/* Toolbar - Hidden in print */}
      <div className="bg-card border-b border-border p-2 flex items-center gap-1 flex-wrap print:hidden">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor?.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor?.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor?.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          isActive={editor?.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          isActive={editor?.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Alignment */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          isActive={editor?.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          isActive={editor?.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          isActive={editor?.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
          isActive={editor?.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Block Elements */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Zoom Controls */}
        <ToolbarButton
          onClick={() => setZoom(Math.max(50, zoom - 10))}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </ToolbarButton>
        <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
        <ToolbarButton
          onClick={() => setZoom(Math.min(200, zoom + 10))}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2" disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportDocx}>
              <FileText className="h-4 w-4 mr-2" />
              Export as DOCX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save Status */}
        <div className="ml-auto text-xs text-muted-foreground capitalize">
          {saveStatus}
        </div>
      </div>

      {/* A4 Paper Canvas with Pages */}
      <div 
        className="flex-1 overflow-auto bg-muted/30 print:overflow-visible print:bg-white"
        onScroll={handleScroll}
        ref={pagesContainerRef}
      >
        <div 
          className="py-8 px-4 flex flex-col items-center gap-8 print:p-0 print:gap-0"
          style={{ minHeight: '100%' }}
        >
          {/* Render each page */}
          {Array.from({ length: pageCount }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="a4-page bg-white dark:bg-zinc-900 shadow-elevated rounded-sm print:shadow-none print:rounded-none relative"
              style={{
                width: `${A4_WIDTH_PX}px`,
                height: `${A4_HEIGHT_PX}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                marginBottom: zoom !== 100 ? `${(A4_HEIGHT_PX * (zoom / 100 - 1))}px` : 0,
                overflow: 'hidden',
                pageBreakAfter: 'always',
                pageBreakInside: 'avoid',
              }}
            >
              {/* Page Content */}
              <div 
                ref={pageIndex === 0 ? editorContainerRef : undefined}
                className="absolute inset-0"
                style={{
                  padding: `${MARGIN_PX}px`,
                  overflow: 'hidden',
                }}
              >
                {pageIndex === 0 ? (
                  <div 
                    className="editor-content-wrapper h-full"
                    style={{
                      overflow: 'visible',
                      position: 'relative',
                    }}
                  >
                    <EditorContent 
                      editor={editor} 
                      className="document-content"
                    />
                  </div>
                ) : (
                  <div 
                    className="continuation-page"
                    style={{
                      position: 'relative',
                      height: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Content overflow from previous page shown here */}
                    <div 
                      className="continuation-content"
                      style={{
                        position: 'absolute',
                        top: `-${pageIndex * CONTENT_HEIGHT_PX}px`,
                        left: 0,
                        right: 0,
                      }}
                    >
                      <EditorContent 
                        editor={editor} 
                        className="document-content pointer-events-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Page Number */}
              <div 
                className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground print:text-black"
              >
                {pageIndex + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Status - Hidden in print */}
      <div className="bg-card border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground print:hidden">
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <span>
          {currentDocument?.title || 'Untitled Document'}
        </span>
        <span>
          Words: {editor?.getText().split(/\s+/).filter(Boolean).length || 0}
        </span>
        <span>
          Characters: {editor?.getText().length || 0}
        </span>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .a4-page {
            page-break-after: always;
            page-break-inside: avoid;
            box-shadow: none !important;
            border: none !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
        }
        
        .document-editor {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000;
        }
        
        .dark .document-editor {
          color: #fff;
        }
        
        .document-editor p {
          margin: 0 0 12pt 0;
        }
        
        .document-editor h1 {
          font-size: 24pt;
          font-weight: bold;
          margin: 24pt 0 12pt 0;
        }
        
        .document-editor h2 {
          font-size: 18pt;
          font-weight: bold;
          margin: 18pt 0 9pt 0;
        }
        
        .document-editor h3 {
          font-size: 14pt;
          font-weight: bold;
          margin: 14pt 0 7pt 0;
        }
        
        .document-editor ul,
        .document-editor ol {
          padding-left: 24pt;
          margin: 12pt 0;
        }
        
        .document-editor li {
          margin: 6pt 0;
        }
        
        .document-editor blockquote {
          border-left: 3pt solid #ccc;
          padding-left: 12pt;
          margin: 12pt 0;
          font-style: italic;
        }
        
        .document-editor hr {
          border: none;
          border-top: 1pt solid #ccc;
          margin: 12pt 0;
        }
        
        .document-content .ProseMirror {
          outline: none;
          min-height: 100%;
        }
        
        .document-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
