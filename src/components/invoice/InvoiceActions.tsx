
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from 'lucide-react';
import type { DateRange } from '@/hooks/useInvoices';
import DateRangeFilter from './DateRangeFilter';
import VehicleSearch from './VehicleSearch';

interface InvoiceActionsProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  onSaveAll: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  dateRange,
  onDateRangeChange,
  searchValue,
  onSearchChange,
  onReset,
  onSaveAll
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 mb-4 items-start md:items-end">
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
        <VehicleSearch value={searchValue} onChange={onSearchChange} />
        <Button
          variant="secondary"
          className="flex items-center gap-1"
          type="button"
        >
          <SearchIcon className="h-4 w-4" /> Search
        </Button>
        <Button
          variant="ghost"
          onClick={onReset}
          className="flex items-center gap-1"
          type="button"
        >
          Reset
        </Button>
      </div>

      <div className="flex justify-end mb-4 gap-2">
        <Button onClick={onSaveAll}>
          Save All Invoices to PDFs
        </Button>
      </div>
    </>
  );
};

export default InvoiceActions;
