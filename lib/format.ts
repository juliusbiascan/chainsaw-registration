import { UseType, FuelType } from '@/constants/data';

export function formatUseType(useType: UseType): string {
  switch (useType) {
    case 'WOOD_PROCESSING':
      return 'Wood Processing';
    case 'TREE_CUTTING_PRIVATE_PLANTATION':
      return 'Tree Cutting (Private Plantation)';
    case 'GOVT_LEGAL_PURPOSES':
      return 'Gov\'t Legal Purposes';
    case 'OFFICIAL_TREE_CUTTING_BARANGAY':
      return 'Official Tree Cutting (Barangay)';
    case 'OTHER':
      return 'Other';
    default:
      return String(useType).replace(/_/g, ' ').toLowerCase();
  }
}

export function formatFuelType(fuelType: FuelType): string {
  switch (fuelType) {
    case 'GAS':
      return 'Gas';
    case 'DIESEL':
      return 'Diesel';
    case 'ELECTRIC':
      return 'Electric';
    case 'OTHER':
      return 'Other';
    default:
      return String(fuelType).toLowerCase();
  }
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
