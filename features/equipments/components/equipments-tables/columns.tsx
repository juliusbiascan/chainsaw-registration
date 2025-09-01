'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Equipment, FuelType, UseType } from '@/constants/data';
import { DEFAULT_FUEL_TYPES, DEFAULT_USE_TYPES } from './options';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle, Edit, Trash2, Eye, AlertTriangle, Clock } from 'lucide-react';
import { DynamicCategoryFilter } from '@/components/ui/table/dynamic-category-filter';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEquipmentAction } from '@/actions/equipment';
import { AlertModal } from '@/components/modal/alert-modal';
import { formatUseType, formatFuelType, formatDate } from '@/lib/format';
import { getStatusBadgeVariant, getStatusLabel, getStatusDescription } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Inline Actions Component
const InlineActions = ({ equipment }: { equipment: Equipment }) => {
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
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error deleting equipment:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3001'}/equipments/${equipment.id}`, '_blank')}
          className="h-8 w-8 p-0"
          title="View Equipment"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/equipments/${equipment.id}`)}
          className="h-8 w-8 p-0"
          title="Edit Equipment"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="h-8 w-8 p-0"
          title="Delete Equipment"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
};

export const columns: ColumnDef<Equipment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'photo_url',
  //   header: 'IMAGE',
  //   cell: ({ row }) => {
  //     return (
  //       <div className='relative aspect-square'>
  //         <Image
  //           src={row.getValue('photo_url')}
  //           alt={row.getValue('name')}
  //           fill
  //           className='rounded-lg'
  //         />
  //       </div>
  //     );
  //   }
  // },
  {
    id: 'brand',
    accessorKey: 'brand',
    header: ({ column }: { column: Column<Equipment, unknown> }) => (
      <DataTableColumnHeader column={column} title='Brand' />
    ),
    cell: ({ cell }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{cell.getValue<Equipment['brand']>()}</span>
        <span className="text-xs text-muted-foreground/60">↕</span>
      </div>
    ),
    meta: {
      label: 'Brand',
      placeholder: 'Search by brand',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'model',
    accessorKey: 'model',
    header: ({ column }: { column: Column<Equipment, unknown> }) => (
      <DataTableColumnHeader column={column} title='Model' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Equipment['model']>()}</div>,
    meta: {
      label: 'Model',
      placeholder: 'Search by model',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'serialNumber',
    accessorKey: 'serialNumber',
    header: ({ column }: { column: Column<Equipment, unknown> }) => (
      <DataTableColumnHeader column={column} title='Serial Number' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Equipment['serialNumber']>()}</div>,
    meta: {
      label: 'Serial Number',
      placeholder: 'Search by serial number',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'fuelType',
    accessorKey: 'fuelType',
    header: ({ column }: { column: Column<Equipment, unknown> }) => (
      <DataTableColumnHeader column={column} title='Fuel Type' />
    ),
    cell: ({ cell }) => {
      const fuelType = cell.getValue<Equipment['fuelType']>();
      return (
        <Badge variant='outline' className='capitalize'>
          {formatFuelType(fuelType)}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Fuel Type',
      variant: 'multiSelect',
      filterComponent: DynamicCategoryFilter,
      options: DEFAULT_FUEL_TYPES
    }
  },
  {
    id: 'intendedUse',
    accessorKey: 'intendedUse',
    header: ({ column }: { column: Column<Equipment, unknown> }) => (
      <DataTableColumnHeader column={column} title='Intended Use' />
    ),
    cell: ({ cell }) => {
      const useType = cell.getValue<Equipment['intendedUse']>();
      return (
        <Badge variant='outline' className='capitalize'>
          {formatUseType(useType)}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Intended Use',
      variant: 'multiSelect',
      filterComponent: DynamicCategoryFilter,
      options: DEFAULT_USE_TYPES
    }
  },

  // {
  //   id: 'specs',
  //   header: 'Technical Specs',
  //   cell: ({ row }) => {
  //     const equipment = row.original;
  //     return (
  //       <div className="space-y-1">
  //         <div className="text-sm">
  //           <span className="font-medium">Guide Bar:</span> {equipment.guidBarLength}″
  //         </div>
  //         <div className="text-sm">
  //           <span className="font-medium">Power:</span> {equipment.horsePower} HP
  //         </div>
  //       </div>
  //     );
  //   }
  // },
  {
    accessorKey: 'dateAcquired',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date Acquired' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return <div>{formatDate(date)}</div>;
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date Registered' />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return <div>{formatDate(date)}</div>;
    }
  },

  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Validity' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Equipment['status']>();

      const getStatusIcon = () => {
        switch (status) {
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={getStatusBadgeVariant(status)}
                className='capitalize cursor-help flex items-center'
              >
                {getStatusIcon()}
                {getStatusLabel(status)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getStatusDescription(status)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    id: 'initialApplicationStatus',
    accessorKey: 'initialApplicationStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Application Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Equipment['initialApplicationStatus']>();

      const getApplicationStatusIcon = () => {
        switch (status) {
          case 'ACCEPTED':
            return <CheckCircle2 className="w-3 h-3 mr-1" />;
          case 'REJECTED':
            return <XCircle className="w-3 h-3 mr-1" />;
          case 'PENDING':
            return <Clock className="w-3 h-3 mr-1" />;
          default:
            return null;
        }
      };

      const getApplicationStatusVariant = (status: string | null | undefined) => {
        switch (status) {
          case 'ACCEPTED':
            return 'default';
          case 'REJECTED':
            return 'destructive';
          case 'PENDING':
            return 'secondary';
          default:
            return 'secondary';
        }
      };

      const getApplicationStatusLabel = (status: string | null | undefined) => {
        switch (status) {
          case 'ACCEPTED':
            return 'Accepted';
          case 'REJECTED':
            return 'Rejected';
          case 'PENDING':
            return 'Pending';
          default:
            return 'Pending';
        }
      };

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={getApplicationStatusVariant(status)}
                className='capitalize cursor-help flex items-center'
              >
                {getApplicationStatusIcon()}
                {getApplicationStatusLabel(status)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Initial application review status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    id: 'inspectionResult',
    accessorKey: 'inspectionResult',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Inspection Result' />
    ),
    cell: ({ cell }) => {
      const result = cell.getValue<Equipment['inspectionResult']>();

      const getInspectionResultIcon = () => {
        switch (result) {
          case 'PASSED':
            return <CheckCircle2 className="w-3 h-3 mr-1" />;
          case 'FAILED':
            return <XCircle className="w-3 h-3 mr-1" />;
          case 'PENDING':
            return <Clock className="w-3 h-3 mr-1" />;
          default:
            return null;
        }
      };

      const getInspectionResultVariant = (result: string | null | undefined) => {
        switch (result) {
          case 'PASSED':
            return 'default';
          case 'FAILED':
            return 'destructive';
          case 'PENDING':
            return 'secondary';
          default:
            return 'secondary';
        }
      };

      const getInspectionResultLabel = (result: string | null | undefined) => {
        switch (result) {
          case 'PASSED':
            return 'Passed';
          case 'FAILED':
            return 'Failed';
          case 'PENDING':
            return 'Pending';
          default:
            return 'Pending';
        }
      };

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={getInspectionResultVariant(result)}
                className='capitalize cursor-help flex items-center'
              >
                {getInspectionResultIcon()}
                {getInspectionResultLabel(result)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Physical inspection result</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <InlineActions equipment={row.original} />,
    enableSorting: false,
    enableHiding: false,
  }
]
