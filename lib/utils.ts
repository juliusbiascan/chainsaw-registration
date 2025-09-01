import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizeType === 'accurate'
    ? (accurateSizes[i] ?? 'Bytest')
    : (sizes[i] ?? 'Bytes')
    }`;
}

/**
 * Calculate equipment status based on business rules:
 * - New Equipment + Expired → "inactive" (red badge)
 * - Renewal Equipment + Expired → "renewal" (orange/gray badge)  
 * - Any Equipment + Active → "active" (green badge)
 */
export function calculateEquipmentStatus(
  isNew: boolean,
  dateAcquired: Date | string,
  createdAt: Date | string
): 'active' | 'inactive' | 'renewal' {
  const currentDate = new Date();
  let isExpired = false;

  if (isNew) {
    // For new equipment: use dateAcquired + 2 years
    const dateAcquiredDate = new Date(dateAcquired);
    const twoYearsFromAcquisition = new Date(dateAcquiredDate);
    twoYearsFromAcquisition.setFullYear(dateAcquiredDate.getFullYear() + 2);
    isExpired = currentDate > twoYearsFromAcquisition;
  } else {
    // For renewal equipment: use createdAt + 2 years
    const createdAtDate = new Date(createdAt);
    const twoYearsFromRegistration = new Date(createdAtDate);
    twoYearsFromRegistration.setFullYear(createdAtDate.getFullYear() + 2);
    isExpired = currentDate > twoYearsFromRegistration;
  }

  if (isExpired) {
    return isNew ? 'inactive' : 'renewal';
  } else {
    return 'active';
  }
}

/**
 * Get badge variant for equipment status
 */
export function getStatusBadgeVariant(status: 'active' | 'inactive' | 'renewal'): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'active':
      return 'default'; // Green badge
    case 'renewal':
      return 'secondary'; // Orange/gray badge
    case 'inactive':
      return 'destructive'; // Red badge
    default:
      return 'default';
  }
}

/**
 * Get descriptive status label that clearly indicates renewal status
 */
export function getStatusLabel(status: 'active' | 'inactive' | 'renewal'): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'renewal':
      return 'Needs Renewal';
    case 'inactive':
      return 'Inactive';
    default:
      return 'Unknown';
  }
}

/**
 * Get status description for tooltips or detailed information
 */
export function getStatusDescription(status: 'active' | 'inactive' | 'renewal'): string {
  switch (status) {
    case 'active':
      return 'Equipment is currently valid and active';
    case 'renewal':
      return 'Equipment has expired and requires renewal';
    case 'inactive':
      return 'Equipment has expired and is no longer active';
    default:
      return 'Status unknown';
  }
}

