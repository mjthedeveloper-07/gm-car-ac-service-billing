
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceList from "@/components/InvoiceList";
import CompanySettings from "@/components/CompanySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            GM CAR A/C SERVICE & MULTIBRAND
          </h1>
          <p className="text-gray-600 mt-2">Billing Management System</p>
        </header>
        
        <Tabs defaultValue="invoice" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoice">New Invoice</TabsTrigger>
            <TabsTrigger value="list">Invoice List</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="invoice">
            <InvoiceForm />
          </TabsContent>
          <TabsContent value="list">
            <InvoiceList />
          </TabsContent>
          <TabsContent value="settings">
            <CompanySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
