"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Course } from "../page";
import { logStudySessionAction } from "@/app/actions";
import { toast } from "sonner";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function CourseItem({ course }: { course: Course }) {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = async () => {
    setIsActive(false);
    setIsSaving(true);

    const durationMinutes = Math.floor(time / 60);

    if (durationMinutes > 0) {
      const promise = logStudySessionAction(course.id, durationMinutes);

      toast.promise(promise, {
        loading: "Çalışma kaydediliyor...",
        success: (data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setTime(0);
          return "Çalışma başarıyla kaydedildi!";
        },
        error: (error) => `Hata: ${error.message}`,
        finally: () => setIsSaving(false),
      });
    } else {
      toast.warning("Süre 1 dakikadan az olduğu için kaydedilmedi.", {
        description: `Sadece ${time} saniye çalıştınız. Kayıt için en az 1 dakika gereklidir.`,
      });
      setTime(0);
      setIsSaving(false);
    }

    setIsSaving(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  return (
    <Card className="p-4 flex justify-between items-center">
      <div className="flex-grow">
        <p className="font-semibold text-lg">{course.name}</p>
        <p className="text-2xl font-mono tracking-wider">{formatTime(time)}</p>
      </div>
      <div className="flex space-x-2">
        {!isActive ? (
          <Button
            onClick={handleStart}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSaving}
          >
            Başlat
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            size="sm"
            variant="destructive"
            disabled={isSaving}
          >
            {isSaving ? "Kaydediliyor..." : "Durdur & Kaydet"}
          </Button>
        )}
        <Button
          onClick={handleReset}
          size="sm"
          variant="outline"
          disabled={isSaving}
        >
          Sıfırla
        </Button>
      </div>
    </Card>
  );
}
