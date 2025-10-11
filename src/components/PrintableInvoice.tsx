import React, { useEffect, useState } from 'react';

interface ServiceItem {
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

interface InvoiceProps {
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
  date: string;
  id: string;
  taxType: 'intra' | 'inter';
  bankDetails?: {
    bankName: string;
    branch: string;
    accountNo: string;
    ifscCode: string;
    upiId: string;
  };
}

interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
}

const PrintableInvoice: React.FC<InvoiceProps> = ({
  customerName,
  customerPhone,
  customerAddress,
  customerState,
  customerGST,
  shipToName,
  shipToAddress,
  shipToState,
  shipToGST,
  vehicleModel,
  vehicleNumber,
  paymentMode,
  reverseCharge,
  buyersOrderNo,
  suppliersRef,
  deliveryDate,
  termsOfDelivery,
  services,
  subtotal,
  cgst,
  sgst,
  igst,
  total,
  totalInWords,
  date,
  id,
  taxType,
  bankDetails
}) => {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: 'GM CAR AC & SERVICE',
    address: 'No:16 Gangai Amman Kallikuppam, Ambattur Chennai-53',
    city: 'Chennai',
    pincode: '600053',
    phone: '+91 84280 00085',
    email: 'gmautocool@gmail.com',
    website: 'www.gmcaracservice.com',
    gstin: '33AABCG1234H1Z5'
  });

  useEffect(() => {
    const savedDetails = localStorage.getItem('companyDetails');
    if (savedDetails) {
      const details = JSON.parse(savedDetails);
      setCompanyDetails(prev => ({ ...prev, ...details }));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convertHundreds = (n: number): string => {
      let result = '';
      
      if (n >= 100) {
        result += units[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result;
      }
      
      if (n > 0) {
        result += units[n] + ' ';
      }
      
      return result;
    };
    
    const crores = Math.floor(num / 10000000);
    const lakhs = Math.floor((num % 10000000) / 100000);
    const thousands = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;
    
    let result = '';
    
    if (crores > 0) {
      result += convertHundreds(crores) + 'Crore ';
    }
    
    if (lakhs > 0) {
      result += convertHundreds(lakhs) + 'Lakh ';
    }
    
    if (thousands > 0) {
      result += convertHundreds(thousands) + 'Thousand ';
    }
    
    if (remainder > 0) {
      result += convertHundreds(remainder);
    }
    
    return result.trim() + ' Only';
  };

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white">
        {/* Print Button */}
        <div className="print-button mb-4 text-center">
          <button 
            onClick={handlePrint}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            🖨️ Print Invoice
          </button>
        </div>

        {/* Invoice Content - Simplified version matching blueprint */}
        <div className="p-8 bg-white text-black" id="printable-invoice" style={{ fontSize: '13px', lineHeight: '1.4' }}>
          
          {/* Header */}
          <div className="border-2 border-black mb-2">
            <div className="text-center py-2 font-bold text-lg border-b-2 border-black">
              Tax Invoice
            </div>
            <div className="p-4">
              <div className="font-bold text-xl mb-2">{companyDetails.name}</div>
              <div className="text-sm">{companyDetails.address}</div>
              <div className="grid grid-cols-2 mt-3 text-sm">
                <div>Phone: <span className="font-semibold">{companyDetails.phone}</span></div>
                <div className="text-right">GSTIN: <span className="font-semibold">{companyDetails.gstin}</span></div>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <div>Website: <span className="font-semibold">{companyDetails.website}</span></div>
                <div className="text-right">State: <span className="font-semibold">33-Tamil Nadu</span></div>
              </div>
            </div>
          </div>

          {/* Bill To & Invoice Details */}
          <div className="border-2 border-black grid grid-cols-2">
            <div className="border-r-2 border-black p-3">
              <div className="font-bold mb-1">Bill To:</div>
              <div className="font-bold text-base">{customerName}</div>
            </div>
            <div className="p-3">
              <div className="font-bold mb-1">Invoice Details:</div>
              <div>No: <span className="font-semibold">{id}</span></div>
              <div>Date: <span className="font-semibold">{new Date(date).toLocaleDateString('en-GB')}</span></div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-t-0 border-black">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black bg-gray-50">
                  <th className="border-r border-black p-2 text-left w-8">#</th>
                  <th className="border-r border-black p-2 text-left">Item name</th>
                  <th className="border-r border-black p-2 text-center w-24">HSN/ SAC</th>
                  <th className="border-r border-black p-2 text-center w-20">Quantity</th>
                  <th className="border-r border-black p-2 text-right w-28">Price/ Unit(₹)</th>
                  <th className="border-r border-black p-2 text-right w-28">GST(₹)</th>
                  <th className="p-2 text-right w-28">Amount(₹)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="border-b border-black">
                    <td className="border-r border-black p-2">{index + 1}</td>
                    <td className="border-r border-black p-2 font-semibold">{service.description}</td>
                    <td className="border-r border-black p-2 text-center">{service.hsn}</td>
                    <td className="border-r border-black p-2 text-center">{service.quantity}</td>
                    <td className="border-r border-black p-2 text-right">₹ {service.rate.toFixed(2)}</td>
                    <td className="border-r border-black p-2 text-right">₹ {service.gstAmount.toFixed(2)} ({service.gstPercent}%)</td>
                    <td className="p-2 text-right">₹ {service.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="border-b-2 border-black font-bold">
                  <td colSpan={3} className="border-r border-black p-2">Total</td>
                  <td className="border-r border-black p-2 text-center">{services.reduce((sum, s) => sum + s.quantity, 0)}</td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2 text-right">₹ {services.reduce((sum, s) => sum + s.gstAmount, 0).toFixed(2)}</td>
                  <td className="p-2 text-right">₹ {total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Summary */}
          <div className="border-2 border-t-0 border-black">
            <div className="p-2 bg-gray-50 font-bold border-b border-black">Tax Summary:</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-black">
                  <th rowSpan={2} className="border-r border-black p-2 text-center">HSN/ SAC</th>
                  <th rowSpan={2} className="border-r border-black p-2 text-center">Taxable<br/>amount (₹)</th>
                  <th colSpan={2} className="border-r border-black p-1 text-center">IGST</th>
                  <th colSpan={2} className="border-r border-black p-1 text-center">CGST</th>
                  <th colSpan={2} className="border-r border-black p-1 text-center">SGST</th>
                  <th rowSpan={2} className="border-r border-black p-2 text-center">Total Tax (₹)</th>
                  <th colSpan={3} className="p-1 text-center"></th>
                </tr>
                <tr className="border-b border-black">
                  <th className="border-r border-black p-1 text-center">Rate<br/>(%)</th>
                  <th className="border-r border-black p-1 text-center">Amt<br/>(₹)</th>
                  <th className="border-r border-black p-1 text-center">Rate<br/>(%)</th>
                  <th className="border-r border-black p-1 text-center">Amt<br/>(₹)</th>
                  <th className="border-r border-black p-1 text-center">Rate<br/>(%)</th>
                  <th className="border-r border-black p-1 text-center">Amt<br/>(₹)</th>
                  <th className="border-r border-black p-1 text-center">Sub Total</th>
                  <th className="border-r border-black p-1 text-center">:</th>
                  <th className="p-1 text-right">₹ {total.toFixed(2)}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(services.map(s => s.hsn))).map((hsn, idx) => {
                  const hsnServices = services.filter(s => s.hsn === hsn);
                  const taxableAmt = hsnServices.reduce((sum, s) => sum + s.taxableValue, 0);
                  const gstRate = hsnServices[0]?.gstPercent || 0;
                  const taxAmt = hsnServices.reduce((sum, s) => sum + s.gstAmount, 0);
                  
                  return (
                    <tr key={idx} className="border-b border-black">
                      <td className="border-r border-black p-2 text-center">{hsn}</td>
                      <td className="border-r border-black p-2 text-right">{taxableAmt.toFixed(2)}</td>
                      {taxType === 'inter' ? (
                        <>
                          <td className="border-r border-black p-2 text-center">{gstRate}</td>
                          <td className="border-r border-black p-2 text-right">{taxAmt.toFixed(2)}</td>
                          <td className="border-r border-black p-2 text-center"></td>
                          <td className="border-r border-black p-2"></td>
                          <td className="border-r border-black p-2 text-center"></td>
                          <td className="border-r border-black p-2"></td>
                        </>
                      ) : (
                        <>
                          <td className="border-r border-black p-2 text-center"></td>
                          <td className="border-r border-black p-2"></td>
                          <td className="border-r border-black p-2 text-center">{gstRate/2}</td>
                          <td className="border-r border-black p-2 text-right">{(taxAmt/2).toFixed(2)}</td>
                          <td className="border-r border-black p-2 text-center">{gstRate/2}</td>
                          <td className="border-r border-black p-2 text-right">{(taxAmt/2).toFixed(2)}</td>
                        </>
                      )}
                      <td className="border-r border-black p-2 text-right">{taxAmt.toFixed(2)}</td>
                      <td className="border-r border-black p-1 font-semibold">Total</td>
                      <td className="border-r border-black p-1 text-center">:</td>
                      <td className="p-1 text-right font-semibold">₹ {total.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="border-b border-black font-bold">
                  <td className="border-r border-black p-2 text-center">TOTAL</td>
                  <td className="border-r border-black p-2 text-right">{subtotal.toFixed(2)}</td>
                  {taxType === 'inter' ? (
                    <>
                      <td className="border-r border-black p-2 text-center"></td>
                      <td className="border-r border-black p-2 text-right">{igst.toFixed(2)}</td>
                      <td className="border-r border-black p-2"></td>
                      <td className="border-r border-black p-2"></td>
                      <td className="border-r border-black p-2"></td>
                      <td className="border-r border-black p-2"></td>
                    </>
                  ) : (
                    <>
                      <td className="border-r border-black p-2"></td>
                      <td className="border-r border-black p-2"></td>
                      <td className="border-r border-black p-2"></td>
                      <td className="border-r border-black p-2 text-right">{cgst.toFixed(2)}</td>
                      <td className="border-r border-black p-2"></td>
                      <td className="border-r border-black p-2 text-right">{sgst.toFixed(2)}</td>
                    </>
                  )}
                  <td className="border-r border-black p-2 text-right">{(cgst + sgst + igst).toFixed(2)}</td>
                  <td rowSpan={3} colSpan={3} className="p-2">
                    <div className="font-bold mb-1">Invoice Amount in Words:</div>
                    <div className="text-xs italic">{numberToWords(Math.round(total))} only</div>
                    <div className="mt-3">
                      <div className="text-xs">Received<span className="ml-20">:</span><span className="ml-4">₹ {total.toFixed(2)}</span></div>
                      <div className="text-xs">Balance<span className="ml-20">:</span><span className="ml-4">₹ 0.00</span></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms & Conditions */}
          <div className="border-2 border-t-0 border-black">
            <div className="grid grid-cols-2">
              <div className="border-r-2 border-black p-3">
                <div className="font-bold mb-2 text-sm">Terms & Conditions:</div>
                <div className="text-xs">Thanks for doing business with us!</div>
              </div>
              <div className="p-3 text-right">
                <div className="mb-1 text-sm">For {companyDetails.name}:</div>
                <div className="h-16"></div>
                <div className="border-t-2 border-black pt-1 mt-2 text-sm">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintableInvoice;