import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';
import { Equipment } from '@/constants/data';
import { formatFuelType, formatDate } from '@/lib/format';
import { calculateEquipmentStatus } from '@/lib/utils';

// Function to get recent equipment from database
async function getRecentEquipments(): Promise<Equipment[]> {
  try {
    const equipments = await db.equipment.findMany({
      where: {
        initialApplicationStatus: 'ACCEPTED',
        inspectionResult: 'PASSED'
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform database equipment to match the Equipment type
    return equipments.map((equipment) => {
      // Use centralized status calculation
      const status = calculateEquipmentStatus(
        equipment.isNew,
        equipment.dateAcquired,
        equipment.createdAt
      );

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
        ownerIdUrl: equipment.ownerIdUrl || undefined,
        // Equipment Information
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        guidBarLength: equipment.guidBarLength || undefined,
        horsePower: equipment.horsePower || undefined,
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
        registrationApplicationUrl: equipment.registrationApplicationUrl || undefined,
        officialReceiptUrl: equipment.officialReceiptUrl || undefined,
        spaUrl: equipment.spaUrl || undefined,
        stencilSerialNumberPictureUrl: equipment.stencilSerialNumberPictureUrl || undefined,
        chainsawPictureUrl: equipment.chainsawPictureUrl || undefined,
        // Additional Requirements
        forestTenureAgreementUrl: equipment.forestTenureAgreementUrl || undefined,
        businessPermitUrl: equipment.businessPermitUrl || undefined,
        certificateOfRegistrationUrl: equipment.certificateOfRegistrationUrl || undefined,
        lguBusinessPermitUrl: equipment.lguBusinessPermitUrl || undefined,
        woodProcessingPermitUrl: equipment.woodProcessingPermitUrl || undefined,
        governmentCertificationUrl: equipment.governmentCertificationUrl || undefined,
        // Data Privacy Consent
        dataPrivacyConsent: equipment.dataPrivacyConsent
      };
    });
  } catch (error) {
    console.error('Error fetching recent equipment:', error);
    return [];
  }
}

// Function to check if equipment is expiring soon
function isExpiringSoon(dateAcquired: string, isNew: boolean, createdAt: string): boolean {
  const now = new Date();
  let validUntil: Date;

  if (isNew) {
    // For new equipment: use dateAcquired + 2 years
    const acquiredDate = new Date(dateAcquired);
    validUntil = new Date(acquiredDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  } else {
    // For renewal equipment: use createdAt + 2 years
    const createdDate = new Date(createdAt);
    validUntil = new Date(createdDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  }

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  return validUntil <= thirtyDaysFromNow && validUntil > now;
}

// Function to check if equipment is expired
function isExpired(dateAcquired: string, isNew: boolean, createdAt: string): boolean {
  let validUntil: Date;

  if (isNew) {
    // For new equipment: use dateAcquired + 2 years
    const acquiredDate = new Date(dateAcquired);
    validUntil = new Date(acquiredDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  } else {
    // For renewal equipment: use createdAt + 2 years
    const createdDate = new Date(createdAt);
    validUntil = new Date(createdDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  }

  return validUntil < new Date();
}

// Function to get valid until date
function getValidUntilDate(dateAcquired: string, isNew: boolean, createdAt: string): Date {
  if (isNew) {
    // For new equipment: use dateAcquired + 2 years
    const acquiredDate = new Date(dateAcquired);
    return new Date(acquiredDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  } else {
    // For renewal equipment: use createdAt + 2 years
    const createdDate = new Date(createdAt);
    return new Date(createdDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  }
}

// Function to format owner's full name
function formatOwnerName(firstName: string, lastName: string, middleName: string): string {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ');
}

export async function RecentEquipment() {
  const recentEquipments = await getRecentEquipments();

  return (
    <Card className="h-full">
      <CardHeader >
        <CardTitle className="text-lg">Recent Equipment</CardTitle>
        <CardDescription className="text-sm">
          {recentEquipments.length > 0
            ? `${recentEquipments.length} equipment items added recently.`
            : 'No equipment found.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {recentEquipments.map((equipment) => (
            <div
              key={equipment.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs font-semibold">
                  {equipment.model.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">
                    {equipment.brand} {equipment.model}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {equipment.isNew ? (
                      <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 hover:bg-green-100">
                        New
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Renewal
                      </Badge>
                    )}
                    {isExpired(equipment.dateAcquired, equipment.isNew, equipment.createdAt) && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                        Expired
                      </Badge>
                    )}
                    {isExpiringSoon(equipment.dateAcquired, equipment.isNew, equipment.createdAt) && !isExpired(equipment.dateAcquired, equipment.isNew, equipment.createdAt) && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        Expiring
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="truncate">SN: {equipment.serialNumber}</span>
                  <span className="truncate">
                    {formatOwnerName(equipment.ownerFirstName, equipment.ownerLastName, equipment.ownerMiddleName)}
                  </span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    {formatFuelType(equipment.fuelType)}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>Valid: {formatDate(getValidUntilDate(equipment.dateAcquired, equipment.isNew, equipment.createdAt))}</span>
                  <span>Created: {formatDate(equipment.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}

          {recentEquipments.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">No equipment found.</p>
              <p className="text-xs">Add some equipment to see them here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
