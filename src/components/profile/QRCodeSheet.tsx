import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QrCode, X } from "lucide-react";

interface QRCodeSheetProps {
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  selectedOffer: { clubName: string } | null;
}

export function QRCodeSheet({
  showQRCode,
  setShowQRCode,
  selectedOffer
}: QRCodeSheetProps) {
  return (
    <Sheet open={showQRCode} onOpenChange={setShowQRCode}>
      <SheetContent side="bottom" className="h-[400px]">
        <div className="absolute right-4 top-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowQRCode(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <h3 className="font-semibold text-lg">Offer QR Code</h3>
          <div className="bg-white p-4 rounded-lg">
            <QrCode className="h-32 w-32 text-black" />
          </div>
          {selectedOffer && (
            <p className="text-sm text-muted-foreground">
              Show this QR code at {selectedOffer.clubName}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}