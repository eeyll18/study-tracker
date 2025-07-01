"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setGoalAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { toast } from "sonner";

interface GoalCardProps {
  title: string;
  type: "daily" | "weekly";
  progress: number;
  target: number;
}

export default function GoalCard({
  title,
  type,
  progress,
  target,
}: GoalCardProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const progressPercentage =
    target > 0 ? Math.min((progress / target) * 100, 100) : 0;

  const handleSubmit = async (formData: FormData) => {
    const result = await setGoalAction(formData);
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.success);
      document.getElementById(`close-dialog-${type}`)?.click();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Dialog onOpenChange={(open) => !open && formRef.current?.reset()}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Düzenle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{title} Belirle</DialogTitle>
              <DialogDescription>
                Lütfen yeni hedef sürenizi dakika olarak girin. Kaydettiğinizde mevcut hedefiniz güncellenecektir.
              </DialogDescription>
            </DialogHeader>
            <form ref={formRef} action={handleSubmit}>
              <input type="hidden" name="type" value={type} />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="target_minutes" className="text-right">
                    Hedef (dk)
                  </Label>
                  <Input
                    id="target_minutes"
                    name="target_minutes"
                    type="number"
                    defaultValue={target}
                    className="col-span-3"
                    min="0"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Kaydet</Button>
              </DialogFooter>
            </form>
            <DialogClose asChild>
              <button
                id={`close-dialog-${type}`}
                style={{ display: "none" }}
              ></button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div>
          {progress}/{target} dk
        </div>
        <p className="text-xs text-muted-foreground">
          Hedefin %{Math.round(progressPercentage)}ını tamamladın.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}
