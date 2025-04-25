
import { toast } from "sonner";

interface ShareInvoiceProps {
  customerPhone: string;
  customerName: string;
  invoiceId: string;
  pdfContent: string;
}

export const shareInvoice = async ({
  customerPhone,
  customerName,
  invoiceId,
  pdfContent
}: ShareInvoiceProps) => {
  // Add country code if not present
  const formattedPhone = customerPhone.startsWith('+') 
    ? customerPhone 
    : `+91${customerPhone}`; // Assuming India as default country code

  // Using WhatsApp Business API
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone.replace('+', '')}&text=Hi ${customerName}, here's your invoice from GM CAR A/C SERVICE & MULTIBRAND.`;
  
  try {
    // Create a temporary link to download the PDF
    const blob = await fetch(pdfContent).then(r => r.blob());
    const blobUrl = URL.createObjectURL(blob);
    
    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `invoice_${invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Invoice ready to share via WhatsApp");
  } catch (error) {
    console.error('Error preparing invoice:', error);
    toast.error("Failed to prepare invoice");
  }
};
