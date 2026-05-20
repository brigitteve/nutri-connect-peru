import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/valoracion")({
  component: Valoracion,
});

function Valoracion() {
  const [dishStars, setDishStars] = useState(5);
  const [restStars, setRestStars] = useState(4);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full gradient-premium shadow-glow">
          <Check className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-center">¡Gracias por tu reseña!</h1>
        <div className="mt-4 rounded-2xl bg-accent px-4 py-3 flex items-center gap-2">
          <span className="text-xl">🏅</span>
          <span className="text-sm font-bold text-accent-foreground">+30 puntos · Insignia "Crítico" desbloqueada</span>
        </div>
        <Link to="/" className="mt-8 rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="mx-auto max-w-md px-5 pt-6">
        <Link to="/pedidos" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <h1 className="mt-6 text-2xl font-bold">¿Cómo fue tu experiencia?</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tu opinión ayuda a la comunidad NutriConnect</p>

        {/* Plato */}
        <section className="mt-7 rounded-3xl bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">El plato</p>
          <h3 className="mt-1 font-bold">Lomo Saltado Fit</h3>
          <Stars value={dishStars} onChange={setDishStars} />
          <div className="mt-4 flex flex-wrap gap-2">
            {["Sabor delicioso", "Presentación 10/10", "Macros precisos", "Buen tamaño"].map((t) => (
              <button key={t} className="rounded-full bg-secondary/20 px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Restaurante */}
        <section className="mt-4 rounded-3xl bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">El restaurante</p>
          <h3 className="mt-1 font-bold">Sazón Saludable</h3>
          <Stars value={restStars} onChange={setRestStars} />
          <div className="mt-4 flex flex-wrap gap-2">
            {["Puntual", "Empaque ecológico", "Buena atención"].map((t) => (
              <button key={t} className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4">
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Comentario (opcional)</span>
            <textarea
              rows={4}
              placeholder="Cuéntanos más sobre tu experiencia..."
              className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary resize-none"
            />
          </label>
          <p className="mt-1.5 text-[10px] text-muted-foreground">Los comentarios pasan por moderación automática</p>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-5 py-3">
        <div className="mx-auto max-w-md">
          <button
            onClick={() => setSent(true)}
            className="block w-full rounded-full gradient-premium py-4 text-center text-sm font-bold text-primary-foreground shadow-glow"
          >
            Publicar valoración
          </button>
        </div>
      </div>
    </div>
  );
}

function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="mt-3 flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} onClick={() => onChange(i)} className="transition-transform hover:scale-110">
          <Star className={`h-8 w-8 ${i <= value ? "fill-accent text-accent" : "text-muted"}`} />
        </button>
      ))}
    </div>
  );
}
