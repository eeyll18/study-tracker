"use client";

import React, { useState, } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Course } from "../page";
import { deleteCourseAction } from "@/app/actions";
import { toast } from "sonner";
import { usePomodoro } from "@/hooks/usePomodoro";


function formatPomodoroTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

type PomodoroMode = "work" | "shortBreak" | "longBreak";

const modeDetails: Record<PomodoroMode, { text: string; color: string }> = {
  work: { text: "Çalışma", color: "bg-red-500" },
  shortBreak: { text: "Kısa Mola", color: "bg-green-500" },
  longBreak: { text: "Uzun Mola", color: "bg-blue-500" },
};

const TimerDisplay = React.memo(({ timeLeft, pomodorosCompleted }: { timeLeft: number; pomodorosCompleted: number }) => {
  console.log("TimerDisplay Rendered"); 
  return (
    <div className='text-center'>
      <p className="text-6xl font-mono tracking-wider">{formatPomodoroTime(timeLeft)}</p>
      <p className='text-sm text-gray-500 mt-1'>Tamamlanan Pomodoro: {pomodorosCompleted}</p>
    </div>
  );
});
TimerDisplay.displayName = 'TimerDisplay';

const PomodoroControls = React.memo(({ isActive, isDeleting, onToggle, onSkip, onReset, onDelete }: {
  isActive: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onSkip: () => void;
  onReset: () => void;
  onDelete: () => void;
}) => {
  console.log("PomodoroControls Rendered");
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button onClick={onToggle} size="sm" className="w-24 bg-green-600 hover:bg-green-700 dark:text-white" disabled={isDeleting}>
        {isActive ? 'Duraklat' : 'Başlat'}
      </Button>
      <Button onClick={onSkip} size="sm" variant="outline" disabled={isDeleting}>Geç</Button>
      <Button onClick={onReset} size="sm" variant="outline" disabled={isDeleting}>Sıfırla</Button>
      <Button onClick={onDelete} size="sm" variant="destructive" disabled={isDeleting}>
        {isDeleting ? "Siliniyor..." : "Dersi Sil"}
      </Button>
    </div>
  );
});
PomodoroControls.displayName = 'PomodoroControls';

export default function CourseItem({ course }: { course: Course }) {
  const {
    timeLeft,
    mode,
    pomodorosCompleted,
    isActive,
    handleToggle,
    handleReset,
    handleSkip,
  } = usePomodoro({ courseId: course.id, courseName: course.name });

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`"${course.name}" dersini silmek istediğinizden emin misiniz?`)) return;
    setIsDeleting(true);
    const promise = deleteCourseAction(course.id);
    toast.promise(promise, {
      loading: "Ders siliniyor...",
      success: "Ders başarıyla silindi!",
      error: (err) => `Hata: ${err.message}`,
      finally: () => setIsDeleting(false),
    });
  };

  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className='flex justify-between items-start'>
        <p className="font-semibold text-lg">{course.name}</p>
        <Badge className={`${modeDetails[mode].color} text-white`}>
            {modeDetails[mode].text}
        </Badge>
      </div>
      
      <TimerDisplay timeLeft={timeLeft} pomodorosCompleted={pomodorosCompleted} />
      
      <PomodoroControls
        isActive={isActive}
        isDeleting={isDeleting}
        onToggle={handleToggle}
        onSkip={handleSkip}
        onReset={handleReset}
        onDelete={handleDelete}
      />
    </Card>
  );
}