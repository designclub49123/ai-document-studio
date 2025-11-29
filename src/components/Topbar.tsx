import { useState } from 'react';
import { useDocStore } from '@/state/useDocStore';
import { useUserStore } from '@/state/useUserStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Save,
  Download,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Check,
  Loader2,
  Cloud,
  Presentation,
} from 'lucide-react';
import { downloadDocument } from '@/utils/documentActions';
import { APP_NAME } from '@/constants';

export function Topbar() {
  const { currentDocument, saveStatus, updateDocumentTitle, saveDocument } = useDocStore();
  const { user, theme, toggleTheme, logout } = useUserStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentDocument?.title || 'Untitled Document');

  const handleTitleClick = () => {
    setTitleValue(currentDocument?.title || 'Untitled Document');
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim()) {
      updateDocumentTitle(titleValue.trim());
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTitleValue(currentDocument?.title || 'Untitled Document');
    }
  };

  const handleExport = async (format: 'docx' | 'pdf' | 'pptx') => {
    if (currentDocument) {
      await downloadDocument(currentDocument.id, format);
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'saved':
        return <Check className="h-4 w-4 text-success" />;
      default:
        return <Cloud className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      default:
        return 'Unsaved changes';
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
      {/* Logo & Title Section */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:block">{APP_NAME}</span>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Document Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditingTitle ? (
            <Input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="h-8 max-w-xs bg-transparent border-muted-foreground/30"
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate max-w-xs"
            >
              {currentDocument?.title || 'Untitled Document'}
            </button>
          )}

          {/* Save Status */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            {getSaveStatusIcon()}
            <span className="hidden md:block">{getSaveStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => saveDocument()}>
          <Save className="h-4 w-4" />
          <span className="hidden md:block">Save</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
              <span className="hidden md:block">Export</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('docx')}>
              <FileText className="h-4 w-4 mr-2" />
              Word Document (.docx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              PDF Document (.pdf)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport('pptx')}>
              <Presentation className="h-4 w-4 mr-2" />
              PowerPoint (.pptx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden md:block text-sm">
                {user?.name || 'Guest'}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
