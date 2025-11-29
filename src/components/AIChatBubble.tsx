import { cn } from '@/lib/utils';
import { User, Sparkles } from 'lucide-react';
import type { Message } from '@/state/useAISidebar';

interface AIChatBubbleProps {
  message: Message;
}

export function AIChatBubble({ message }: AIChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'h-7 w-7 rounded-full flex items-center justify-center shrink-0',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Message */}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <span
          className={cn(
            'text-[10px] mt-1.5 block',
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
