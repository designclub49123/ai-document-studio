import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  FileImage, 
  FileCode,
  Settings,
  Loader2,
  Check,
  Palette,
  Type,
  Layout,
  Stamp,
  FileDown
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { cn } from '@/lib/utils';

interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'txt' | 'md';
  includeHeaders: boolean;
  includeFooters: boolean;
  headerText: string;
  footerText: string;
  includeWatermark: boolean;
  watermarkText: string;
  watermarkOpacity: number;
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: 'normal' | 'narrow' | 'wide';
  fontSize: number;
  fontFamily: string;
  includePageNumbers: boolean;
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'top-right';
}

interface AdvancedExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  content: string;
  onExport: (options: ExportOptions) => void;
}

export const AdvancedExportDialog: React.FC<AdvancedExportDialogProps> = ({
  isOpen,
  onClose,
  documentName,
  content,
  onExport
}) => {
  const [exporting, setExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeHeaders: false,
    includeFooters: false,
    headerText: documentName,
    footerText: 'Page {page} of {total}',
    includeWatermark: false,
    watermarkText: 'CONFIDENTIAL',
    watermarkOpacity: 0.1,
    pageSize: 'a4',
    orientation: 'portrait',
    margins: 'normal',
    fontSize: 12,
    fontFamily: 'helvetica',
    includePageNumbers: true,
    pageNumberPosition: 'bottom-center'
  });

  const formatIcons = {
    pdf: FileText,
    docx: FileText,
    html: FileCode,
    txt: FileText,
    md: FileCode
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      if (options.format === 'pdf') {
        await exportToPDF();
      } else if (options.format === 'txt') {
        exportToTxt();
      } else if (options.format === 'md') {
        exportToMarkdown();
      } else if (options.format === 'html') {
        exportToHTML();
      } else {
        onExport(options);
      }
      toast.success(`Exported as ${options.format.toUpperCase()}`);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    const doc = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: options.pageSize
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Margin sizes
    const margins = {
      normal: { left: 25, right: 25, top: 25, bottom: 25 },
      narrow: { left: 12, right: 12, top: 12, bottom: 12 },
      wide: { left: 40, right: 40, top: 40, bottom: 40 }
    };
    const margin = margins[options.margins];
    
    doc.setFontSize(options.fontSize);
    
    // Add watermark to each page
    const addWatermark = (pageNum: number) => {
      if (options.includeWatermark && options.watermarkText) {
        doc.setPage(pageNum);
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(60);
        const textWidth = doc.getTextWidth(options.watermarkText);
        doc.text(
          options.watermarkText, 
          pageWidth / 2 - textWidth / 2, 
          pageHeight / 2,
          { angle: 45 }
        );
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(options.fontSize);
      }
    };

    // Add headers/footers to each page
    const addHeadersFooters = (pageNum: number, totalPages: number) => {
      doc.setPage(pageNum);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      
      if (options.includeHeaders && options.headerText) {
        doc.text(options.headerText, margin.left, 15);
        doc.line(margin.left, 18, pageWidth - margin.right, 18);
      }
      
      if (options.includeFooters && options.footerText) {
        doc.line(margin.left, pageHeight - 18, pageWidth - margin.right, pageHeight - 18);
        const footerText = options.footerText
          .replace('{page}', pageNum.toString())
          .replace('{total}', totalPages.toString());
        doc.text(footerText, margin.left, pageHeight - 10);
      }
      
      if (options.includePageNumbers) {
        const pageText = `${pageNum} / ${totalPages}`;
        let x = pageWidth / 2;
        if (options.pageNumberPosition === 'bottom-right') x = pageWidth - margin.right;
        if (options.pageNumberPosition === 'top-right') {
          doc.text(pageText, pageWidth - margin.right, 15, { align: 'right' });
        } else {
          const align = options.pageNumberPosition === 'bottom-center' ? 'center' : 'right';
          doc.text(pageText, x, pageHeight - 10, { align });
        }
      }
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(options.fontSize);
    };

    // Content area
    const contentWidth = pageWidth - margin.left - margin.right;
    const startY = margin.top + (options.includeHeaders ? 10 : 0);
    const endY = pageHeight - margin.bottom - (options.includeFooters || options.includePageNumbers ? 15 : 0);
    
    // Split content into lines
    const lines = doc.splitTextToSize(content.replace(/<[^>]*>/g, ''), contentWidth);
    
    let currentY = startY;
    const lineHeight = options.fontSize * 0.5;
    
    lines.forEach((line: string, index: number) => {
      if (currentY + lineHeight > endY) {
        doc.addPage();
        currentY = startY;
      }
      doc.text(line, margin.left, currentY);
      currentY += lineHeight;
    });

    // Add watermarks and headers/footers to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      addWatermark(i);
      addHeadersFooters(i, totalPages);
    }

    doc.save(`${documentName}.pdf`);
  };

  const exportToTxt = () => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToMarkdown = () => {
    // Basic HTML to Markdown conversion
    let markdown = content
      .replace(/<h1[^>]*>/gi, '# ')
      .replace(/<h2[^>]*>/gi, '## ')
      .replace(/<h3[^>]*>/gi, '### ')
      .replace(/<strong[^>]*>/gi, '**')
      .replace(/<\/strong>/gi, '**')
      .replace(/<em[^>]*>/gi, '*')
      .replace(/<\/em>/gi, '*')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<p[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]*>/g, '');
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentName}</title>
  <style>
    body { font-family: ${options.fontFamily}, sans-serif; font-size: ${options.fontSize}px; max-width: 800px; margin: 40px auto; padding: 20px; }
    ${options.includeWatermark ? `body::before { content: '${options.watermarkText}'; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; opacity: ${options.watermarkOpacity}; pointer-events: none; }` : ''}
  </style>
</head>
<body>
  ${options.includeHeaders ? `<header style="border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px;">${options.headerText}</header>` : ''}
  <main>${content}</main>
  ${options.includeFooters ? `<footer style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px;">${options.footerText}</footer>` : ''}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileDown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Export Document</DialogTitle>
              <DialogDescription>
                Customize your export with advanced options
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="format" className="gap-2">
              <FileText className="h-4 w-4" />
              Format
            </TabsTrigger>
            <TabsTrigger value="layout" className="gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="extras" className="gap-2">
              <Stamp className="h-4 w-4" />
              Extras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4 mt-4">
            <div className="grid grid-cols-5 gap-2">
              {(['pdf', 'docx', 'html', 'txt', 'md'] as const).map((format) => {
                const Icon = formatIcons[format];
                return (
                  <button
                    key={format}
                    onClick={() => setOptions({ ...options, format })}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                      options.format === format 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Icon className={cn(
                      "h-6 w-6",
                      options.format === format ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-xs font-medium uppercase">{format}</span>
                    {options.format === format && (
                      <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select 
                  value={options.fontFamily} 
                  onValueChange={(v) => setOptions({ ...options, fontFamily: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                    <SelectItem value="times">Times New Roman</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select 
                  value={options.fontSize.toString()} 
                  onValueChange={(v) => setOptions({ ...options, fontSize: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 11, 12, 14, 16, 18].map(size => (
                      <SelectItem key={size} value={size.toString()}>{size}pt</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Page Size</Label>
                <Select 
                  value={options.pageSize} 
                  onValueChange={(v: 'a4' | 'letter' | 'legal') => setOptions({ ...options, pageSize: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Orientation</Label>
                <Select 
                  value={options.orientation} 
                  onValueChange={(v: 'portrait' | 'landscape') => setOptions({ ...options, orientation: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Margins</Label>
                <Select 
                  value={options.margins} 
                  onValueChange={(v: 'normal' | 'narrow' | 'wide') => setOptions({ ...options, margins: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="narrow">Narrow</SelectItem>
                    <SelectItem value="wide">Wide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Page Numbers</Label>
                <p className="text-xs text-muted-foreground">Add page numbers to document</p>
              </div>
              <Switch
                checked={options.includePageNumbers}
                onCheckedChange={(checked) => setOptions({ ...options, includePageNumbers: checked })}
              />
            </div>

            {options.includePageNumbers && (
              <div className="space-y-2 ml-6">
                <Label>Position</Label>
                <Select 
                  value={options.pageNumberPosition} 
                  onValueChange={(v: 'bottom-center' | 'bottom-right' | 'top-right') => setOptions({ ...options, pageNumberPosition: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          <TabsContent value="extras" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Header</Label>
                <p className="text-xs text-muted-foreground">Add header text to each page</p>
              </div>
              <Switch
                checked={options.includeHeaders}
                onCheckedChange={(checked) => setOptions({ ...options, includeHeaders: checked })}
              />
            </div>
            {options.includeHeaders && (
              <Input
                value={options.headerText}
                onChange={(e) => setOptions({ ...options, headerText: e.target.value })}
                placeholder="Header text..."
                className="ml-6"
              />
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Footer</Label>
                <p className="text-xs text-muted-foreground">Add footer text to each page</p>
              </div>
              <Switch
                checked={options.includeFooters}
                onCheckedChange={(checked) => setOptions({ ...options, includeFooters: checked })}
              />
            </div>
            {options.includeFooters && (
              <div className="ml-6 space-y-1">
                <Input
                  value={options.footerText}
                  onChange={(e) => setOptions({ ...options, footerText: e.target.value })}
                  placeholder="Footer text..."
                />
                <p className="text-xs text-muted-foreground">Use {'{page}'} and {'{total}'} for page numbers</p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Watermark</Label>
                <p className="text-xs text-muted-foreground">Add diagonal watermark text</p>
              </div>
              <Switch
                checked={options.includeWatermark}
                onCheckedChange={(checked) => setOptions({ ...options, includeWatermark: checked })}
              />
            </div>
            {options.includeWatermark && (
              <Input
                value={options.watermarkText}
                onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                placeholder="Watermark text..."
                className="ml-6"
              />
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={exporting} className="gap-2">
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export as {options.format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedExportDialog;
