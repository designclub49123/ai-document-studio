import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateCard } from './TemplateCard';
import { useDocStore, type Document } from '@/state/useDocStore';
import {
  BUILT_IN_TEMPLATES,
  getCategories,
  searchTemplates,
  loadTemplate,
} from '@/utils/templateLoader';
import { LEFT_SIDEBAR_TABS } from '@/constants';
import {
  FileText,
  PenTool,
  Palette,
  Table,
  Image,
  Bookmark,
  FolderOpen,
  Search,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Clock,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  PenTool,
  Palette,
  Table,
  Image,
  Bookmark,
  FolderOpen,
};

export function SidebarLeft() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, createNewDocument, setCurrentDocument, deleteDocument } = useDocStore();

  const handleTemplateSelect = async (templateId: string) => {
    const docId = await loadTemplate(templateId);
    console.log('[SidebarLeft] Loaded template, new document ID:', docId);
  };

  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : BUILT_IN_TEMPLATES;

  const categories = getCategories();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        return (
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Upload Button */}
            <Button variant="outline" className="w-full justify-start gap-2">
              <Upload className="h-4 w-4" />
              Upload Template
            </Button>

            {/* Templates Grid */}
            <div className="space-y-6">
              {searchQuery ? (
                <div className="grid grid-cols-1 gap-3">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      {...template}
                      onSelect={() => handleTemplateSelect(template.id)}
                    />
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {BUILT_IN_TEMPLATES.filter((t) => t.category === category)
                        .slice(0, 2)
                        .map((template) => (
                          <TemplateCard
                            key={template.id}
                            {...template}
                            onSelect={() => handleTemplateSelect(template.id)}
                          />
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="p-4 space-y-4">
            <Button
              variant="default"
              className="w-full justify-start gap-2"
              onClick={createNewDocument}
            >
              <Plus className="h-4 w-4" />
              New Document
            </Button>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Documents
              </h3>
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setCurrentDocument(doc)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'tools':
        return (
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Quick access tools for document editing
            </p>
            {['Find & Replace', 'Word Count', 'Spell Check', 'Print Preview'].map(
              (tool) => (
                <Button
                  key={tool}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {tool}
                </Button>
              )
            )}
          </div>
        );

      case 'styles':
        return (
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Apply styles and themes to your document
            </p>
            {['Professional', 'Modern', 'Classic', 'Minimal', 'Academic'].map(
              (style) => (
                <Button
                  key={style}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {style} Theme
                </Button>
              )
            )}
          </div>
        );

      case 'tables':
        return (
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Insert and customize tables
            </p>
            <div className="grid grid-cols-5 gap-1 p-2 bg-muted rounded-lg">
              {Array.from({ length: 25 }).map((_, i) => (
                <button
                  key={i}
                  className="w-6 h-6 border border-border rounded hover:bg-primary hover:border-primary transition-colors"
                />
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Select table size
            </p>
          </div>
        );

      case 'images':
        return (
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Insert images and diagrams
            </p>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Image className="h-4 w-4" />
              Stock Images
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText className="h-4 w-4" />
              Create Diagram
            </Button>
          </div>
        );

      case 'citations':
        return (
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Manage citations and references
            </p>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              Add Citation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Generate Bibliography
            </Button>
            <div className="mt-4 text-xs text-muted-foreground">
              Citation Style: APA 7th Edition
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-14 border-r border-border bg-sidebar flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="m-2"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-1 py-2">
          {LEFT_SIDEBAR_TABS.map((tab) => {
            const Icon = ICON_MAP[tab.icon];
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCollapsed(false);
                }}
                title={tab.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-border bg-sidebar flex flex-col animate-slide-in-left">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">
          {LEFT_SIDEBAR_TABS.find((t) => t.id === activeTab)?.label}
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto p-2 gap-1 border-b border-border scrollbar-thin">
        {LEFT_SIDEBAR_TABS.map((tab) => {
          const Icon = ICON_MAP[tab.icon];
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'shrink-0',
                activeTab === tab.id && 'bg-secondary'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">{renderTabContent()}</ScrollArea>
    </div>
  );
}
