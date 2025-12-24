import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useDocStore } from '@/state/useDocStore';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo,
  Heading1, Heading2, Heading3, Quote, Minus,
  Download, FileText, Loader2, ZoomIn, ZoomOut, Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { exportToPDF, exportToDocx } from '@/utils/exportDocument';

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const MARGIN_PX = 96; // 1 inch margins
const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - (MARGIN_PX * 2);

export function EditorWrapper() {
  const { currentDocument, saveStatus, updateDocument } = useDocStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isExporting, setIsExporting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: 'Start typing your document here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
    ],
    content: currentDocument?.content || '<p></p>',
    onUpdate: ({ editor }) => {
      updateDocument({ content: editor.getHTML() });
      requestAnimationFrame(calculatePages);
    },
    editorProps: {
      attributes: { class: 'document-editor focus:outline-none' },
    },
  });

  const calculatePages = useCallback(() => {
    if (!editorRef.current) return;
    const prose = editorRef.current.querySelector('.ProseMirror');
    if (!prose) return;
    const height = prose.scrollHeight;
    setPageCount(Math.max(1, Math.ceil(height / CONTENT_HEIGHT_PX)));
  }, []);

  useEffect(() => {
    if (editor && currentDocument?.content && editor.getHTML() !== currentDocument.content) {
      editor.commands.setContent(currentDocument.content);
      requestAnimationFrame(calculatePages);
    }
  }, [currentDocument?.id, editor, calculatePages]);

  useEffect(() => {
    calculatePages();
    window.addEventListener('resize', calculatePages);
    return () => window.removeEventListener('resize', calculatePages);
  }, [calculatePages]);

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!editor) return;
    setIsExporting(true);
    try {
      const content = editor.getHTML();
      const filename = currentDocument?.title || 'document';
      if (format === 'pdf') {
        await exportToPDF(content, filename);
      } else {
        await exportToDocx(content, filename);
      }
      toast.success(`${format.toUpperCase()} exported successfully!`);
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const ToolbarBtn = ({ onClick, active, disabled, children, title }: {
    onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; title: string;
  }) => (
    <Button variant="ghost" size="sm" onClick={onClick} disabled={disabled} title={title}
      className={cn("h-8 w-8 p-0", active && "bg-muted text-primary")}>
      {children}
    </Button>
  );

  const wordCount = editor?.getText().split(/\s+/).filter(Boolean).length || 0;
  const charCount = editor?.getText().length || 0;

  return (
    <div className="flex-1 flex flex-col bg-muted/30 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-card border-b border-border p-2 flex items-center gap-1 flex-wrap">
        <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} title="Undo">
          <Undo className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} title="Redo">
          <Redo className="h-4 w-4" />
        </ToolbarBtn>
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} 
          active={editor?.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} 
          active={editor?.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} 
          active={editor?.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolbarBtn>
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} 
          active={editor?.isActive('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} 
          active={editor?.isActive('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} 
          active={editor?.isActive('underline')} title="Underline">
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleStrike().run()} 
          active={editor?.isActive('strike')} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolbarBtn>
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('left').run()} 
          active={editor?.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('center').run()} 
          active={editor?.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenter className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('right').run()} 
          active={editor?.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('justify').run()} 
          active={editor?.isActive({ textAlign: 'justify' })} title="Justify">
          <AlignJustify className="h-4 w-4" />
        </ToolbarBtn>
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} 
          active={editor?.isActive('bulletList')} title="Bullet List">
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
          active={editor?.isActive('orderedList')} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} 
          active={editor?.isActive('blockquote')} title="Quote">
          <Quote className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus className="h-4 w-4" />
        </ToolbarBtn>
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Zoom */}
        <ToolbarBtn onClick={() => setZoom(Math.max(50, zoom - 10))} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </ToolbarBtn>
        <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
        <ToolbarBtn onClick={() => setZoom(Math.min(200, zoom + 10))} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </ToolbarBtn>
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2" disabled={isExporting}>
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" /> Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('docx')}>
              <FileText className="h-4 w-4 mr-2" /> Export as Word
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="ml-auto text-xs text-muted-foreground capitalize">{saveStatus}</div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto" style={{ width: `${A4_WIDTH_PX * (zoom / 100)}px` }}>
          {/* A4 Pages */}
          <div 
            ref={editorRef}
            className="bg-white dark:bg-zinc-900 shadow-xl mx-auto"
            style={{
              width: `${A4_WIDTH_PX}px`,
              minHeight: `${A4_HEIGHT_PX * pageCount}px`,
              padding: `${MARGIN_PX}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              position: 'relative',
            }}
          >
            <EditorContent editor={editor} className="document-content" />
            
            {/* Page break indicators */}
            {Array.from({ length: pageCount - 1 }).map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t-2 border-dashed border-muted-foreground/30"
                style={{ top: `${(i + 1) * A4_HEIGHT_PX}px` }}>
                <span className="absolute right-4 -top-3 text-xs text-muted-foreground bg-white dark:bg-zinc-900 px-2">
                  Page {i + 2}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Page 1 of {pageCount}</span>
        <span>{currentDocument?.title || 'Untitled'}</span>
        <span>Words: {wordCount} | Characters: {charCount}</span>
      </div>

      <style>{`
        .document-editor {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000;
        }
        .dark .document-editor { color: #fff; }
        .document-editor p { margin: 0 0 12pt 0; }
        .document-editor h1 { font-size: 24pt; font-weight: bold; margin: 24pt 0 12pt 0; }
        .document-editor h2 { font-size: 18pt; font-weight: bold; margin: 18pt 0 9pt 0; }
        .document-editor h3 { font-size: 14pt; font-weight: bold; margin: 14pt 0 7pt 0; }
        .document-editor ul, .document-editor ol { padding-left: 24pt; margin: 12pt 0; }
        .document-editor li { margin: 6pt 0; }
        .document-editor blockquote { border-left: 3pt solid #ccc; padding-left: 12pt; margin: 12pt 0; font-style: italic; }
        .document-editor hr { border: none; border-top: 1pt solid #ccc; margin: 12pt 0; }
        .document-content .ProseMirror { outline: none; min-height: 100%; }
        .document-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); float: left; color: #adb5bd; pointer-events: none; height: 0;
        }
        @media print {
          @page { size: A4; margin: 1in; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
