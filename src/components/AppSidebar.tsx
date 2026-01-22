import { LayoutList, Plus, Settings, Building } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

const items = [
  {
    title: "New Invoice",
    url: "#invoice",
    icon: Plus,
  },
  {
    title: "Invoice List",
    url: "#list",
    icon: LayoutList,
  },
  {
    title: "Settings",
    url: "#settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Business Header Section */}
        <div className="border-b p-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                GM Car AC Service
              </p>
              <p className="text-xs text-muted-foreground">
                Billing System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="dark:hover:bg-gray-800 dark:text-white"
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Info Notice */}
        <div className="mt-auto border-t p-4">
          <Card className="bg-primary/5 border-primary/20 p-3">
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="font-medium text-primary mb-1">Professional Billing</p>
                <p className="text-muted-foreground">
                  GST compliant invoice generation system
                </p>
              </div>
            </div>
          </Card>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
