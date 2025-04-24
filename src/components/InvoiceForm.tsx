import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Receipt, Phone } from 'lucide-react';
import { toast } from "sonner";
import jsPDF from 'jspdf';
import { shareInvoice } from '../utils/shareInvoice';
import ReactDOMServer from 'react-dom/server';
import PrintableInvoice from './PrintableInvoice';
import type { Invoice, ServiceItem } from '@/types/invoice';

const InvoiceForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([{ description: '', amount: 0 }]);
  const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem('zapierWebhookUrl') || '');
  const [isSharing, setIsSharing] = useState(false);

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

    // Generate PDF for the invoice
    const invoiceHTML = ReactDOMServer.renderToString(<PrintableInvoice {...invoice} />);
    const doc = new jsPDF();
    
    const pdfBlob = await new Promise<Blob>((resolve) => {
      doc.html(invoiceHTML, {
        callback: function(doc) {
          const pdfBlob = doc.output('blob');
          resolve(pdfBlob);
        },
        x: 10,
        y: 10
      });
    });
    
    // Convert the PDF blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      if (customerPhone) {
        await shareInvoice({
          customerPhone,
          customerName,
          invoiceId: invoice.id,
          pdfContent: base64data,
          webhookUrl
        });
      }
    };

    // Reset form
    setCustomerName('');
    setCustomerPhone('');
    setVehicleModel('');
    setVehicleNumber('');
    setServices([{ description: '', amount: 0 }]);
    
    toast.success("Invoice created successfully");
  };

  return <div className="card-gradient-sass w-full max-w-3xl mx-auto my-5">
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
            
            {services.map((service, index) => <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`service-${index}`}>Service Description</Label>
                  <Input id={`service-${index}`} value={service.description} onChange={e => updateService(index, 'description', e.target.value)} required className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`amount-${index}`}>Amount</Label>
                  <Input id={`amount-${index}`} type="number" value={service.amount} onChange={e => updateService(index, 'amount', e.target.value)} required className="bg-white" />
                </div>
              </div>)}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Total: ₹{calculateTotal()}
            </div>
            <button type="submit" className="button-sass mx-[5px] my-[6px] py-[2px] px-[3px] text-justify text-slate-50 font-thin bg-black text-sm rounded-none">Generate Invoice</button>
          </div>
        </form>
      </CardContent>
    </div>;
};

export default InvoiceForm;
