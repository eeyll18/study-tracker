"use client";

import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button variant="outline">Çıkış Yap</Button>
    </form>
  );
}
