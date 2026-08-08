"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrailSegment } from "@/lib/data/types";
import { buildElevationProfileByDay } from "@/lib/elevation";
import { colorForDayIndex } from "@/lib/itinerary";

export function ElevationChart({
  segments,
  title,
}: {
  segments: TrailSegment[];
  title?: string;
}) {
  const series = buildElevationProfileByDay(segments).map((s, index) => ({
    ...s,
    color: colorForDayIndex(index),
    key: `elev${index}`,
  }));
  if (series.length === 0) return null;

  // One shared dataset with one dataKey per day (rather than a separate `data`
  // array per <Area>) -- each row only carries the value for the day it
  // belongs to, which is the reliable way to render multiple differently
  // colored series sharing one set of axes in recharts.
  const chartData = series
    .flatMap((s) => s.points.map((p) => ({ distanceMiles: p.distanceMiles, [s.key]: p.elevationFt })))
    .sort((a, b) => a.distanceMiles - b.distanceMiles);

  return (
    <div>
      {title && (
        <p className="mb-1 text-xs font-medium text-zinc-500">Elevation profile — {title}</p>
      )}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800"
            />
            <XAxis
              dataKey="distanceMiles"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(v: number) => v.toFixed(1)}
              tick={{ fontSize: 11 }}
              label={{
                value: "Distance (miles)",
                position: "insideBottomRight",
                offset: -4,
                fontSize: 11,
              }}
            />
            <YAxis
              tickFormatter={(v: number) => `${Math.round(v)}`}
              tick={{ fontSize: 11 }}
              width={48}
              label={{ value: "ft", angle: -90, position: "insideLeft", fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => [`${Math.round(Number(value))} ft`, "Elevation"]}
              labelFormatter={(label) => `${Number(label).toFixed(1)} mi`}
            />
            {series.length > 1 &&
              series.map((s) => (
                <ReferenceLine
                  key={s.key}
                  x={s.points[0].distanceMiles}
                  stroke={s.color}
                  strokeDasharray="4 2"
                  label={{
                    value: s.dayNumber != null ? `Day ${s.dayNumber}` : "",
                    position: "top",
                    fontSize: 10,
                    fill: s.color,
                  }}
                />
              ))}
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                fill={s.color}
                fillOpacity={0.15}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
