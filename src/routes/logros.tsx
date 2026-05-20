import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Trophy, Target, Flame, Award, Lock } from "lucide-react";

export const Route = createFileRoute("/logros")({
  component: Logros,
});

const badges = [
  { icon: "🥇", name: "Primera semana", unlocked: true },
  { icon: "🥑", name: "Plato vegano", unlocked: true },
  { icon: "🔥", name: "7 días seguidos", unlocked: true },
  { icon: "💪", name: "Macro maestro", unlocked: false },
  { icon: "🌽", name: "Sabor andino", unlocked: false },
  { icon: "🏆", name: "Top 100", unlocked: false },
];

function Logros() {
  return (
    <AppShell>
      <header className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold">Logros y retos</h1>
      </header>

      {/* Nivel */}
      <section className="px-5">
        <div className="rounded-3xl gradient-premium p-5 text-primary-foreground shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-2xl">
              🥑
            </div>
            <div className="flex-1">
              <p className="text-xs opacity-90 uppercase tracking-wider">Nivel 4</p>
              <h2 className="text-xl font-bold">Nutri Explorador</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">1,240</p>
              <p className="text-[10px] opacity-90">puntos</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "62%" }} />
            </div>
            <p className="mt-1.5 text-xs opacity-90">760 pts para Nivel 5 · Nutri Maestro</p>
          </div>
        </div>
      </section>

      {/* Retos activos */}
      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Retos activos</h2>
        <div className="space-y-2.5">
          <ChallengeCard icon={Flame} title="Racha de 10 días" progress={70} reward="+200 pts" />
          <ChallengeCard icon={Target} title="3 platos con quinoa" progress={33} reward="+100 pts" />
          <ChallengeCard icon={Trophy} title="Prueba 5 restaurantes" progress={60} reward="+150 pts" />
        </div>
      </section>

      {/* Insignias */}
      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Insignias</h2>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 ${
                b.unlocked ? "bg-card border-border" : "bg-muted border-transparent opacity-60"
              }`}
            >
              <div className="text-3xl">{b.unlocked ? b.icon : <Lock className="h-7 w-7 text-muted-foreground" />}</div>
              <p className="text-[11px] text-center font-semibold leading-tight">{b.name}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-6" />
    </AppShell>
  );
}

function ChallengeCard({
  icon: Icon, title, progress, reward,
}: { icon: React.ComponentType<{ className?: string }>; title: string; progress: number; reward: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <Icon className="h-4 w-4 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{reward}</p>
        </div>
        <span className="text-xs font-bold text-primary">{progress}%</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full gradient-premium rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
