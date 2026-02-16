'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

/* --------------------------------- types --------------------------------- */

type TooltipItem = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
};

type TooltipContentProps = {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
  formatter?: (
    value: any,
    name: any,
    item: any,
    index: number,
    payload: any
  ) => React.ReactNode;
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode;
};

type LegendItem = {
  value?: string;
  dataKey?: string;
  color?: string;
};

type LegendContentProps = {
  payload?: LegendItem[];
  verticalAlign?: 'top' | 'bottom';
};

/* --------------------------------- config -------------------------------- */

const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within <ChartContainer />');
  }
  return context;
}

/* ------------------------------ ChartContainer ----------------------------- */

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'Chart';

/* -------------------------------- ChartStyle ------------------------------- */

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const entries = Object.entries(config).filter(
    ([_, v]) => v.color || v.theme
  );
  if (!entries.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart="${id}"] {
${entries
  .map(([key, item]) => {
    const color =
      item.theme?.[theme as keyof typeof THEMES] || item.color;
    return color ? `  --color-${key}: ${color};` : '';
  })
  .join('\n')}
}`
          )
          .join('\n'),
      }}
    />
  );
};

/* -------------------------------- Tooltip -------------------------------- */

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps & {
    className?: string;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'dot' | 'line' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  }
>(
  (
    {
      active,
      payload,
      label,
      className,
      hideLabel,
      hideIndicator,
      indicator = 'dot',
      nameKey,
      labelKey,
      formatter,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    const item = payload[0];
    const key = `${labelKey || item.dataKey || item.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className
        )}
      >
        {!hideLabel && (
          <div className="font-medium">
            {itemConfig?.label || label}
          </div>
        )}

        <div className="grid gap-1.5 mt-1">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(
              config,
              item,
              key
            );

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-muted-foreground">
                  {itemConfig?.label || item.name}
                </span>
                {item.value != null && (
                  <span className="font-mono tabular-nums">
                    {item.value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltip';

/* -------------------------------- Legend --------------------------------- */

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  LegendContentProps & {
    className?: string;
    hideIcon?: boolean;
    nameKey?: string;
  }
>(({ payload, className, verticalAlign = 'bottom', hideIcon }, ref) => {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {payload.map((item, index) => {
        const key = `${item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div key={index} className="flex items-center gap-1.5">
            {!hideIcon ? (
              <div
                className="h-2 w-2 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            ) : null}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegend';

/* -------------------------------- helpers -------------------------------- */

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (!payload || typeof payload !== 'object') return undefined;

  const p = payload as Record<string, any>;

  if (typeof p[key] === 'string' && config[p[key]]) {
    return config[p[key]];
  }

  if (p.payload && typeof p.payload === 'object') {
    const nested = p.payload[key];
    if (typeof nested === 'string' && config[nested]) {
      return config[nested];
    }
  }

  return config[key];
}

/* -------------------------------- exports -------------------------------- */

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
