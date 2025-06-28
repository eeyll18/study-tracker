import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddCourse from "./components/AddCourse";
import CourseItem from "./components/CourseItem";
import SignOutButton from "./components/SignOutButton";
import StatsChart from "./components/StatsChart";
import GoalCard from "./components/GoalCard";

export type Course = {
  id: number;
  name: string;
};

export type DailySummary = {
  course_name: string;
  total_minutes: number;
};

async function getGoalsAndProgress(supabase: any, userId: string) {
  const { data: goalsData } = await supabase
    .from("goals")
    .select("type, target_minutes")
    .eq("user_id", userId);

  const dailyGoal =
    goalsData?.find((g: any) => g.type === "daily")?.target_minutes || 0;
  const weeklyGoal =
    goalsData?.find((g: any) => g.type === "weekly")?.target_minutes || 0;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: dailySessions, error: dailyError } = await supabase
    .from("study_sessions")
    .select("duration_minutes")
    .eq("user_id", userId)
    .gte("created_at", todayStart.toISOString());

  const dailyProgress =
    dailySessions?.reduce((sum: any, s: any) => sum + s.duration_minutes, 0) ||
    0;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const { data: weeklySessions, error: weeklyError } = await supabase
    .from("study_sessions")
    .select("duration_minutes")
    .eq("user_id", userId)
    .gte("created_at", startOfWeek.toISOString());

  const weeklyProgress =
    weeklySessions?.reduce((sum: any, s: any) => sum + s.duration_minutes, 0) ||
    0;

  return { dailyGoal, dailyProgress, weeklyGoal, weeklyProgress };
}

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const [
    { data: courses },
    { data: sessions },
    { dailyGoal, dailyProgress, weeklyGoal, weeklyProgress },
  ] = await Promise.all([
    supabase.from("courses").select("id, name"),
    supabase
      .from("study_sessions")
      .select("*, courses(name)")
      .order("created_at", { ascending: false })
      .limit(5),
    getGoalsAndProgress(supabase, user.id),
  ]);
  const { data, error: summaryError } = await supabase.rpc("get_daily_summary");

  const dailySummary = data as DailySummary[] | null;

  const { data: statsData, error: statsError } = await supabase.rpc(
    "get_user_study_stats"
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hoş Geldin, {user.email?.split("@")[0]}!
        </h1>
        <SignOutButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <GoalCard
          title="Günlük Hedef"
          type="daily"
          progress={dailyProgress}
          target={dailyGoal}
        />
        <GoalCard
          title="Haftalık Hedef"
          type="weekly"
          progress={weeklyProgress}
          target={weeklyGoal}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Derslerim</CardTitle>
            <AddCourse />
          </CardHeader>
          <CardContent>
            {courses && courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course) => (
                  <CourseItem key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Henüz ders eklemediniz. Başlamak için yeni bir ders ekleyin.
              </p>
            )}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Son Çalışmalar</CardTitle>
          </CardHeader>
          <CardContent>
            {dailySummary && dailySummary.length > 0 ? (
              <ul className="space-y-2">
                {dailySummary.map((summary) => (
                  <li
                    key={summary.course_name}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    <span className="font-semibold">
                      {summary.course_name}
                    </span>
                    : {summary.total_minutes} dakika
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Henüz kayıtlı bir çalışma yok.
              </p>
            )}
          </CardContent>
        </Card> */}

        <div>
          <StatsChart data={statsData || []} />
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Bugünkü Toplam Süre</CardTitle>
            </CardHeader>
            <CardContent>
              {dailySummary && dailySummary.length > 0 ? (
                <ul className="space-y-3">
                  {dailySummary.map((summary) => (
                    <li
                      key={summary.course_name}
                      className="flex justify-between items-center text-sm font-medium"
                    >
                      <span className="text-gray-800 dark:text-gray-200">
                        {summary.course_name}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900 dark:text-blue-200">
                        {summary.total_minutes} dakika
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Bugün hiç çalışmadınız.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
