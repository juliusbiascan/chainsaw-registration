
import { Equipment } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import EquipmentListingWrapper from './equipment-listing-wrapper';
import { columns } from './equipments-tables/columns';
import { getEquipments } from '@/data/equipment';
import { calculateEquipmentStatus } from '@/lib/utils';

type EquipmentListingPage = {};

export default async function EquipmentListingPage({ }: EquipmentListingPage) {
  try {
    // Showcasing the use of search params cache in nested RSCs
    const page = searchParamsCache.get('page');
    const pageLimit = searchParamsCache.get('perPage');
    const fuelType = searchParamsCache.get('fuelType');
    const intendedUse = searchParamsCache.get('intendedUse');

    // Get individual column search filters
    const brand = searchParamsCache.get('brand');
    const model = searchParamsCache.get('model');
    const serialNumber = searchParamsCache.get('serialNumber');

    // Parse filter categories if they exist
    let parsedCategories: string[] = [];
    if (fuelType) {
      parsedCategories.push(...fuelType.split(',').map(cat => cat.trim()));
    }
    if (intendedUse) {
      parsedCategories.push(...intendedUse.split(',').map(cat => cat.trim()));
    }

    const filters = {
      page: page || 1,
      limit: pageLimit || 10,
      ...(brand && { brand }),
      ...(model && { model }),
      ...(serialNumber && { serialNumber }),
      ...(parsedCategories.length > 0 && { categories: parsedCategories })
    };

    console.log('Applied filters:', filters);
    const data = await getEquipments(filters);
    console.log('Equipment data:', data);

    if (!data.success) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Failed to load equipments</h3>
            <p className="text-gray-500">{data.message || 'An error occurred while fetching equipment data.'}</p>
          </div>
        </div>
      );
    }

    const totalEquipments = data.total_equipments;
    const equipments: Equipment[] = data.equipments.map((equipment: any) => {
      // Use centralized status calculation
      const status = calculateEquipmentStatus(
        equipment.isNew,
        equipment.dateAcquired,
        equipment.createdAt
      );

      // Ensure all dates are in ISO format for consistent handling
      return {
        id: equipment.id,
        // Owner Information
        ownerFirstName: equipment.ownerFirstName,
        ownerLastName: equipment.ownerLastName,
        ownerMiddleName: equipment.ownerMiddleName,
        ownerAddress: equipment.ownerAddress,
        ownerContactNumber: equipment.ownerContactNumber,
        ownerEmail: equipment.ownerEmail,
        ownerPreferContactMethod: equipment.ownerPreferContactMethod,
        ownerIdUrl: equipment.ownerIdUrl,
        // Equipment Information
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        guidBarLength: equipment.guidBarLength,
        horsePower: equipment.horsePower,
        fuelType: equipment.fuelType,
        dateAcquired: new Date(equipment.dateAcquired).toISOString(),
        stencilOfSerialNo: equipment.stencilOfSerialNo,
        otherInfo: equipment.otherInfo,
        intendedUse: equipment.intendedUse,
        isNew: equipment.isNew,
        createdAt: new Date(equipment.createdAt).toISOString(),
        updatedAt: new Date(equipment.updatedAt).toISOString(),
        status,
        // Document Requirements
        registrationApplicationUrl: equipment.registrationApplicationUrl,
        officialReceiptUrl: equipment.officialReceiptUrl,
        spaUrl: equipment.spaUrl,
        stencilSerialNumberPictureUrl: equipment.stencilSerialNumberPictureUrl,
        chainsawPictureUrl: equipment.chainsawPictureUrl,
        // Additional Requirements
        forestTenureAgreementUrl: equipment.forestTenureAgreementUrl,
        businessPermitUrl: equipment.businessPermitUrl,
        certificateOfRegistrationUrl: equipment.certificateOfRegistrationUrl,
        lguBusinessPermitUrl: equipment.lguBusinessPermitUrl,
        woodProcessingPermitUrl: equipment.woodProcessingPermitUrl,
        governmentCertificationUrl: equipment.governmentCertificationUrl,
        // Data Privacy Consent
        dataPrivacyConsent: equipment.dataPrivacyConsent,

        // Application Status and Processing
        initialApplicationStatus: equipment.initialApplicationStatus,
        initialApplicationRemarks: equipment.initialApplicationRemarks,
        inspectionResult: equipment.inspectionResult,
        inspectionRemarks: equipment.inspectionRemarks,
        orNumber: equipment.orNumber,
        orDate: equipment.orDate ? new Date(equipment.orDate).toISOString() : undefined,
        expiryDate: equipment.expiryDate ? new Date(equipment.expiryDate).toISOString() : undefined
      };
    });

    return (
      <EquipmentListingWrapper
        initialData={equipments}
        totalItems={totalEquipments}
        columns={columns}
      />
    );
  } catch (error) {
    console.error('Error in EquipmentListingPage:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
          <p className="text-gray-500">Unable to load equipment data. Please try again later.</p>
        </div>
      </div>
    );
  }
}
