import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Crown, Scale } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/registro")({
  component: Registro,
});

function Registro() {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<"free" | "premium">("premium");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [goal, setGoal] = useState("Bajar peso");

  const toggle = (a: string) =>
    setAllergies((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="mx-auto max-w-md px-5 pt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : null)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="text-xs font-semibold text-muted-foreground">Paso {step} de 3</p>
        </div>

        {/* Progress */}
        <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full gradient-premium rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        {step === 1 && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold">Cuéntanos de ti</h1>
            <p className="mt-1 text-sm text-muted-foreground">Estos datos nos ayudan a personalizar tus platos</p>
            <div className="mt-6 space-y-3">
              <Input label="Nombre completo" placeholder="Camila Rojas" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Edad" placeholder="28" type="number" />
                <Input label="Peso (kg)" placeholder="62" type="number" />
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground">Objetivo nutricional</span>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {["Bajar peso", "Ganar músculo", "Mantenimiento", "Gestación"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`rounded-xl border-2 py-2.5 text-xs font-semibold transition ${
                        goal === g ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold">Alergias y restricciones</h1>
            <p className="mt-1 text-sm text-muted-foreground">Filtraremos automáticamente los platos</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Lactosa", "Gluten", "Maní", "Mariscos", "Huevo", "Soya", "Frutos secos", "Bajo sodio"].map((a) => {
                const on = allergies.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggle(a)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      on ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                    }`}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                    {a}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 rounded-2xl bg-accent/40 border border-accent p-4">
              <p className="text-xs font-bold text-accent-foreground">🔒 Tus datos están protegidos</p>
              <p className="mt-1 text-xs text-accent-foreground/80">
                Cumplimos con la Ley de Protección de Datos Personales del Perú.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold">Elige tu plan</h1>
            <p className="mt-1 text-sm text-muted-foreground">Puedes cambiar en cualquier momento</p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setPlan("free")}
                className={`w-full text-left rounded-2xl border-2 p-5 transition ${
                  plan === "free" ? "border-foreground" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Freemium</h3>
                  <span className="text-sm font-bold">Gratis</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-secondary-foreground" /> Explorar platos saludables</li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-secondary-foreground" /> Plan semanal básico</li>
                </ul>
              </button>

              <button
                onClick={() => setPlan("premium")}
                className={`w-full text-left rounded-2xl border-2 p-5 transition relative overflow-hidden ${
                  plan === "premium" ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <span className="absolute top-3 right-3 rounded-full premium-shine px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                  RECOMENDADO
                </span>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Premium</h3>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">S/ 29</span>
                  <span className="text-xs text-muted-foreground">/ mes</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs">
                  <li className="flex items-center gap-2 font-semibold"><Crown className="h-3.5 w-3.5 text-primary" /> Platos 100% personalizados</li>
                  <li className="flex items-center gap-2 font-semibold"><Scale className="h-3.5 w-3.5 text-primary" /> Balanza digital conectada</li>
                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="h-3.5 w-3.5 text-secondary-foreground" /> Mini-juegos educativos</li>
                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="h-3.5 w-3.5 text-secondary-foreground" /> Gráficos de progreso</li>
                </ul>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-5 py-3">
        <div className="mx-auto max-w-md">
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-foreground py-4 text-sm font-bold text-background"
            >
              Continuar <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              to="/"
              className="block w-full rounded-full gradient-premium py-4 text-center text-sm font-bold text-primary-foreground shadow-glow"
            >
              Empezar mi camino nutri
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
      />
    </label>
  );
}
