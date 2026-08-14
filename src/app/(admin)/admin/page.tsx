"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { AdminShell } from "@/components/AdminShell";
import {
  adminGetAllUsersFn,
  adminToggleAdminFn,
  adminGetDashboardStatsFn,
  adminDeleteUserFn,
} from "@/lib/api";
import {
  Users,
  Shield,
  ShieldOff,
  Clock,
  Activity,
  TrendingUp,
  UserCheck,
  UserPlus,
  AlertTriangle,
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  X,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type React from "react";

type UserRow = {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  childName: string | null;
  childBirthDate: string | null;
  logCount: number;
  screeningCount: number;
};

type DashboardStats = {
  newUsersCount: number;
  activeUsersCount: number;
  activityChart: { date: string; count: number }[];
  verdictChart: { verdict: string; count: number }[];
  needsAttention: {
    userId: string;
    childName: string;
    age: number;
    verdict: string;
    date: string;
  }[];
};

type SortKey = "logCount" | "screeningCount" | "createdAt";
type SortDir = "asc" | "desc";

function exportCsv(rows: UserRow[]) {
  const header = [
    "Email","Nama Anak","Tanggal Lahir","Jumlah Catatan","Jumlah Skrining","Role","Tanggal Daftar",
  ].join(",");
  const body = rows.map((u) =>
    [
      `"${u.email}"`,
      `"${u.childName ?? ""}"`,
      `"${u.childBirthDate ?? ""}"`,
      u.logCount,
      u.screeningCount,
      u.isAdmin ? "Admin" : "User",
      `"${new Date(u.createdAt).toLocaleDateString("id-ID")}"`,
    ].join(",")
  );
  const csv = [header, ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `speechpro-users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<UserRow | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  async function load() {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        adminGetAllUsersFn(),
        adminGetDashboardStatsFn(),
      ]);
      setUsers(usersData as UserRow[]);
      setStats(statsData as DashboardStats);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleAdmin(userId: string, current: boolean) {
    setToggling(userId);
    try {
      await adminToggleAdminFn({ data: { targetUserId: userId, isAdmin: !current } });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isAdmin: !current } : u));
    } finally {
      setToggling(null);
    }
  }

  async function handleDelete(userId: string) {
    setDeleting(userId);
    try {
      await adminDeleteUserFn({ data: { targetUserId: userId } });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleteConfirm(null);
    } finally {
      setDeleting(null);
    }
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const totalLogs = users.reduce((s, u) => s + u.logCount, 0);
  const totalScreenings = users.reduce((s, u) => s + u.screeningCount, 0);
  const adminCount = users.filter((u) => u.isAdmin).length;
  const avgScreenings = users.length > 0 ? (totalScreenings / users.length).toFixed(1) : "0";

  const filteredUsers = useMemo(() => {
    let result = users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.email.toLowerCase().includes(q) || (u.childName ?? "").toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || (roleFilter === "admin" && u.isAdmin) || (roleFilter === "user" && !u.isAdmin);
      return matchSearch && matchRole;
    });
    result = [...result].sort((a, b) => {
      const valA = sortKey === "logCount" ? a.logCount : sortKey === "screeningCount" ? a.screeningCount : new Date(a.createdAt).getTime();
      const valB = sortKey === "logCount" ? b.logCount : sortKey === "screeningCount" ? b.screeningCount : new Date(b.createdAt).getTime();
      return sortDir === "asc" ? (valA < valB ? -1 : valA > valB ? 1 : 0) : (valA > valB ? -1 : valA < valB ? 1 : 0);
    });
    return result;
  }, [users, search, roleFilter, sortKey, sortDir]);

  const activityChartData = (stats?.activityChart ?? []).map((d) => ({
    ...d,
    label: d.date.slice(5).replace("-", "/"),
  }));

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola semua pengguna SpeechPro</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={<Users className="size-5 text-primary" />} label="Total User" value={users.length} color="bg-primary-soft" />
          <StatCard icon={<Shield className="size-5 text-violet-600" />} label="Admin" value={adminCount} color="bg-tile-violet" />
          <StatCard icon={<Activity className="size-5 text-emerald-600" />} label="Total Catatan" value={totalLogs} color="bg-tile-mint" />
          <StatCard icon={<Clock className="size-5 text-amber-600" />} label="Total Skrining" value={totalScreenings} color="bg-tile-cream" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard icon={<UserPlus className="size-5 text-blue-600" />} label="User Baru (7 hari)" value={stats?.newUsersCount ?? "—"} color="bg-tile-sky" />
          <StatCard icon={<UserCheck className="size-5 text-rose-600" />} label="User Aktif (7 hari)" value={stats?.activeUsersCount ?? "—"} color="bg-tile-blush" />
          <StatCard icon={<TrendingUp className="size-5 text-teal-600" />} label="Avg Skrining/User" value={avgScreenings} color="bg-tile-mint" />
        </div>

        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-3xl bg-card shadow-[var(--shadow-card)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="size-4 text-primary" />
                <h2 className="font-extrabold text-secondary-foreground text-sm">Aktivitas Catatan — 30 Hari Terakhir</h2>
              </div>
              {activityChartData.every((d) => d.count === 0) ? (
                <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Belum ada data aktivitas</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={activityChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} labelStyle={{ fontWeight: 700 }} />
                    <Line type="monotone" dataKey="count" name="Catatan" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-3xl bg-card shadow-[var(--shadow-card)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="size-4 text-primary" />
                <h2 className="font-extrabold text-secondary-foreground text-sm">Distribusi Hasil Skrining</h2>
              </div>
              {stats.verdictChart.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Belum ada data skrining</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats.verdictChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="verdict" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="count" name="Jumlah" radius={[6, 6, 0, 0]} fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {stats && stats.needsAttention.length > 0 && (
          <div className="rounded-3xl bg-card shadow-[var(--shadow-card)] overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              <h2 className="font-extrabold text-secondary-foreground">Perlu Perhatian</h2>
              <span className="ml-auto text-xs text-muted-foreground">{stats.needsAttention.length} anak</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-amber-50/50 dark:bg-amber-950/20">
                    <th className="px-5 py-3 text-left text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Nama Anak</th>
                    <th className="px-5 py-3 text-center text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Usia (bln)</th>
                    <th className="px-5 py-3 text-left text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Verdict Terakhir</th>
                    <th className="px-5 py-3 text-left text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Tanggal</th>
                    <th className="px-5 py-3 text-center text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {stats.needsAttention.map((a) => (
                    <tr key={a.userId} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3 font-bold text-foreground">{a.childName}</td>
                      <td className="px-5 py-3 text-center">{a.age}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${
                          a.verdict.toLowerCase().includes("penyimpangan")
                            ? "bg-destructive/10 text-destructive"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {a.verdict}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-[0.75rem]">{a.date}</td>
                      <td className="px-5 py-3 text-center">
                        <Link href={`/admin/users/${a.userId}`} className="rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="rounded-3xl bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <div className="px-5 py-4 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-secondary-foreground">Semua Pengguna</h2>
              <button
                type="button"
                onClick={() => exportCsv(filteredUsers)}
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Download className="size-3.5" /> Export CSV
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari email atau nama anak..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-border bg-background pl-8 pr-8 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as "all" | "admin" | "user")}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">Semua Role</option>
                <option value="admin">Admin Saja</option>
                <option value="user">User Saja</option>
              </select>
              <span className="self-center text-xs text-muted-foreground whitespace-nowrap">{filteredUsers.length} user</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
              <span className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary mr-2" />
              Memuat data...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="px-5 py-3 text-left text-xs font-extrabold text-muted-foreground uppercase tracking-wide">User</th>
                    <th className="px-5 py-3 text-left text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Anak</th>
                    <SortableTh label="Catatan" sortKey="logCount" current={sortKey} dir={sortDir} onSort={handleSort} />
                    <SortableTh label="Skrining" sortKey="screeningCount" current={sortKey} dir={sortDir} onSort={handleSort} />
                    <SortableTh label="Daftar" sortKey="createdAt" current={sortKey} dir={sortDir} onSort={handleSort} />
                    <th className="px-5 py-3 text-center text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Admin</th>
                    <th className="px-5 py-3 text-center text-xs font-extrabold text-muted-foreground uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-foreground truncate max-w-[180px]">{u.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-foreground">{u.childName ?? "—"}</p>
                        {u.childBirthDate && <p className="text-[0.7rem] text-muted-foreground">{u.childBirthDate}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-tile-mint text-xs font-extrabold">{u.logCount}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-tile-violet text-xs font-extrabold">{u.screeningCount}</span>
                      </td>
                      <td className="px-5 py-3.5 text-[0.7rem] text-muted-foreground whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {u.isAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-bold text-primary">
                            <Shield className="size-3" /> Admin
                          </span>
                        ) : (
                          <span className="text-[0.7rem] text-muted-foreground">User</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/users/${u.id}`} className="rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                            Detail
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleAdmin(u.id, u.isAdmin)}
                            disabled={toggling === u.id}
                            title={u.isAdmin ? "Cabut admin" : "Jadikan admin"}
                            className={`rounded-full p-1.5 transition-colors disabled:opacity-50 ${u.isAdmin ? "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" : "bg-primary/10 text-primary hover:bg-primary hover:text-white"}`}
                          >
                            {u.isAdmin ? <ShieldOff className="size-3.5" /> : <Shield className="size-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(u)}
                            title="Hapus user"
                            className="rounded-full p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                        {search || roleFilter !== "all" ? "Tidak ada user yang cocok dengan filter" : "Belum ada pengguna"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="mx-4 w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-destructive/10 p-2.5">
                <Trash2 className="size-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground">Hapus User</h3>
                <p className="text-xs text-muted-foreground">Tindakan ini tidak bisa dibatalkan</p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-1">
              Yakin ingin menghapus <span className="font-bold">{deleteConfirm.email}</span>?
            </p>
            <p className="text-xs text-muted-foreground mb-5">
              Semua data catatan, skrining, dan profil anak akan ikut terhapus secara permanen.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-full border border-border py-2 text-sm font-bold text-foreground hover:bg-secondary transition-colors">
                Batal
              </button>
              <button
                type="button"
                disabled={deleting === deleteConfirm.id}
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 rounded-full bg-destructive py-2 text-sm font-bold text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {deleting === deleteConfirm.id ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className={`rounded-3xl ${color} p-4 shadow-[var(--shadow-card)]`}>
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground font-bold mt-0.5">{label}</p>
    </div>
  );
}

function SortableTh({ label, sortKey, current, dir, onSort }: { label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (key: SortKey) => void }) {
  const active = current === sortKey;
  return (
    <th className="px-5 py-3 text-center text-xs font-extrabold text-muted-foreground uppercase tracking-wide">
      <button type="button" onClick={() => onSort(sortKey)} className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${active ? "text-foreground" : ""}`}>
        {label}
        <span className="inline-flex flex-col">
          <ChevronUp className={`size-2.5 -mb-0.5 ${active && dir === "asc" ? "text-primary" : "opacity-30"}`} />
          <ChevronDown className={`size-2.5 ${active && dir === "desc" ? "text-primary" : "opacity-30"}`} />
        </span>
      </button>
    </th>
  );
}
