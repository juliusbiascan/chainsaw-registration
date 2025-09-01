'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  showLogo?: boolean;
}

export function QRCodeDisplay({ value, size = 100, className, showLogo = false }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      // Generate QR code with DENR color scheme
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#08933D', // DENR Green (Salem)
          light: '#DDE5E1' // Light Green (Nubula)
        }
      }).then(() => {
        // Add logo overlay if requested
        if (showLogo && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            const logoSize = size * 0.18; // 18% of QR code size
            const logoImg = new window.Image();
            logoImg.src = '/logo.jpg';
            logoImg.onload = () => {
              const x = (size - logoSize) / 2;
              const y = (size - logoSize) / 2;
              ctx.save();
              ctx.globalAlpha = 1;
              ctx.drawImage(logoImg, x, y, logoSize, logoSize);
              ctx.restore();
            };
          }
        }
      });
    }
  }, [value, size, showLogo]);

  return (
    <div className={`qr-code-container ${className || ''}`}>
      <canvas
        ref={canvasRef}
        className="qr-code-canvas"
        width={size}
        height={size}
        style={{
          borderRadius: '8px',
          border: '2px solid #7FA8A7',
          background: '#DDE5E1',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
}
