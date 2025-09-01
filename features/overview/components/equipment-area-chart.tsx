'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface EquipmentValidityData {
  month: string;
  expiring: number;
  valid: number;
}

interface EquipmentAreaChartProps {
  data: EquipmentValidityData[];
}

const chartConfig = {
  valid: {
    label: 'Valid Chainsaws',
    color: 'var(--primary)'
  },
  expiring: {
    label: 'Expiring Registrations',
    color: 'var(--primary-foreground)'
  }
} satisfies ChartConfig;

export function EquipmentAreaChart({ data }: EquipmentAreaChartProps) {
  const totalEquipment = data.reduce((acc, curr) => acc + curr.valid + curr.expiring, 0);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Chainsaw Registration Status</CardTitle>
        <CardDescription>
          Registration validity trends over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {data.length === 0 ? (
          <div className='text-center text-muted-foreground py-8'>
            No equipment validity data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[250px] w-full'
          >
            <AreaChart
              data={data}
              margin={{
                left: 12,
                right: 12
              }}
            >
              <defs>
                <linearGradient id='fillValid' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-valid)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-valid)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillExpiring' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-expiring)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-expiring)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='dot' />}
              />
              <Area
                dataKey='expiring'
                type='natural'
                fill='url(#fillExpiring)'
                stroke='var(--color-expiring)'
                stackId='a'
              />
              <Area
                dataKey='valid'
                type='natural'
                fill='url(#fillValid)'
                stroke='var(--color-valid)'
                stackId='a'
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Monitoring equipment validity trends{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Tracking {data.length} months of validity data
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
