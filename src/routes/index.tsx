import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { dishes } from "@/lib/dishes";
import { Flame, Trophy, TrendingUp, Sparkles, ChevronRight, Crown } from "lucide-react";
import heroImg from "@/assets/hero-nutritionist.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NutriConnect — Platos personalizados por nutricionistas" },
      { name: "description", content: "Reserva platos saludables a medida, sigue tus metas y gana logros." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <AppShell>
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Hola,</p>
            <h1 className="text-2xl font-bold">Camila 👋</h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
            <span className="text-xs font-bold text-accent-foreground">1,240 pts</span>
          </div>
        </div>
      </header>

      {/* Premium CTA */}
      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl gradient-premium p-5 text-primary-foreground shadow-elevated">
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Crown className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider opacity-90">Premium</p>
              <p className="font-bold leading-tight">Reserva un plato 100% a tu medida</p>
            </div>
          </div>
          <p className="relative z-10 mt-3 text-sm opacity-95">
            Nuestros nutricionistas diseñan tu plato según tus macros, alergias y objetivos.
          </p>
          <Link
            to="/reservar"
            className="relative z-10 mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary"
          >
            Reservar ahora <ChevronRight className="h-4 w-4" />
          </Link>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -right-12 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        </div>
      </section>

      {/* Progreso */}
      <section className="px-5 mt-6">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Hoy</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Flame} value="1,420" label="kcal" tint="primary" />
          <StatCard icon={TrendingUp} value="92g" label="proteína" tint="secondary" />
          <StatCard icon={Trophy} value="3" label="retos" tint="accent" />
        </div>
      </section>

      {/* Recomendados */}
      <section className="mt-7">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-lg font-bold">Recomendados para ti</h2>
          <Link to="/explorar" className="text-sm font-semibold text-primary">Ver todos</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none px-5 pb-2">
          {dishes.map((d) => (
            <Link
              key={d.id}
              to="/plato/$id"
              params={{ id: d.id }}
              className="group w-64 shrink-0 overflow-hidden rounded-2xl bg-card shadow-card transition-all hover:shadow-elevated"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {d.premium && (
                  <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full premium-shine px-2.5 py-1 text-[10px] font-bold text-gold-foreground shadow">
                    <Crown className="h-3 w-3" /> A MEDIDA
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{d.restaurant}</p>
                <h3 className="mt-0.5 font-semibold leading-tight">{d.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{d.kcal} kcal · {d.protein}g prot</span>
                  <span className="font-bold text-primary">S/ {d.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nutricionista */}
      <section className="px-5 mt-7">
        <div className="overflow-hidden rounded-3xl bg-card shadow-card">
          <img src={heroImg} alt="Nutricionista" className="aspect-[5/3] w-full object-cover" />
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Conoce a tu nutricionista</p>
            <h3 className="mt-1 text-lg font-bold">Lucía Vargas, Mg.</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Más de 800 planes personalizados creados con ingredientes peruanos.
            </p>
          </div>
        </div>
      </section>

      <div className="h-6" />
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  tint: "primary" | "secondary" | "accent";
}) {
  const tintMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/20 text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
  };
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl ${tintMap[tint]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
