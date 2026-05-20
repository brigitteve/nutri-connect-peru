import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Star, TrendingUp, Plus, Check, X } from "lucide-react";

export const Route = createFileRoute("/restaurante")({
  component: Restaurante,
});

function Restaurante() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-auto max-w-md">
        <header className="flex items-center gap-3 px-5 pt-6 pb-3">
          <Link to="/perfil" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Restaurante</p>
            <h1 className="text-xl font-bold flex items-center gap-1.5">
              <ChefHat className="h-5 w-5 text-primary" /> Sazón Saludable
            </h1>
          </div>
        </header>

        {/* Métricas */}
        <section className="px-5 mt-2 grid grid-cols-3 gap-3">
          <MetricCard label="Pedidos hoy" value="34" trend="+12%" />
          <MetricCard label="Rating" value="4.8" icon={<Star className="h-3 w-3 fill-current" />} />
          <MetricCard label="Ranking" value="#3" trend="↑2" />
        </section>

        {/* Pedidos pendientes */}
        <section className="px-5 mt-6">
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Confirmaciones pendientes</h2>
          <div className="space-y-3">
            {[
              { name: "Camila R.", dish: "Lomo Saltado Fit (a medida)", time: "1:30 PM" },
              { name: "Diego M.", dish: "Bowl Quinoa Andina", time: "2:00 PM" },
            ].map((o, i) => (
              <div key={i} className="rounded-2xl bg-card p-4 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">{o.dish}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.name} · {o.time}</p>
                  </div>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                    NUEVA
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground">
                    <Check className="h-3.5 w-3.5" /> Aceptar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-border py-2.5 text-xs font-bold">
                    <X className="h-3.5 w-3.5" /> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platos */}
        <section className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mis platos</h2>
            <button className="flex items-center gap-1 text-xs font-bold text-primary">
              <Plus className="h-3.5 w-3.5" /> Nuevo
            </button>
          </div>
          <div className="space-y-2">
            {[
              { name: "Lomo Saltado Fit", price: 32, active: true },
              { name: "Bowl Quinoa Andina", price: 24, active: true },
              { name: "Ensalada César Light", price: 18, active: false },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="font-semibold text-sm">{d.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">S/ {d.price}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase ${d.active ? "text-secondary-foreground" : "text-muted-foreground"}`}>
                  {d.active ? "● Activo" : "○ Pausado"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, icon }: { label: string; value: string; trend?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className="flex items-center gap-1 text-secondary-foreground">
        {icon}
        <TrendingUp className="h-3 w-3 opacity-0" />
      </div>
      <p className="mt-1 text-xl font-bold leading-none">{value}</p>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        {trend && <span className="text-[10px] font-bold text-secondary-foreground">{trend}</span>}
      </div>
    </div>
  );
}
