import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Scale, Bluetooth, Check, Plus, Loader2, Utensils } from "lucide-react";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/balanza")({
  component: Balanza,
});

type Item = { name: string; kcal: number; prot: number; weight: number };

function Balanza() {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [grams, setGrams] = useState(0);
  const [tare, setTare] = useState(0);
  const [plate, setPlate] = useState<Item[]>([]);

  useEffect(() => {
    if (status !== "connected") return;
    const t = setInterval(() => {
      setGrams((g) => {
        const jump = (Math.random() - 0.4) * 8;
        return Math.max(0, g + jump);
      });
    }, 600);
    return () => clearInterval(t);
  }, [status]);

  const handleConnect = () => {
    setStatus("connecting");
    setTimeout(() => {
      setStatus("connected");
      setGrams(120); // Initial weight simulation
    }, 2000);
  };

  const net = Math.max(0, grams - tare);

  const addToPlate = (base: { name: string; kcal: number; prot: number }) => {
    const w = Math.round(net);
    if (w <= 0) return;
    setPlate([...plate, { ...base, weight: w }]);
    setTare(grams); // Auto-tare after adding
  };

  const totalKcal = plate.reduce((acc, i) => acc + Math.round(i.weight * i.kcal), 0);
  const totalProt = plate.reduce((acc, i) => acc + Math.round(i.weight * i.prot), 0);

  return (
    <AppShell>
      <div className="px-5 pt-6 flex items-center gap-3">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Balanza digital</h1>
          <p className="text-xs text-muted-foreground">Premium · NutriScale X1</p>
        </div>
      </div>

      <section className="px-5 mt-6">
        <div className={`relative overflow-hidden rounded-3xl p-8 text-center shadow-elevated transition-colors duration-500 ${
          status === "connected" ? "gradient-premium text-primary-foreground" : 
          status === "connecting" ? "bg-card border-2 border-primary/50" : "bg-card"
        }`}>
          {status === "connecting" ? (
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
          ) : (
            <Scale className={`mx-auto h-12 w-12 ${status === "connected" ? "opacity-90 animate-pulse" : "text-muted-foreground"}`} />
          )}
          
          <p className={`mt-4 text-xs uppercase tracking-widest ${status === "connected" ? "opacity-80" : "text-muted-foreground"}`}>
            {status === "connecting" ? "Sincronizando..." : "Peso actual"}
          </p>
          <p className={`mt-2 text-6xl font-bold tabular-nums transition-opacity ${status === "connecting" ? "opacity-50" : "opacity-100"}`}>
            {status === "connected" ? Math.round(net) : "0"}
          </p>
          <p className={`mt-1 text-sm ${status === "connected" ? "opacity-90" : "text-muted-foreground"}`}>gramos</p>

          {status === "disconnected" && (
            <button
              onClick={handleConnect}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-bold text-background shadow-lg transition active:scale-95"
            >
              <Bluetooth className="h-4 w-4" /> Conectar balanza
            </button>
          )}
        </div>
      </section>

      {status === "connected" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="px-5 mt-4">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setTare(grams)} className="rounded-2xl bg-card py-3 text-xs font-bold shadow-card active:scale-95 transition">TARA</button>
              <button onClick={() => { setGrams(0); setTare(0); }} className="rounded-2xl bg-card py-3 text-xs font-bold shadow-card active:scale-95 transition">RESET</button>
              <button className="rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-glow active:scale-95 transition">G / OZ</button>
            </div>
          </section>

          <section className="px-5 mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Agregar al plato actual</h2>
            <div className="rounded-2xl bg-card shadow-card divide-y divide-border">
              {[
                { name: "Quinoa cocida", kcal: 1.2, prot: 0.04 },
                { name: "Pechuga de pollo", kcal: 1.65, prot: 0.31 },
                { name: "Palta", kcal: 1.6, prot: 0.02 },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(net * i.kcal)} kcal · {Math.round(net * i.prot)}g prot</p>
                  </div>
                  <button 
                    onClick={() => addToPlate(i)}
                    disabled={Math.round(net) <= 0}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 transition active:scale-90"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {plate.length > 0 && (
            <section className="px-5 mt-6">
              <div className="rounded-2xl bg-secondary/10 border-2 border-secondary p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-secondary-foreground">
                    <Utensils className="h-4 w-4" /> Resumen del Plato
                  </div>
                  <div className="text-xs font-bold text-secondary-foreground">
                    {totalKcal} kcal | {totalProt}g prot
                  </div>
                </div>
                <div className="space-y-1.5">
                  {plate.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-secondary-foreground/80">
                      <span>{p.weight}g de {p.name}</span>
                      <span>{Math.round(p.weight * p.kcal)} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="px-5 mt-6 pb-6">
            <div className="rounded-2xl bg-accent/20 border border-accent p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-accent-foreground">
                <Check className="h-4 w-4" /> Conectada y sincronizando
              </div>
              <p className="mt-1 text-xs text-accent-foreground/80">Los macros se sumarán automáticamente a tu progreso diario.</p>
            </div>
          </section>
        </div>
      )}

      <div className="h-6" />
    </AppShell>
  );
}
