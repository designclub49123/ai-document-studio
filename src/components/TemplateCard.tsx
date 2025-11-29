import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

interface TemplateCardProps {
  title: string;
  description: string;
  previewImageUrl?: string;
  category?: string;
  onSelect: () => void;
  className?: string;
}

export function TemplateCard({
  title,
  description,
  previewImageUrl,
  category,
  onSelect,
  className,
}: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative w-full text-left rounded-xl border border-border bg-card p-3',
        'transition-all duration-200 hover:border-primary/30 hover:shadow-soft',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      {/* Preview */}
      <div className="aspect-[4/3] rounded-lg bg-muted mb-3 overflow-hidden flex items-center justify-center">
        {previewImageUrl && previewImageUrl !== '/placeholder.svg' ? (
          <img
            src={previewImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <FileText className="h-8 w-8" />
            <span className="text-xs">Preview</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        {category && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
            {category}
          </span>
        )}
        <h3 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
