"use client";

import { useState } from "react";
import Image from "next/image";
import { AppShell, BottomNav, PrintButton } from "@/components/AppShell";
import { ageBands, bandLabel, type AgeBandId } from "@/data/ages";
import { latihanSheets, type WordCategory } from "@/data/latihan";
import { ageInMonths, bandForMonths, useSpeechPro } from "@/lib/store";
import { Lightbulb, CheckCircle2, Sparkles, BookOpen } from "lucide-react";

const categoryImageMap: Record<string, string> = {
  "Sapaan & Sentuhan": "/latihan/sapaan.webp",
  "Suara & Bunyi": "/latihan/suara.webp",
  "Kebutuhan": "/latihan/kebutuhan.webp",
  "Kasih Sayang": "/latihan/kasihsayang.webp",
  "Kegiatan Sehari-hari": "/latihan/kegiatan.webp",
  "Waktu Istirahat": "/latihan/istirahat.webp",
};

const defaultImages = [
  "/latihan/sapaan.webp",
  "/latihan/suara.webp",
  "/latihan/kebutuhan.webp",
  "/latihan/kasihsayang.webp",
  "/latihan/kegiatan.webp",
  "/latihan/istirahat.webp",
];

function getCategoryImg(title: string, index: number): string {
  if (categoryImageMap[title]) {
    return categoryImageMap[title];
  }
  const lower = title.toLowerCase();
  if (lower.includes("sapaan") || lower.includes("orang") || lower.includes("keluarga")) return "/latihan/sapaan.webp";
  if (lower.includes("suara") || lower.includes("bunyi") || lower.includes("suku")) return "/latihan/suara.webp";
  if (lower.includes("kebutuhan") || lower.includes("makan") || lower.includes("tubuh")) return "/latihan/kebutuhan.webp";
  if (lower.includes("kasih") || lower.includes("perasaan") || lower.includes("ekspresi")) return "/latihan/kasihsayang.webp";
  if (lower.includes("kegiatan") || lower.includes("rutinitas") || lower.includes("kerja") || lower.includes("perintah")) return "/latihan/kegiatan.webp";
  if (lower.includes("istirahat") || lower.includes("waktu") || lower.includes("nyanyi") || lower.includes("benda")) return "/latihan/istirahat.webp";

  return defaultImages[index % defaultImages.length];
}

function getCategoryDescription(cat: WordCategory): string {
  if (cat.description) return cat.description;
  if (cat.when && cat.when.length > 0) return cat.when[0];
  return "Meningkatkan kemampuan pemahaman kata dan stimulasi komunikasi Si Kecil.";
}

export default function LatihanPage() {
  const { state } = useSpeechPro();
  const months = ageInMonths(state.profile.birthDate);
  const [band, setBand] = useState<AgeBandId>(bandForMonths(months));
  const sheet = latihanSheets[band];

  return (
    <AppShell>
      <main className="min-h-screen bg-[#f8f9ff] dark:bg-background pb-16 pt-4 flex flex-col items-center">
        {/* HERO HEADER SECTION */}
        <section className="w-full max-w-4xl px-4 pt-6 pb-4 flex flex-col items-center text-center">

          {/* TITLE */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0b1c30] dark:text-foreground mb-3 font-sans">
            Latihan Kata Harian
          </h1>

          {/* SUBTITLE */}
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed mb-6 font-normal">
            Langkah kecil setiap hari membantu perkembangan bahasa si kecil. Pilih kategori di bawah ini untuk memulai latihan ringan dan menyenangkan.
          </p>

          {/* AGE BAND SELECTOR */}
          <div className="no-print flex flex-wrap justify-center gap-2 mb-2 w-full max-w-3xl">
            {ageBands.map((b) => {
              const isActive = b.id === band;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBand(b.id)}
                  className={`rounded-full px-4 py-2 text-xs md:text-sm font-semibold transition-all duration-200 ${isActive
                      ? "bg-[#564ac0] text-white shadow-md scale-105"
                      : "bg-white dark:bg-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-accent border border-slate-200/80 dark:border-border/60 shadow-2xs"
                    }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Tahap Terpilih: <span className="font-bold text-[#564ac0] dark:text-primary">{bandLabel(band)}</span>
          </p>
        </section>

        {/* CARDS GRID */}
        <section className="w-full max-w-6xl px-4 md:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {sheet.categories.map((cat, idx) => {
              const imgSrc = getCategoryImg(cat.title, idx);
              const description = getCategoryDescription(cat);

              return (
                <div
                  key={cat.title}
                  className="group bg-white dark:bg-card rounded-[24px] p-5 md:p-6 border border-slate-100 dark:border-border/40 shadow-[0_10px_30px_rgba(89,76,195,0.05)] hover:shadow-[0_15px_35px_rgba(89,76,195,0.12)] transition-all duration-300 flex flex-col h-full"
                >
                  {/* CARD IMAGE */}
                  <div className="relative w-full h-48 md:h-52 rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-muted shrink-0">
                    <Image
                      src={imgSrc}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={idx < 3}
                    />
                  </div>

                  {/* CARD TITLE */}
                  <h2 className="text-xl md:text-2xl font-bold text-[#0b1c30] dark:text-foreground text-center mb-2 leading-snug">
                    {cat.title}
                  </h2>

                  {/* CARD DESCRIPTION */}
                  <p className="text-xs md:text-sm text-slate-600 dark:text-muted-foreground text-center mb-6 leading-relaxed px-1 min-h-[44px] flex items-center justify-center">
                    {description}
                  </p>

                  {/* WORD CHIPS */}
                  <div className="flex flex-wrap justify-center items-center gap-2 mt-auto pt-2">
                    {cat.words.map((w) => (
                      <span
                        key={w}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-[#f0effe] dark:bg-primary/20 text-[#594cc3] dark:text-primary-foreground transition-colors hover:bg-[#e4e0fe]"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTRO & GUIDANCE SECTION */}
        <section className="w-full max-w-6xl px-4 md:px-8 mt-12 space-y-6">
          {/* INTRO CARD */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 border border-slate-100 dark:border-border/40 shadow-xs flex items-start gap-4">
            <div className="size-10 rounded-2xl bg-[#efeefd] dark:bg-primary/20 text-[#564ac0] dark:text-primary grid place-items-center shrink-0">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0b1c30] dark:text-foreground mb-1">
                Panduan Latihan Tahap {bandLabel(band)}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                {sheet.intro}
              </p>
            </div>
          </div>

          {/* TIPS & MANFAAT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TIPS STIMULASI */}
            <div className="bg-[#fffdfa] dark:bg-card rounded-3xl p-6 border border-[#fef3c7] dark:border-border/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="size-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 grid place-items-center">
                    <Lightbulb className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0b1c30] dark:text-foreground">
                    Tips Stimulasi
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {sheet.tips.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* MANFAAT LATIHAN */}
            <div className="bg-[#f6fbf9] dark:bg-card rounded-3xl p-6 border border-[#a7f3d0]/60 dark:border-border/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="size-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 grid place-items-center">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0b1c30] dark:text-foreground">
                    Manfaat Latihan
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {sheet.manfaat.map((m) => (
                    <li key={m} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CLOSING CARD & PRINT BUTTON */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 border border-slate-100 dark:border-border/40 shadow-xs text-center space-y-4">
            <p className="text-xs md:text-sm font-semibold text-[#0b1c30] dark:text-foreground max-w-3xl mx-auto leading-relaxed">
              "{sheet.closing}"
            </p>
            <div className="pt-2 max-w-md mx-auto">
              <PrintButton label="Cetak Lembar Latihan" />
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </AppShell>
  );
}

