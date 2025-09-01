import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import EquipmentListingPage from '@/features/equipments/components/equipment-listing';
import { EquipmentMobileSkeleton } from '@/features/equipments/components/equipment-mobile-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Equipment'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={true}>
      <div className='flex-1 flex flex-col space-y-4 h-full'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Chainsaws'
            description='Manage equipments (Server side table functionalities.)'
          />
          <Link
            href='/dashboard/equipments/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Register
          </Link>
        </div>
        <Separator />
        <Suspense
          key={key}
          fallback={
            <div className="w-full space-y-4">
              {/* Desktop View Skeleton */}
              <div className="hidden md:block flex-1 w-full min-h-[400px]">
                <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
              </div>
              {/* Mobile View Skeleton */}
              <EquipmentMobileSkeleton cardCount={8} />
            </div>
          }
        >
          <EquipmentListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
