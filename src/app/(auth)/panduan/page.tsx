"use client";

import { useState } from "react";
import { AppShell, BottomNav, Card, PageHeader, PrintButton } from "@/components/AppShell";
import family from "@/assets/family.png";
import {
  Heart,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Check,
  Clock,
  Activity,
  BookOpen,
  Music,
  Users,
  Palette,
  Lightbulb,
} from "lucide-react";

export default function PanduanPage() {
  const [completedCount] = useState(3);

  return (
    <AppShell>
      <PageHeader
        title="Panduan Orang Tua"
        subtitle="Bekal penting untuk mendampingi Si Kecil"
        illustration={<img src={family.src} alt="" className="w-full" />}
      />

      <main className="flex flex-col gap-8 px-4 md:px-8 pt-4 pb-8 max-w-6xl mx-auto w-full">
        {/* HERO BANNER SECTION */}
        <section className="rounded-3xl bg-card p-6 md:p-8 shadow-[var(--shadow-card)] border border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-start gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-1 text-xs font-bold text-primary">
                <Heart className="size-3.5 fill-primary text-primary" />
                Pendamping Setia Tumbuh Kembang
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
                Panduan Lengkap Orang Tua untuk Tumbuh Kembang Anak
              </h1>
              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                Menjadi orang tua adalah perjalanan yang indah namun penuh tantangan. Kami hadir untuk memberikan panduan, tips, dan dukungan yang Anda butuhkan dalam membimbing si kecil dengan penuh kasih sayang dan perhatian.
              </p>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("speech-delay-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="brand-gradient rounded-xl px-6 py-3 text-xs md:text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
              >
                Mulai Membaca
              </button>
            </div>
            <div className="overflow-hidden rounded-3xl bg-muted h-64 md:h-80 shadow-sm border border-border/40">
              <img
                src="/asset/gambar 1.webp"
                alt="Ibu membaca buku bersama anak"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* SECTION 1: MEMAHAMI SPEECH DELAY */}
        <section id="speech-delay-section" className="flex flex-col gap-5">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
              Memahami Speech Delay
            </h2>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground leading-relaxed">
              Mengenali tanda-tanda keterlambatan bicara sejak dini sangat penting agar anak mendapatkan intervensi yang tepat di waktu yang tepat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Tanda yang Perlu Diwaspadai */}
            <Card className="p-5 md:p-6 border border-border/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="grid size-9 place-items-center rounded-xl bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-5" />
                  </div>
                  <h3 className="text-base md:text-lg font-extrabold text-foreground">
                    Tanda yang Perlu Diwaspadai
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Tidak mengoceh pada usia 12 bulan.",
                    "Tidak bisa menunjuk benda pada usia 12 bulan.",
                    "Belum mengucapkan kata berarti di usia 16 bulan.",
                    "Tidak merangkai dua kata di usia 24 bulan.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 rounded-2xl bg-secondary/60 p-3.5 text-xs text-foreground leading-relaxed"
                    >
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Right Card: Yang Bisa Dilakukan */}
            <Card className="p-5 md:p-6 border border-border/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="grid size-9 place-items-center rounded-xl bg-tile-mint text-tile-mint-foreground">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h3 className="text-base md:text-lg font-extrabold text-foreground">
                    Yang Bisa Dilakukan
                  </h3>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {[
                    "Konsultasi ke Dokter Anak",
                    "Terapi Wicara",
                    "Banyak mengajak ngobrol",
                    "Membacakan buku cerita",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs md:text-sm text-foreground">
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("pola-asuh-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 w-full rounded-full bg-primary-soft py-2.5 text-xs font-extrabold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Lihat Detail
              </button>
            </Card>
          </div>
        </section>

        {/* SECTION 2: POLA ASUH SUPORTIF */}
        <section id="pola-asuh-section">
          <Card className="p-5 md:p-6 border border-border/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="overflow-hidden rounded-3xl bg-muted h-64 md:h-full min-h-[220px]">
                <img
                  src="/asset/gambar 2.webp"
                  alt="Ibu dan anak bermain balok kayu"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-extrabold text-foreground">
                    Pola Asuh Suportif
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Membangun fondasi emosional yang kuat melalui kehadiran dan pengertian.
                  </p>
                </div>

                <div>
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                    PRINSIP POLA ASUH
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Kasih Sayang Tanpa Syarat", "Komunikasi Terbuka", "Disiplin Positif"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-soft px-3 py-1 text-xs font-extrabold text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                    TIPS
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Dengarkan anak tanpa menghakimi.",
                      "Berikan pujian pada usahanya, bukan hanya hasil.",
                      "Tetapkan aturan yang jelas dan konsisten.",
                    ].map((tip) => (
                      <li
                        key={tip}
                        className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-xs text-foreground"
                      >
                        <Check className="size-3.5 text-primary shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 3: PEMBATASAN SCREEN TIME */}
        <section id="screen-time-section">
          <div className="rounded-3xl bg-tile-sky/60 p-5 md:p-8 border border-tile-sky-foreground/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-extrabold text-foreground">
                    Pembatasan Screen Time
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Layar digital merupakan bagian dari dunia modern, namun paparannya harus dikontrol untuk mendukung perkembangan kognitif dan fisik anak yang optimal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-card p-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Clock className="size-4" />
                      <span className="text-xs font-extrabold">0-18 Bulan</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Hanya untuk video call dengan keluarga.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-card p-4 shadow-2xs">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Clock className="size-4" />
                      <span className="text-xs font-extrabold">18-24 Bulan</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Tontonan edukatif bersama orang tua, durasi dibatasi.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-card p-4 shadow-2xs">
                  <p className="text-xs font-extrabold text-foreground mb-2">Tips Membatasi</p>
                  <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 size-1 rounded-full bg-primary shrink-0" />
                      <span>Buat zone bebas layar di rumah.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 size-1 rounded-full bg-primary shrink-0" />
                      <span>Berikan contoh yang baik dengan mengurangi waktu layar Anda sendiri.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 size-1 rounded-full bg-primary shrink-0" />
                      <span>Ganti waktu layar dengan aktivitas fisik.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-muted h-64 md:h-full min-h-[240px]">
                <img
                  src="/asset/gambar 3.webp"
                  alt="Anak di meja belajar dengan tablet"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: AKTIVITAS POSITIF BERSAMA ANAK */}
        <section id="aktivitas-section">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
              Aktivitas Positif Bersama Anak
            </h2>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground leading-relaxed">
              Habiskan waktu berkualitas melalui kegiatan yang merangsang kreativitas dan perkembangan motorik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Featured Left Card */}
            <Card className="md:col-span-2 p-0 overflow-hidden border border-border/60 flex flex-col justify-between">
              <div className="relative h-56 md:h-64 w-full bg-muted">
                <img
                  src="/asset/gambar 3.webp"
                  alt="Membangun Imajinasi Bersama"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                  <h3 className="text-lg md:text-xl font-extrabold text-white">
                    Membangun Imajinasi Bersama
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                <div className="rounded-2xl bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 mb-1 text-primary">
                    <Activity className="size-4" />
                    <p className="text-sm font-extrabold text-foreground">Bermain & Bergerak</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Aktivitas fisik untuk melatih motorik kasar dan halus.
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 mb-1 text-primary">
                    <BookOpen className="size-4" />
                    <p className="text-sm font-extrabold text-foreground">Membaca & Bercerita</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Memperkaya kosakata dan melatih daya konsentrasi anak.
                  </p>
                </div>
              </div>
            </Card>

            {/* Right Column Stacked Cards */}
            <div className="flex flex-col gap-4">
              <Card className="p-4 border border-border/60">
                <div className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-tile-mint text-tile-mint-foreground">
                    <Music className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground">Bernyanyi & Berbicara</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Stimulasi pendengaran dan pengenalan nada serta artikulasi.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border border-border/60">
                <div className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-tile-violet text-tile-violet-foreground">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground">Bermain Peran</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Melatih empati dan kemampuan memecahkan masalah.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border border-border/60">
                <div className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-tile-cream text-tile-cream-foreground">
                    <Palette className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground">Aktivitas Kreatif</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Menggambar atau mewarnai untuk ekspresi diri.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 5: MENGAPA PENTING? & HAL YANG PERLU DIINGAT */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mengapa Penting? */}
          <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-[var(--shadow-soft)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="size-5 text-primary-foreground" />
                <h3 className="text-lg font-extrabold text-primary-foreground">Mengapa Penting?</h3>
              </div>
              <p className="text-xs md:text-sm leading-relaxed opacity-95">
                Setiap momen yang Anda habiskan bersama anak, setiap aturan yang Anda terapkan dengan kasih sayang, dan setiap stimulasi yang Anda berikan membentuk fondasi kuat bagi masa depan mereka. Masa kanak-kanak adalah masa emas pembentukan karakter dan kecerdasan.
              </p>
            </div>
          </div>

          {/* Hal yang Perlu Diingat */}
          <div className="rounded-3xl bg-tile-sky/60 p-6 border border-tile-sky-foreground/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="size-5 text-primary" />
                <h3 className="text-lg font-extrabold text-foreground">Hal yang Perlu Diingat</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Setiap anak berkembang dengan kecepatannya masing-masing.",
                  "Konsistensi adalah kunci dalam menerapkan pola asuh.",
                  "Jangan ragu mencari bantuan profesional jika Anda merasa khawatir dengan perkembangan anak.",
                ].map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-xs md:text-sm text-foreground leading-relaxed">
                    <span className="mt-1 size-2 rounded-full border-2 border-primary shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </AppShell>
  );
}


