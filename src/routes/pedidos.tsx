import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ChefHat, Package, Bike, Check, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/pedidos")({
  component: Pedidos,
});

const steps = [
  { icon: ChefHat, label: "Preparando", done: true },
  { icon: Package, label: "Listo", done: true },
  { icon: Bike, label: "En camino", done: false, active: true },
  { icon: Check, label: "Entregado", done: false },
];

function Pedidos() {
  return (
    <AppShell>
      <header className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold">Mis pedidos</h1>
      </header>

      <section className="px-5 mt-2">
        <div className="rounded-3xl bg-card shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pedido #N-2847</p>
              <h2 className="font-bold mt-0.5">Lomo Saltado Fit</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Sazón Saludable · S/ 32</p>
            </div>
            <span className="rounded-full bg-secondary/20 px-2.5 py-1 text-[10px] font-bold text-secondary-foreground">
              EN CAMINO
            </span>
          </div>

          {/* Tracker */}
          <div className="mt-6 relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
            <div className="absolute top-5 left-5 h-0.5 bg-primary transition-all" style={{ width: "50%" }} />
            <div className="relative grid grid-cols-4">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                      s.done
                        ? "bg-primary text-primary-foreground"
                        : s.active
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <s.icon className="h-4 w-4" />
                  </div>
                  <p className={`mt-2 text-[10px] font-semibold ${s.done || s.active ? "" : "text-muted-foreground"}`}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-sm">
            Llegada estimada <strong>1:42 PM</strong>
          </p>

          <Link to="/chat" className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold">
            <MessageCircle className="h-4 w-4" /> Chatear con el restaurante
          </Link>
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">Anteriores</h2>
        <div className="space-y-2.5">
          {["Bowl Quinoa Andina", "Ceviche Light", "Bowl Quinoa Andina"].map((n, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card">
              <div>
                <p className="font-semibold text-sm">{n}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Hace {i + 2} días · Entregado</p>
              </div>
              <Link to="/valoracion" className="text-xs font-bold text-primary">Valorar</Link>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
