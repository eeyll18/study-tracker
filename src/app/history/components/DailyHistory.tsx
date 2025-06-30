import { createClient } from "@/lib/supabase/server";
import DayNavigator from "./DayNavigator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/app/dashboard/page";

type DailySession = {
  id: number;
  duration_minutes: number;
  created_at: string;
  courses: {
    name: string;
  } | null;
};

export default async function DailyHistory({
  dateParam,
}: {
  dateParam?: string;
}) {
  const supabase = await createClient();
  const targetDate = dateParam ? new Date(dateParam) : new Date();
  const startOfDay = new Date(
    Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      0,
      0,
      0
    )
  );
  const endOfDay = new Date(
    Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      23,
      59,
      59
    )
  );

  const { data: sessions, error } = await supabase
    .from("study_sessions")
    .select("id, duration_minutes, created_at, courses(name)")
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString())
    .order("created_at", { ascending: false });

  const { data: summary } = await supabase.rpc("get_study_summary_for_period", {
    start_date: startOfDay.toISOString(),
    end_date: endOfDay.toISOString(),
  });

  if (error) {
    return <p>Veri çekilirken hata oluştu: {error.message}</p>;
  }

  const dailySessions = sessions as unknown as DailySession[];
  const dailySummary = summary as Stat[] | null;
  
  const totalMinutes = dailySessions.reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  return (
    <>
      <DayNavigator currentDate={startOfDay.toISOString().split("T")[0]} />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Günlük Rapor</CardTitle>
          <p className="text-sm text-gray-500 dark:text-white">
            Toplam Çalışma Süresi:{" "}
            <span className="font-bold">{totalMinutes} dakika</span>
          </p>
        </CardHeader>
        <CardContent>
          {dailySummary && dailySummary.length > 0 ? (
            <ul className="space-y-4">
              {dailySummary.map((item) => (
                <li
                  key={item.course_name}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-background"
                >
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {item.course_name || "Bilinmeyen Ders"}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900 dark:text-white">
                    {item.total_minutes} dakika
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Bu tarih için kayıtlı bir çalışma bulunamadı.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
