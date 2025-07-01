"use client"

import { logStudySessionAction } from "@/app/actions";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const WORK_DURATION = 1 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;
const CYCLES_BEFORE_LONG_BREAK = 4;

type PomodoroMode = "work" | "shortBreak" | "longBreak";

export interface UsePomodoroReturn {
  timeLeft: number;
  mode: PomodoroMode;
  pomodorosCompleted: number;
  isActive: boolean;
  handleToggle: () => void;
  handleReset: () => void;
  handleSkip: () => void;
}

interface UsePomodoroProps {
  courseId: number;
  courseName: string;
}

export function usePomodoro({ courseId, courseName }: UsePomodoroProps): UsePomodoroReturn {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const switchToNextMode = useCallback((options: { saveSession?: boolean } = {}) => {
    const { saveSession = false } = options;

    if (mode === "work") {
      let completedCount = pomodorosCompleted;

      if (saveSession) {
        completedCount++;
        setPomodorosCompleted(completedCount);
        logStudySessionAction(courseId, WORK_DURATION / 60).then(() => {
          toast.success(`${courseName} için 25 dakikalık çalışma kaydedildi!`);
        });
      }

      if (completedCount > 0 && completedCount % CYCLES_BEFORE_LONG_BREAK === 0) {
        setMode("longBreak");
        setTimeLeft(LONG_BREAK_DURATION);
        toast.info("Harika iş! Uzun mola zamanı.");
      } else {
        setMode("shortBreak");
        setTimeLeft(SHORT_BREAK_DURATION);
        toast.info("Süper! Şimdi kısa bir mola ver.");
      }
    } else {
      setMode("work");
      setTimeLeft(WORK_DURATION);
      toast.info("Mola bitti. Tekrar çalışma zamanı!");
    }
  }, [mode, courseId, courseName, pomodorosCompleted]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      switchToNextMode({ saveSession: mode === 'work' });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, mode, switchToNextMode]);

  const handleToggle = () => setIsActive(!isActive);

  const handleReset = () => {
    setIsActive(false);
    setMode("work");
    setTimeLeft(WORK_DURATION);
    setPomodorosCompleted(0);
    toast.info("Zamanlayıcı sıfırlandı.");
  };

  const handleSkip = () => {
    if (window.confirm("Bu aşamayı atlayıp bir sonrakine geçmek istediğinizden emin misiniz?")) {
      setIsActive(false);
      switchToNextMode({ saveSession: false });
    }
  };

  return {
    timeLeft,
    mode,
    pomodorosCompleted,
    isActive,
    handleToggle,
    handleReset,
    handleSkip,
  };
}