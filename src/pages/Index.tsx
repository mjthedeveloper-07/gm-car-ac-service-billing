
import { SidebarProvider } from "@/components/ui/sidebar";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceList from "@/components/InvoiceList";
import CompanySettings from "@/components/CompanySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full page-gradient">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-4">
              <img 
                src="/lovable-uploads/63822fdf-87c9-4ff9-9b0c-12e0ca960fb2.png" 
                alt="GM Car AC Service Logo" 
                className="h-24 w-24 object-contain"
              />
            </div>
            <h1 className="text-4xl card-header-gradient font-bold tracking-tight animate-fade-in">
              GM CAR A/C SERVICE & MULTIBRAND
            </h1>
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 w-48 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <Tabs defaultValue="invoice" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
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
    </SidebarProvider>
  );
};

export default Index;
