import qz from 'qz-tray';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Connect QZ Tray
export const connectQZ = async () => {
  if (!qz.websocket.isActive()) {
    try {
      await qz.websocket.connect();
      console.log('Connected to QZ Tray');
    } catch (err) {
      console.error('Failed to connect to QZ Tray', err);
      throw err;
    }
  }
};

// Get default or selected printer
export const getPrinter = async (printerName = '') => {
  await connectQZ();
  return printerName || await qz.printers.getDefault();
};

// Create and send printable PDF of leads
export const printLeads = async (printerName, leads) => {
  const printer = await getPrinter(printerName);
  const config = qz.configs.create(printer);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const fontSize = 12;
  let y = height - 40;

  // Title
  page.drawText('Lead Report', {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0.2, 0.2, 0.6),
  });

  y -= 30;

  // Column headers
  const headers = 'Name | Email | Phone | Source | Status | Rep';
  page.drawText(headers, {
    x: 50,
    y,
    size: fontSize,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 15;

  // Separator
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  y -= 20;

  // Lead entries
  leads.forEach((lead, i) => {
    const line = `${lead.name} | ${lead.email} | ${lead.phone} | ${lead.source} | ${lead.status} | ${lead.rep}`;
    if (y < 50) {
      page = pdfDoc.addPage();
      y = height - 40;
    }

    page.drawText(line, {
      x: 50,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 20;
  });

  // Convert to base64
  const pdfBytes = await pdfDoc.save();
  const base64 = btoa(String.fromCharCode(...pdfBytes));

  const data = [{
    type: 'pdf',
    format: 'base64',
    data: base64,
  }];

  try {
    await qz.print(config, data);
    console.log('✅ Leads printed as PDF!');
  } catch (err) {
    console.error('❌ Print failed:', err);
    throw err;
  }
};
