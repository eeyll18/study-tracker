"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function DayNavigator({ currentDate }: { currentDate: string }) {
  const router = useRouter();
  const current = new Date(currentDate);

  const handlePreviousDay = () => {
    const prevDay = new Date(current);
    prevDay.setUTCDate(current.getUTCDate() - 1);
    router.push(`/history?view=daily&date=${formatDate(prevDay)}`);
  };

  const handleNextDay = () => {
    const nextDay = new Date(current);
    nextDay.setUTCDate(current.getUTCDate() + 1);
    router.push(`/history?view=daily&date=${formatDate(nextDay)}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <Button onClick={handlePreviousDay} variant="outline" size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <p className="text-lg font-semibold">
          {current.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: 'UTC' 
          })}
        </p>
      </div>
      <Button onClick={handleNextDay} variant="outline" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}