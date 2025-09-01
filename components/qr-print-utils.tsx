'use client';

import { Equipment } from '@/constants/data';
import { Button } from '@/components/ui/button';
import { Printer, MoreVertical } from 'lucide-react';
import QRCode from 'qrcode';
import { getAll } from '@/data/equipment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface QRPrintUtilsProps {
  equipments: Equipment[];
  selectedEquipments?: Equipment[];
}

export function QRPrintUtils({ equipments, selectedEquipments }: QRPrintUtilsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Generate QR code and overlay logo at the center
  const generateQRCodeDataURL = async (equipment: Equipment, size: number = 200): Promise<string> => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3001'}/equipments/${equipment.id}`;
    // DENR color scheme
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#08933D', // Salem as Primary
        light: '#DDE5E1' // Nubula as BG
      }
    });

    // Create canvas and draw QR code
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return qrCodeDataUrl;

    // Draw QR code
    const qrImg = new window.Image();
    qrImg.src = qrCodeDataUrl;
    await new Promise((resolve) => {
      qrImg.onload = resolve;
    });
    ctx.drawImage(qrImg, 0, 0, size, size);

    // Draw logo at center
    const logoSize = size * 0.18; // 18% of QR code size
    const logoImg = new window.Image();
    logoImg.src = '/logo.jpg'; // Ensure logo.jpg is in public/
    await new Promise((resolve) => {
      logoImg.onload = resolve;
    });
    const x = (size - logoSize) / 2;
    const y = (size - logoSize) / 2;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.drawImage(logoImg, x, y, logoSize, logoSize);
    ctx.restore();

    return canvas.toDataURL('image/png');
  };

  const printQRCodes = async (items: Equipment[]) => {
    try {
      setIsLoading(true);

      let itemsToPrint = items;

      // If no items are selected, fetch all equipment data with current filters
      if (!selectedEquipments || selectedEquipments.length === 0) {
        console.log('No items selected, fetching all equipment data with current filters...');

        // Get current filters from URL
        const currentFilters = {
          search: searchParams.get('search') || undefined,
          brand: searchParams.get('brand') || undefined,
          model: searchParams.get('model') || undefined,
          serialNumber: searchParams.get('serialNumber') || undefined,
          categories: (() => {
            const fuelType = searchParams.get('fuelType');
            const intendedUse = searchParams.get('intendedUse');
            const categories: string[] = [];
            if (fuelType) categories.push(...fuelType.split(',').map(cat => cat.trim()));
            if (intendedUse) categories.push(...intendedUse.split(',').map(cat => cat.trim()));
            return categories.length > 0 ? categories : undefined;
          })()
        };

        const allEquipments = await getAll(currentFilters);

        // Transform the raw data to match Equipment type
        itemsToPrint = allEquipments.map((equipment: any) => {
          const dateAcquired = new Date(equipment.dateAcquired);
          const currentDate = new Date();
          let isExpired = false;

          if (equipment.isNew) {
            // For new equipment: use dateAcquired + 2 years
            const twoYearsFromAcquisition = new Date(dateAcquired);
            twoYearsFromAcquisition.setFullYear(dateAcquired.getFullYear() + 2);
            isExpired = currentDate > twoYearsFromAcquisition;
          } else {
            // For renewal equipment: use createdAt + 2 years
            const createdAt = new Date(equipment.createdAt);
            const twoYearsFromRegistration = new Date(createdAt);
            twoYearsFromRegistration.setFullYear(createdAt.getFullYear() + 2);
            isExpired = currentDate > twoYearsFromRegistration;
          }

          return {
            id: equipment.id,
            ownerFirstName: equipment.ownerFirstName,
            ownerLastName: equipment.ownerLastName,
            ownerMiddleName: equipment.ownerMiddleName,
            ownerAddress: equipment.ownerAddress,
            ownerContactNumber: equipment.ownerContactNumber,
            ownerEmail: equipment.ownerEmail,
            ownerPreferContactMethod: equipment.ownerPreferContactMethod,
            ownerIdUrl: equipment.ownerIdUrl,
            brand: equipment.brand,
            model: equipment.model,
            serialNumber: equipment.serialNumber,
            guidBarLength: equipment.guidBarLength,
            horsePower: equipment.horsePower,
            fuelType: equipment.fuelType,
            dateAcquired: dateAcquired.toISOString(),
            stencilOfSerialNo: equipment.stencilOfSerialNo,
            otherInfo: equipment.otherInfo,
            intendedUse: equipment.intendedUse,
            isNew: equipment.isNew,
            createdAt: new Date(equipment.createdAt).toISOString(),
            updatedAt: new Date(equipment.updatedAt).toISOString(),
            status: isExpired ? (equipment.isNew ? 'inactive' : 'renewal') : 'active',
            registrationApplicationUrl: equipment.registrationApplicationUrl,
            officialReceiptUrl: equipment.officialReceiptUrl,
            spaUrl: equipment.spaUrl,
            stencilSerialNumberPictureUrl: equipment.stencilSerialNumberPictureUrl,
            chainsawPictureUrl: equipment.chainsawPictureUrl,
            forestTenureAgreementUrl: equipment.forestTenureAgreementUrl,
            businessPermitUrl: equipment.businessPermitUrl,
            certificateOfRegistrationUrl: equipment.certificateOfRegistrationUrl,
            lguBusinessPermitUrl: equipment.lguBusinessPermitUrl,
            woodProcessingPermitUrl: equipment.woodProcessingPermitUrl,
            governmentCertificationUrl: equipment.governmentCertificationUrl,
            dataPrivacyConsent: equipment.dataPrivacyConsent
          };
        });
      }

      // Determine layout based on number of items
      const itemCount = itemsToPrint.length;
      const isSmallCount = itemCount <= 2;
      const isSingleItem = itemCount === 1;

      // Optimize QR code size for better space utilization
      const qrSize = isSmallCount ? 500 : 450;

      const qrCodes = await Promise.all(
        itemsToPrint.map(async (equipment) => ({
          equipment,
          dataURL: await generateQRCodeDataURL(equipment, qrSize)
        }))
      );

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const stickerWidth = isSmallCount ? '160mm' : '140mm';
      const stickerHeight = isSmallCount ? '120mm' : '110mm';
      // Force 2-column layout for better space utilization
      const gridColumns = isSingleItem ? '1fr' : 'repeat(2, 1fr)';
      const gridJustify = isSingleItem ? 'center' : 'start';
      const containerMaxWidth = 'none';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Equipment QR Code Stickers</title>
          <style>
            @page {
              size: A4;
              margin: 5mm;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              background: linear-gradient(135deg, #DDE5E1 0%, #f0f4f2 100%);
              padding: 0;
              color: #0C1B72;
              min-height: 100vh;
              line-height: 1.6;
            }
            
            .header {
              text-align: center;
              margin-bottom: 15px;
              padding: 15px 15px 10px 15px;
              background: linear-gradient(135deg, #08933D 0%, #0a7a33 100%);
              color: #fff;
              border-bottom: 4px solid #7FA8A7;
              box-shadow: 0 4px 12px rgba(8, 147, 61, 0.2);
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            
            .header h1 {
              font-size: clamp(20px, 4vw, 28px);
              margin: 0 0 8px 0;
              letter-spacing: 1px;
              font-weight: 700;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
              position: relative;
              z-index: 1;
            }
            
            .header p {
              font-size: clamp(12px, 2.5vw, 14px);
              margin: 4px 0;
              color: #DDE5E1;
              font-weight: 500;
              position: relative;
              z-index: 1;
            }
            
            .sticker-container {
              max-width: ${containerMaxWidth};
              margin: 0 auto;
              padding: 0 15px 15px 15px;
            }
            
            .sticker-grid {
              display: grid;
              grid-template-columns: ${gridColumns};
              gap: ${isSmallCount ? '18px' : '15px'};
              margin: 15px 0;
              justify-items: ${gridJustify};
              align-items: start;
            }
            
            .sticker-item {
              width: ${stickerWidth};
              height: ${stickerHeight};
              border: 3px dashed #08933D;
              border-radius: 12px;
              padding: 12px;
              text-align: center;
              background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
              box-shadow: 
                0 8px 25px rgba(12,27,114,0.1),
                0 4px 10px rgba(8,147,61,0.08),
                inset 0 1px 0 rgba(255,255,255,0.8);
              page-break-inside: avoid;
              box-sizing: border-box;
              position: relative;
              ${isSingleItem ? 'margin: 0 auto;' : ''}
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              transition: all 0.3s ease;
            }
            
            .sticker-item:hover {
              transform: translateY(-2px);
              box-shadow: 
                0 12px 35px rgba(12,27,114,0.15),
                0 6px 15px rgba(8,147,61,0.12),
                inset 0 1px 0 rgba(255,255,255,0.9);
            }
            
            .sticker-item::before {
              content: '';
              position: absolute;
              top: -6px;
              left: -6px;
              right: -6px;
              bottom: -6px;
              border: 2px solid #7FA8A7;
              border-radius: 16px;
              pointer-events: none;
              z-index: -1;
              background: linear-gradient(145deg, #f0f4f2 0%, #e8ecea 100%);
            }
            
            .sticker-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 8px;
            }
            
            .sticker-item img {
              max-width: 100%;
              height: auto;
              border-radius: 10px;
              background: linear-gradient(145deg, #DDE5E1 0%, #d0d8d4 100%);
              border: 2px solid #7FA8A7;
              width: ${Math.min(qrSize, 220)}px;
              height: ${Math.min(qrSize, 220)}px;
              object-fit: contain;
              box-shadow: 0 4px 12px rgba(8,147,61,0.15);
              transition: all 0.3s ease;
            }
            
            .sticker-item:hover img {
              box-shadow: 0 6px 18px rgba(8,147,61,0.25);
              transform: scale(1.02);
            }
            
            .equipment-name {
              font-weight: 700;
              font-size: clamp(12px, 3vw, ${isSmallCount ? '18px' : '16px'});
              margin: 4px 0;
              color: #08933D;
              word-break: break-word;
              line-height: 1.3;
              max-width: 100%;
              text-shadow: 0 1px 2px rgba(8,147,61,0.1);
            }
            
            .equipment-id {
              font-size: clamp(10px, 2.5vw, ${isSmallCount ? '13px' : '12px'});
              color: #0C1B72;
              margin: 3px 0;
              word-break: break-all;
              line-height: 1.2;
              font-weight: 600;
              background: rgba(12,27,114,0.05);
              padding: 2px 6px;
              border-radius: 4px;
              border: 1px solid rgba(12,27,114,0.1);
            }
            
            .equipment-category {
              font-size: clamp(9px, 2.2vw, ${isSmallCount ? '12px' : '11px'});
              color: #fff;
              background: linear-gradient(135deg, #7FA8A7 0%, #6b8f8e 100%);
              padding: 4px 10px;
              border-radius: 6px;
              display: inline-block;
              margin-top: 4px;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              letter-spacing: 0.4px;
              line-height: 1.2;
              font-weight: 600;
              box-shadow: 0 2px 6px rgba(127,168,167,0.3);
            }
            
            .cut-indicator {
              position: absolute;
              top: -10px;
              left: 50%;
              transform: translateX(-50%);
              background: linear-gradient(135deg, #08933D 0%, #0a7a33 100%);
              color: white;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              box-shadow: 0 3px 8px rgba(8,147,61,0.3);
              border: 1px solid rgba(255,255,255,0.2);
            }
            
            .cut-indicator::before {
              content: '✂️';
              margin-right: 4px;
              font-size: 8px;
            }
            
            @media screen and (max-width: 600px) {
              .header {
                padding: 15px 8px 10px 8px;
                margin-bottom: 15px;
              }
              
              .sticker-container {
                padding: 0 12px 12px 12px;
              }
              
              .sticker-grid {
                grid-template-columns: 1fr;
                gap: 15px;
                justify-items: center;
              }
              
              .sticker-item {
                width: 100mm;
                height: 75mm;
                padding: 10px;
              }
              
              .sticker-item img {
                width: 120px;
                height: 120px;
              }
            }
            
            @media screen and (max-width: 400px) {
              .sticker-item {
                width: 90mm;
                height: 70mm;
                padding: 8px;
              }
              
              .sticker-item img {
                width: 90px;
                height: 90px;
              }
            }
            
            @media print {
              body { 
                margin: 0; 
                background: white;
              }
              
              .no-print { display: none; }
              
              .sticker-grid {
                gap: ${isSmallCount ? '12px' : '10px'};
              }
              
              .header {
                background: #08933D !important;
                color: #fff !important;
                border-bottom: 3px solid #7FA8A7 !important;
                box-shadow: none !important;
              }
              
              .sticker-item {
                page-break-inside: avoid;
                break-inside: avoid;
                border: 3px dashed #08933D !important;
                background: white !important;
                box-shadow: none !important;
                transform: none !important;
              }
              
              .sticker-item::before {
                border: 2px solid #7FA8A7 !important;
                background: white !important;
              }
              
              .sticker-item:hover {
                transform: none !important;
                box-shadow: none !important;
              }
              
              .sticker-item img {
                box-shadow: none !important;
                transform: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DENR Equipment QR Code Stickers</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Stickers: ${qrCodes.length}</p>
          </div>
          <div class="sticker-container">
            <div class="sticker-grid">
              ${qrCodes.map(({ equipment, dataURL }) => `
                <div class="sticker-item">
                  <div class="cut-indicator">Cut Here</div>
                  <div class="sticker-content">
                    <div class="equipment-name">${equipment.brand} ${equipment.model}</div>
                    <div class="equipment-id">ID: ${equipment.id}</div>
                    <img src="${dataURL}" alt="QR Code for ${equipment.brand} ${equipment.model}" />
                    <div class="equipment-category">${equipment.fuelType} | ${equipment.intendedUse}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 1000);

    } catch (error) {
      console.error('Error generating QR codes for printing:', error);
      alert('Error generating QR codes for printing');
    } finally {
      setIsLoading(false);
    }
  };

  const hasSelection = selectedEquipments && selectedEquipments.length > 0;
  const itemsToProcess = hasSelection ? selectedEquipments : equipments;

  return (
    <>
      {/* Mobile View - Context Menu */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={itemsToProcess.length === 0 || isLoading}>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => printQRCodes(itemsToProcess)} disabled={isLoading}>
              <Printer className="h-4 w-4 mr-2" />
              <span>
                {isLoading ? 'Generating...' : `Print Stickers ${hasSelection ? `(${selectedEquipments.length})` : '(All)'}`}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop View - Regular Buttons */}
      <div className="hidden sm:flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => printQRCodes(itemsToProcess)}
          disabled={itemsToProcess.length === 0 || isLoading}
        >
          <Printer className="h-4 w-4 mr-2" />
          {isLoading ? 'Generating...' : `Print Stickers ${hasSelection ? `Selected (${selectedEquipments.length})` : 'All'}`}
        </Button>
      </div>
    </>
  );
}
