import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Receipt, Phone } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';
import { shareInvoice } from '../utils/shareInvoice';

interface ServiceItem {
  description: string;
  amount: number;
}
interface Invoice {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  vehicleNumber: string;
  services: ServiceItem[];
  total: number;
}

const InvoiceForm = () => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([{ description: '', amount: 0 }]);
  
  const addService = () => {
    setServices([...services, {
      description: '',
      amount: 0
    }]);
  };
  
  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const updatedServices = [...services];
    if (field === 'amount') {
      updatedServices[index][field] = parseFloat(value) || 0;
    } else {
      updatedServices[index][field] = value;
    }
    setServices(updatedServices);
  };
  
  const calculateTotal = () => {
    return services.reduce((sum, service) => sum + service.amount, 0);
  };

  const generatePDFBlob = (invoice: Invoice): Promise<Blob> => {
    return new Promise((resolve) => {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text(`Invoice #${invoice.id}`, 14, 20);
      
      doc.setFontSize(12);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Customer Name: ${invoice.customerName}`, 14, 40);
      doc.text(`Phone: ${invoice.customerPhone}`, 14, 50);
      doc.text(`Vehicle Model: ${invoice.vehicleModel}`, 14, 60);
      doc.text(`Vehicle Number: ${invoice.vehicleNumber}`, 14, 70);
      
      let currentY = 85;
      doc.text("Services:", 14, currentY);
      currentY += 8;
      
      invoice.services.forEach((service, index) => {
        doc.text(`${index + 1}. ${service.description} - ₹${service.amount}`, 20, currentY);
        currentY += 8;
      });
      
      currentY += 5;
      doc.text(`Total: ₹${invoice.total}`, 14, currentY);
      
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoice: Invoice = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      customerName,
      customerPhone,
      vehicleModel,
      vehicleNumber,
      services,
      total: calculateTotal()
    };

    // Save to localStorage
    const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    localStorage.setItem('invoices', JSON.stringify([...existingInvoices, invoice]));

    // Generate PDF and download (removed share)
    const pdfBlob = await generatePDFBlob(invoice);

    // Create a download link with customer name
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `GM_Auto_Invoice_${customerName.replace(/\s+/g, '_')}_${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    // Reset form
    setCustomerName('');
    setCustomerPhone('');
    setVehicleModel('');
    setVehicleNumber('');
    setServices([{ description: '', amount: 0 }]);
  };

  return (
    <div className="card-gradient-sass w-full max-w-3xl mx-auto my-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-6 w-6" />
          New Invoice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <div className="flex items-center gap-2 relative">
                <Phone className="h-4 w-4 text-gray-500 absolute left-3" />
                <Input id="customerPhone" type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Enter customer phone number" className="pl-10 bg-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Vehicle Model</Label>
              <Input id="vehicleModel" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} required className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input id="vehicleNumber" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} required className="bg-white" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Services</h3>
              <Button type="button" variant="outline" onClick={addService}>
                Add Service
              </Button>
            </div>
            
            {services.map((service, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`service-${index}`}>Service Description</Label>
                  <Input id={`service-${index}`} value={service.description} onChange={e => updateService(index, 'description', e.target.value)} required className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`amount-${index}`}>Amount</Label>
                  <Input id={`amount-${index}`} type="number" value={service.amount} onChange={e => updateService(index, 'amount', e.target.value)} required className="bg-white" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Total: ₹{calculateTotal()}
            </div>
            <button type="submit" className="button-sass mx-[5px] my-[6px] py-[2px] px-[3px] text-justify text-slate-50 font-thin bg-black text-sm rounded-none">Generate Invoice</button>
          </div>
        </form>
      </CardContent>
    </div>
  );
};

export default InvoiceForm;
