'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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

interface EquipmentCategoryData {
  category: string;
  count: number;
  fill: string;
}

interface EquipmentPieGraphProps {
  data: EquipmentCategoryData[];
}

const generateChartConfig = (data: EquipmentCategoryData[]): ChartConfig => {
  const config: ChartConfig = {
    count: {
      label: 'Equipment Count'
    }
  };

  data.forEach((item) => {
    config[item.category.toLowerCase().replace(/\s+/g, '')] = {
      label: item.category,
      color: item.fill
    };
  });

  return config;
};

export function EquipmentPieGraph({ data }: EquipmentPieGraphProps) {
  const totalEquipment = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  const chartConfig = generateChartConfig(data);

  const topCategory = data.reduce(
    (max, item) => (item.count > max.count ? item : max),
    data[0] || { category: '', count: 0 }
  );

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Intended Usage Distribution</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Distribution of chainsaws by intended use
          </span>
          <span className='@[540px]/card:hidden'>Chainsaw purposes</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {data.length === 0 ? (
          <div className='text-center text-muted-foreground py-8'>
            No equipment category data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square h-[250px]'
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey='count'
                nameKey='category'
                innerRadius={60}
                strokeWidth={2}
                stroke='var(--background)'
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='fill-foreground text-3xl font-bold'
                          >
                            {totalEquipment.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground'
                          >
                            Equipment
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {data.length > 0 && (
          <>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {topCategory.category} leads with{' '}
              {totalEquipment > 0
                ? ((topCategory.count / totalEquipment) * 100).toFixed(1)
                : 0}
              %{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground leading-none'>
              Total of {totalEquipment} equipment across {data.length} categories
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
