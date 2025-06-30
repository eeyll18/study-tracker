"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function WeekNavigator({
  currentWeekStart,
}: {
  currentWeekStart: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekStartParam = searchParams.get("week_start");
  const current = new Date(weekStartParam || currentWeekStart);

  const handlePreviousWeek = () => {
    const prevWeek = new Date(current);
    prevWeek.setDate(current.getDate() - 7);
    router.push(`/history?week_start=${formatDate(prevWeek)}`);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(current);
    nextWeek.setDate(current.getDate() + 7);
    router.push(`/history?week_start=${formatDate(nextWeek)}`);
  };

  const endOfWeek = new Date(current);
  endOfWeek.setDate(current.getDate() + 6);

//   useEffect(() => {
//     if (!searchParams.get("week_start")) {
//       router.replace(
//         `/history?week_start=${formatDate(new Date(currentWeekStart))}`
//       );
//     }
//   }, []);

  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <Button onClick={handlePreviousWeek} variant="outline" size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <p className="text-lg font-semibold">
          {current.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
          })}{" "}
          -{" "}
          {endOfWeek.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <Button onClick={handleNextWeek} variant="outline" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
