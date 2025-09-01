import { EquipmentPieGraph } from '@/features/overview/components/equipment-pie-graph';
import { getEquipmentUseTypeData } from '@/data/equipment-stats';

export default async function Stats() {
  const data = await getEquipmentUseTypeData();

  return <EquipmentPieGraph data={data} />;
}
