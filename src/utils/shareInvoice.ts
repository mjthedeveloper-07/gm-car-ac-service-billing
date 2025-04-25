
import { toast } from "sonner";

interface ShareInvoiceProps {
  customerPhone: string;
  customerName: string;
  invoiceId: string;
  pdfContent: string;
}

const saveInvoiceToPDF = async (pdfBlob: Blob, fileName: string) => {
  try {
    // Create a File object from the Blob
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
    
    // Save to downloads folder
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    toast.success("Invoice saved successfully");
  } catch (error) {
    console.error('Error saving invoice:', error);
    toast.error("Failed to save invoice");
  }
};

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

  // Format the filename with customer details
  const fileName = `gm_ac_service_${customerName.replace(/\s+/g, '_')}_${invoiceId}.pdf`;

  try {
    // Create PDF blob
    const blob = await fetch(pdfContent).then(r => r.blob());
    
    // Save the PDF
    await saveInvoiceToPDF(blob, fileName);
    
    // Create WhatsApp sharing link
    const whatsappText = encodeURIComponent(`Hi ${customerName}, here's your invoice from GM CAR A/C SERVICE & MULTIBRAND.`);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone.replace('+', '')}&text=${whatsappText}`;
    
    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
    
    toast.success("Invoice ready to share via WhatsApp");
  } catch (error) {
    console.error('Error preparing invoice:', error);
    toast.error("Failed to prepare invoice for sharing");
  }
};
