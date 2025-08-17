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

        {/* Invoice Content */}
        <div className="p-6 bg-white text-black" id="printable-invoice" style={{ fontSize: '12px', lineHeight: '1.3' }}>
          {/* Header Section */}
          <div className="border border-gray-400 mb-4">
            <div className="grid grid-cols-3 border-b border-gray-400">
              <div className="p-3 border-r border-gray-400">
                <div className="text-xs font-semibold mb-1">GSTIN: {companyDetails.gstin}</div>
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-primary/10 border border-gray-300 rounded flex items-center justify-center text-xs">
                    <img 
                      src="/lovable-uploads/a502963b-46f0-4da9-a374-6d5b6261e7d4.png"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-blue-800">{companyDetails.name}</div>
                    <div className="text-xs text-gray-600 mt-1">Car Service - {companyDetails.city}</div>
                    <div className="text-xs">{companyDetails.address}</div>
                    <div className="text-xs">Contact No.: {companyDetails.phone}</div>
                  </div>
                </div>
              </div>
              <div className="p-3 text-center">
                <div className="font-bold text-lg">Tax Invoice</div>
              </div>
              <div className="p-3 text-right text-xs">
                <div>Original/Duplicate Bill</div>
              </div>
            </div>
          </div>

          {/* Bill To & Ship To Section */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-gray-400">
              <div className="bg-blue-50 p-2 border-b border-gray-400 font-semibold text-xs">Bill To</div>
              <div className="p-3 text-xs">
                <div><strong>Name:</strong> {customerName}</div>
                 <div><strong>Address:</strong> {customerAddress || 'N/A'}</div>
                <div><strong>State:</strong> {customerState || 'N/A'}</div>
                {customerGST && <div><strong>GSTIN:</strong> {customerGST}</div>}
              </div>
            </div>
            <div className="border border-gray-400">
              <div className="bg-blue-50 p-2 border-b border-gray-400 font-semibold text-xs">Ship To</div>
              <div className="p-3 text-xs">
                <div><strong>Name:</strong> {shipToName || customerName}</div>
                <div><strong>Address:</strong> {shipToAddress || customerAddress || 'N/A'}</div>
                <div><strong>State:</strong> {shipToState || customerState || 'N/A'}</div>
                {(shipToGST || customerGST) && <div><strong>GSTIN:</strong> {shipToGST || customerGST}</div>}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-xs space-y-1">
              <div><strong># Inv. No.:</strong> {id}</div>
              <div><strong>Inv. Date:</strong> {new Date(date).toLocaleDateString('en-IN')}</div>
              <div><strong>Payment Mode:</strong> {paymentMode || 'Cash'}</div>
              <div><strong>Reverse Charge:</strong> {reverseCharge || 'No'}</div>
            </div>
            <div className="text-xs space-y-1">
              {buyersOrderNo && <div><strong>Buyer's Order No.:</strong> {buyersOrderNo}</div>}
              {suppliersRef && <div><strong>Supplier's Ref.:</strong> {suppliersRef}</div>}
              <div><strong>Vehicle Number:</strong> {vehicleNumber}</div>
              {deliveryDate && <div><strong>Delivery Date:</strong> {deliveryDate}</div>}
              {termsOfDelivery && <div><strong>Terms Of Delivery:</strong> {termsOfDelivery}</div>}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-400 mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border-r border-gray-400 p-2 text-left">Sr</th>
                  <th className="border-r border-gray-400 p-2 text-left">Goods & Service Description</th>
                  <th className="border-r border-gray-400 p-2 text-center">HSN</th>
                  <th className="border-r border-gray-400 p-2 text-center">Quantity</th>
                  <th className="border-r border-gray-400 p-2 text-right">Rate</th>
                  <th className="border-r border-gray-400 p-2 text-right">Taxable Value</th>
                  <th className="border-r border-gray-400 p-2 text-center">GST %</th>
                  <th className="border-r border-gray-400 p-2 text-right">GST Amt.</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="border-t border-gray-400">
                    <td className="border-r border-gray-400 p-2">{index + 1}</td>
                    <td className="border-r border-gray-400 p-2">
                      <div>{service.description}</div>
                      {service.details && <div className="text-gray-600 italic">{service.details}</div>}
                    </td>
                    <td className="border-r border-gray-400 p-2 text-center">{service.hsn}</td>
                    <td className="border-r border-gray-400 p-2 text-center">{service.quantity}</td>
                    <td className="border-r border-gray-400 p-2 text-right">{service.rate.toFixed(2)}</td>
                    <td className="border-r border-gray-400 p-2 text-right">{service.taxableValue.toFixed(2)}</td>
                    <td className="border-r border-gray-400 p-2 text-center">{service.gstPercent}%</td>
                    <td className="border-r border-gray-400 p-2 text-right">{service.gstAmount.toFixed(2)}</td>
                    <td className="p-2 text-right">{service.total.toFixed(2)}</td>
                  </tr>
                ))}
                {/* Empty rows for padding */}
                {Array.from({ length: Math.max(0, 8 - services.length) }).map((_, index) => (
                  <tr key={`empty-${index}`} className="border-t border-gray-400">
                    <td className="border-r border-gray-400 p-3">&nbsp;</td>
                    <td className="border-r border-gray-400 p-3">&nbsp;</td>
                    <td className="border-r border-gray-400 p-3">&nbsp;</td>
                    <td className="border-r border-gray-400 p-3">&nbsp;</td>
                    <td className="border-r border-gray-400 p-3">&nbsp;</td>
                    <td className="border-r border-gray-400 p-3">&nbsp;</td>
                    <td className="border-r border-gray-400 p-3">&nbsp;</td>
                    <td className="border-r border-gray-400 p-3">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column - Bank Details & Terms */}
            <div className="space-y-4">
              {/* Bank Details */}
              <div className="border border-gray-400">
                <div className="bg-blue-50 p-2 border-b border-gray-400 font-semibold text-xs">Our Bank Details</div>
                <div className="p-3 text-xs space-y-1">
                  <div><strong>Bank Name:</strong> {bankDetails?.bankName || 'STATE BANK OF INDIA'}</div>
                  <div><strong>Branch:</strong> {bankDetails?.branch || 'Chennai'}</div>
                  <div><strong>Account No:</strong> {bankDetails?.accountNo || '20412XXXX05'}</div>
                  <div><strong>IFSC Code:</strong> {bankDetails?.ifscCode || 'SBIN003XXXX'}</div>
                  <div><strong>UPI ID:</strong> {bankDetails?.upiId || 'yourid@upi'}</div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="text-xs">
                <div className="font-semibold mb-2">Declaration</div>
                <div className="space-y-1">
                  <div>1. Subject to Mehsana jurisdiction</div>
                  <div>2. Terms & conditions are subject to our trade policy</div>
                  <div>3. Our risk & responsibility ceases after the delivery of goods.</div>
                  <div className="mt-2 font-semibold">E. & O.E.</div>
                </div>
              </div>
            </div>

            {/* Right Column - Totals & Summary */}
            <div className="space-y-4">
              {/* Totals */}
              <div className="border border-gray-400">
                <div className="bg-blue-50 p-2 border-b border-gray-400 font-semibold text-xs text-center">SUMMARY</div>
                <div className="text-xs">
                  <div className="flex justify-between p-2 border-b border-gray-400">
                    <span>Sub-Total:</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                  {taxType === 'intra' ? (
                    <>
                      <div className="flex justify-between p-2 border-b border-gray-400">
                        <span>CGST Amt.:</span>
                        <span>{cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-2 border-b border-gray-400">
                        <span>SGST Amt.:</span>
                        <span>{sgst.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between p-2 border-b border-gray-400">
                      <span>IGST Amt.:</span>
                      <span>{igst.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 border-b border-gray-400">
                    <span>Round off:</span>
                    <span>0.00</span>
                  </div>
                  <div className="flex justify-between p-2 font-bold">
                    <span>Total Amount:</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Total in Words */}
              <div className="text-xs">
                <div className="font-semibold mb-1">Invoice Total in Word</div>
                <div className="italic">Rupees {numberToWords(Math.round(total))}</div>
              </div>

              {/* QR Code & Signature */}
              <div className="flex justify-between items-end">
                <div className="w-20 h-20 border border-gray-400 flex items-center justify-center text-xs">
                  QR Code
                </div>
                <div className="text-right text-xs">
                  <div className="mb-8">For, {companyDetails.name}</div>
                  <div className="border-t border-gray-400 pt-1">Authorised Signatory</div>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="text-center mt-4 text-xs font-semibold">
            Thank You For Business With US!
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintableInvoice;