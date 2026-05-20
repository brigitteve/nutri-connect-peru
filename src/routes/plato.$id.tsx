import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { getDish } from "@/lib/dishes";
import { ArrowLeft, Crown, Heart, Plus, AlertCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/plato/$id")({
  component: PlatoDetalle,
});

function PlatoDetalle() {
  const { id } = useParams({ from: "/plato/$id" });
  const dish = getDish(id);
  
  // Simulated state for demo purposes
  const [isPremium, setIsPremium] = useState(true);

  if (!dish) return <div className="p-8 text-center">Plato no encontrado</div>;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="mx-auto max-w-md">
        <div className="relative aspect-square">
          <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
          <Link
            to="/explorar"
            className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur shadow"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="absolute top-5 right-5 flex gap-2">
            <button 
              onClick={() => setIsPremium(!isPremium)}
              className={`flex items-center justify-center rounded-full backdrop-blur shadow px-3 py-2 text-xs font-bold transition ${isPremium ? 'bg-primary/90 text-primary-foreground' : 'bg-muted/90 text-muted-foreground'}`}
            >
              {isPremium ? 'PREMIUM' : 'FREEMIUM'}
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur shadow">
              <Heart className="h-5 w-5" />
            </button>
          </div>
          {dish.premium && (
            <span className="absolute bottom-5 left-5 flex items-center gap-1 rounded-full premium-shine px-3 py-1.5 text-xs font-bold text-gold-foreground shadow">
              <Crown className="h-3.5 w-3.5" /> PLATO A MEDIDA
            </span>
          )}
        </div>

        <div className="px-5 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{dish.restaurant}</p>
          <h1 className="mt-1 text-2xl font-bold">{dish.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{dish.description}</p>

          {/* Macros */}
          <div className="mt-5 grid grid-cols-4 gap-2 rounded-2xl bg-card p-4 shadow-card">
            <Macro label="kcal" value={dish.kcal} color="text-primary" />
            <Macro label="prot" value={`${dish.protein}g`} color="text-secondary-foreground" />
            <Macro label="carbs" value={`${dish.carbs}g`} color="text-accent-foreground" />
            <Macro label="grasa" value={`${dish.fat}g`} color="text-muted-foreground" />
          </div>

          {/* Alérgenos y restricciones */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Sin Gluten
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Alto en Proteína
            </span>
          </div>

          {/* Ingredientes */}
          <h2 className="mt-6 font-bold">Ingredientes Exactos</h2>
          <div className="mt-3 space-y-2">
            {dish.ingredients.map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/20">
                  <Plus className="h-3.5 w-3.5 text-secondary-foreground" />
                </div>
                <span className="text-sm">{i}</span>
              </div>
            ))}
          </div>

          {dish.premium && isPremium && (
            <div className="mt-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Crown className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Personaliza este plato</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajusta ingredientes, porciones y macros con tu nutricionista antes de reservar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky action */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-5 py-3">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold">S/ {dish.price}</p>
          </div>
          
          {!isPremium && dish.premium ? (
            <Link
              to="/upgrade"
              className="flex-1 rounded-full bg-foreground py-3.5 text-center text-sm font-bold text-background shadow-glow flex items-center justify-center gap-2"
            >
              <Crown className="h-4 w-4" /> Mejorar a Premium
            </Link>
          ) : (
            <Link
              to={dish.premium ? "/reservar" : "/"}
              search={dish.premium ? { dish: dish.id } : undefined}
              className={`flex-1 rounded-full py-3.5 text-center text-sm font-bold shadow-glow ${
                dish.premium 
                  ? "gradient-premium text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {dish.premium ? "Reservar a medida" : "Agregar a mi plan"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Macro({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
