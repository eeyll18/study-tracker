import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import WeekNavigator from "./components/WeekNavigator";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatsChart from "../dashboard/components/StatsChart";

type HistoryStat = {
  course_name: string;
  total_minutes: number;
};

const getMonday = (date: Date) => {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
};

const getWeekRange = (dateStr?: string | null) => {
  const refDate = dateStr ? new Date(dateStr) : new Date();
  const startOfWeek = getMonday(refDate);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7);
  return { startOfWeek, endOfWeek };
};

async function HistoryContent({ weekStartParam }: { weekStartParam?: string }) {
  const supabase = await createClient();
  const { startOfWeek, endOfWeek } = getWeekRange(weekStartParam);

  const { data: summary, error } = await supabase.rpc(
    "get_study_summary_for_period",
    {
      start_date: startOfWeek.toISOString(),
      end_date: endOfWeek.toISOString(),
    }
  );

  const weeklySummary = summary as HistoryStat[] | null;
  const totalMinutes =
    weeklySummary?.reduce((sum, s) => sum + s.total_minutes, 0) || 0;

  return (
    <>
      <WeekNavigator
        key={startOfWeek.toISOString()}
        currentWeekStart={startOfWeek.toISOString().split("T")[0]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Özet</CardTitle>
            <p className="text-sm text-gray-500">
              Toplam Çalışma Süresi:{" "}
              <span className="font-bold">{totalMinutes} dakika</span>
            </p>
          </CardHeader>
          <CardContent>
            {weeklySummary && weeklySummary.length > 0 ? (
              <ul className="space-y-3">
                {weeklySummary.map((item) => (
                  <li
                    key={item.course_name}
                    className="flex justify-between items-center text-sm font-medium"
                  >
                    <span className="text-gray-800 dark:text-gray-200">
                      {item.course_name}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900 dark:text-white">
                      {item.total_minutes} dakika
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Bu hafta için kayıtlı bir çalışma bulunamadı.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Dağılım</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsChart data={weeklySummary || []} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const weekStart = searchParams?.week_start;

  return (
    <div className="space-y-8 p-4 md:p-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Çalışma Geçmişi
        </h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">Panele Dön</Link>
        </Button>
      </header>

      <Suspense key={weekStart || "current"} fallback={<p>Yükleniyor...</p>}>
        <HistoryContent weekStartParam={weekStart} />
      </Suspense>
    </div>
  );
}
