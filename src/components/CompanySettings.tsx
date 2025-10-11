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
import { supabase } from "@/integrations/supabase/client";
import { z } from 'zod';

// Validation schemas
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const phoneRegex = /^[+]?[1-9]\d{1,14}$/;

const companySettingsSchema = z.object({
  name: z.string().trim().min(1, "Company name is required").max(200, "Company name too long"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address too long"),
  gstNumber: z.string().trim().regex(gstRegex, "Invalid GST number format"),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone number format"),
  email: z.string().trim().email("Invalid email format").max(255, "Email too long"),
  website: z.string().trim().optional(),
  cgstRate: z.number().min(0, "Rate cannot be negative").max(100, "Rate cannot exceed 100%"),
  sgstRate: z.number().min(0, "Rate cannot be negative").max(100, "Rate cannot exceed 100%"),
  igstRate: z.number().min(0, "Rate cannot be negative").max(100, "Rate cannot exceed 100%")
});

const serviceSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Service name required").max(100, "Service name too long"),
  defaultRate: z.number().min(0, "Rate cannot be negative").max(1000000, "Rate too large")
});

const CompanySettingsComponent = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'GM CAR A/C SERVICE & Cool Sales & Engine Dercarbonisation PVT LTD',
    address: 'No:16 Gangai Amman, Kallikuppam, Ambattur, Chennai-53 Tamilnadu',
    gstNumber: '33ATXPM5584B1ZB',
    phone: '+91 8428000085',
    email: 'gmautocool@gmail.com',
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
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user settings from database
      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userSettings) {
        setSettings({
          name: userSettings.company_name,
          address: userSettings.company_address || '',
          gstNumber: userSettings.gst_number || '',
          phone: userSettings.phone || '',
          email: userSettings.email || '',
          website: userSettings.website || '',
          cgstRate: Number(userSettings.cgst_rate) || 9,
          sgstRate: Number(userSettings.sgst_rate) || 9,
          igstRate: Number(userSettings.igst_rate) || 18
        });
      }

      // Load predefined services from database
      const { data: userServices } = await supabase
        .from('predefined_services')
        .select('*')
        .eq('user_id', user.id);

      if (userServices && userServices.length > 0) {
        setServices(userServices.map(s => ({
          id: s.id,
          name: s.name,
          defaultRate: Number(s.default_rate)
        })));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

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

  const saveSettings = async () => {
    try {
      // Validate settings
      const validatedSettings = companySettingsSchema.parse(settings);
      
      // Validate services
      for (const service of services) {
        serviceSchema.parse(service);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save settings.",
          variant: "destructive",
        });
        return;
      }

      // Upsert user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          company_name: validatedSettings.name.trim(),
          company_address: validatedSettings.address.trim(),
          gst_number: validatedSettings.gstNumber.trim(),
          phone: validatedSettings.phone.trim(),
          email: validatedSettings.email.trim(),
          website: validatedSettings.website?.trim() || null,
          cgst_rate: validatedSettings.cgstRate,
          sgst_rate: validatedSettings.sgstRate,
          igst_rate: validatedSettings.igstRate
        }, { onConflict: 'user_id' });

      if (settingsError) throw settingsError;

      // Delete existing services and insert new ones
      await supabase
        .from('predefined_services')
        .delete()
        .eq('user_id', user.id);

      if (services.length > 0) {
        const { error: servicesError } = await supabase
          .from('predefined_services')
          .insert(services.map(s => ({
            id: s.id,
            user_id: user.id,
            name: s.name.trim(),
            default_rate: s.defaultRate
          })));

        if (servicesError) throw servicesError;
      }
      
      toast({
        title: "Settings Saved!",
        description: "Company settings and services have been updated successfully.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        console.error('Error saving settings:', error);
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
      }
    }
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
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={settings.website || ''}
                onChange={e => handleSettingsChange('website', e.target.value)}
                className="mt-1"
                placeholder="www.example.com"
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
