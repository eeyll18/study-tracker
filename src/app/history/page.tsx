import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ViewSwitcher from "./components/ViewSwitcher";
import WeeklyHistory from "./components/WeeklyHistory";
import DailyHistory from "./components/DailyHistory";

type HistoryPageProps = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const viewParam = searchParams?.view;
  const view = Array.isArray(viewParam) ? viewParam[0] : viewParam || "weekly";

  const weekStartParam = searchParams?.week_start;
  const weekStart = Array.isArray(weekStartParam)
    ? weekStartParam[0]
    : weekStartParam;

  const dateParam = searchParams?.date;
  const date = Array.isArray(dateParam) ? dateParam[0] : dateParam;

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
