import { db } from '@/lib/db';
import { EquipmentBarGraph } from './equipment-bar-graph';

interface EquipmentMonthlyData {
  month: string;
  count: number;
}

// Server component to fetch equipment addition data
export async function EquipmentBarGraphContainer() {
  try {
    // Get equipment data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const equipments = await db.equipment.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        initialApplicationStatus: 'ACCEPTED',
        inspectionResult: 'PASSED'
      },
      select: {
        createdAt: true,
      },
    }) as { createdAt: Date }[];

    // Generate monthly data
    const monthlyData: EquipmentMonthlyData[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });

      // Calculate equipment added in this month
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = equipments.filter((eq: { createdAt: Date }) =>
        eq.createdAt >= monthStart && eq.createdAt <= monthEnd
      ).length;

      monthlyData.push({
        month: monthName,
        count,
      });
    }

    return <EquipmentBarGraph data={monthlyData} />;
  } catch (error) {
    console.error('Error fetching equipment addition data:', error);
    return <EquipmentBarGraph data={[]} />;
  }
}
