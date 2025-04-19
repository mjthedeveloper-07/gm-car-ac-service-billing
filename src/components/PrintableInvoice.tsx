
import React from 'react';

interface ServiceItem {
  description: string;
  amount: number;
}

interface InvoiceProps {
  customerName: string;
  vehicleModel: string;
  vehicleNumber: string;
  services: ServiceItem[];
  total: number;
  date: string;
  id: string;
}

const PrintableInvoice: React.FC<InvoiceProps> = ({
  customerName,
  vehicleModel,
  vehicleNumber,
  services,
  total,
  date,
  id
}) => {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white" id="printable-invoice">
      <div className="border-b-2 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GM CAR A/C SERVICE & MULTIBRAND</h1>
            <div className="mt-2 text-gray-600">
              <p>123 Service Road, Mechanical District</p>
              <p>Chennai, Tamil Nadu - 600001</p>
              <p>Phone: +91 98765 43210</p>
              <p>Email: gmservice@example.com</p>
              <p>Website: www.gmcarservice.com</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-32 h-32 bg-gray-100 flex items-center justify-center border">
              <span className="text-gray-400">Logo Space</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">Invoice To:</h2>
          <div className="text-gray-600">
            <p className="font-medium">{customerName}</p>
            <p>Vehicle: {vehicleModel}</p>
            <p>Number: {vehicleNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold mb-2">Invoice Details:</h2>
          <div className="text-gray-600">
            <p>Invoice #: {id}</p>
            <p>Date: {date}</p>
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2">
            <th className="text-left py-2">Description</th>
            <th className="text-right py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{service.description}</td>
              <td className="text-right py-2">₹{service.amount}</td>
            </tr>
          ))}
          <tr className="font-semibold">
            <td className="py-2">Total</td>
            <td className="text-right py-2">₹{total}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8 pt-8 border-t">
        <p className="text-gray-600 text-center">Thank you for choosing our service!</p>
      </div>
    </div>
  );
};

export default PrintableInvoice;
