import { NavItem } from '@/types';

export type FuelType = 'GAS' | 'DIESEL' | 'ELECTRIC' | 'OTHER';
export type UseType = 'WOOD_PROCESSING' | 'TREE_CUTTING_PRIVATE_PLANTATION' | 'GOVT_LEGAL_PURPOSES' | 'OFFICIAL_TREE_CUTTING_BARANGAY' | 'OTHER';

export type Equipment = {
  id: string;
  // Owner Information
  ownerFirstName: string;
  ownerLastName: string;
  ownerMiddleName: string;
  ownerAddress: string;
  ownerContactNumber: string;
  ownerEmail: string;
  ownerPreferContactMethod: string;
  ownerIdUrl?: string;

  // Equipment Information
  brand: string;
  model: string;
  serialNumber: string;
  guidBarLength?: number;
  horsePower?: number;
  fuelType: FuelType;
  dateAcquired: string;
  stencilOfSerialNo: string;
  otherInfo: string;
  intendedUse: UseType;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'renewal';

  // Document Requirements
  registrationApplicationUrl?: string;
  officialReceiptUrl?: string;
  spaUrl?: string;
  stencilSerialNumberPictureUrl?: string;
  chainsawPictureUrl?: string;

  // Renewal Registration Requirements
  previousCertificateOfRegistrationNumber?: string;
  renewalRegistrationApplicationUrl?: string;
  renewalPreviousCertificateOfRegistrationUrl?: string;

  // Additional Requirements
  forestTenureAgreementUrl?: string;
  businessPermitUrl?: string;
  certificateOfRegistrationUrl?: string;
  lguBusinessPermitUrl?: string;
  woodProcessingPermitUrl?: string;
  governmentCertificationUrl?: string;

  // Data Privacy Consent
  dataPrivacyConsent: boolean;

  // Application Status and Processing
  initialApplicationStatus?: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  initialApplicationRemarks?: string;
  inspectionResult?: 'PASSED' | 'FAILED' | 'PENDING';
  inspectionRemarks?: string;
  orNumber?: string;
  orDate?: string;
  expiryDate?: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Chainsaws',
    url: '/dashboard/equipments',
    icon: 'chainsaw',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
];
