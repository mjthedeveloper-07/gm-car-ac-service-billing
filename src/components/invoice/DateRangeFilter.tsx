
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangeFilterProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, onDateRangeChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[230px] justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {dateRange.from && dateRange.to
            ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
            : "Search by Date Range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <ShadCalendar
          mode="range"
          selected={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onSelect={(range: DateRange | undefined) => {
            // Always pass both `from` and `to` as keys with undefined fallback for both (to satisfy type)
            onDateRangeChange({
              from: range?.from ?? undefined,
              to: range?.to ?? undefined,
            });
          }}
          numberOfMonths={2}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;

