import { notFound } from 'next/navigation';

import { getEquipmentById } from '@/data/equipment';
import EquipmentForm from './equipment-form';

type TEquipmentViewPage = {
  equipmentId: string;
};

export default async function EquipmentViewPage({
  equipmentId
}: TEquipmentViewPage) {
  let equipment = null;
  let pageTitle = 'Register Equipment';

  if (equipmentId !== 'new') {
    const data = await getEquipmentById(equipmentId);
    if (data.success && data.equipment) {
      equipment = data.equipment;
      pageTitle = `Update Chainsaw Registration`;
    } else {
      notFound();
    }
  }

  return <EquipmentForm initialData={equipment} pageTitle={pageTitle} />;
}
