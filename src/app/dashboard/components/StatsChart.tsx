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

interface ChartData {
  course_name: string;
  total_minutes: number;
}

interface StatsChartProps {
  data: ChartData[];
}

export default function StatsChart({ data }: StatsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ders İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between h-60">
            <p className="text-gray-500">
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
        <div style={{ width: "%100", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course_name" />
              <YAxis />
              <Tooltip
                cursor={{ fill: "rgba(206,212,218,0.3" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar
                dataKey="total_minutes"
                fill="#0077b6"
                name="Toplam Çalışma (dk)"
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
