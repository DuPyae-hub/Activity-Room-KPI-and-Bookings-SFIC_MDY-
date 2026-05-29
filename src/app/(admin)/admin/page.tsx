import { ApprovalsQueue } from "@/components/admin/approvals-queue";
import { KpiCharts } from "@/components/admin/kpi-charts";
import { getAdminKpis, getPendingBookings } from "@/data/queries";

export default async function AdminPage() {
  const [kpis, pending] = await Promise.all([
    getAdminKpis(),
    getPendingBookings(),
  ]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-brand-red">Management console</p>
        <h1 className="text-3xl font-bold">KPI & Approvals</h1>
        <p className="mt-1 text-white/50">
          Strategy First institutional metrics and real-time request queue.
        </p>
      </header>

      <KpiCharts
        topClubs={kpis.topClubs}
        peakHours={kpis.peakHours}
        pendingCount={kpis.pendingCount}
      />

      <h2 className="mb-4 mt-10 text-lg font-semibold">Pending approvals</h2>
      <ApprovalsQueue bookings={pending} />
    </div>
  );
}
