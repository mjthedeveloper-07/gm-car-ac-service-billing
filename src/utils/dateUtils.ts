
import { parseISO } from 'date-fns';

export const parseInvoiceDate = (date: string) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? parseISO(date) : d;
};
