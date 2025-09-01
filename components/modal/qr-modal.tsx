'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useQRCode } from 'next-qrcode';

interface QrModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const QrModal: React.FC<QrModalProps> = ({
  url,
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {

  const { Canvas } = useQRCode();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='QR Code'
      description='This generated QR code can be scanned to access the equipment details.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex items-center justify-center p-4  '>

        <Canvas
          text={url}
          options={{
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 200,

          }}
        />
      </div>
      <div className='flex w-full items-center justify-end space-x-2 pt-6'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
