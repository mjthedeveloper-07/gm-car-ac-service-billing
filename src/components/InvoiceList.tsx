import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Wallet, Download, Phone } from 'lucide-react';
import PrintableInvoice from './PrintableInvoice';
import ReactDOMServer from 'react-dom/server';

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

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(storedInvoices);
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

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          Recent Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{invoice.customerName}</h3>
                    {invoice.customerPhone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="h-4 w-4 text-gray-500" />
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
                      <p className="text-sm text-gray-500">{invoice.date}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => downloadInvoice(invoice)}
                      className="ml-2"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
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
    </Card>
  );
};

export default InvoiceList;
