
export interface ServiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerGST?: string;
  vehicleModel: string;
  vehicleNumber: string;
  services: ServiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  taxType: 'intra' | 'inter';
}

export interface CompanySettings {
  name: string;
  address: string;
  gstNumber: string;
  phone: string;
  email: string;
  logo?: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
}

export interface PredefinedService {
  id: string;
  name: string;
  defaultRate: number;
}
