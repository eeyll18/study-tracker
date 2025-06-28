import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddCourse from "./components/AddCourse";
import CourseItem from "./components/CourseItem";
import SignOutButton from "./components/SignOutButton";
import StatsChart from "./components/StatsChart";
import GoalCard from "./components/GoalCard";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Course = {
  id: number;
  name: string;
};

export type Stat = {
  course_name: string;
  total_minutes: number;
};

async function getDashboardData(supabase: SupabaseClient, userId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // pzt
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    coursesResult,
    // statsResult,
    dailySummaryResult,
    goalsResult,
    dailySessionsResult,
    weeklySessionsResult,
  ] = await Promise.all([
    supabase.from("courses").select("id, name").eq("user_id", userId),
    // supabase.rpc("get_user_study_stats"),
    supabase.rpc("get_daily_summary"),
    supabase.from("goals").select("type, target_minutes").eq("user_id", userId),
    supabase
      .from("study_sessions")
      .select("duration_minutes")
      .eq("user_id", userId)
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("study_sessions")
      .select("duration_minutes")
      .eq("user_id", userId)
      .gte("created_at", startOfWeek.toISOString()),
  ]);

  // gelen veri
  const dailyProgress =
    dailySessionsResult.data?.reduce((sum, s) => sum + s.duration_minutes, 0) ||
    0;
  const weeklyProgress =
    weeklySessionsResult.data?.reduce(
      (sum, s) => sum + s.duration_minutes,
      0
    ) || 0;
  const dailyGoal =
    goalsResult.data?.find((g) => g.type === "daily")?.target_minutes || 0;
  const weeklyGoal =
    goalsResult.data?.find((g) => g.type === "weekly")?.target_minutes || 0;

  return {
    courses: coursesResult.data as Course[] | null,
    // stats: statsResult.data as Stat[] | null,
    dailySummary: dailySummaryResult.data as Stat[] | null,
    dailyGoal,
    weeklyGoal,
    dailyProgress,
    weeklyProgress,
  };
}

const CourseListCard = ({ courses }: { courses: Course[] | null }) => (
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
);

const DailySummaryCard = ({
  dailySummary,
}: {
  dailySummary: Stat[] | null;
}) => (
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
);

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const {
    courses,
    // stats,
    dailySummary,
    dailyGoal,
    weeklyGoal,
    dailyProgress,
    weeklyProgress,
  } = await getDashboardData(supabase, user.id);

  return (
    <div className="space-y-8 p-4 md:p-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Hoş Geldin, {user.email?.split("@")[0]}!
        </h1>
        <SignOutButton />
      </header>

      <section className="grid gap-4 md:grid-cols-2">
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
      </section>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <CourseListCard courses={courses} />
        </div>

        <div className="space-y-8">
          <StatsChart data={dailySummary || []} />
        </div>
        <div className="space-y-8">
          <DailySummaryCard dailySummary={dailySummary} />
        </div>
      </main>
    </div>
  );
}
