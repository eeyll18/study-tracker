import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { login, signup } from "./actions";
// import { ThemeToggle } from "../components/theme-toggle";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full relative max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-2xl ">
        {/* <div className="absolute top-0 left-0">
          <ThemeToggle />
        </div> */}
        <h1 className="text-2xl font-bold text-center text-gray-900 ">
          Ders Takip Uygulamasına Hoş Geldiniz
        </h1>
        <p className="text-center text-gray-600 ">
          Giriş yapın veya yeni bir hesap oluşturun.
        </p>
        <form className="space-y-6">
          <div>
            <Label htmlFor="email" className="dark:text-black">
              E-posta
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 dark:text-black dark:bg-white dark:border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="password" className="dark:text-black">
              Şifre
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 dark:text-background dark:border-gray-600"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button formAction={login} className="dark:text-black dark:hover:bg-background dark:hover:text-white">
              Giriş Yap
            </Button>
            <Button formAction={signup} className="dark:text-black dark:hover:bg-background dark:hover:text-white">
              Kayıt Ol
            </Button>
          </div>
          {searchParams.message && (
            <p className="mt-4 p-4 bg-gray-100 text-gray-600 dark:text-black text-center rounded-md">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
