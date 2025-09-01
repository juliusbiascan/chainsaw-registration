'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { QRPrintUtils } from '@/components/qr-print-utils';
import { ExcelUtils } from '@/components/excel-utils';
import { BulkDeleteUtils } from '@/components/bulk-delete-utils';
import { Equipment } from '@/constants/data';
import { EquipmentCard } from '../equipment-card';
import { EquipmentMobileSkeleton } from '../equipment-mobile-skeleton';
import { ExpandableOwnerInfo } from './expandable-owner-info';

import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Folder } from 'lucide-react';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface EquipmentTableParams {
  data: Equipment[];
  totalItems: number;
  columns: ColumnDef<Equipment, any>[];
  isLoading?: boolean;
}

export function EquipmentTable({
  data,
  totalItems,
  columns,
  isLoading = false
}: EquipmentTableParams) {
  const router = useRouter();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  console.log('Table data:', data);
  console.log('Columns:', columns);
  console.log('Total items:', totalItems);

  const { table } = useDataTable({
    data, // equipments data
    columns, // equipments columns
    pageCount: pageCount,
    shallow: false, //Setting to false triggers a network request with the updated querystring.
    debounceMs: 500,
    enableRowSelection: true,
    initialState: {
      rowSelection: {}
    }
  });

  const selectedEquipments = table.getFilteredSelectedRowModel().rows.map(row => row.original);

  return (
    <div className="w-full space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block flex-1 w-full min-h-[400px]">
        <DataTable
          table={table}
          actionBar={
            <div className="flex gap-2 items-center">
              <QRPrintUtils
                equipments={data}
                selectedEquipments={selectedEquipments}
              />
              <ExcelUtils
                equipments={data}
                selectedEquipments={selectedEquipments}
              />
              <BulkDeleteUtils
                selectedEquipments={selectedEquipments}
              />
            </div>
          }
          expandableContent={(equipment: Equipment) => (
            <ExpandableOwnerInfo equipment={equipment} />
          )}
        >
          <DataTableToolbar table={table}>
            <div className="flex gap-2 items-center">
              <QRPrintUtils
                equipments={data}
                selectedEquipments={selectedEquipments}
              />
              <ExcelUtils
                equipments={data}
                selectedEquipments={selectedEquipments}
              />
              <BulkDeleteUtils
                selectedEquipments={selectedEquipments}
              />
            </div>
          </DataTableToolbar>
        </DataTable>
      </div>

      {/* Mobile View */}
      {isLoading ? (
        <EquipmentMobileSkeleton cardCount={8} />
      ) : (
        <div className="md:hidden">
          {/* Sticky Toolbar */}
          <div className="sticky top-0 z-10 bg-background pb-4">
            <DataTableToolbar table={table}>
              <div className="flex gap-2 items-center">
                <QRPrintUtils
                  equipments={data}
                  selectedEquipments={selectedEquipments}
                />
                <ExcelUtils
                  equipments={data}
                  selectedEquipments={selectedEquipments}
                />
                <BulkDeleteUtils
                  selectedEquipments={selectedEquipments}
                />
              </div>
            </DataTableToolbar>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-4 pb-20">
            {table.getRowModel().rows.map((row) => (
              <EquipmentCard
                key={row.id}
                equipment={row.original}
                isSelected={row.getIsSelected()}
                onSelectionChange={(checked: boolean) => row.toggleSelected(!!checked)}
              />
            ))}
            {table.getRowModel().rows.length === 0 && (
              <EmptyPlaceholder
                icon={<Folder className="h-12 w-12 text-muted-foreground" />}
                title="No equipments yet"
                description="Register your first equipment to get started."
              >
                <Button onClick={() => router.push('/dashboard/equipments/new')}>
                  Add Equipment
                </Button>
              </EmptyPlaceholder>
            )}

            {/* Mobile Pagination */}
            <div className="flex items-center justify-between px-2">
              <button
                className="p-2 text-sm text-muted-foreground disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
              <button
                className="p-2 text-sm text-muted-foreground disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          {selectedEquipments.length > 0 && (
            <div className="fixed bottom-4 left-4 right-4 p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg">
              <div className="flex gap-2 items-center justify-center">
                <QRPrintUtils
                  equipments={data}
                  selectedEquipments={selectedEquipments}
                />
                <ExcelUtils
                  equipments={data}
                  selectedEquipments={selectedEquipments}
                />
                <BulkDeleteUtils
                  selectedEquipments={selectedEquipments}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
