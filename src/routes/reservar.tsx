import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Bike, ShoppingBag, Calendar, Crown, ShieldCheck, Trophy } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/reservar")({
  component: Reservar,
});

const restaurants = [
  { id: "1", name: "Verde Andino", rating: 4.9, tags: ["Vegano", "Keto"], eta: "25-30 min", verified: true },
  { id: "2", name: "Sazón Saludable", rating: 4.8, tags: ["Gestantes", "Sin gluten"], eta: "30-40 min", verified: true },
  { id: "3", name: "Mar Limeño", rating: 4.7, tags: ["Pescados", "Light"], eta: "20-25 min", verified: false },
];

function Reservar() {
  const [rest, setRest] = useState("1");
  const [mode, setMode] = useState<"envio" | "recojo">("envio");
  const [step, setStep] = useState(1);

  if (step === 2) return <Confirmation />;

  const subtotal = 28.00;
  const deliveryFee = mode === "envio" ? 4.00 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-background pb-44">
      <div className="mx-auto max-w-md">
        <header className="flex items-center gap-3 px-5 pt-6 pb-3">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Premium</p>
            <h1 className="text-xl font-bold flex items-center gap-1.5">
              <Crown className="h-5 w-5 text-primary" /> Reservar a medida
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
                className={`w-full text-left rounded-2xl border-2 p-4 transition relative overflow-hidden ${
                  rest === r.id ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-1.5">
                      {r.name} 
                      {r.verified && <ShieldCheck className="h-4 w-4 text-success" />}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">⭐ {r.rating} · {r.eta}</p>
                  </div>
                  {rest === r.id && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="mt-3 flex gap-1.5">
                  {r.tags.map((t) => (
                    <span key={t} className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                {!r.verified && (
                  <div className="mt-2 text-[10px] font-semibold text-destructive flex items-center gap-1">
                    Solo los restaurantes verificados preparan a medida.
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 mt-6">
          <h2 className="text-sm font-bold mb-2.5">Modalidad</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <ModeBtn icon={Bike} label="Envío a domicilio" active={mode === "envio"} onClick={() => setMode("envio")} />
            <ModeBtn icon={ShoppingBag} label="Recojo en tienda" active={mode === "recojo"} onClick={() => setMode("recojo")} />
          </div>
        </section>

        <section className="px-5 mt-6">
          <h2 className="text-sm font-bold mb-2.5">Fecha y hora</h2>
          <div className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4 shadow-sm">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Hoy, 1:30 PM</p>
              <p className="text-xs text-muted-foreground">Confirmación doble requerida</p>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">Cambiar</button>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-5 py-4">
        <div className="mx-auto max-w-md">
          {/* Desglose de costos */}
          <div className="mb-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal del plato</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Costo de envío</span>
              <span>{mode === "envio" ? `S/ ${deliveryFee.toFixed(2)}` : "Gratis"}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-accent-foreground items-center mt-1 pt-1 border-t border-border/50">
              <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> Puntos a ganar</span>
              <span>+50 pts</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-2">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">S/ {total.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!restaurants.find(r => r.id === rest)?.verified}
              className="flex-1 rounded-full gradient-premium py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50 disabled:shadow-none"
            >
              Confirmar reserva
            </button>
          </div>
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
      className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-4 px-2 text-center transition ${
        active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
      }`}
    >
      <Icon className={`h-6 w-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`text-xs font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
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
        Tu plato a medida está siendo preparado por un restaurante verificado.
      </p>
      <div className="mt-6 rounded-2xl bg-accent px-4 py-3 flex items-center gap-2 shadow-sm">
        <span className="text-xl">🏆</span>
        <span className="text-sm font-bold text-accent-foreground">+50 puntos NutriConnect</span>
      </div>
      <Link
        to="/pedidos"
        className="mt-8 w-full max-w-xs rounded-full bg-foreground py-3.5 text-center text-sm font-bold text-background shadow-lg"
      >
        Seguir mi pedido
      </Link>
      <Link to="/" className="mt-4 text-sm font-semibold text-muted-foreground hover:underline">Volver al inicio</Link>
    </div>
  );
}
