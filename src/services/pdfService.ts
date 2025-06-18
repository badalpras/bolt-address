import jsPDF from 'jspdf';
import { RouteData } from '../types';

export function generateRoutePDF(routeData: RouteData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = margin;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Route Plan', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date and time
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const now = new Date();
  doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, margin, yPosition);
  yPosition += 12;

  // Route summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Route Summary', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Distance: ${routeData.totalDistance}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Estimated Duration: ${routeData.totalDuration}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Number of Stops: ${routeData.selectedAddresses.length}`, margin, yPosition);
  yPosition += 12;

  // Starting point
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Starting Point', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${routeData.startingPoint.address}`, margin, yPosition);
  yPosition += 15;

  // Route stops table header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Route Stops (Optimized Order)', margin, yPosition);
  yPosition += 10;

  // Table headers
  const tableStartY = yPosition;
  const colWidths = [15, 60, 105]; // Stop#, Business Name, Address
  const colPositions = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1]];
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  // Draw header background
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 8, 'F');
  
  // Header text
  doc.text('Stop', colPositions[0] + 2, yPosition + 4);
  doc.text('Business Name', colPositions[1] + 2, yPosition + 4);
  doc.text('Address', colPositions[2] + 2, yPosition + 4);
  
  yPosition += 8;

  // Get the optimized waypoint order from the route
  const waypointOrder = routeData.route.routes[0].waypoint_order || [];
  const orderedAddresses = waypointOrder.map(index => routeData.selectedAddresses[index]);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  orderedAddresses.forEach((address, index) => {
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPosition = margin;
      
      // Redraw headers on new page
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 8, 'F');
      doc.text('Stop', colPositions[0] + 2, yPosition + 4);
      doc.text('Business Name', colPositions[1] + 2, yPosition + 4);
      doc.text('Address', colPositions[2] + 2, yPosition + 4);
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    }

    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(248, 248, 248);
      doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 10, 'F');
    }

    // Row data
    doc.text(`${index + 1}`, colPositions[0] + 2, yPosition + 4);
    
    // Truncate long business names
    const businessName = address.businessName.length > 35 ? 
      address.businessName.substring(0, 32) + '...' : address.businessName;
    doc.text(businessName, colPositions[1] + 2, yPosition + 4);
    
    // Truncate long addresses
    const addressText = address.address.length > 60 ? 
      address.address.substring(0, 57) + '...' : address.address;
    doc.text(addressText, colPositions[2] + 2, yPosition + 4);

    yPosition += 10;
  });

  // Return to starting point row
  if (yPosition > doc.internal.pageSize.getHeight() - 30) {
    doc.addPage();
    yPosition = margin;
  }

  // Final row background
  if (orderedAddresses.length % 2 === 0) {
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, yPosition - 2, pageWidth - 2 * margin, 10, 'F');
  }

  doc.setFont('helvetica', 'bold');
  doc.text(`${orderedAddresses.length + 1}`, colPositions[0] + 2, yPosition + 4);
  doc.text('Return to Start', colPositions[1] + 2, yPosition + 4);
  
  doc.setFont('helvetica', 'normal');
  const returnAddress = routeData.startingPoint.address.length > 60 ? 
    routeData.startingPoint.address.substring(0, 57) + '...' : routeData.startingPoint.address;
  doc.text(returnAddress, colPositions[2] + 2, yPosition + 4);

  // Draw table borders
  const tableHeight = yPosition - tableStartY + 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);
  
  // Vertical lines
  colPositions.forEach(pos => {
    doc.line(pos, tableStartY, pos, tableStartY + tableHeight);
  });
  doc.line(pageWidth - margin, tableStartY, pageWidth - margin, tableStartY + tableHeight);
  
  // Horizontal lines
  doc.line(margin, tableStartY, pageWidth - margin, tableStartY);
  doc.line(margin, tableStartY + tableHeight, pageWidth - margin, tableStartY + tableHeight);

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${pageCount} - Generated by Address Mapping & Route Planner`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `route-plan-${now.toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}