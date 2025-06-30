"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ViewSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "weekly";

  const handleViewChange = (view: "weekly" | "daily") => {
    const params = new URLSearchParams(searchParams);
    params.set("view", view);

    params.delete("week_start");
    params.delete("date");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex w-full justify-center items-center flex-col gap-2 rounded-lg p-1 sm:w-auto sm:flex-row dark:bg-black">
      <Button
        onClick={() => handleViewChange("weekly")}
        variant={currentView === "weekly" ? "default" : "outline"}
        className="w-full border-black"
      >
        Haftalık
      </Button>
      <Button
        onClick={() => handleViewChange("daily")}
        variant={currentView === "daily" ? "default" : "outline"}
        className="w-full border-black"
      >
        Günlük
      </Button>
    </div>
  );
}
