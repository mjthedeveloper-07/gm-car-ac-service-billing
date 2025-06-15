import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Wallet, Search as SearchIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ReactDOMServer from 'react-dom/server';
import jsPDF from 'jspdf';
import { shareInvoice } from '../utils/shareInvoice';
import { toast } from "sonner";
import { isAfter, isBefore, isEqual } from 'date-fns';
import type { Invoice } from '@/types/invoice';
import { parseInvoiceDate } from '@/utils/dateUtils';
import DateRangeFilter from './invoice/DateRangeFilter';
import VehicleSearch from './invoice/VehicleSearch';
import InvoiceCard from './invoice/InvoiceCard';
import PrintableInvoice from './PrintableInvoice';
import { format } from "date-fns";

const printableInvoiceCache: Record<string, string> = {}; // in-memory cache: id -> HTML

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [webhookUrl] = useState(localStorage.getItem('zapierWebhookUrl') || '');
  const [searchVehicle, setSearchVehicle] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(storedInvoices);
    setFilteredInvoices(storedInvoices);
  }, []);

  useEffect(() => {
    let result = invoices;

    if (searchVehicle.trim() !== "") {
      result = result.filter(invoice =>
        invoice.vehicleNumber.toLowerCase().includes(searchVehicle.trim().toLowerCase())
      );
    }

    if (dateRange.from && dateRange.to) {
      result = result.filter(invoice => {
        const dateObj = parseInvoiceDate(invoice.date);
        return (
          (isAfter(dateObj, dateRange.from) || isEqual(dateObj, dateRange.from)) &&
          (isBefore(dateObj, dateRange.to) || isEqual(dateObj, dateRange.to))
        );
      });
    }

    setFilteredInvoices(result);
  }, [invoices, searchVehicle, dateRange]);

  const resetFilters = () => {
    setSearchVehicle("");
    setDateRange({ from: undefined, to: undefined });
    setFilteredInvoices(invoices);
  };

  // PRINTABLE INVOICE: try to cache HTML string for the invoice id
  const printInvoice = (invoice: Invoice) => {
    let invoiceHTML = printableInvoiceCache[invoice.id];
    if (!invoiceHTML) {
      invoiceHTML = ReactDOMServer.renderToString(<PrintableInvoice {...invoice} />);
      printableInvoiceCache[invoice.id] = invoiceHTML;
    }
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${invoice.id}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            ${invoiceHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
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
        pdfContent: base64data,
        webhookUrl
      });
    };
  };

  const saveAllInvoicesAsPDF = () => {
    filteredInvoices.forEach((invoice) => {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text(`Invoice #${invoice.id}`, 14, 20);

      doc.setFontSize(12);
      doc.text(`Date: ${format(parseInvoiceDate(invoice.date), 'PPP')}`, 14, 30);
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

  // Add handler to download a single invoice as PDF
  const downloadInvoice = (invoice: Invoice) => {
    // Generate simple PDF from invoice object.
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Invoice #${invoice.id}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${format(parseInvoiceDate(invoice.date), 'PPP')}`, 14, 30);
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
        <div className="flex flex-col md:flex-row gap-2 mb-4 items-start md:items-end">
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <VehicleSearch value={searchVehicle} onChange={setSearchVehicle} />
          <Button
            variant="secondary"
            onClick={() => {
              // No need to do anything; the effect will auto-filter on state change
            }}
            className="flex items-center gap-1"
            type="button"
          >
            <SearchIcon className="h-4 w-4" /> Search
          </Button>
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="flex items-center gap-1"
            type="button"
          >
            Reset
          </Button>
        </div>

        <div className="flex justify-end mb-4 gap-2">
          <Button onClick={saveAllInvoicesAsPDF}>
            Save All Invoices to PDFs
          </Button>
        </div>

        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onEdit={handleEdit}
                onDownload={downloadInvoice}
                onShare={handleShare}
                onPrint={printInvoice}
                onDelete={(id) => setInvoiceToDelete(id)}
              />
            ))}
            {filteredInvoices.length === 0 && (
              <p className="text-center text-gray-500 py-4">No invoices found</p>
            )}
          </div>
        </ScrollArea>
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
