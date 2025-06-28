"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCourseAction } from "@/app/actions";
import { useRef } from "react";

export default function AddCourse() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog onOpenChange={(open) => !open && formRef.current?.reset()}>
      <DialogTrigger asChild>
        <Button>+ Yeni Ders Ekle</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Ders Ekle</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={async (formData) => {
            await addCourseAction(formData);
            document.getElementById("close-dialog-button")?.click();
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseName" className="text-right">
                Ders Adı
              </Label>
              <Input
                id="courseName"
                name="courseName"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Kaydet</Button>
          </DialogFooter>
        </form>
        <DialogClose asChild>
          <button id="close-dialog-button" style={{ display: "none" }}></button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
