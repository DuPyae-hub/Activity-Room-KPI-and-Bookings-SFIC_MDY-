"use client";

import { MascotSpot } from "@/components/animated/mascot-spot";

export function AdminLoginMascot() {
  return (
    <div className="mb-6 flex justify-center">
      <MascotSpot
        layout="stacked"
        size="lg"
        captionLabel="Admin"
        caption="Staff sign-in only. Use the credentials provided by your administrator."
      />
    </div>
  );
}
