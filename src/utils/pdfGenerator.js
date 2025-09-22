import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

export const generateTicketPDF = async (bookingData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Colors and styling
  const primaryColor = [139, 69, 19]; // Saddle brown for temple theme
  const secondaryColor = [255, 140, 0]; // Orange
  const textColor = [0, 0, 0];
  const lightBg = [255, 248, 220]; // Light yellow background

  // Header Section
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  // Temple Logo/Symbol (decorative)
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ॐ', 20, 25);

  // Title
  pdf.setFontSize(18);
  pdf.text('E-DARSHAN ENTRY PASS', pageWidth / 2, 25, { align: 'center' });

  // Subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Sacred Temple Analytics Platform', pageWidth / 2, 35, { align: 'center' });

  let yPosition = 60;

  // Booking Details Section
  pdf.setTextColor(...textColor);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BOOKING DETAILS', 20, yPosition);

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  const details = [
    ['Booking ID:', bookingData?.id || 'N/A'],
    ['Temple:', bookingData?.temple?.name || 'N/A'],
    ['Location:', bookingData?.temple?.location || 'N/A'],
    ['Date:', bookingData?.date?.toLocaleDateString() || 'N/A'],
    ['Time Slot:', bookingData?.timeSlot || 'N/A'],
    ['Ticket Type:', bookingData?.ticketType || 'N/A'],
    ['Number of Tickets:', bookingData?.tickets?.toString() || 'N/A'],
    ['Total Amount:', `₹${bookingData?.amount || 'N/A'}`],
    ['Status:', bookingData?.status?.toUpperCase() || 'N/A']
  ];

  details.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 80, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Devotee Details Section
  if (bookingData?.devotees && bookingData?.devotees?.length > 0) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DEVOTEE DETAILS', 20, yPosition);

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Table header
    pdf.setFillColor(...lightBg);
    pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.text('Name', 25, yPosition);
    pdf.text('Age', 120, yPosition);

    yPosition += 10;

    // Devotee details
    bookingData?.devotees?.forEach((devotee, index) => {
      pdf.setFont('helvetica', 'normal');
      pdf.text(devotee?.name || 'N/A', 25, yPosition);
      pdf.text(devotee?.age?.toString() || 'N/A', 120, yPosition);
      yPosition += 8;

      // Add new page if needed
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 30;
      }
    });
  }

  yPosition += 15;

  // Important Instructions
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IMPORTANT INSTRUCTIONS', 20, yPosition);

  yPosition += 12;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const instructions = [
    '• Please arrive 30 minutes before your scheduled time',
    '• Carry a valid photo ID for verification',
    '• This ticket is non-transferable and valid only for the specified date and time',
    '• Photography may be restricted in certain areas',
    '• Follow temple guidelines and maintain decorum',
    '• In case of emergency, contact temple authorities immediately'
  ];

  instructions.forEach(instruction => {
    pdf.text(instruction, 20, yPosition);
    yPosition += 6;
  });

  // Generate real QR code with booking data
  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SCAN FOR ENTRY', 20, yPosition);

  // Generate QR code with booking data
  const qrData = JSON.stringify({
    bookingId: bookingData?.id,
    temple: bookingData?.temple?.name,
    date: bookingData?.date,
    timeSlot: bookingData?.timeSlot,
    ticketType: bookingData?.ticketType,
    tickets: bookingData?.tickets
  });

  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Add QR code to PDF
    yPosition += 10;
    const qrSize = 50;
    const qrX = (pageWidth - qrSize) / 2;
    
    // Draw QR code image
    pdf.addImage(qrCodeDataURL, 'PNG', qrX, yPosition, qrSize, qrSize);

    // Add text below QR code
    yPosition += qrSize + 10;
    pdf.setFillColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Scan this QR code for entry verification', pageWidth / 2, yPosition, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text(`Booking ID: ${bookingData?.id}`, pageWidth / 2, yPosition + 8, { align: 'center' });

  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to text-based QR code representation
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.text(`QR CODE ERROR - Use Booking ID: ${bookingData?.id}`, pageWidth / 2, yPosition, { align: 'center' });
  }

  // Footer
  const footerY = pageHeight - 30;
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, footerY, pageWidth, 30, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generated by Temple Analytics Platform', pageWidth / 2, footerY + 10, { align: 'center' });
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 20, { align: 'center' });

  // Add temple contact info
  pdf.setFontSize(8);
  pdf.text(`Temple Contact: ${bookingData?.temple?.contact || 'N/A'}`, 20, footerY + 15);

  return pdf;
};

export const downloadTicketPDF = async (bookingData) => {
  try {
    const pdf = await generateTicketPDF(bookingData);
    const fileName = `e-darshan-ticket-${bookingData?.id || 'ticket'}.pdf`;
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
