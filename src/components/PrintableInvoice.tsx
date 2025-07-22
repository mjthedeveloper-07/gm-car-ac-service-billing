import React, { useEffect, useState } from 'react';

interface ServiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  details?: string;
}

interface InvoiceProps {
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  vehicleNumber: string;
  services: ServiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  date: string;
  id: string;
  taxType: 'intra' | 'inter';
}

interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
}

const PrintableInvoice: React.FC<InvoiceProps> = ({
  customerName,
  customerPhone,
  vehicleModel,
  vehicleNumber,
  services,
  subtotal,
  cgst,
  sgst,
  igst,
  total,
  date,
  id,
  taxType
}) => {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: 'GM CAR A/C SERVICE & MULTIBRAND',
    address: 'No:16 Gangai Amman Kallikuppam, Ambattur Chennai-53 Tamilnadu',
    city: 'Chennai',
    pincode: '600053',
    phone: '+91 84280 00085',
    email: 'gmautocool@gmail.com',
    website: 'www.gmcaracservice.com'
  });

  useEffect(() => {
    const savedDetails = localStorage.getItem('companyDetails');
    if (savedDetails) {
      setCompanyDetails(JSON.parse(savedDetails));
    }
  }, []);

  const handlePrint = () => {
    window.print();
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
        <div className="p-8 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="border-b-4 border-primary pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">
                  GM CAR AC & SERVICE
                </h1>
                <div className="text-automotive-grey space-y-1">
                  <p className="font-medium">{companyDetails.address}</p>
                  <p>{companyDetails.city}, Tamil Nadu - {companyDetails.pincode}</p>
                  <p>📞 {companyDetails.phone}</p>
                  <p>✉️ {companyDetails.email}</p>
                  <p>🌐 {companyDetails.website}</p>
                  <p><strong>GST No:</strong> 33AABCG1234H1Z5</p>
                </div>
              </div>
              <div className="text-right">
                <img 
                  src="/lovable-uploads/a502963b-46f0-4da9-a374-6d5b6261e7d4.png"
                  alt="GM Car AC Service Logo"
                  className="w-32 h-32 object-contain border-2 border-primary/20 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Customer & Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-primary mb-3 border-b border-primary/30 pb-1">
                BILL TO:
              </h2>
              <div className="space-y-1 text-automotive-grey">
                <p className="font-bold text-foreground">{customerName}</p>
                {customerPhone && <p>📞 {customerPhone}</p>}
                <p><strong>Vehicle:</strong> {vehicleModel}</p>
                <p><strong>Reg. No:</strong> {vehicleNumber}</p>
              </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-primary mb-3 border-b border-primary/30 pb-1">
                INVOICE DETAILS:
              </h2>
              <div className="space-y-1 text-automotive-grey">
                <p><strong>Invoice #:</strong> {id}</p>
                <p><strong>Date:</strong> {new Date(date).toLocaleDateString('en-IN')}</p>
                <p><strong>Tax Type:</strong> {taxType === 'intra' ? 'Intra-State' : 'Inter-State'}</p>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-automotive-grey/30">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="border border-automotive-grey/30 text-left py-3 px-4 font-bold">
                    Service Description
                  </th>
                  <th className="border border-automotive-grey/30 text-center py-3 px-4 font-bold">
                    Qty
                  </th>
                  <th className="border border-automotive-grey/30 text-right py-3 px-4 font-bold">
                    Rate (₹)
                  </th>
                  <th className="border border-automotive-grey/30 text-right py-3 px-4 font-bold">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="border-b border-automotive-grey/20">
                    <td className="border border-automotive-grey/30 py-3 px-4">
                      <div className="font-medium">{service.description}</div>
                      {service.details && (
                        <div className="text-sm text-automotive-grey mt-1 italic">
                          {service.details}
                        </div>
                      )}
                    </td>
                    <td className="border border-automotive-grey/30 py-3 px-4 text-center">
                      {service.quantity}
                    </td>
                    <td className="border border-automotive-grey/30 py-3 px-4 text-right">
                      ₹{service.rate.toFixed(2)}
                    </td>
                    <td className="border border-automotive-grey/30 py-3 px-4 text-right font-medium">
                      ₹{service.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-md">
              <div className="bg-secondary/20 p-4 rounded-lg border border-automotive-grey/30">
                <div className="space-y-2">
                  <div className="flex justify-between py-1">
                    <span className="font-medium">Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {taxType === 'intra' ? (
                    <>
                      <div className="flex justify-between py-1">
                        <span>CGST (9%):</span>
                        <span>₹{cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>SGST (9%):</span>
                        <span>₹{sgst.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between py-1">
                      <span>IGST (18%):</span>
                      <span>₹{igst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t-2 border-primary pt-2 mt-3">
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>GRAND TOTAL:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-primary pt-6">
            <div className="text-center space-y-2">
              <p className="text-primary font-bold text-lg">
                Thank you for choosing GM Car AC & Service!
              </p>
              <p className="text-automotive-grey text-sm">
                "Professional Car AC Service & Multibrand Repairs"
              </p>
              <p className="text-automotive-grey text-xs font-medium">
                * No Warranty and No Guarantee *
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintableInvoice;
