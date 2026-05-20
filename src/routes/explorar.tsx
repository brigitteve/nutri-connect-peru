import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { dishes } from "@/lib/dishes";
import { Search, SlidersHorizontal, Crown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/explorar")({
  head: () => ({ meta: [{ title: "Explorar platos — NutriConnect" }] }),
  component: Explorar,
});

const filters = ["Todos", "Alta proteína", "Bajo en grasa", "Sin gluten", "Gestantes", "Premium"];

function Explorar() {
  const [active, setActive] = useState("Todos");
  const list = active === "Todos"
    ? dishes
    : active === "Premium"
      ? dishes.filter((d) => d.premium)
      : dishes.filter((d) => d.tags.includes(active));

  return (
    <AppShell>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold">Explorar</h1>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar platos, restaurantes..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                active === f
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 mt-4 space-y-4">
        {list.map((d) => (
          <Link
            key={d.id}
            to="/plato/$id"
            params={{ id: d.id }}
            className="block overflow-hidden rounded-2xl bg-card shadow-card"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
              {d.premium && (
                <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full premium-shine px-2.5 py-1 text-[10px] font-bold text-gold-foreground">
                  <Crown className="h-3 w-3" /> A MEDIDA
                </span>
              )}
              <div className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold">
                S/ {d.price}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.restaurant}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.tags.map((t) => (
                  <span key={t} className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>🔥 {d.kcal} kcal</span>
                <span>🍗 {d.protein}g</span>
                <span>🌾 {d.carbs}g</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="h-6" />
    </AppShell>
  );
}
