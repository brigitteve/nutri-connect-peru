import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, Star, MessageCircle, Crown, Calendar } from "lucide-react";
import heroImg from "@/assets/hero-nutritionist.jpg";

export const Route = createFileRoute("/nutricionistas")({
  component: Nutricionistas,
});

const list = [
  { name: "Lucía Vargas, Mg.", spec: "Nutrición clínica · Gestantes", rating: 4.9, reviews: 312, plates: 820, mine: true },
  { name: "Andrés Quispe", spec: "Deportiva · Hipertrofia", rating: 4.8, reviews: 198, plates: 540 },
  { name: "Camila Soto", spec: "Vegetariana · Andina", rating: 4.9, reviews: 264, plates: 610 },
  { name: "Renzo Paredes", spec: "Pérdida de peso · Keto", rating: 4.7, reviews: 142, plates: 380 },
];

function Nutricionistas() {
  return (
    <AppShell>
      <div className="px-5 pt-6 flex items-center gap-3">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Nutricionistas</h1>
          <p className="text-xs text-muted-foreground">Verificados · Premium</p>
        </div>
      </div>

      <section className="px-5 mt-5">
        <div className="overflow-hidden rounded-3xl bg-card shadow-elevated">
          <img src={heroImg} alt="" className="aspect-[5/2] w-full object-cover" />
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Crown className="h-3.5 w-3.5" /> Tu nutricionista
            </div>
            <h2 className="mt-1 text-xl font-bold">Lucía Vargas, Mg.</h2>
            <p className="text-sm text-muted-foreground">Diseñó 820 planes con ingredientes peruanos</p>
            <div className="mt-4 flex gap-2">
              <Link to="/chat" className="flex-1 inline-flex items-center justify-center gap-2 rounded-full gradient-premium py-3 text-sm font-bold text-primary-foreground shadow-glow">
                <MessageCircle className="h-4 w-4" /> Chatear
              </Link>
              <Link to="/personalizar" className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-bold">
                <Calendar className="h-4 w-4" /> Reservar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Más especialistas</h2>
        <div className="space-y-3">
          {list.filter((n) => !n.mine).map((n) => (
            <div key={n.name} className="rounded-2xl bg-card p-4 shadow-card flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold">
                {n.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">{n.name}</p>
                <p className="text-xs text-muted-foreground">{n.spec}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-0.5 font-semibold">
                    <Star className="h-3 w-3 fill-accent text-accent" /> {n.rating}
                  </span>
                  <span className="text-muted-foreground">· {n.reviews} reseñas · {n.plates} planes</span>
                </div>
              </div>
              <button className="rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background">Ver</button>
            </div>
          ))}
        </div>
      </section>

      <div className="h-6" />
    </AppShell>
  );
}
