
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wallet } from 'lucide-react';

interface ServiceItem {
  description: string;
  amount: number;
}

interface Invoice {
  id: string;
  date: string;
  customerName: string;
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
                    <p className="text-sm text-gray-500">
                      {invoice.vehicleModel} - {invoice.vehicleNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{invoice.total}</p>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
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
