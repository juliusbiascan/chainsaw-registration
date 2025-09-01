'use client';
import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import * as React from 'react';

import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  expandableContent?: (row: TData) => React.ReactNode;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  expandableContent
}: DataTableProps<TData>) {
  const router = useRouter();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      {children}
      <div className='relative flex-1'>
        <div className='rounded-lg border'>
          <ScrollArea className='h-full w-full'>
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {expandableContent && (
                      <TableHead className="w-12">
                        <span className="sr-only">Expand</span>
                      </TableHead>
                    )}
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getCommonPinningStyles({ column: header.column })
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
                {expandableContent && (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length + 1}
                      className="text-xs text-muted-foreground text-center py-2 border-t"
                    >
                      💡 Click the arrow (↕) next to any row to view owner information
                    </TableCell>
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const isExpanded = expandedRows.has(row.id);
                    return (
                      <React.Fragment key={row.id}>
                        <TableRow
                          data-state={row.getIsSelected() && 'selected'}
                          className="hover:bg-muted/50"
                        >
                          {expandableContent && (
                            <TableCell className="w-12">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(row.id)}
                                className="h-6 w-6 p-0"
                              >
                                {isExpanded ? (
                                  <ChevronDownIcon className="h-4 w-4" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {isExpanded ? 'Collapse' : 'Expand'} row
                                </span>
                              </Button>
                            </TableCell>
                          )}
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles({ column: cell.column })
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        {isExpanded && expandableContent && (
                          <TableRow>
                            <TableCell
                              colSpan={row.getVisibleCells().length + 1}
                              className="p-0"
                            >
                              <div className="p-4 bg-muted/20 border-t">
                                {expandableContent(row.original)}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length + (expandableContent ? 1 : 0)}
                      className='h-24 text-center'
                    >
                      <EmptyPlaceholder
                        icon={<Folder className="h-12 w-12 text-muted-foreground" />}
                        title="No equipments yet"
                        description="Register your first equipment to get started."
                      >
                        <Button onClick={() => router.push('/dashboard/equipments/new')}>
                          Add Equipment
                        </Button>
                      </EmptyPlaceholder>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
