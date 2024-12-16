import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface Contact {
  name: string;
  tel: string;
}

interface ContactSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (selectedContacts: Contact[]) => void;
}

export const ContactSelectionModal = ({ isOpen, onClose, onShare }: ContactSelectionModalProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  const loadContacts = async () => {
    try {
      if ('contacts' in navigator) {
        const props = ['name', 'tel'];
        const contacts = await (navigator as any).contacts.select(props, { multiple: true });
        setContacts(contacts);
      } else {
        toast({
          title: "Contact Access Not Supported",
          description: "Your browser doesn't support contact selection.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error accessing contacts:', error);
      toast({
        title: "Error",
        description: "Failed to access contacts. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleContact = (contact: Contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.tel === contact.tel);
      if (isSelected) {
        return prev.filter(c => c.tel !== contact.tel);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleShare = () => {
    onShare(selectedContacts);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share with Contacts</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {contacts.length === 0 ? (
            <Button onClick={loadContacts}>
              Select Contacts
            </Button>
          ) : (
            <>
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`contact-${index}`}
                        checked={selectedContacts.some(c => c.tel === contact.tel)}
                        onCheckedChange={() => toggleContact(contact)}
                      />
                      <label
                        htmlFor={`contact-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {contact.name} ({contact.tel})
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleShare} disabled={selectedContacts.length === 0}>
                  Share with {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};