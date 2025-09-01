'use client';

import { EquipmentTable } from './equipments-tables';
import { Equipment } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface EquipmentListingWrapperProps {
  initialData: Equipment[];
  totalItems: number;
  columns: ColumnDef<Equipment, any>[];
}

export default function EquipmentListingWrapper({
  initialData,
  totalItems,
  columns
}: EquipmentListingWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialData);

  // This effect will handle any future loading states
  // For now, we'll use the initial data
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <EquipmentTable
      data={data}
      totalItems={totalItems}
      columns={columns}
      isLoading={isLoading}
    />
  );
}
