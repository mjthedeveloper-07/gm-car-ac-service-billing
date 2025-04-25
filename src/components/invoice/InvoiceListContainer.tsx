
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Invoice } from '@/types/invoice';
import InvoiceCard from './InvoiceCard';

interface InvoiceListContainerProps {
  invoices: Invoice[];
  onEdit: (id: string) => void;
  onDownload: (invoice: Invoice) => void;
  onShare: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

const InvoiceListContainer: React.FC<InvoiceListContainerProps> = ({
  invoices,
  onEdit,
  onDownload,
  onShare,
  onDelete
}) => {
  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onEdit={onEdit}
            onDownload={onDownload}
            onShare={onShare}
            onDelete={onDelete}
          />
        ))}
        {invoices.length === 0 && (
          <p className="text-center text-gray-500 py-4">No invoices found</p>
        )}
      </div>
    </ScrollArea>
  );
};

export default InvoiceListContainer;
