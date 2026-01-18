import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        // Handle shortcuts with ctrl/meta
        if (shortcut.ctrl || shortcut.meta) {
          const modMatch = event.ctrlKey || event.metaKey;
          if (modMatch && shiftMatch && altMatch && keyMatch) {
            if (shortcut.preventDefault !== false) {
              event.preventDefault();
            }
            shortcut.handler();
            return;
          }
        } else if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Common editor shortcuts
export function useEditorShortcuts({
  onSave,
  onUndo,
  onRedo,
  onBold,
  onItalic,
  onUnderline,
  onFind,
  onReplace,
  onNewDocument,
  onExport,
}: {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onFind?: () => void;
  onReplace?: () => void;
  onNewDocument?: () => void;
  onExport?: () => void;
}) {
  const shortcuts: ShortcutConfig[] = [];

  if (onSave) {
    shortcuts.push({ key: 's', ctrl: true, handler: onSave });
  }
  if (onUndo) {
    shortcuts.push({ key: 'z', ctrl: true, handler: onUndo });
  }
  if (onRedo) {
    shortcuts.push({ key: 'z', ctrl: true, shift: true, handler: onRedo });
    shortcuts.push({ key: 'y', ctrl: true, handler: onRedo });
  }
  if (onBold) {
    shortcuts.push({ key: 'b', ctrl: true, handler: onBold });
  }
  if (onItalic) {
    shortcuts.push({ key: 'i', ctrl: true, handler: onItalic });
  }
  if (onUnderline) {
    shortcuts.push({ key: 'u', ctrl: true, handler: onUnderline });
  }
  if (onFind) {
    shortcuts.push({ key: 'f', ctrl: true, handler: onFind });
  }
  if (onReplace) {
    shortcuts.push({ key: 'h', ctrl: true, handler: onReplace });
  }
  if (onNewDocument) {
    shortcuts.push({ key: 'n', ctrl: true, handler: onNewDocument });
  }
  if (onExport) {
    shortcuts.push({ key: 'e', ctrl: true, shift: true, handler: onExport });
  }

  useKeyboardShortcuts(shortcuts);
}

export default useKeyboardShortcuts;
