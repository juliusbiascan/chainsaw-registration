'use client';

import { Equipment } from '@/constants/data';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { bulkImportEquipmentAction } from '@/actions/equipment';
import { getAll } from '@/data/equipment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ExcelUtilsProps {
  equipments: Equipment[];
  selectedEquipments?: Equipment[];
}

export function ExcelUtils({ equipments, selectedEquipments }: ExcelUtilsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const importFromExcel = () => {
    try {
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xlsx,.xls';
      fileInput.style.display = 'none';

      fileInput.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        try {
          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });

          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            alert('Excel file must have at least a header row and one data row');
            return;
          }

          // Get headers from first row
          const headers = jsonData[0] as string[];

          // Process data rows
          const importedEquipments: any[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (!row || row.length === 0) continue;

            // Transform data according to schema requirements - aligned with chainsaw-registration-alaminos.xlsx format
            const equipmentData = {
              // Auto Number (extract number from CSRALAMINOS format if present)
              autoNumber: (() => {
                const autoNumberValue = row[headers.indexOf('Auto Number')] || '';
                if (autoNumberValue && typeof autoNumberValue === 'string' && autoNumberValue.startsWith('CSRALAMINOS')) {
                  // Extract the number part from CSRALAMINOS format
                  const numberPart = autoNumberValue.replace('CSRALAMINOS', '');
                  return parseInt(numberPart) || 0;
                }
                return 0;
              })(),

              // Owner Information
              ownerFirstName: row[headers.indexOf('First Name')] || '',
              ownerLastName: row[headers.indexOf('Last Name')] || '',
              ownerMiddleName: row[headers.indexOf('Middle Initial')] || '',
              ownerAddress: row[headers.indexOf('Address')] || '',
              ownerContactNumber: row[headers.indexOf('Contact No.')] || '',
              ownerEmail: row[headers.indexOf('Email Address')] || '',
              ownerPreferContactMethod: row[headers.indexOf('Preferred Contacting Method')] || '',
              ownerIdUrl: '', // Default empty string

              // Equipment Information
              brand: row[headers.indexOf('Chainsaw Brand')] || '',
              model: row[headers.indexOf('Chainsaw Model')] || '',
              serialNumber: row[headers.indexOf('Chainsaw Serial No.')] || '',
              guidBarLength: parseFloat(row[headers.indexOf('Guide Bar Length (inches)')] || '0') || 0,
              horsePower: parseFloat(row[headers.indexOf('Horse Power')] || '0') || 0,
              fuelType: row[headers.indexOf('Fuel ')] || 'GAS',
              dateAcquired: (() => {
                const dateValue = row[headers.indexOf('Date of Acquisition')];
                if (dateValue) {
                  // Handle Excel date serial number
                  if (typeof dateValue === 'number') {
                    return new Date((dateValue - 25569) * 86400 * 1000);
                  }
                  return new Date(dateValue);
                }
                return new Date();
              })(),
              stencilOfSerialNo: row[headers.indexOf('Stencil of Serial No.')] || '',
              otherInfo: row[headers.indexOf('Other Info of the Chainsaw (Description, Color, etc.)')] || '',
              intendedUse: row[headers.indexOf('Intended Use of the Chainsaw')] || 'OTHER',
              isNew: (row[headers.indexOf('New Chainsaw or renewal of registration?')] || '').toLowerCase().includes('new'),

              // Document Requirements
              registrationApplicationUrl: row[headers.indexOf('Signed Chainsaw Registration Application')] || '',
              officialReceiptUrl: row[headers.indexOf('Official Receipt of the Chainsaw')] || '',
              spaUrl: row[headers.indexOf('SPA (if the applicant is not the owner of the chainsaw)')] || '',
              stencilSerialNumberPictureUrl: row[headers.indexOf('Stencil Serial Number of Chainsaw (Picture)')] || '',
              chainsawPictureUrl: row[headers.indexOf('Picture of the Chainsaw')] || '',
              forestTenureAgreementUrl: row[headers.indexOf('Forest Tenure Agreement (if Tenural Instrument Holder)')] || '',
              businessPermitUrl: row[headers.indexOf('Business Permit (If Business owner)')] || '',
              certificateOfRegistrationUrl: row[headers.indexOf('For Private Tree Plantation Owner - Certificate of Registration')] || '',
              lguBusinessPermitUrl: row[headers.indexOf('Business Permit from LGU or affidavit that the chainsaw\r\nis needed if applicants/profession/work and will be used for legal purpose')] || '',
              woodProcessingPermitUrl: row[headers.indexOf('For Wood Processor - Wood processing plant permit')] || '',
              governmentCertificationUrl: row[headers.indexOf('For government and GOCC - Certification from the Head of Office or his/her authorized representative that chainsaws are owned/possessed by the office and use for legal purposes (specify)')] || '',
              dataPrivacyConsent: (row[headers.indexOf('Data Privacy Act Consent:')] || '').toLowerCase().includes('agree'),

              // Renewal Registration Requirements
              previousCertificateOfRegistrationNumber: row[headers.indexOf('Previous Certificate of Registration Number')] || '',
              renewalRegistrationApplicationUrl: row[headers.indexOf('Signed Chainsaw Registration Application - Renew Previous Certificate of Registration')] || '',
              renewalPreviousCertificateOfRegistrationUrl: row[headers.indexOf('Previous Certificate of Registration ')] || '',

              // Application Status and Processing
              initialApplicationStatus: (() => {
                const status = row[headers.indexOf('Initial Application Status')] || '';
                if (status.toLowerCase().includes('accept')) return 'ACCEPTED';
                if (status.toLowerCase().includes('reject')) return 'REJECTED';
                if (status.toLowerCase().includes('pending')) return 'PENDING';
                return null;
              })(),
              initialApplicationRemarks: row[headers.indexOf('Initial Application Remarks')] || '',
              inspectionResult: (() => {
                const result = row[headers.indexOf('Inspection Result')] || '';
                if (result.toLowerCase().includes('pass')) return 'PASSED';
                if (result.toLowerCase().includes('fail')) return 'FAILED';
                if (result.toLowerCase().includes('pending')) return 'PENDING';
                return null;
              })(),
              inspectionRemarks: row[headers.indexOf('Inspection Remarks')] || '',
              orNumber: row[headers.indexOf('OR No')] || '',
              orDate: (() => {
                const dateValue = row[headers.indexOf('OR Date')];
                if (dateValue) {
                  if (typeof dateValue === 'number') {
                    return new Date((dateValue - 25569) * 86400 * 1000);
                  }
                  return new Date(dateValue);
                }
                return null;
              })(),
              expiryDate: (() => {
                const dateValue = row[headers.indexOf('Expiry Date')];
                if (dateValue) {
                  if (typeof dateValue === 'number') {
                    return new Date((dateValue - 25569) * 86400 * 1000);
                  }
                  return new Date(dateValue);
                }
                return null;
              })()
            };

            importedEquipments.push(equipmentData);
          }

          if (importedEquipments.length === 0) {
            alert('No valid equipment data found in the Excel file');
            return;
          }

          // Show confirmation dialog
          const confirmed = confirm(`Import ${importedEquipments.length} equipment records? This will add them to the database.`);
          if (!confirmed) return;

          // Call the server action to import the data
          const result = await bulkImportEquipmentAction(importedEquipments);

          if (result.success) {
            alert(`Import completed!\n\nSuccessfully imported: ${result.details.success} records\nFailed: ${result.details.failed} records${result.details.errors.length > 0 ? '\n\nErrors:\n' + result.details.errors.slice(0, 5).join('\n') : ''}`);

            // Refresh the page to show new data
            window.location.reload();
          } else {
            alert(`Import failed: ${result.message}\n\nErrors:\n${result.details.errors.slice(0, 10).join('\n')}`);
          }

        } catch (error) {
          console.error('Error importing Excel file:', error);
          alert('Error importing Excel file. Please check the file format.');
        }
      };

      // Trigger file selection
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);

    } catch (error) {
      console.error('Error setting up file import:', error);
      alert('Error setting up file import');
    }
  };

  const exportToExcel = async (items: Equipment[]) => {
    try {
      setIsLoading(true);

      let itemsToExport = items;

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
        itemsToExport = allEquipments.map((equipment: any) => {
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
            dataPrivacyConsent: equipment.dataPrivacyConsent,

            // Renewal Registration Requirements
            previousCertificateOfRegistrationNumber: equipment.previousCertificateOfRegistrationNumber,
            renewalRegistrationApplicationUrl: equipment.renewalRegistrationApplicationUrl,
            renewalPreviousCertificateOfRegistrationUrl: equipment.renewalPreviousCertificateOfRegistrationUrl,

            // Application Status and Processing
            initialApplicationStatus: equipment.initialApplicationStatus,
            initialApplicationRemarks: equipment.initialApplicationRemarks,
            inspectionResult: equipment.inspectionResult,
            inspectionRemarks: equipment.inspectionRemarks,
            orNumber: equipment.orNumber,
            orDate: equipment.orDate,
            expiryDate: equipment.expiryDate
          };
        });
      }

      // Prepare data for export - aligned with chainsaw-registration-alaminos.xlsx format
      const exportData = itemsToExport.map((equipment, index) => ({
        'Auto Number': `CSRALAMINOS${String((index + 1000)).padStart(4, '0')}`,
        'Timestamp': equipment.createdAt,
        'First Name': equipment.ownerFirstName,
        'Middle Initial': equipment.ownerMiddleName,
        'Last Name': equipment.ownerLastName,
        'Address': equipment.ownerAddress,
        'Contact No.': equipment.ownerContactNumber || '',
        'Email Address': equipment.ownerEmail || '',
        'Preferred Contacting Method': equipment.ownerPreferContactMethod || '',
        'Chainsaw Brand': equipment.brand,
        'Chainsaw Model': equipment.model,
        'Chainsaw Serial No.': equipment.serialNumber,
        'Guide Bar Length (inches)': equipment.guidBarLength || '',
        'Horse Power': equipment.horsePower || '',
        'Fuel ': equipment.fuelType,
        'Date of Acquisition': equipment.dateAcquired,
        'Stencil of Serial No.': equipment.stencilOfSerialNo,
        'Other Info of the Chainsaw (Description, Color, etc.)': equipment.otherInfo,
        'Intended Use of the Chainsaw': equipment.intendedUse,
        'New Chainsaw or renewal of registration?': equipment.isNew ? 'New Chainsaw' : 'Renewal of Registration',
        'Previous Certificate of Registration Number': equipment.previousCertificateOfRegistrationNumber || '',
        'Signed Chainsaw Registration Application - Renew Previous Certificate of Registration': equipment.renewalRegistrationApplicationUrl || '',
        'Previous Certificate of Registration ': equipment.renewalPreviousCertificateOfRegistrationUrl || '',
        'Initial Application Status': equipment.initialApplicationStatus || '',
        'Initial Application Remarks': equipment.initialApplicationRemarks || '',
        'Inspection Result': equipment.inspectionResult || '',
        'Inspection Remarks': equipment.inspectionRemarks || '',
        'OR No': equipment.orNumber || '',
        'OR Date': equipment.orDate ? new Date(equipment.orDate).toISOString() : '',
        'Expiry Date': equipment.expiryDate ? new Date(equipment.expiryDate).toISOString() : '',
        'Signed Chainsaw Registration Application': equipment.registrationApplicationUrl || '',
        'Official Receipt of the Chainsaw': equipment.officialReceiptUrl || '',
        'SPA (if the applicant is not the owner of the chainsaw)': equipment.spaUrl || '',
        'Stencil Serial Number of Chainsaw (Picture)': equipment.stencilSerialNumberPictureUrl || '',
        'Picture of the Chainsaw': equipment.chainsawPictureUrl || '',
        'Forest Tenure Agreement (if Tenural Instrument Holder)': equipment.forestTenureAgreementUrl || '',
        'Business Permit (If Business owner)': equipment.businessPermitUrl || '',
        'For Private Tree Plantation Owner - Certificate of Registration': equipment.certificateOfRegistrationUrl || '',
        'Business Permit from LGU or affidavit that the chainsaw\r\nis needed if applicants/profession/work and will be used for legal purpose': equipment.lguBusinessPermitUrl || '',
        'For Wood Processor - Wood processing plant permit': equipment.woodProcessingPermitUrl || '',
        'For government and GOCC - Certification from the Head of Office or his/her authorized representative that chainsaws are owned/possessed by the office and use for legal purposes (specify)': equipment.governmentCertificationUrl || '',
        'Data Privacy Act Consent:': equipment.dataPrivacyConsent ? 'Agree' : 'Disagree',
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability - aligned with chainsaw-registration-alaminos.xlsx format
      const columnWidths = [
        { wch: 15 }, // Auto Number
        { wch: 20 }, // Timestamp
        { wch: 15 }, // First Name
        { wch: 15 }, // Middle Initial
        { wch: 15 }, // Last Name
        { wch: 40 }, // Address
        { wch: 15 }, // Contact No.
        { wch: 30 }, // Email Address
        { wch: 30 }, // Preferred Contacting Method
        { wch: 20 }, // Chainsaw Brand
        { wch: 20 }, // Chainsaw Model
        { wch: 20 }, // Chainsaw Serial No.
        { wch: 25 }, // Guide Bar Length (inches)
        { wch: 15 }, // Horse Power
        { wch: 12 }, // Fuel
        { wch: 20 }, // Date of Acquisition
        { wch: 25 }, // Stencil of Serial No.
        { wch: 40 }, // Other Info of the Chainsaw (Description, Color, etc.)
        { wch: 30 }, // Intended Use of the Chainsaw
        { wch: 35 }, // New Chainsaw or renewal of registration?
        { wch: 35 }, // Previous Certificate of Registration Number
        { wch: 40 }, // Signed Chainsaw Registration Application - Renewal
        { wch: 35 }, // Previous Certificate of Registration
        { wch: 25 }, // Initial Application Status
        { wch: 25 }, // Initial Application Remarks
        { wch: 20 }, // Inspection Result
        { wch: 25 }, // Inspection Remarks
        { wch: 15 }, // OR No
        { wch: 15 }, // OR Date
        { wch: 15 }, // Expiry Date
        { wch: 40 }, // Signed Chainsaw Registration Application
        { wch: 35 }, // Official Receipt of the Chainsaw
        { wch: 45 }, // SPA (if the applicant is not the owner of the chainsaw)
        { wch: 40 }, // Stencil Serial Number of Chainsaw (Picture)
        { wch: 25 }, // Picture of the Chainsaw
        { wch: 45 }, // Forest Tenure Agreement (if Tenural Instrument Holder)
        { wch: 35 }, // Business Permit (If Business owner)
        { wch: 50 }, // For Private Tree Plantation Owner - Certificate of Registration
        { wch: 60 }, // Business Permit from LGU or affidavit...
        { wch: 40 }, // For Wood Processor - Wood processing plant permit
        { wch: 70 }, // For government and GOCC - Certification...
        { wch: 25 }, // Data Privacy Act Consent:
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipment Data');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `chainsaw-registration-alaminos-${timestamp}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting data to Excel');
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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" disabled={isLoading}>
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => exportToExcel(itemsToProcess)} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              <span>
                {isLoading ? 'Exporting...' : `Export to Excel ${hasSelection ? `(${selectedEquipments.length})` : '(All)'}`}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={importFromExcel}>
              <Upload className="h-4 w-4 mr-2" />
              <span>Import from Excel</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop View - Regular Buttons */}
      <div className="hidden sm:flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToExcel(itemsToProcess)}
          disabled={isLoading}
        >
          <Download className="h-4 w-4 mr-2" />
          {isLoading ? 'Exporting...' : `Export to Excel ${hasSelection ? `Selected (${selectedEquipments.length})` : 'All'}`}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={importFromExcel}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import from Excel
        </Button>
      </div>
    </>
  );
}
