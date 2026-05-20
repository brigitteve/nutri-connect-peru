import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Brain, Apple, Timer, Trophy, Lock, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/juegos")({
  component: Juegos,
});

const quiz = [
  { q: "¿Qué alimento aporta más proteína por 100g?", opts: ["Quinoa", "Pechuga de pollo", "Palta"], a: 1 },
  { q: "¿Cuál es un carbohidrato andino?", opts: ["Camote", "Quinoa", "Ambos"], a: 2 },
  { q: "¿Qué tiene menos sodio?", opts: ["Sillao bajo sodio", "Sillao normal", "Sal de mesa"], a: 0 },
];

function Juegos() {
  const [active, setActive] = useState<null | "quiz">(null);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  if (active === "quiz") {
    const item = quiz[i];
    const done = i >= quiz.length;
    return (
      <AppShell>
        <div className="px-5 pt-6 flex items-center gap-3">
          <button onClick={() => setActive(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Quiz Nutri</p>
            <h1 className="text-lg font-bold">{done ? "Resultado" : `Pregunta ${i + 1} / ${quiz.length}`}</h1>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{score * 50} pts</span>
        </div>

        {!done ? (
          <section className="px-5 mt-8">
            <div className="rounded-3xl gradient-premium p-6 text-primary-foreground shadow-elevated">
              <Brain className="h-8 w-8 opacity-90" />
              <p className="mt-3 text-xl font-bold leading-snug">{item.q}</p>
            </div>
            <div className="mt-5 space-y-2">
              {item.opts.map((o, idx) => {
                const isPicked = picked === idx;
                const correct = picked !== null && idx === item.a;
                const wrong = isPicked && idx !== item.a;
                return (
                  <button
                    key={o}
                    disabled={picked !== null}
                    onClick={() => {
                      setPicked(idx);
                      if (idx === item.a) setScore((s) => s + 1);
                      setTimeout(() => { setPicked(null); setI(i + 1); }, 900);
                    }}
                    className={`w-full text-left rounded-2xl px-4 py-4 text-sm font-semibold border-2 transition ${
                      correct ? "border-success bg-success/10 text-success" :
                      wrong ? "border-destructive bg-destructive/10 text-destructive" :
                      "border-border bg-card"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="px-5 mt-12 text-center">
            <div className="mx-auto h-20 w-20 rounded-full gradient-premium flex items-center justify-center shadow-glow">
              <Trophy className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="mt-5 text-2xl font-bold">¡Bien hecho!</h2>
            <p className="mt-2 text-muted-foreground">Has ganado <b className="text-foreground">{score * 50} puntos</b></p>
            <button
              onClick={() => { setActive(null); setI(0); setScore(0); }}
              className="mt-8 rounded-full gradient-premium px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Volver a juegos
            </button>
          </section>
        )}
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-5 pt-6 flex items-center gap-3">
        <Link to="/logros" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Mini-juegos educativos</h1>
          <p className="text-xs text-muted-foreground">Aprende jugando · Suma puntos</p>
        </div>
      </div>

      <section className="px-5 mt-6 space-y-3">
        <GameCard
          icon={Brain} title="Quiz Nutri" desc="Pon a prueba tu conocimiento andino" reward="+150 pts"
          tint="gradient-premium text-primary-foreground"
          onClick={() => setActive("quiz")}
        />
        <GameCard
          icon={Apple} title="Adivina la kcal" desc="Estima las calorías de platos peruanos" reward="+100 pts"
          tint="bg-secondary text-secondary-foreground"
          locked
        />
        <GameCard
          icon={Timer} title="Reto 7 días" desc="Cumple tu plan toda la semana" reward="+500 pts"
          tint="bg-accent text-accent-foreground"
          locked
        />
      </section>

      <section className="px-5 mt-6">
        <div className="rounded-2xl bg-card p-4 shadow-card flex items-center gap-3">
          <Trophy className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-bold">Ranking semanal</p>
            <p className="text-xs text-muted-foreground">Estás en el puesto #14 de Lima</p>
          </div>
          <Link to="/logros" className="text-xs font-bold text-primary">Ver →</Link>
        </div>
      </section>

      <div className="h-6" />
    </AppShell>
  );
}

function GameCard({
  icon: Icon, title, desc, reward, tint, locked, onClick,
}: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; reward: string; tint: string; locked?: boolean; onClick?: () => void }) {
  return (
    <button
      disabled={locked}
      onClick={onClick}
      className={`relative w-full text-left rounded-3xl p-5 shadow-elevated transition ${tint} ${locked ? "opacity-60" : "active:scale-[0.98]"}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <p className="text-xs opacity-90">{desc}</p>
        </div>
        {locked ? <Lock className="h-4 w-4 opacity-80" /> : <ChevronRight className="h-5 w-5" />}
      </div>
      <span className="absolute top-3 right-3 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold backdrop-blur">
        {reward}
      </span>
    </button>
  );
}
