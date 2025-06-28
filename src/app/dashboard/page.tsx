import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddCourse from "./components/AddCourse";
import CourseItem from "./components/CourseItem";
import SignOutButton from "./components/SignOutButton";

export type Course = {
  id: number;
  name: string;
};

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id,name");

  const { data: sessions } = await supabase
    .from("study_sessions")
    .select("*, courses(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hoş Geldin, {user.email?.split("@")[0]}!
        </h1>
        <SignOutButton />
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

        <Card>
          <CardHeader>
            <CardTitle>Son Çalışmalar</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <ul className="space-y-2">
                {sessions.map((session) => (
                  <li
                    key={session.id}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    <span className="font-semibold">
                      {session.courses?.name}
                    </span>
                    : {session.duration_minutes} dakika
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Henüz kayıtlı bir çalışma yok.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
