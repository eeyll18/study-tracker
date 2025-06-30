import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import WeekNavigator from "./components/WeekNavigator";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatsChart from "../dashboard/components/StatsChart";
import ViewSwitcher from "./components/ViewSwitcher";
import WeeklyHistory from './components/WeeklyHistory'
import DailyHistory from "./components/DailyHistory";


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

  const view = searchParams?.view || "weekly";
  const weekStart = searchParams?.week_start;
  const date = searchParams?.date;

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
      <div className="max-w-xs mx-auto">
        <ViewSwitcher />
      </div>

      <Suspense key={view + weekStart + date} fallback={<p>Yükleniyor...</p>}>
        {view === "daily" ? (
          <DailyHistory dateParam={date} />
        ) : (
          <WeeklyHistory weekStartParam={weekStart} />
        )}
        {/* <HistoryContent weekStartParam={weekStart} /> */}
      </Suspense>
    </div>
  );
}
