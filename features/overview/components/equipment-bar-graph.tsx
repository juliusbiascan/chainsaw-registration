'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

interface EquipmentMonthlyData {
  month: string;
  count: number;
}

interface EquipmentBarGraphProps {
  data: EquipmentMonthlyData[];
}

const chartConfig = {
  count: {
    label: 'Equipment Added',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function EquipmentBarGraph({ data }: EquipmentBarGraphProps) {
  const totalEquipment = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className='@container/card'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Equipment Added Over Time</CardTitle>
          <CardDescription>
            Monthly equipment addition trends for the last 6 months
          </CardDescription>
        </div>
        <div className='flex'>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6'>
            <span className='text-xs text-muted-foreground'>This Month</span>
            <span className='text-lg font-bold leading-none sm:text-3xl'>
              {data.length > 0 ? data[data.length - 1]?.count || 0 : 0}
            </span>
          </div>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'>
            <span className='text-xs text-muted-foreground'>Total</span>
            <span className='text-lg font-bold leading-none sm:text-3xl'>
              {totalEquipment}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        {data.length === 0 ? (
          <div className='text-center text-muted-foreground py-8'>
            No equipment data available for the chart
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[250px] w-full'
          >
            <BarChart
              data={data}
              margin={{
                left: 12,
                right: 12
              }}
            >
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
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='count' fill='var(--color-count)' radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Equipment additions trending up{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              {totalEquipment} total equipment added over {data.length} months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
