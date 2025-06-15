import React from 'react';
import { format } from 'date-fns';
import { Phone, Calendar, Edit2, Download, Trash2, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Invoice } from '@/types/invoice';
import { parseInvoiceDate } from '@/utils/dateUtils';

// Remove 'onShare' from InvoiceCardProps interface
interface InvoiceCardProps {
  invoice: Invoice;
  onEdit: (id: string) => void;
  onDownload: (invoice: Invoice) => void;
  onPrint: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onEdit,
  onDownload,
  onPrint,
  onDelete,
}) => {
  return (
    <Card key={invoice.id} className="p-4 hover:bg-gradient-to-r from-violet-50 to-blue-50 transition-all duration-200 hover:scale-[1.015] shadow group relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold group-hover:text-primary transition-colors duration-200">{invoice.customerName}</h3>
          {invoice.customerPhone && (
            <p className="text-sm text-gray-500 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
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
            <p className="font-semibold group-hover:text-primary/90 transition-colors">₹{invoice.total}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(parseInvoiceDate(invoice.date), 'PPP')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(invoice.id)}
              className="hover:bg-blue-100 hover:border-blue-300 transition-all"
              aria-label="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDownload(invoice)}
              className="border-emerald-400 text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-200 shadow-sm"
              aria-label="Download Invoice"
            >
              <Download className="h-4 w-4" />
            </Button>
            {/* Removed Share button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPrint(invoice)}
              className="hover:bg-slate-100 transition-colors"
              aria-label="Print Invoice"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(invoice.id)}
              className="text-red-500 hover:text-white hover:bg-red-500 hover:border-red-400 transition-all duration-200"
              aria-label="Delete Invoice"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvoiceCard;
