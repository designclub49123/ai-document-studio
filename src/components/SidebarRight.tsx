import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIChatBubble } from './AIChatBubble';
import { WizardForm } from './WizardForm';
import { useAISidebar, type WizardType } from '@/state/useAISidebar';
import { AI_ACTIONS, WIZARD_TYPES } from '@/constants';
import {
  Sparkles,
  Send,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Wand2,
  MessageSquare,
  GraduationCap,
  Check,
  Minimize2,
  Maximize2,
  FileText,
  Mail,
  FileBarChart,
  Presentation,
  BookOpen,
  Eraser,
} from 'lucide-react';

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  generate: Sparkles,
  formal: GraduationCap,
  grammar: Check,
  condense: Minimize2,
  expand: Maximize2,
  summarize: FileText,
};

const WIZARD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  letter: Mail,
  report: FileBarChart,
  proposal: Presentation,
  essay: BookOpen,
};

export function SidebarRight() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen,
    mode,
    messages,
    isGenerating,
    wizardType,
    setMode,
    sendMessage,
    clearMessages,
    generateSection,
    rewriteFormal,
    fixGrammar,
    condense,
    expand,
    summarize,
    startWizard,
  } = useAISidebar();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isGenerating) return;
    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAction = async (actionId: string) => {
    switch (actionId) {
      case 'generate':
        await generateSection();
        break;
      case 'formal':
        await rewriteFormal();
        break;
      case 'grammar':
        await fixGrammar();
        break;
      case 'condense':
        await condense();
        break;
      case 'expand':
        await expand();
        break;
      case 'summarize':
        await summarize();
        break;
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-14 border-l border-border bg-sidebar flex flex-col items-center py-3 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="h-px w-8 bg-border my-2" />
        <Button
          variant={mode === 'chat' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => {
            setMode('chat');
            setIsCollapsed(false);
          }}
          title="AI Chat"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button
          variant={mode === 'wizard' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => {
            setMode('wizard');
            setIsCollapsed(false);
          }}
          title="Document Wizard"
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Wizard Mode
  if (mode === 'wizard' && wizardType) {
    return (
      <div className="w-80 border-l border-border bg-sidebar flex flex-col animate-slide-in-right">
        <WizardForm type={wizardType} />
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-sidebar flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-foreground">AI Assistant</h2>
            <p className="text-[10px] text-muted-foreground">Powered by AI</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mode Tabs */}
      <div className="flex p-2 gap-1 border-b border-border">
        <Button
          variant={mode === 'chat' ? 'secondary' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setMode('chat')}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Chat
        </Button>
        <Button
          variant={mode === 'wizard' ? 'secondary' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setMode('wizard')}
        >
          <Wand2 className="h-4 w-4 mr-1.5" />
          Wizard
        </Button>
      </div>

      {mode === 'chat' ? (
        <>
          {/* Quick Actions */}
          <div className="p-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-2">Quick Actions</p>
            <div className="flex flex-wrap gap-1.5">
              {AI_ACTIONS.map((action) => {
                const Icon = ACTION_ICONS[action.id];
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAction(action.id)}
                    disabled={isGenerating}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-sm text-foreground mb-1">
                  Start a conversation
                </h3>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Ask me to help you write, edit, or improve your document.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <AIChatBubble key={message.id} message={message} />
                ))}
                {isGenerating && (
                  <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mb-2 text-xs text-muted-foreground"
                onClick={clearMessages}
              >
                <Eraser className="h-3 w-3 mr-1" />
                Clear conversation
              </Button>
            )}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI anything..."
                disabled={isGenerating}
                className="flex-1"
              />
              <Button
                variant="ai"
                size="icon"
                onClick={handleSend}
                disabled={!inputValue.trim() || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* Wizard Selection */
        <ScrollArea className="flex-1 p-4">
          <p className="text-xs text-muted-foreground mb-4">
            Select a document type to generate with AI assistance
          </p>
          <div className="space-y-2">
            {WIZARD_TYPES.map((wizard) => {
              const Icon = WIZARD_ICONS[wizard.id];
              return (
                <button
                  key={wizard.id}
                  onClick={() => startWizard(wizard.id as WizardType)}
                  className="w-full p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-soft transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                        {wizard.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Step-by-step {wizard.id} creation
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
