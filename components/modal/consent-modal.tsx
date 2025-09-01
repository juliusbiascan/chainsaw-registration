'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleConfirm = () => {
    if (hasConsented) {
      onConfirm();
    }
  };

  return (
    <Modal
      title='CERTIFICATION AND DATA PRIVACY CONSENT'
      description='Please read and accept the terms below to proceed with registration.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='space-y-4'>
        <ScrollArea className='h-80 w-full rounded-md border p-4'>
          <div className='space-y-4 text-sm'>
            <p>
              By completing this form, I hereby certify that the information I have provided is true, correct, and complete.
            </p>
            <p>
              Any false information provided herein will render this application null and void.
            </p>
            <p>
              I hereby express my consent for the CENRO ALAMINOS to collect and process my personal information, record, transmit, and store the data provided herein subject to the rules and regulations set by Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012.
            </p>
            <p>
              In submitting this form I agree to my details being used for the purposes of Chainsaw Registration. The information will only be accessed by DENR Staff. I understand my data will be held securely and will not be distributed to third parties.
            </p>
          </div>
        </ScrollArea>

        <div className='flex items-center space-x-2'>
          <Checkbox
            id='consent'
            checked={hasConsented}
            onCheckedChange={(checked) => setHasConsented(checked as boolean)}
          />
          <Label htmlFor='consent' className='text-sm'>
            I have read, understood, and agree to the certification and data privacy consent terms above.
          </Label>
        </div>

        <div className='flex w-full items-center justify-end space-x-2 pt-6'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasConsented}
            className='bg-green-600 hover:bg-green-700'
          >
            I Agree and Proceed
          </Button>
        </div>
      </div>
    </Modal>
  );
};
