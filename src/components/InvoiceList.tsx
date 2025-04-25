
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ReactDOMServer from 'react-dom/server';
import jsPDF from 'jspdf';
import { shareInvoice } from '../utils/shareInvoice';
import { toast } from "sonner";
import { format } from 'date-fns';
import type { Invoice } from '@/types/invoice';
import { useInvoices } from '@/hooks/useInvoices';
import InvoiceActions from './invoice/InvoiceActions';
import InvoiceListContainer from './invoice/InvoiceListContainer';
import PrintableInvoice from './PrintableInvoice';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  
  const {
    filteredInvoices,
    searchVehicle,
    setSearchVehicle,
    dateRange,
    setDateRange,
    deleteInvoice,
    resetFilters
  } = useInvoices();

  const downloadInvoice = (invoice: Invoice) => {
    const invoiceHTML = ReactDOMServer.renderToString(<PrintableInvoice {...invoice} />);
    const doc = new jsPDF();
    
    doc.html(invoiceHTML, {
      callback: function(doc) {
        const pdfBlob = doc.output('blob');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `GM_Auto_Invoice_${invoice.customerName.replace(/\s+/g, '_')}_${invoice.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      },
      x: 10,
      y: 10
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    toast.success("Invoice deleted successfully");
    setInvoiceToDelete(null);
  };

  const handleShare = async (invoice: Invoice) => {
    const invoiceHTML = ReactDOMServer.renderToString(<PrintableInvoice {...invoice} />);
    const doc = new jsPDF();
    
    const pdfBlob = await new Promise<Blob>((resolve) => {
      doc.html(invoiceHTML, {
        callback: function(doc) {
          const pdfBlob = doc.output('blob');
          resolve(pdfBlob);
        },
        x: 10,
        y: 10
      });
    });

    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      shareInvoice({
        customerPhone: invoice.customerPhone,
        customerName: invoice.customerName,
        invoiceId: invoice.id,
        pdfContent: base64data
      });
    };
  };

  const saveAllInvoicesAsPDF = () => {
    filteredInvoices.forEach((invoice) => {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text(`Invoice #${invoice.id}`, 14, 20);

      doc.setFontSize(12);
      doc.text(`Date: ${format(new Date(invoice.date), 'PPP')}`, 14, 30);
      doc.text(`Customer Name: ${invoice.customerName}`, 14, 40);
      doc.text(`Phone: ${invoice.customerPhone}`, 14, 50);
      doc.text(`Vehicle Model: ${invoice.vehicleModel}`, 14, 60);
      doc.text(`Vehicle Number: ${invoice.vehicleNumber}`, 14, 70);

      let currentY = 85;
      doc.text("Services:", 14, currentY);
      currentY += 8;

      invoice.services.forEach((service, index) => {
        doc.text(`${index + 1}. ${service.description} - ₹${service.amount}`, 20, currentY);
        currentY += 8;
      });

      currentY += 5;
      doc.text(`Total: ₹${invoice.total}`, 14, currentY);

      const safeName = invoice.customerName.replace(/\s+/g, '_');
      doc.save(`Invoice_${safeName}_${invoice.id}.pdf`);
    });

    toast.success("All invoices saved as PDFs");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          Recent Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InvoiceActions
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          searchValue={searchVehicle}
          onSearchChange={setSearchVehicle}
          onReset={resetFilters}
          onSaveAll={saveAllInvoicesAsPDF}
        />

        <InvoiceListContainer
          invoices={filteredInvoices}
          onEdit={handleEdit}
          onDownload={downloadInvoice}
          onShare={handleShare}
          onDelete={(id) => setInvoiceToDelete(id)}
        />
      </CardContent>

      <AlertDialog open={!!invoiceToDelete} onOpenChange={() => setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => invoiceToDelete && handleDelete(invoiceToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default InvoiceList;
