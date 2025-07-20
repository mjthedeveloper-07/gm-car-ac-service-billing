import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings, Building, FileText, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { CompanySettings, PredefinedService } from '@/types/invoice';

const CompanySettingsComponent = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'GM Car AC Service & Multibrand',
    address: 'Shop Address, City, State - PIN',
    gstNumber: 'GSTIN123456789',
    phone: '+91 9876543210',
    email: 'info@gmcarservice.com',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18
  });

  const [services, setServices] = useState<PredefinedService[]>([
    { id: '1', name: 'AC Gas Filling', defaultRate: 1500 },
    { id: '2', name: 'AC Service Complete', defaultRate: 2500 },
    { id: '3', name: 'AC Compressor Repair', defaultRate: 3500 },
    { id: '4', name: 'Engine Oil Change', defaultRate: 800 },
    { id: '5', name: 'Brake Service', defaultRate: 1200 },
    { id: '6', name: 'Battery Service', defaultRate: 600 },
    { id: '7', name: 'Tire Change', defaultRate: 400 },
    { id: '8', name: 'General Checkup', defaultRate: 500 },
  ]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedServices = localStorage.getItem('predefinedServices');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  const handleSettingsChange = (field: keyof CompanySettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index: number, field: keyof PredefinedService, value: string | number) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const addService = () => {
    const newService: PredefinedService = {
      id: Date.now().toString(),
      name: '',
      defaultRate: 0
    };
    setServices([...services, newService]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const saveSettings = () => {
    localStorage.setItem('companySettings', JSON.stringify(settings));
    localStorage.setItem('predefinedServices', JSON.stringify(services));
    
    toast({
      title: "Settings Saved!",
      description: "Company settings and services have been updated successfully.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Company Information */}
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.name}
                onChange={e => handleSettingsChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={settings.gstNumber}
                onChange={e => handleSettingsChange('gstNumber', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={e => handleSettingsChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={e => handleSettingsChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Complete Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={e => handleSettingsChange('address', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card className="shadow-lg">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Tax Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cgstRate">CGST Rate (%)</Label>
              <Input
                id="cgstRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.cgstRate}
                onChange={e => handleSettingsChange('cgstRate', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="sgstRate">SGST Rate (%)</Label>
              <Input
                id="sgstRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.sgstRate}
                onChange={e => handleSettingsChange('sgstRate', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="igstRate">IGST Rate (%)</Label>
              <Input
                id="igstRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.igstRate}
                onChange={e => handleSettingsChange('igstRate', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> CGST + SGST applies for intra-state transactions. IGST applies for inter-state transactions.
              Standard GST rates: CGST 9% + SGST 9% = 18% total, or IGST 18%.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Predefined Services */}
      <Card className="shadow-lg">
        <CardHeader className="bg-accent text-accent-foreground">
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Predefined Services
            </div>
            <Button onClick={addService} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {services.map((service, index) => (
              <Card key={service.id} className="p-4 bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label>Service Name</Label>
                    <Input
                      value={service.name}
                      onChange={e => handleServiceChange(index, 'name', e.target.value)}
                      placeholder="Enter service name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Default Rate (₹)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={service.defaultRate}
                        onChange={e => handleServiceChange(index, 'defaultRate', parseFloat(e.target.value) || 0)}
                      />
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
                </div>
              </Card>
            ))}
          </div>
          
          {services.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No predefined services yet. Add some to speed up invoice creation!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button onClick={saveSettings} size="lg" className="px-8">
          <Save className="h-5 w-5 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default CompanySettingsComponent;
