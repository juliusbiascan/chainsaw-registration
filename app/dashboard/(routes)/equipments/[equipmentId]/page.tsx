import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import EquipmentViewPage from '@/features/equipments/components/equipment-view-page';

export const metadata = {
  title: 'Dashboard : Equipment'
};

type PageProps = { params: Promise<{ equipmentId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <EquipmentViewPage equipmentId={params.equipmentId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
