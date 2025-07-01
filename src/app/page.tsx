import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }else {
    redirect("/login");
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Ders Takip Uygulamasına Hoş Geldiniz
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Giriş yapın veya yeni bir hesap oluşturun.
        </p>
      </div>
    </div>
  );
}
