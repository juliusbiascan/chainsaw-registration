// 'use server';

// import { db } from "@/lib/db";

// export async function getCategories() {
//   try {
//     const equipments = await db.equipment.findMany({
//       select: {
//         category: true
//       },
//       distinct: ['category']
//     });

//     return equipments.map(equipment => ({
//       value: equipment.category,
//       label: equipment.category
//     }));
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return [];
//   }
// }

'use client';

import { useState, useEffect } from 'react';

// Default categories in case of empty database or error
export const DEFAULT_FUEL_TYPES = [
  { value: 'GAS', label: 'Gas' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'OTHER', label: 'Other' }
];

export const DEFAULT_USE_TYPES = [
  { value: 'WOOD_PROCESSING', label: 'Wood Processing' },
  { value: 'TREE_CUTTING_PRIVATE_PLANTATION', label: 'Tree Cutting inside a Private Tree Plantation' },
  { value: 'GOVT_LEGAL_PURPOSES', label: 'Gov\'t./ GOCC - for legal purposes' },
  { value: 'OFFICIAL_TREE_CUTTING_BARANGAY', label: 'Official Tree Cutting within the Barangay' },
  { value: 'OTHER', label: 'Other' }
];

// For SSR contexts
export const FUEL_TYPE_OPTIONS = DEFAULT_FUEL_TYPES;
export const USE_TYPE_OPTIONS = DEFAULT_USE_TYPES;
