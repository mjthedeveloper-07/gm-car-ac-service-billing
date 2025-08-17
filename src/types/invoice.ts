
export interface ServiceItem {
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  taxableValue: number;
  gstPercent: number;
  gstAmount: number;
  total: number;
  details?: string;
}

export interface Invoice {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerState?: string;
  customerGST?: string;
  shipToName?: string;
  shipToAddress?: string;
  shipToState?: string;
  shipToGST?: string;
  vehicleModel: string;
  vehicleNumber: string;
  paymentMode?: string;
  reverseCharge?: 'Yes' | 'No';
  buyersOrderNo?: string;
  suppliersRef?: string;
  deliveryDate?: string;
  termsOfDelivery?: string;
  services: ServiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  totalInWords?: string;
  taxType: 'intra' | 'inter';
  bankDetails?: {
    bankName: string;
    branch: string;
    accountNo: string;
    ifscCode: string;
    upiId: string;
  };
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
