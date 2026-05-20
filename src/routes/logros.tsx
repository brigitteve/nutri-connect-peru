import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Trophy, Target, Flame, Award, Lock, Gamepad2, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar on mount
    const timer = setTimeout(() => setProgress(62), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppShell>
      <header className="px-5 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Logros y retos</h1>
        <Link to="/juegos" className="inline-flex items-center gap-1.5 rounded-full gradient-premium px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-glow transition hover:scale-105 active:scale-95">
          <Gamepad2 className="h-3.5 w-3.5" /> Jugar
        </Link>
      </header>

      {/* Nivel */}
      <section className="px-5">
        <div className="relative overflow-hidden rounded-3xl gradient-premium p-5 text-primary-foreground shadow-elevated">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -right-12 bottom-0 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-2xl shadow-sm">
              🥑
            </div>
            <div className="flex-1">
              <p className="text-xs opacity-90 uppercase tracking-wider font-semibold">Nivel 4</p>
              <h2 className="text-xl font-bold">Nutri Explorador</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">1,240</p>
              <p className="text-[10px] opacity-90 font-semibold uppercase tracking-wider">puntos</p>
            </div>
          </div>
          <div className="relative z-10 mt-5">
            <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5 opacity-90">
              <span>Nvl 4</span>
              <span>Nvl 5</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <p className="mt-2 text-xs font-medium text-center">
              Faltan <strong className="font-bold">760 pts</strong> para desbloquear <strong className="font-bold">Nutri Maestro</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Retos activos */}
      <section className="px-5 mt-6">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Retos activos</h2>
          <span className="text-[10px] font-bold text-primary animate-pulse">Renueva en 4h</span>
        </div>
        <div className="space-y-2.5">
          <ChallengeCard icon={Flame} title="Racha de 10 días" progress={70} reward="+200 pts" />
          <ChallengeCard icon={Target} title="3 platos con quinoa" progress={33} reward="+100 pts" />
          <ChallengeCard icon={Trophy} title="Prueba 5 restaurantes" progress={60} reward="+150 pts" />
        </div>
      </section>

      {/* Insignias */}
      <section className="px-5 mt-6 pb-6">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Insignias</h2>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-300 ${
                b.unlocked 
                  ? "bg-card border-border shadow-sm hover:scale-105 hover:shadow-md cursor-pointer" 
                  : "bg-muted border-transparent opacity-60"
              }`}
            >
              <div className="text-3xl relative">
                {b.unlocked ? (
                  <>
                    <span className="relative z-10">{b.icon}</span>
                    <div className="absolute inset-0 bg-gold/20 blur-md rounded-full z-0" />
                  </>
                ) : (
                  <Lock className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <p className="text-[11px] text-center font-semibold leading-tight">{b.name}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function ChallengeCard({
  icon: Icon, title, progress, reward,
}: { icon: React.ComponentType<{ className?: string }>; title: string; progress: number; reward: string }) {
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimProgress(progress), 400);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="rounded-2xl bg-card p-4 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <Icon className="h-5 w-5 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-[10px] font-bold text-accent-foreground mt-0.5">{reward}</p>
        </div>
        <span className="text-xs font-bold text-primary">{animProgress}%</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full gradient-premium rounded-full transition-all duration-1000 ease-out" style={{ width: `${animProgress}%` }} />
      </div>
    </div>
  );
}
