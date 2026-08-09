"use client";

import { AppShell, BottomNav, Card, PageHeader } from "@/components/AppShell";
import { messages } from "@/data/reward";

const tones = {
  violet: "bg-tile-violet",
  cream: "bg-tile-cream",
  mint: "bg-tile-mint",
  sky: "bg-tile-sky",
} as const;

export default function PesanPage() {
  return (
    <AppShell>
      <PageHeader title="Pesan" subtitle="Pengingat & tips untuk orang tua" />

      <main className="flex flex-col gap-5 px-4 md:px-8 pt-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((m) => (
            <Card key={m.id} className={`${tones[m.tone]} tile-hover flex flex-col justify-between`}>
              <div>
                <h2 className="text-sm md:text-base font-extrabold text-secondary-foreground">{m.title}</h2>
                <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-foreground">{m.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </AppShell>
  );
}
