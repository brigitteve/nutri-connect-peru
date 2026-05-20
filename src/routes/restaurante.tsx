import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Star, TrendingUp, Plus, Check, X, ShieldCheck, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/restaurante")({
  component: Restaurante,
});

type Order = { id: string; name: string; dish: string; time: string; status: "pending" | "preparing" | "ready" };

const initialOrders: Order[] = [
  { id: "1", name: "Camila R.", dish: "Lomo Saltado Fit (a medida)", time: "1:30 PM", status: "pending" },
  { id: "2", name: "Diego M.", dish: "Bowl Quinoa Andina", time: "2:00 PM", status: "pending" },
];

function Restaurante() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const acceptOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "preparing" } : o))
    );
  };

  const rejectOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Banner modo restaurante */}
      <div className="bg-foreground text-background px-5 py-2 text-center text-[11px] font-semibold flex items-center justify-center gap-2">
        <ChefHat className="h-3.5 w-3.5" /> Modo restaurante activo
        <Link to="/perfil" className="ml-2 underline opacity-80">Volver a modo usuario</Link>
      </div>

      <div className="mx-auto max-w-md">
        <header className="flex items-center gap-3 px-5 pt-5 pb-3">
          <Link to="/perfil" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card transition active:scale-95">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Restaurante</p>
            <h1 className="text-xl font-bold flex items-center gap-1.5">
              <ChefHat className="h-5 w-5 text-primary" /> Sazón Saludable 
              <ShieldCheck className="h-5 w-5 text-success ml-1" />
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Gestión de Pedidos</h2>
            <span className="bg-accent px-2 py-0.5 rounded-full text-[10px] font-bold text-accent-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {orders.filter(o => o.status === 'pending').length} ptes
            </span>
          </div>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center p-6 bg-card rounded-2xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No hay pedidos activos.</p>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="rounded-2xl bg-card p-4 shadow-card transition-all duration-500 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm leading-tight">{o.dish}</p>
                      <p className="text-xs text-muted-foreground mt-1">{o.name} · Para: {o.time}</p>
                    </div>
                    {o.status === "pending" ? (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground shadow-sm animate-pulse">
                        NUEVA
                      </span>
                    ) : (
                      <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                        PREPARANDO
                      </span>
                    )}
                  </div>
                  
                  {o.status === "pending" ? (
                    <div className="mt-4 flex gap-2 animate-in slide-in-from-bottom-2 duration-300">
                      <button 
                        onClick={() => acceptOrder(o.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-glow transition active:scale-95"
                      >
                        <Check className="h-4 w-4" /> Aceptar
                      </button>
                      <button 
                        onClick={() => rejectOrder(o.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-full border-2 border-muted py-2.5 text-xs font-bold transition hover:bg-muted active:scale-95"
                      >
                        <X className="h-4 w-4" /> Rechazar
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 animate-in fade-in duration-500">
                       <button className="w-full flex items-center justify-center gap-1.5 rounded-full bg-secondary py-2.5 text-xs font-bold text-secondary-foreground transition active:scale-95">
                        <Check className="h-4 w-4" /> Marcar como Listo
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Platos */}
        <section className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mis platos</h2>
            <Link to="/restaurante/menu" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline transition">
              <Plus className="h-3.5 w-3.5" /> Gestionar menú
            </Link>
          </div>
          <div className="space-y-2">
            {[
              { name: "Lomo Saltado Fit", price: 32, active: true },
              { name: "Bowl Quinoa Andina", price: 24, active: true },
              { name: "Ensalada César Light", price: 18, active: false },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm hover:shadow-md transition">
                <div>
                  <p className="font-semibold text-sm leading-tight">{d.name}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">S/ {d.price}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${d.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                  {d.active ? "Activo" : "Pausado"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom nav exclusivo del modo restaurante */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg pb-safe">
        <div className="mx-auto max-w-md grid grid-cols-4">
          <RNavItem label="Pedidos" active />
          <RNavItem to="/restaurante/menu" label="Menú" />
          <RNavItem to="/restaurante/ingresos" label="Ingresos" />
          <RNavItem label="Ranking" />
        </div>
      </nav>
    </div>
  );
}

function RNavItem({ label, active, to }: { label: string; active?: boolean; to?: string }) {
  const content = (
    <button className={`w-full py-4 text-[11px] font-bold transition-colors ${active ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
      {label}
    </button>
  );
  
  if (to) {
    return <Link to={to} className="w-full">{content}</Link>;
  }
  return content;
}

function MetricCard({ label, value, trend, icon }: { label: string; value: string; trend?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card transition hover:shadow-md">
      <div className="flex items-center gap-1 text-secondary-foreground mb-1">
        {icon}
        {!icon && <TrendingUp className="h-3.5 w-3.5" />}
      </div>
      <p className="text-2xl font-bold leading-none">{value}</p>
      <div className="mt-1.5 flex items-center justify-between">
        <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
        {trend && <span className="text-[10px] font-bold text-success bg-success/15 px-1 rounded">{trend}</span>}
      </div>
    </div>
  );
}
