// src/lib/pdfService.ts
import jsPDF from 'jspdf';

interface ReceiptData {
  order: {
    id: string;
    amount: number;
    currency: string;
    description: string;
    timeline: string;
    createdAt: Date;
    completedAt?: Date;
    paidAmount?: number;
  };
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  artisan: {
    name: string;
    email?: string;
    phone?: string;
  };
}

export class PDFService {
  static generateReceipt(data: ReceiptData): jsPDF {
    const doc = new jsPDF();
    
    // Calculate remaining amount
    const totalAmount = data.order.amount;
    const paidAmount = data.order.paidAmount || 0;
    const remainingAmount = totalAmount - paidAmount;

    // Set font styles
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIPT', 105, 20, { align: 'center' });

    // Order ID
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order #${data.order.id.slice(-8)}`, 105, 30, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 37, { align: 'center' });

    // Order Status
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ Order Completed', 105, 50, { align: 'center' });

    // Customer and Artisan Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Information:', 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${data.customer.name}`, 20, 80);
    if (data.customer.email) {
      doc.text(`Email: ${data.customer.email}`, 20, 87);
    }
    if (data.customer.phone) {
      doc.text(`Phone: ${data.customer.phone}`, 20, 94);
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Artisan Information:', 120, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${data.artisan.name}`, 120, 80);
    if (data.artisan.email) {
      doc.text(`Email: ${data.artisan.email}`, 120, 87);
    }
    if (data.artisan.phone) {
      doc.text(`Phone: ${data.artisan.phone}`, 120, 94);
    }

    // Order Details
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details:', 20, 115);
    doc.setFont('helvetica', 'normal');
    doc.text(`Project: ${data.order.description}`, 20, 125);
    doc.text(`Timeline: ${data.order.timeline}`, 20, 132);
    doc.text(`Order Date: ${new Date(data.order.createdAt).toLocaleDateString()}`, 20, 139);
    if (data.order.completedAt) {
      doc.text(`Completion Date: ${new Date(data.order.completedAt).toLocaleDateString()}`, 20, 146);
    }

    // Payment Summary
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Summary:', 20, 165);
    doc.setFont('helvetica', 'normal');
    
    // Total Amount
    doc.text(`Total Amount: ${data.order.currency} ${totalAmount.toLocaleString()}`, 20, 175);
    
    // Amount Paid
    doc.text(`Amount Paid: ${data.order.currency} ${paidAmount.toLocaleString()}`, 20, 182);
    
    // Remaining Amount
    doc.setFont('helvetica', 'bold');
    doc.text(`Remaining Amount: ${data.order.currency} ${remainingAmount.toLocaleString()}`, 20, 192);

    // Payment Instructions
    if (remainingAmount > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 140, 0); // Orange color
      doc.text('Payment Required:', 20, 210);
      doc.setFont('helvetica', 'normal');
      doc.text(`Please pay the remaining amount of ${data.order.currency} ${remainingAmount.toLocaleString()}`, 20, 217);
      doc.text('to complete your order.', 20, 224);
      doc.setTextColor(0, 0, 0); // Reset to black
    }

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing Ducali for your project!', 105, 250, { align: 'center' });
    doc.text('This receipt serves as proof of your completed order.', 105, 255, { align: 'center' });

    return doc;
  }

  static downloadReceipt(data: ReceiptData, filename?: string): void {
    const doc = this.generateReceipt(data);
    const defaultFilename = `receipt-${data.order.id.slice(-8)}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename || defaultFilename);
  }

  static printReceipt(data: ReceiptData): void {
    const doc = this.generateReceipt(data);
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  }
}
