'use client';

import { Column } from '@tanstack/react-table';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DynamicCategoryFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DynamicCategoryFilter<TData, TValue>({
  column,
  title
}: DynamicCategoryFilterProps<TData, TValue>) {
  const options = column?.columnDef?.meta?.options || [];

  return (
    <DataTableFacetedFilter
      column={column}
      title={title}
      options={options}
    />
  );
}
