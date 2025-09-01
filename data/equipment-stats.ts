"use server";

import { db } from "@/lib/db";

export const getEquipmentStats = async () => {
  try {
    // Get total count of equipments with Accepted Application Status and Passed Inspection Result
    const totalEquipments = await db.equipment.count({
      where: {
        initialApplicationStatus: 'ACCEPTED',
        inspectionResult: 'PASSED'
      }
    });

    // Get equipment count by intended use (only Accepted and Passed)
    const equipmentsByUseType = await db.equipment.groupBy({
      by: ['intendedUse'],
      where: {
        initialApplicationStatus: 'ACCEPTED',
        inspectionResult: 'PASSED'
      },
      _count: {
        id: true,
      },
    });

    // Get equipments created this month (only Accepted and Passed)
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const equipmentsThisMonth = await db.equipment.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
        initialApplicationStatus: 'ACCEPTED',
        inspectionResult: 'PASSED'
      },
    });

    // Get last month's count for comparison (only Accepted and Passed)
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const equipmentsLastMonth = await db.equipment.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
        initialApplicationStatus: 'ACCEPTED',
        inspectionResult: 'PASSED'
      },
    });

    // Calculate growth rate
    const monthlyGrowthRate = equipmentsLastMonth > 0
      ? ((equipmentsThisMonth - equipmentsLastMonth) / equipmentsLastMonth) * 100
      : 100;

    // Get expired/expiring equipment counts based on 2-year validity
    // For new equipment: use dateAcquired + 2 years
    // For renewals: use createdAt + 2 years
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);

    // Count expired equipment (only Accepted and Passed)
    const expiredEquipments = await db.equipment.count({
      where: {
        AND: [
          {
            initialApplicationStatus: 'ACCEPTED',
            inspectionResult: 'PASSED'
          },
          {
            OR: [
              // New equipment: expired if dateAcquired is more than 2 years ago
              {
                isNew: true,
                dateAcquired: {
                  lt: twoYearsAgo,
                },
              },
              // Renewal equipment: expired if createdAt is more than 2 years ago
              {
                isNew: false,
                createdAt: {
                  lt: twoYearsAgo,
                },
              },
            ],
          }
        ]
      },
    });

    // Equipment expiring in next 30 days (only Accepted and Passed)
    const almostTwoYearsAgo = new Date(now.getTime() - (2 * 365 - 30) * 24 * 60 * 60 * 1000);
    const expiringInNext30Days = await db.equipment.count({
      where: {
        AND: [
          {
            initialApplicationStatus: 'ACCEPTED',
            inspectionResult: 'PASSED'
          },
          {
            OR: [
              // New equipment: expiring if dateAcquired is between 2 years and 1 year 11 months ago
              {
                isNew: true,
                dateAcquired: {
                  gte: twoYearsAgo,
                  lte: almostTwoYearsAgo,
                },
              },
              // Renewal equipment: expiring if createdAt is between 2 years and 1 year 11 months ago
              {
                isNew: false,
                createdAt: {
                  gte: twoYearsAgo,
                  lte: almostTwoYearsAgo,
                },
              },
            ],
          }
        ]
      },
    });

    // Get equipment by creation date for charts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const equipmentsByMonth = await db.equipment.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        initialApplicationStatus: 'ACCEPTED',
        inspectionResult: 'PASSED'
      },
      select: {
        createdAt: true,
        fuelType: true,
      },
    });

    // Group by month
    const monthlyData = equipmentsByMonth.reduce((acc: Record<string, number>, equipment: { createdAt: Date; fuelType: string }) => {
      const month = equipment.createdAt.toISOString().substring(0, 7); // YYYY-MM format
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEquipments,
      equipmentsThisMonth,
      equipmentsLastMonth,
      monthlyGrowthRate,
      expiredEquipments,
      expiringInNext30Days,
      equipmentsByType: equipmentsByUseType.map((item: { intendedUse: string; _count: { id: number } }) => ({
        type: item.intendedUse,
        count: item._count.id,
      })),
      monthlyData,
    };
  } catch (error) {
    console.error('Error fetching equipment stats:', error);
    return {
      totalEquipments: 0,
      equipmentsThisMonth: 0,
      equipmentsLastMonth: 0,
      monthlyGrowthRate: 0,
      expiredEquipments: 0,
      expiringInNext30Days: 0,
      equipmentsByType: [],
      monthlyData: {},
    };
  }
};

export const getEquipmentUseTypeData = async () => {
  try {
    const equipments = await db.equipment.findMany({
      where: {
        initialApplicationStatus: 'ACCEPTED',
        inspectionResult: 'PASSED'
      },
      select: {
        intendedUse: true,
      },
    });

    // Count equipment by intended use
    const useTypeCount: Record<string, number> = {};
    equipments.forEach((equipment: { intendedUse: string }) => {
      const useType = equipment.intendedUse;
      useTypeCount[useType] = (useTypeCount[useType] || 0) + 1;
    });

    // Friendly names for the use types
    const useTypeNames: Record<string, string> = {
      WOOD_PROCESSING: 'Wood Processing',
      TREE_CUTTING: 'Tree Cutting',
      LEGAL_PURPOSES: 'Legal Purposes',
      OFFICIAL_TREE_CUTTING: 'Official Tree Cutting',
      OTHER: 'Other Uses'
    };

    // Convert to chart data format with distinct colors for each purpose
    const colors = [
      'hsl(220, 70%, 50%)',   // Blue
      'hsl(120, 70%, 45%)',   // Green
      'hsl(30, 90%, 55%)',    // Orange
      'hsl(280, 70%, 60%)',   // Purple
      'hsl(0, 70%, 55%)',     // Red
      'hsl(180, 70%, 45%)',   // Teal
      'hsl(60, 80%, 55%)',    // Yellow
      'hsl(340, 70%, 55%)'    // Pink
    ];

    const data = Object.entries(useTypeCount).map(
      ([useType, count], index) => ({
        category: useTypeNames[useType] || useType, // Use friendly names
        count,
        fill: colors[index % colors.length]
      })
    );

    return data;
  } catch (error) {
    console.error('Error fetching equipment use type data:', error);
    return [];
  }
};
