import { Equipment } from '@/constants/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, XCircle, QrCode, Edit, Trash2, User, MapPin, Phone, Mail, FileText, Clock, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertModal } from '@/components/modal/alert-modal';
import { deleteEquipmentAction } from '@/actions/equipment';
import { Separator } from '@/components/ui/separator';
import { formatUseType, formatFuelType, formatDate } from '@/lib/format';
import { getStatusBadgeVariant, getStatusLabel, getStatusDescription } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EquipmentCardProps {
  equipment: Equipment;
  isSelected: boolean;
  onSelectionChange: (checked: boolean) => void;
}

export function EquipmentCard({ equipment, isSelected, onSelectionChange }: EquipmentCardProps) {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteEquipmentAction(equipment.id);

      if (result.success) {
        router.refresh();
        router.push('/dashboard/equipments');
      } else {
        console.error('Error deleting equipment:', result.error);
      }
    } catch (error) {
      console.error('Error deleting equipment:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusIcon = () => {
    switch (equipment.status) {
      case 'active':
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case 'renewal':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'inactive':
        return <XCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelectionChange}
              aria-label="Select equipment"
            />
            <h3 className="font-medium">{`${equipment.brand} ${equipment.model}`}</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={getStatusBadgeVariant(equipment.status)}
                  className='capitalize cursor-help flex items-center'
                >
                  {getStatusIcon()}
                  {getStatusLabel(equipment.status)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getStatusDescription(equipment.status)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {/* Owner Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Owner Information
                  </h4>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">Full Name</label>
                    <p className="mt-1 dark:text-gray-300 font-medium">
                      {equipment.ownerFirstName} {equipment.ownerMiddleName} {equipment.ownerLastName}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Address
                    </label>
                    <p className="mt-1 dark:text-gray-300 bg-muted/30 p-2 rounded-md">
                      {equipment.ownerAddress}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {equipment.ownerContactNumber && (
                      <div>
                        <label className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Contact Number
                        </label>
                        <p className="mt-1 dark:text-gray-300">{equipment.ownerContactNumber}</p>
                      </div>
                    )}

                    {equipment.ownerEmail && (
                      <div>
                        <label className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email Address
                        </label>
                        <p className="mt-1 dark:text-gray-300">{equipment.ownerEmail}</p>
                      </div>
                    )}
                  </div>

                  {equipment.ownerPreferContactMethod && (
                    <div>
                      <label className="text-sm text-muted-foreground dark:text-gray-400">Preferred Contact Method</label>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {equipment.ownerPreferContactMethod}
                      </Badge>
                    </div>
                  )}

                  {equipment.ownerIdUrl && (
                    <div>
                      <label className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        ID Document
                      </label>
                      <a
                        href={equipment.ownerIdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 block"
                      >
                        View ID Document
                      </a>
                    </div>
                  )}

                  {/* Document Requirements */}
                  {(equipment.registrationApplicationUrl || equipment.officialReceiptUrl || equipment.spaUrl || equipment.stencilSerialNumberPictureUrl || equipment.chainsawPictureUrl) && (
                    <div>
                      <label className="text-sm text-muted-foreground dark:text-gray-400">Document Requirements</label>
                      <div className="mt-1 space-y-1">
                        {equipment.registrationApplicationUrl && (
                          <a href={equipment.registrationApplicationUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block">
                            • Registration Application
                          </a>
                        )}
                        {equipment.officialReceiptUrl && (
                          <a href={equipment.officialReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block">
                            • Official Receipt
                          </a>
                        )}
                        {equipment.spaUrl && (
                          <a href={equipment.spaUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block">
                            • SPA Document
                          </a>
                        )}
                        {equipment.stencilSerialNumberPictureUrl && (
                          <a href={equipment.stencilSerialNumberPictureUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block">
                            • Stencil Serial Number Picture
                          </a>
                        )}
                        {equipment.chainsawPictureUrl && (
                          <a href={equipment.chainsawPictureUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block">
                            • Chainsaw Picture
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Equipment Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Equipment Information</h4>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">Intended Use</label>
                    <Badge variant='outline' className='capitalize ml-2 dark:border-gray-600 dark:text-gray-300'>
                      {equipment.isNew ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                      {formatUseType(equipment.intendedUse)}
                    </Badge>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">Serial Number</label>
                    <p className="mt-1 dark:text-gray-300">{equipment.serialNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">Date Acquired</label>
                    <p className="mt-1 dark:text-gray-300">
                      {formatDate(equipment.dateAcquired)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">Specifications</label>
                    <p className="mt-1 dark:text-gray-300">
                      Guid Bar Length: {equipment.guidBarLength}mm<br />
                      Horse Power: {equipment.horsePower}hp<br />
                      Fuel Type: {formatFuelType(equipment.fuelType)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">Additional Info</label>
                    <p className="mt-1 dark:text-gray-300">{equipment.otherInfo}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground dark:text-gray-400">Last Updated</label>
                    <p className="mt-1 dark:text-gray-300">
                      {formatDate(equipment.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3001'}/equipments/${equipment.id}`, '_blank')}
                    className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    title="View Equipment"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Show
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/equipments/${equipment.id}`)}
                    className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <AlertModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
