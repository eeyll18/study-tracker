import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { login, signup } from "./actions";

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

  return(
     <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Ders Takip Uygulamasına Hoş Geldiniz
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Giriş yapın veya yeni bir hesap oluşturun.
        </p>
        <form className="space-y-6">
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button formAction={login}>Giriş Yap</Button>
            <Button formAction={signup} variant="outline">
              Kayıt Ol
            </Button>
          </div>
          {searchParams.message && (
            <p className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-center rounded-md">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
