import { jsPDF } from 'jspdf';

/**
 * Generates a downloadable PDF for RTI Applications.
 * Strict Constraint: The PDF filename MUST NOT contain spaces (e.g., RTI_Application_Railways.pdf).
 * 
 * @param {string} text - The formatted RTI request text.
 * @param {string} departmentName - Name of the targeted Central Government Ministry/Dept.
 * @returns {string} - Generated filename
 */
export const generateRTIPdf = (text, departmentName = 'Central_Government') => {
  // Clean department name to remove spaces and special characters for filename
  const cleanDeptName = departmentName
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  // Filename strictly without spaces
  const filename = `RTI_Application_${cleanDeptName || 'Central_Government'}.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - margin * 2;

  // Header Banner styling
  doc.setFillColor(16, 42, 67); // Navy #102a43
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RIGHT TO INFORMATION ACT, 2005 - FORMAL APPLICATION', margin, 14);

  // Subheader bar
  doc.setFillColor(255, 153, 51); // Saffron accent
  doc.rect(0, 24, pageWidth, 2, 'F');

  // Metadata / Date
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Generated on: ${currentDate}`, margin, 34);
  doc.text(`Target Public Authority: ${departmentName}`, margin, 40);

  // Line separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 44, pageWidth - margin, 44);

  // Body text
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Split text into lines that fit within maxLineWidth
  const splitText = doc.splitTextToSize(text, maxLineWidth);
  
  let cursorY = 52;
  const lineHeight = 6;

  for (let i = 0; i < splitText.length; i++) {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      
      // Top accent for new page
      doc.setFillColor(16, 42, 67);
      doc.rect(0, 0, pageWidth, 8, 'F');
      
      cursorY = 20;
    }
    doc.text(splitText[i], margin, cursorY);
    cursorY += lineHeight;
  }

  // Footer instructions on last page
  if (cursorY + 25 < pageHeight - margin) {
    cursorY += 10;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Note: This document was auto-formatted via Rights Navigator for attachment on rtionline.gov.in', margin, cursorY);
  }

  // Save PDF file
  doc.save(filename);
  return filename;
};
