
import { useState, useEffect } from 'react';
import type { Invoice } from '@/types/invoice';
import { isAfter, isBefore, isEqual } from 'date-fns';
import { parseInvoiceDate } from '@/utils/dateUtils';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchVehicle, setSearchVehicle] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

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

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
  };

  const resetFilters = () => {
    setSearchVehicle("");
    setDateRange({ from: undefined, to: undefined });
    setFilteredInvoices(invoices);
  };

  return {
    invoices,
    filteredInvoices,
    searchVehicle,
    setSearchVehicle,
    dateRange,
    setDateRange,
    deleteInvoice,
    resetFilters
  };
};
