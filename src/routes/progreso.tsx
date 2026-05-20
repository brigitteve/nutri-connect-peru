import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, TrendingDown, TrendingUp, Flame } from "lucide-react";

export const Route = createFileRoute("/progreso")({
  component: Progreso,
});

const semanas = [62.4, 62.1, 61.8, 61.5, 61.2, 60.9, 60.6, 60.3];
const kcal = [1620, 1750, 1480, 1820, 1690, 1550, 1710];

function Progreso() {
  const min = Math.min(...semanas) - 0.5;
  const max = Math.max(...semanas) + 0.5;
  const maxK = Math.max(...kcal);

  return (
    <AppShell>
      <div className="px-5 pt-6 flex items-center gap-3">
        <Link to="/perfil" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Mi progreso</h1>
          <p className="text-xs text-muted-foreground">Últimas 8 semanas</p>
        </div>
      </div>

      {/* KPIs */}
      <section className="px-5 mt-6 grid grid-cols-3 gap-3">
        <Kpi icon={TrendingDown} value="-2.1 kg" label="8 semanas" tint="bg-secondary/20 text-secondary-foreground" />
        <Kpi icon={Flame} value="1,650" label="kcal prom." tint="bg-primary/10 text-primary" />
        <Kpi icon={TrendingUp} value="92g" label="proteína" tint="bg-accent text-accent-foreground" />
      </section>

      {/* Peso */}
      <section className="px-5 mt-6">
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Peso</p>
              <p className="text-2xl font-bold">60.3 kg</p>
            </div>
            <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary-foreground">-2.1 kg</span>
          </div>
          <svg viewBox="0 0 320 120" className="mt-4 w-full h-32">
            <defs>
              <linearGradient id="gP" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.18 22)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(0.7 0.18 22)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const pts = semanas.map((v, i) => {
                const x = (i / (semanas.length - 1)) * 300 + 10;
                const y = 110 - ((v - min) / (max - min)) * 100;
                return [x, y] as const;
              });
              const d = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
              const fill = `${d} L310,110 L10,110 Z`;
              return (
                <>
                  <path d={fill} fill="url(#gP)" />
                  <path d={d} fill="none" stroke="oklch(0.7 0.18 22)" strokeWidth="2.5" strokeLinecap="round" />
                  {pts.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill="oklch(0.7 0.18 22)" />
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      </section>

      {/* Calorías */}
      <section className="px-5 mt-5">
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Calorías esta semana</p>
          <div className="mt-4 flex items-end gap-2 h-32">
            {kcal.map((k, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-lg gradient-premium"
                  style={{ height: `${(k / maxK) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{["L","M","X","J","V","S","D"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Macros radar simple */}
      <section className="px-5 mt-5">
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Adherencia a tu plan</p>
          <div className="mt-3 space-y-3">
            <Bar label="Proteína" pct={92} tint="bg-primary" />
            <Bar label="Carbohidratos" pct={78} tint="bg-secondary" />
            <Bar label="Grasas" pct={64} tint="bg-accent" />
            <Bar label="Fibra" pct={88} tint="bg-success" />
          </div>
        </div>
      </section>

      <div className="h-6" />
    </AppShell>
  );
}

function Kpi({ icon: Icon, value, label, tint }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string; tint: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-2 text-lg font-bold leading-none">{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Bar({ label, pct, tint }: { label: string; pct: number; tint: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold">{label}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${tint} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
