import jsPDF from "jspdf";

export function convertMarkdownToPDF(markdown: string): Blob {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 10;
  const lineHeight = 7;
  let y = margin;

  // Split the markdown into lines
  const lines = markdown.split("\n");

  lines.forEach((line) => {
    // Split long lines
    const words = line.split(" ");
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const testLineWidth =
        (pdf.getStringUnitWidth(testLine) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;

      if (testLineWidth > pageWidth - 2 * margin) {
        pdf.text(currentLine, margin, y);
        y += lineHeight;
        currentLine = word;

        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      } else {
        currentLine = testLine;
      }
    });

    // Print the last line of a paragraph
    if (currentLine) {
      pdf.text(currentLine, margin, y);
      y += lineHeight;
    }

    // Add extra space between paragraphs
    y += lineHeight / 2;

    if (y > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  });

  return pdf.output("blob");
}
