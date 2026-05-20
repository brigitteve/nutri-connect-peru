import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Bike, ShoppingBag, Calendar, Crown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/reservar")({
  component: Reservar,
});

const restaurants = [
  { id: "1", name: "Verde Andino", rating: 4.9, tags: ["Vegano", "Keto"], eta: "25-30 min" },
  { id: "2", name: "Sazón Saludable", rating: 4.8, tags: ["Gestantes", "Sin gluten"], eta: "30-40 min" },
  { id: "3", name: "Mar Limeño", rating: 4.7, tags: ["Pescados", "Light"], eta: "20-25 min" },
];

function Reservar() {
  const [rest, setRest] = useState("1");
  const [mode, setMode] = useState<"envio" | "recojo">("envio");
  const [step, setStep] = useState(1);

  if (step === 2) return <Confirmation />;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="mx-auto max-w-md">
        <header className="flex items-center gap-3 px-5 pt-6 pb-3">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Premium</p>
            <h1 className="text-xl font-bold flex items-center gap-1.5">
              <Crown className="h-5 w-5 text-primary" /> Reservar plato a medida
            </h1>
          </div>
        </header>

        <section className="px-5 mt-3">
          <h2 className="text-sm font-bold mb-2.5">Elige el restaurante</h2>
          <div className="space-y-2.5">
            {restaurants.map((r) => (
              <button
                key={r.id}
                onClick={() => setRest(r.id)}
                className={`w-full text-left rounded-2xl border-2 p-4 transition ${
                  rest === r.id ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">⭐ {r.rating} · {r.eta}</p>
                  </div>
                  {rest === r.id && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="mt-2 flex gap-1.5">
                  {r.tags.map((t) => (
                    <span key={t} className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 mt-6">
          <h2 className="text-sm font-bold mb-2.5">Modalidad</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <ModeBtn icon={Bike} label="Envío" active={mode === "envio"} onClick={() => setMode("envio")} />
            <ModeBtn icon={ShoppingBag} label="Recojo" active={mode === "recojo"} onClick={() => setMode("recojo")} />
          </div>
        </section>

        <section className="px-5 mt-6">
          <h2 className="text-sm font-bold mb-2.5">Fecha y hora</h2>
          <div className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Hoy, 1:30 PM</p>
              <p className="text-xs text-muted-foreground">Confirmación doble incluida</p>
            </div>
            <button className="text-xs font-bold text-primary">Cambiar</button>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-5 py-3">
        <div className="mx-auto max-w-md flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold">S/ 32.00</p>
          </div>
          <button
            onClick={() => setStep(2)}
            className="flex-1 rounded-full gradient-premium py-3.5 text-sm font-bold text-primary-foreground shadow-glow"
          >
            Confirmar reserva
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeBtn({
  icon: Icon, label, active, onClick,
}: { icon: React.ComponentType<{ className?: string }>; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 py-4 transition ${
        active ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`text-sm font-semibold ${active ? "text-primary" : ""}`}>{label}</span>
    </button>
  );
}

function Confirmation() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full gradient-premium shadow-glow animate-pulse">
          <Check className="h-12 w-12 text-primary-foreground" />
        </div>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-center">¡Reserva confirmada!</h1>
      <p className="mt-2 text-center text-muted-foreground max-w-xs">
        Tu plato a medida está siendo preparado por <strong>Sazón Saludable</strong>.
      </p>
      <div className="mt-6 rounded-2xl bg-accent px-4 py-3 flex items-center gap-2">
        <span className="text-xl">🏆</span>
        <span className="text-sm font-bold text-accent-foreground">+50 puntos NutriConnect</span>
      </div>
      <Link
        to="/pedidos"
        className="mt-8 w-full max-w-xs rounded-full bg-foreground py-3.5 text-center text-sm font-bold text-background"
      >
        Ver seguimiento
      </Link>
      <Link to="/" className="mt-3 text-sm font-semibold text-muted-foreground">Volver al inicio</Link>
    </div>
  );
}
