
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Wallet, Download, Phone, Calendar, Edit2, Trash2 } from 'lucide-react';
import PrintableInvoice from './PrintableInvoice';
import ReactDOMServer from 'react-dom/server';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ServiceItem {
  description: string;
  amount: number;
}

interface Invoice {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  vehicleNumber: string;
  services: ServiceItem[];
  total: number;
}

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(storedInvoices.map((invoice: Invoice) => ({
      ...invoice,
      date: format(new Date(invoice.date), 'PPP')
    })));
  }, []);

  const downloadInvoice = (invoice: Invoice) => {
    const invoiceHTML = ReactDOMServer.renderToString(<PrintableInvoice {...invoice} />);
    
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

  const handleDelete = (id: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
    toast.success("Invoice deleted successfully");
    setInvoiceToDelete(null);
  };

  const handleEdit = (id: string) => {
    // Navigate to invoice form with the selected invoice
    window.location.hash = 'invoice';
    const selectedInvoice = invoices.find(invoice => invoice.id === id);
    if (selectedInvoice) {
      localStorage.setItem('editInvoice', JSON.stringify(selectedInvoice));
    }
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
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{invoice.customerName}</h3>
                    {invoice.customerPhone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {invoice.customerPhone}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {invoice.vehicleModel} - {invoice.vehicleNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">₹{invoice.total}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {invoice.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(invoice.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadInvoice(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setInvoiceToDelete(invoice.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {invoices.length === 0 && (
              <p className="text-center text-gray-500 py-4">No invoices yet</p>
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
