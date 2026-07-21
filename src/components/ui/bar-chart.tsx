"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type BarSegmentTone = "neutral" | "blue";

export type BarSegment = { value: number; tone: BarSegmentTone };

export type BarChartBar = {
  label: string;
  sublabel?: string;
  segments: BarSegment[];
  variant?: "solid" | "planned" | "placeholder";
  emphasized?: boolean;
  valueLabel?: string;
};

const LIFT = 60;

const SOLID: Record<BarSegmentTone, string> = {
  neutral: "bg-hairline-strong",
  blue: "bg-blue-bold",
};

function plannedStyle(tone: BarSegmentTone): React.CSSProperties {
  const wash = tone === "blue" ? "var(--blue-wash)" : "var(--hairline)";
  const line = tone === "blue" ? "#A9D6F7" : "var(--hairline-strong)";
  const outline = tone === "blue" ? "var(--blue-bold)" : "var(--hairline-strong)";
  return {
    backgroundImage: `repeating-linear-gradient(45deg, ${line} 0 4px, ${wash} 4px 8px)`,
    border: `1.5px dashed ${outline}`,
  };
}

function barTotal(bar: BarChartBar): number {
  return bar.segments.reduce((sum, segment) => sum + segment.value, 0);
}

type Point = { x: number; y: number };

function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function BarChart({
  bars,
  height = 180,
  trend = true,
}: {
  bars: BarChartBar[];
  height?: number;
  trend?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const max = Math.max(1, ...bars.map(barTotal));
  const hasValueLabels = bars.some((bar) => bar.valueLabel);
  const lift = trend ? LIFT : hasValueLabels ? 24 : 0;
  const chartHeight = height + lift;

  const points = bars
    .map((bar, index) =>
      bar.variant === "placeholder"
        ? null
        : {
            x: width * ((index + 0.5) / bars.length),
            y: height - (barTotal(bar) / max) * height,
          },
    )
    .filter((point): point is Point => point !== null);

  const showTrend = trend && width > 0 && points.length > 1;
  const last = points[points.length - 1];

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className="relative flex items-end"
        style={{ height: chartHeight }}
      >
        {showTrend ? (
          <svg
            className="pointer-events-none absolute left-0 top-0 overflow-visible"
            width={width}
            height={chartHeight}
            viewBox={`0 0 ${width} ${chartHeight}`}
            aria-hidden="true"
          >
            <path
              d={smoothPath(points)}
              fill="none"
              stroke="#A9D6F7"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}

        {showTrend && last ? (
          <span
            className="absolute h-3.5 w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-t-[5px] rounded-b-full border-2 border-blue-bold bg-white"
            style={{ left: last.x, top: last.y }}
          />
        ) : null}

        {bars.map((bar, index) => (
          <div key={index} className="flex flex-1 flex-col items-center">
            <div
              className="flex w-10 flex-col-reverse gap-0.5"
              style={{ height }}
            >
              {bar.variant === "placeholder" ? (
                <div
                  className="w-full rounded-full bg-hairline"
                  style={{ height: 3 }}
                />
              ) : (
                bar.segments.map((segment, segmentIndex) => (
                  <div
                    key={segmentIndex}
                    className={cn(
                      "w-full rounded-[5px]",
                      bar.variant !== "planned" && SOLID[segment.tone],
                    )}
                    style={{
                      height: (segment.value / max) * height,
                      ...(bar.variant === "planned"
                        ? plannedStyle(segment.tone)
                        : {}),
                    }}
                  />
                ))
              )}
            </div>
          </div>
        ))}

        {bars.map((bar, index) =>
          bar.valueLabel ? (
            <span
              key={`value-${index}`}
              className="absolute -translate-x-1/2 -translate-y-full text-xs font-bold tabular-nums text-blue-text"
              style={{
                left: `${((index + 0.5) / bars.length) * 100}%`,
                top: lift + (height - (barTotal(bar) / max) * height) - 4,
              }}
            >
              {bar.valueLabel}
            </span>
          ) : null,
        )}
      </div>

      <div className="mt-2 flex">
        {bars.map((bar, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center leading-tight"
          >
            <span
              className={cn(
                "text-xs tabular-nums",
                bar.emphasized ? "font-bold text-blue-text" : "text-faint",
              )}
            >
              {bar.label}
            </span>
            {bar.sublabel ? (
              <span className="text-xs text-faint">{bar.sublabel}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
