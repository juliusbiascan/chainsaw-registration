import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp, IconAlertTriangle } from '@tabler/icons-react';
import React from 'react';
import { getEquipmentStats } from '@/data/equipment-stats';

export default async function OverViewLayout({
  recent,
  pie_stats,
  bar_stats,
  area_stats
}: {
  recent: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  // Fetch equipment statistics
  const stats = await getEquipmentStats();

  // Format the monthly growth rate
  const formattedGrowthRate = stats.monthlyGrowthRate > 0
    ? `+${stats.monthlyGrowthRate.toFixed(1)}%`
    : `${stats.monthlyGrowthRate.toFixed(1)}%`;

  // Calculate active equipment (not expired based on 2 year validity)
  // For new equipment: use dateAcquired + 2 years
  // For renewals: use createdAt + 2 years
  const activeEquipments = stats.totalEquipments - stats.expiredEquipments;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            DENR Chainsaw Registry Dashboard 🪚
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Chainsaws</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.totalEquipments.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  {stats.equipmentsThisMonth} this month
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Registered chainsaws <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Total registered chainsaws
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>New Registrations</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.equipmentsThisMonth}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  {stats.monthlyGrowthRate >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                  {formattedGrowthRate}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {stats.monthlyGrowthRate >= 0 ? 'Growing' : 'Declining'} vs last month{' '}
                {stats.monthlyGrowthRate >= 0 ? <IconTrendingUp className='size-4' /> : <IconTrendingDown className='size-4' />}
              </div>
              <div className='text-muted-foreground'>
                Chainsaws registered this month
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Valid Registrations</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {activeEquipments.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  {((activeEquipments / stats.totalEquipments) * 100).toFixed(1)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Chainsaws with valid permits <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Non-expired registrations (new: 2y from acquisition, renewal: 2y from registration)
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Expiring Soon</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.expiringInNext30Days}
              </CardTitle>
              <CardAction>
                <Badge variant={stats.expiringInNext30Days > 0 ? 'destructive' : 'outline'}>
                  {stats.expiringInNext30Days > 0 ? <IconAlertTriangle /> : <IconTrendingUp />}
                  {stats.expiredEquipments} expired
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {stats.expiringInNext30Days > 0 ? 'Renewals needed' : 'All permits valid'}{' '}
                {stats.expiringInNext30Days > 0 ? <IconAlertTriangle className='size-4' /> : <IconTrendingUp className='size-4' />}
              </div>
              <div className='text-muted-foreground'>
                Permits expiring in next 30 days (new: 2y from acquisition, renewal: 2y from registration)
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* sales arallel routes */}
            {recent}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
