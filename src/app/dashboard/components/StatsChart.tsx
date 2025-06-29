"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface ChartData {
  course_name: string;
  total_minutes: number;
}

interface StatsChartProps {
  data: ChartData[];
}

export default function StatsChart({ data }: StatsChartProps) {
  const { resolvedTheme } = useTheme();

  const tickColor = resolvedTheme === "dark" ? "#d1d5db" : "#374151";
  const strokeColor = resolvedTheme === "dark" ? "#4b5563" : "#e5e7eb";
  const tooltipBackgroundColor =
    resolvedTheme === "dark" ? "#1f2937" : "#ffffff";
  const tooltipBorderColor = resolvedTheme === "dark" ? "#374151" : "#ccc";

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ders İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">
              Grafiği görmek için önce biraz ders çalışın!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ders İstatistikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} />
              <XAxis
                dataKey="course_name"
                tick={{ fill: tickColor }}
                tickLine={{ stroke: tickColor }}
              />
              <YAxis
                tick={{ fill: tickColor }}
                tickLine={{ stroke: tickColor }}
              />
              <Tooltip
                cursor={{ fill: "rgba(100, 116, 139, 0.3)" }}
                contentStyle={{
                  backgroundColor: tooltipBackgroundColor,
                  border: `1px solid ${tooltipBorderColor}`,
                  borderRadius: "0.5rem",
                  color: tickColor,
                }}
              />
              <Legend wrapperStyle={{ color: tickColor }} />
              <Bar
                dataKey="total_minutes"
                fill="#0077b6"
                name="Toplam Çalışma (dk)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
