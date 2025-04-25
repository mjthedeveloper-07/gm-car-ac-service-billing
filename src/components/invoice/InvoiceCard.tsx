import React from 'react';
import { format } from 'date-fns';
import { Phone, Calendar, Edit2, Download, Share2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Invoice } from '@/types/invoice';
import { parseInvoiceDate } from '@/utils/dateUtils';
import { toast } from "sonner";

interface InvoiceCardProps {
  invoice: Invoice;
  onEdit: (id: string) => void;
  onDownload: (invoice: Invoice) => void;
  onShare: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onEdit,
  onDownload,
  onShare,
  onDelete,
}) => {
  const handleShare = () => {
    if (!invoice.customerPhone) {
      toast.error("Customer phone number is required for sharing");
      return;
    }
    onShare(invoice);
  };

  return (
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
              {format(parseInvoiceDate(invoice.date), 'PPP')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(invoice.id)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDownload(invoice)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className={!invoice.customerPhone ? 'opacity-50' : ''}
              title={!invoice.customerPhone ? 'Customer phone required' : 'Share invoice'}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(invoice.id)}
              className="text-red-500 hover:text-red-700"
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
