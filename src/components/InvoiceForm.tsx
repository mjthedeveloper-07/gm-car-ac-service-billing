import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Receipt, Phone, Car, Plus, Trash2, Calculator } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import type { Invoice, ServiceItem, CompanySettings, PredefinedService } from '@/types/invoice';

const defaultServices: PredefinedService[] = [
  { id: '1', name: 'AC Gas Filling', defaultRate: 1500 },
  { id: '2', name: 'AC Service Complete', defaultRate: 2500 },
  { id: '3', name: 'AC Compressor Repair', defaultRate: 3500 },
  { id: '4', name: 'Engine Oil Change', defaultRate: 800 },
  { id: '5', name: 'Brake Service', defaultRate: 1200 },
  { id: '6', name: 'Battery Service', defaultRate: 600 },
  { id: '7', name: 'Tire Change', defaultRate: 400 },
  { id: '8', name: 'General Checkup', defaultRate: 500 },
];

const InvoiceForm = () => {
  const { toast } = useToast();
  
  // Customer & Vehicle Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerGST, setCustomerGST] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  
  // Services
  const [services, setServices] = useState<ServiceItem[]>([
    { description: '', hsn: '', quantity: 1, rate: 0, taxableValue: 0, gstPercent: 18, gstAmount: 0, total: 0, details: '' }
  ]);
  
  // Tax Settings
  const [taxType, setTaxType] = useState<'intra' | 'inter'>('intra');
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'GM Car AC Service & Multibrand',
    address: 'Shop Address, City, State - PIN',
    gstNumber: 'GSTIN123456789',
    phone: '+91 9876543210',
    email: 'info@gmcarservice.com',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18
  });

  // Auto-complete suggestions
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);
  const [vehicleSuggestions, setVehicleSuggestions] = useState<any[]>([]);
  
  useEffect(() => {
    // Load company settings
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      setCompanySettings(JSON.parse(savedSettings));
    }
    
    // Load customer suggestions from previous invoices
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const customers = invoices.map((inv: Invoice) => ({
      name: inv.customerName,
      phone: inv.customerPhone,
      gst: inv.customerGST || ''
    }));
    setCustomerSuggestions([...new Map(customers.map(c => [`${c.name}-${c.phone}`, c])).values()]);
    
    // Load vehicle suggestions
    const vehicles = invoices.map((inv: Invoice) => ({
      number: inv.vehicleNumber,
      model: inv.vehicleModel
    }));
    setVehicleSuggestions([...new Map(vehicles.map(v => [v.number, v])).values()]);
  }, []);

  const addService = () => {
    setServices([...services, { description: '', hsn: '', quantity: 1, rate: 0, taxableValue: 0, gstPercent: 18, gstAmount: 0, total: 0, details: '' }]);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string | number) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    
    // Calculate total when quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      const taxableValue = updatedServices[index].quantity * updatedServices[index].rate;
      const gstAmount = (taxableValue * updatedServices[index].gstPercent) / 100;
      updatedServices[index].taxableValue = taxableValue;
      updatedServices[index].gstAmount = gstAmount;
      updatedServices[index].total = taxableValue + gstAmount;
    }
    
    setServices(updatedServices);
  };

  const selectPredefinedService = (index: number, serviceId: string) => {
    const service = defaultServices.find(s => s.id === serviceId);
    if (service) {
      updateService(index, 'description', service.name);
      updateService(index, 'rate', service.defaultRate);
      const taxableValue = services[index].quantity * service.defaultRate;
      const gstAmount = (taxableValue * 18) / 100;
      updateService(index, 'taxableValue', taxableValue);
      updateService(index, 'gstAmount', gstAmount);
      updateService(index, 'total', taxableValue + gstAmount);
    }
  };

  const calculateSubtotal = () => {
    return services.reduce((sum, service) => sum + service.taxableValue, 0);
  };

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal();
    
    if (taxType === 'intra') {
      const cgst = (subtotal * companySettings.cgstRate) / 100;
      const sgst = (subtotal * companySettings.sgstRate) / 100;
      return { cgst, sgst, igst: 0 };
    } else {
      const igst = (subtotal * companySettings.igstRate) / 100;
      return { cgst: 0, sgst: 0, igst };
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxes = calculateTaxes();
    return subtotal + taxes.cgst + taxes.sgst + taxes.igst;
  };

  const fillCustomerDetails = (customer: any) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerGST(customer.gst);
  };

  const fillVehicleDetails = (vehicle: any) => {
    setVehicleNumber(vehicle.number);
    setVehicleModel(vehicle.model);
  };

  const generatePDF = (invoice: Invoice): Blob => {
    const doc = new jsPDF();
    const taxes = calculateTaxes();
    
    // Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(companySettings.name, 14, 20);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(companySettings.address, 14, 28);
    doc.text(`GST No: ${companySettings.gstNumber}`, 14, 34);
    doc.text(`Phone: ${companySettings.phone}`, 14, 40);
    
    // Invoice details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`INVOICE #${invoice.id}`, 150, 20);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 28);
    
    // Customer details
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Bill To:', 14, 55);
    
    doc.setFont(undefined, 'normal');
    doc.text(invoice.customerName, 14, 63);
    doc.text(`Phone: ${invoice.customerPhone}`, 14, 69);
    if (invoice.customerGST) {
      doc.text(`GST: ${invoice.customerGST}`, 14, 75);
    }
    doc.text(`Vehicle: ${invoice.vehicleModel} (${invoice.vehicleNumber})`, 14, 81);
    
    // Services table
    let currentY = 95;
    doc.setFont(undefined, 'bold');
    doc.text('Description', 14, currentY);
    doc.text('Qty', 120, currentY);
    doc.text('Rate', 140, currentY);
    doc.text('Amount', 170, currentY);
    
    currentY += 8;
    doc.setFont(undefined, 'normal');
    
    invoice.services.forEach((service) => {
      doc.text(service.description, 14, currentY);
      doc.text(service.quantity.toString(), 120, currentY);
      doc.text(`₹${service.rate}`, 140, currentY);
      doc.text(`₹${service.total}`, 170, currentY);
      currentY += 6;
    });
    
    // Totals
    currentY += 10;
    doc.text(`Subtotal: ₹${invoice.subtotal}`, 140, currentY);
    
    if (invoice.taxType === 'intra') {
      currentY += 6;
      doc.text(`CGST (${companySettings.cgstRate}%): ₹${invoice.cgst}`, 140, currentY);
      currentY += 6;
      doc.text(`SGST (${companySettings.sgstRate}%): ₹${invoice.sgst}`, 140, currentY);
    } else {
      currentY += 6;
      doc.text(`IGST (${companySettings.igstRate}%): ₹${invoice.igst}`, 140, currentY);
    }
    
    currentY += 8;
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ₹${invoice.total}`, 140, currentY);
    
    return doc.output('blob');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taxes = calculateTaxes();
    const subtotal = calculateSubtotal();
    
    const invoice: Invoice = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      customerName,
      customerPhone,
      customerGST: customerGST || undefined,
      vehicleModel,
      vehicleNumber,
      services,
      subtotal,
      cgst: taxes.cgst,
      sgst: taxes.sgst,
      igst: taxes.igst,
      total: calculateTotal(),
      taxType
    };

    // Save to localStorage
    const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    localStorage.setItem('invoices', JSON.stringify([...existingInvoices, invoice]));

    // Generate and download PDF
    const pdfBlob = generatePDF(invoice);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `GM_Invoice_${customerName.replace(/\s+/g, '_')}_${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast({
      title: "Invoice Generated!",
      description: `Invoice #${invoice.id} has been created and downloaded.`,
    });

    // Reset form
    setCustomerName('');
    setCustomerPhone('');
    setCustomerGST('');
    setVehicleModel('');
    setVehicleNumber('');
    setServices([{ description: '', hsn: '', quantity: 1, rate: 0, taxableValue: 0, gstPercent: 18, gstAmount: 0, total: 0, details: '' }]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-6 w-6" />
            New Invoice - Professional Billing System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Customer Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Customer Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input 
                      id="customerName" 
                      value={customerName} 
                      onChange={e => setCustomerName(e.target.value)} 
                      required 
                      className="mt-1"
                      list="customers"
                    />
                    <datalist id="customers">
                      {customerSuggestions.map((customer, idx) => (
                        <option key={idx} value={customer.name} onClick={() => fillCustomerDetails(customer)} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input 
                      id="customerPhone" 
                      type="tel" 
                      value={customerPhone} 
                      onChange={e => setCustomerPhone(e.target.value)} 
                      required 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerGST">Customer GST Number (Optional)</Label>
                    <Input 
                      id="customerGST" 
                      value={customerGST} 
                      onChange={e => setCustomerGST(e.target.value)} 
                      placeholder="Enter GST number if available"
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                    <Input 
                      id="vehicleNumber" 
                      value={vehicleNumber} 
                      onChange={e => setVehicleNumber(e.target.value)} 
                      required 
                      className="mt-1"
                      list="vehicles"
                    />
                    <datalist id="vehicles">
                      {vehicleSuggestions.map((vehicle, idx) => (
                        <option key={idx} value={vehicle.number} onClick={() => fillVehicleDetails(vehicle)} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div>
                    <Label htmlFor="vehicleModel">Vehicle Model & Type *</Label>
                    <Input 
                      id="vehicleModel" 
                      value={vehicleModel} 
                      onChange={e => setVehicleModel(e.target.value)} 
                      required 
                      placeholder="e.g., Maruti Swift Petrol"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Tax Type</Label>
                    <Select value={taxType} onValueChange={(value: 'intra' | 'inter') => setTaxType(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intra">Intra-State (CGST + SGST)</SelectItem>
                        <SelectItem value="inter">Inter-State (IGST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Services Section */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Services & Items</h3>
                <Button type="button" onClick={addService} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
              
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                        <div className="lg:col-span-2">
                          <Label>Service Description</Label>
                          <Select 
                            value={service.description} 
                            onValueChange={(value) => {
                              if (value === 'custom') {
                                updateService(index, 'description', '');
                              } else {
                                const selectedService = defaultServices.find(s => s.name === value);
                                if (selectedService) {
                                  selectPredefinedService(index, selectedService.id);
                                }
                              }
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select or enter custom service" />
                            </SelectTrigger>
                            <SelectContent>
                              {defaultServices.map((predefinedService) => (
                                <SelectItem key={predefinedService.id} value={predefinedService.name}>
                                  {predefinedService.name} - ₹{predefinedService.defaultRate}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">Custom Service</SelectItem>
                            </SelectContent>
                          </Select>
                          {!defaultServices.some(s => s.name === service.description) && (
                            <Input 
                              value={service.description} 
                              onChange={e => updateService(index, 'description', e.target.value)} 
                              placeholder="Enter custom service"
                              className="mt-2"
                            />
                          )}
                        </div>
                        
                        <div>
                          <Label>Quantity</Label>
                          <Input 
                            type="number" 
                            min="1"
                            value={service.quantity} 
                            onChange={e => updateService(index, 'quantity', parseInt(e.target.value) || 1)} 
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label>Rate (₹)</Label>
                          <Input 
                            type="number" 
                            min="0"
                            step="0.01"
                            value={service.rate} 
                            onChange={e => updateService(index, 'rate', parseFloat(e.target.value) || 0)} 
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label>Amount (₹)</Label>
                          <Input 
                            type="number" 
                            value={service.total} 
                            readOnly 
                            className="mt-1 bg-muted"
                          />
                        </div>
                        
                        <div>
                          {services.length > 1 && (
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeService(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Service Details Field */}
                      <div className="mt-3">
                        <Label>Service Details (Optional)</Label>
                        <Input 
                          value={service.details || ''} 
                          onChange={e => updateService(index, 'details', e.target.value)} 
                          placeholder="e.g., AC Gas Refill – includes vacuuming and R134a gas top-up"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Tax Calculation Summary */}
            <Card className="p-4 bg-primary/5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Calculation Summary
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Subtotal:</span>
                  <div className="font-semibold text-lg">₹{calculateSubtotal().toFixed(2)}</div>
                </div>
                
                {taxType === 'intra' ? (
                  <>
                    <div>
                      <span className="text-muted-foreground">CGST ({companySettings.cgstRate}%):</span>
                      <div className="font-semibold">₹{calculateTaxes().cgst.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">SGST ({companySettings.sgstRate}%):</span>
                      <div className="font-semibold">₹{calculateTaxes().sgst.toFixed(2)}</div>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="text-muted-foreground">IGST ({companySettings.igstRate}%):</span>
                    <div className="font-semibold">₹{calculateTaxes().igst.toFixed(2)}</div>
                  </div>
                )}
                
                <div>
                  <span className="text-muted-foreground">Grand Total:</span>
                  <div className="font-bold text-xl text-primary">₹{calculateTotal().toFixed(2)}</div>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto px-8 py-3 text-lg"
              >
                <Receipt className="h-5 w-5 mr-2" />
                Generate Professional Invoice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;