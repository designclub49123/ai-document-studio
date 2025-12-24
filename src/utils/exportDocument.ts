import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// A4 dimensions
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

/**
 * Export document content to PDF
 */
export async function exportToPDF(htmlContent: string, filename: string): Promise<void> {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed; left: -9999px; top: 0; width: 210mm;
    background: white; font-family: 'Times New Roman', serif;
    font-size: 12pt; line-height: 1.5; color: black; padding: 25.4mm;
  `;
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    const imgWidth = A4_WIDTH_PT;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= A4_HEIGHT_PT;

    while (heightLeft > 0) {
      position -= A4_HEIGHT_PT;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= A4_HEIGHT_PT;
    }

    pdf.save(`${filename}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Export document content to DOCX (creates downloadable HTML as .doc)
 */
export async function exportToDocx(htmlContent: string, filename: string): Promise<void> {
  const docContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word">
    <head><meta charset="utf-8">
    <style>
      @page { size: A4; margin: 1in; }
      body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
      h1 { font-size: 24pt; } h2 { font-size: 18pt; } h3 { font-size: 14pt; }
    </style></head>
    <body>${htmlContent}</body></html>
  `;
  
  const blob = new Blob([docContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}
