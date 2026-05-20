import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Crown, Check, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/personalizar")({
  component: Personalizar,
});

const proteinas = ["Pollo", "Pescado", "Lomo magro", "Tofu", "Quinoa", "Huevo"];
const carbos = ["Arroz integral", "Camote", "Quinoa", "Choclo", "Yuca", "Sin carbo"];
const veggies = ["Palta", "Espinaca", "Tomate", "Pepino", "Brócoli", "Zanahoria"];
const salsas = ["Ají amarillo light", "Limón", "Vinagreta", "Sin salsa"];

function Personalizar() {
  const [step, setStep] = useState(1);
  const [kcal, setKcal] = useState(550);
  const [picks, setPicks] = useState<Record<string, string[]>>({
    proteina: ["Pollo"],
    carbo: ["Quinoa"],
    veggie: ["Palta", "Tomate"],
    salsa: ["Limón"],
  });

  const toggle = (key: string, val: string, max = 2) => {
    setPicks((p) => {
      const cur = p[key] || [];
      if (cur.includes(val)) return { ...p, [key]: cur.filter((x) => x !== val) };
      if (cur.length >= max) return { ...p, [key]: [...cur.slice(1), val] };
      return { ...p, [key]: [...cur, val] };
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="px-5 pt-6 flex items-center justify-between">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full premium-shine px-3 py-1 text-[10px] font-bold text-gold-foreground">
            <Crown className="h-3 w-3" /> PREMIUM
          </span>
        </div>

        <div className="px-5 mt-5">
          <h1 className="text-2xl font-bold leading-tight">Diseña tu plato a medida</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu nutricionista revisará y ajustará los macros antes de enviarlo al restaurante.
          </p>
        </div>

        {/* Progress dots */}
        <div className="px-5 mt-5 flex gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {step === 1 && (
          <Section title="Calorías objetivo" subtitle="Ajusta según tu plan del día">
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-bold text-primary">{kcal}</span>
                <span className="text-sm text-muted-foreground">kcal</span>
              </div>
              <input
                type="range" min={300} max={900} step={10}
                value={kcal} onChange={(e) => setKcal(+e.target.value)}
                className="mt-4 w-full accent-primary"
              />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <Macro label="Proteína" value={`${Math.round(kcal * 0.3 / 4)}g`} tint="bg-primary/10 text-primary" />
                <Macro label="Carbos" value={`${Math.round(kcal * 0.45 / 4)}g`} tint="bg-secondary/20 text-secondary-foreground" />
                <Macro label="Grasa" value={`${Math.round(kcal * 0.25 / 9)}g`} tint="bg-accent text-accent-foreground" />
              </div>
            </div>
          </Section>
        )}

        {step === 2 && (
          <>
            <Picker title="Proteína" subtitle="Elige hasta 2" options={proteinas} picked={picks.proteina} onPick={(v) => toggle("proteina", v)} />
            <Picker title="Carbohidrato" subtitle="Elige 1" options={carbos} picked={picks.carbo} onPick={(v) => toggle("carbo", v, 1)} />
          </>
        )}

        {step === 3 && (
          <>
            <Picker title="Vegetales" subtitle="Elige hasta 3" options={veggies} picked={picks.veggie} onPick={(v) => toggle("veggie", v, 3)} />
            <Picker title="Salsa o aliño" subtitle="Elige 1" options={salsas} picked={picks.salsa} onPick={(v) => toggle("salsa", v, 1)} />
          </>
        )}

        {step === 4 && (
          <Section title="Resumen" subtitle="Tu plato será revisado por Lucía Vargas, Mg.">
            <div className="rounded-3xl gradient-premium p-5 text-primary-foreground shadow-elevated">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-90">
                <Sparkles className="h-4 w-4" /> Diseño nutricional
              </div>
              <p className="mt-2 text-2xl font-bold leading-tight">Tu Bowl Personalizado</p>
              <p className="mt-1 text-sm opacity-95">{kcal} kcal · revisado por nutricionista</p>
            </div>
            <div className="mt-3 rounded-2xl bg-card p-5 shadow-card space-y-3">
              <SumRow label="Proteína" v={picks.proteina.join(", ")} />
              <SumRow label="Carbo" v={picks.carbo.join(", ")} />
              <SumRow label="Vegetales" v={picks.veggie.join(", ")} />
              <SumRow label="Salsa" v={picks.salsa.join(", ")} />
              <div className="h-px bg-border" />
              <SumRow label="Restaurante sugerido" v="Verde Andino" />
              <SumRow label="Tiempo" v="35–45 min" />
              <SumRow label="Precio estimado" v="S/ 34" highlight />
            </div>
          </Section>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-5 py-3">
        <div className="mx-auto max-w-md flex gap-2">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="rounded-full border border-border bg-background px-5 py-3.5 text-sm font-bold">
              Atrás
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="flex-1 flex items-center justify-center gap-2 rounded-full gradient-premium py-3.5 text-sm font-bold text-primary-foreground shadow-glow">
              Continuar <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <Link to="/reservar" className="flex-1 text-center rounded-full gradient-premium py-3.5 text-sm font-bold text-primary-foreground shadow-glow">
              Enviar a nutricionista
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="px-5 mt-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Picker({ title, subtitle, options, picked, onPick }: { title: string; subtitle: string; options: string[]; picked: string[]; onPick: (v: string) => void }) {
  return (
    <Section title={title} subtitle={subtitle}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = picked.includes(o);
          return (
            <button
              key={o}
              onClick={() => onPick(o)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${on ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border"}`}
            >
              {on && <Check className="h-3.5 w-3.5" />}
              {o}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

function Macro({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <div className={`rounded-xl py-2 ${tint}`}>
      <p className="font-bold">{value}</p>
      <p className="text-[10px] opacity-80 mt-0.5">{label}</p>
    </div>
  );
}

function SumRow({ label, v, highlight }: { label: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-primary" : ""}`}>{v}</span>
    </div>
  );
}
