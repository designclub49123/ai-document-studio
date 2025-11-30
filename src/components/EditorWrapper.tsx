import { useEffect } from 'react';
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
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * EditorWrapper component
 * 
 * Live A4 document editor using TipTap
 */
export function EditorWrapper() {
  const { currentDocument, saveStatus, updateDocument } = useDocStore();

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
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-full',
      },
    },
  });

  // Update editor content when document changes
  useEffect(() => {
    if (editor && currentDocument?.content && editor.getHTML() !== currentDocument.content) {
      editor.commands.setContent(currentDocument.content);
    }
  }, [currentDocument?.id]);

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

  return (
    <div className="flex-1 flex flex-col bg-editor-bg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-card border-b border-border p-2 flex items-center gap-1 flex-wrap">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          title="Redo"
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
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          isActive={editor?.isActive('underline')}
          title="Underline"
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

        {/* Save Status */}
        <div className="ml-auto text-xs text-muted-foreground capitalize">
          {saveStatus}
        </div>
      </div>

      {/* A4 Paper Canvas */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div 
          className="bg-white dark:bg-zinc-900 shadow-elevated rounded-sm border border-border"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '25.4mm',
          }}
        >
          <EditorContent 
            editor={editor} 
            className="min-h-full [&_.ProseMirror]:min-h-[246.2mm] [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none"
          />
        </div>
      </div>

      {/* Footer Status */}
      <div className="bg-card border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {currentDocument?.title || 'Untitled Document'}
        </span>
        <span>
          Words: {editor?.storage.characterCount?.words?.() || editor?.getText().split(/\s+/).filter(Boolean).length || 0}
        </span>
        <span>
          Characters: {editor?.getText().length || 0}
        </span>
      </div>
    </div>
  );
}
