
import { toast } from "sonner";

interface ShareInvoiceProps {
  customerPhone: string;
  customerName: string;
  invoiceId: string;
  pdfContent: string;
  webhookUrl?: string;
}

export const shareInvoice = async ({
  customerPhone,
  customerName,
  invoiceId,
  pdfContent,
  webhookUrl,
}: ShareInvoiceProps) => {
  if (!webhookUrl) {
    toast.error("Please configure Zapier webhook URL in settings");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerPhone,
        customerName,
        invoiceId,
        pdfContent,
        message: `Hi ${customerName}, here's your invoice from GM CAR A/C SERVICE & MULTIBRAND.`
      })
    });

    toast.success("Invoice shared successfully");
  } catch (error) {
    console.error('Error sharing invoice:', error);
    toast.error("Failed to share invoice");
  }
};
