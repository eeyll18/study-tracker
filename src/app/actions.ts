"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addCourseAction(formData: FormData) {
  const supabase = await createClient();

  const courseName = formData.get("courseName") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Giriş yapmalısınız." };
  }

  if (!courseName || courseName.trim().length === 0) {
    return { error: "Ders adı boş olamaz." };
  }

  const { error } = await supabase
    .from("courses")
    .insert({ name: courseName, user_id: user.id });

  if (error) {
    return { error: "Ders eklenirken bir hata oluştu: " + error.message };
  }

  revalidatePath("/dashboard");
  return { success: "Ders başarıyla eklendi." };
}

export async function logStudySessionAction(courseId: number, durationMinutes: number) {
    const supabase =await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Giriş yapmalısınız.' }
    }

    if (durationMinutes <= 0) {
        return { error: 'Süre 0\'dan büyük olmalıdır.' }
    }


    const { error } = await supabase
        .from('study_sessions')
        .insert({
            course_id: courseId,
            user_id: user.id,
            duration_minutes: durationMinutes,
        })
    
    if (error) {
        return { error: 'Veritabanı hatası: ' + error.message }
    }
    
    revalidatePath('/dashboard')
    return { success: 'Çalışma başarıyla kaydedildi!' }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
