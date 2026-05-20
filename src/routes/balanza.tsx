import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Scale, Bluetooth, Check, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/balanza")({
  component: Balanza,
});

function Balanza() {
  const [connected, setConnected] = useState(false);
  const [grams, setGrams] = useState(0);
  const [tare, setTare] = useState(0);

  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => {
      setGrams((g) => Math.max(0, g + (Math.random() - 0.4) * 4));
    }, 400);
    return () => clearInterval(t);
  }, [connected]);

  const net = Math.max(0, grams - tare);

  return (
    <AppShell>
      <div className="px-5 pt-6 flex items-center gap-3">
        <Link to="/perfil" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Balanza digital</h1>
          <p className="text-xs text-muted-foreground">Premium · Bluetooth</p>
        </div>
      </div>

      <section className="px-5 mt-6">
        <div className={`relative overflow-hidden rounded-3xl p-8 text-center shadow-elevated ${connected ? "gradient-premium text-primary-foreground" : "bg-card"}`}>
          <Scale className={`mx-auto h-10 w-10 ${connected ? "opacity-80" : "text-muted-foreground"}`} />
          <p className={`mt-4 text-xs uppercase tracking-widest ${connected ? "opacity-80" : "text-muted-foreground"}`}>Peso actual</p>
          <p className="mt-2 text-6xl font-bold tabular-nums">{Math.round(net)}</p>
          <p className={`mt-1 text-sm ${connected ? "opacity-90" : "text-muted-foreground"}`}>gramos</p>

          {!connected && (
            <button
              onClick={() => setConnected(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-bold text-background"
            >
              <Bluetooth className="h-4 w-4" /> Conectar balanza
            </button>
          )}
        </div>
      </section>

      {connected && (
        <>
          <section className="px-5 mt-4">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setTare(grams)} className="rounded-2xl bg-card py-3 text-xs font-bold shadow-card">TARA</button>
              <button onClick={() => { setGrams(0); setTare(0); }} className="rounded-2xl bg-card py-3 text-xs font-bold shadow-card">RESET</button>
              <button className="rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-glow">G / OZ</button>
            </div>
          </section>

          <section className="px-5 mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Agregar al plato</h2>
            <div className="rounded-2xl bg-card shadow-card divide-y divide-border">
              {[
                { name: "Quinoa cocida", kcal: 1.2 },
                { name: "Pechuga de pollo", kcal: 1.65 },
                { name: "Palta", kcal: 1.6 },
              ].map((i) => (
                <div key={i.name} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(net * i.kcal)} kcal · {Math.round(net)}g</p>
                  </div>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="px-5 mt-6">
            <div className="rounded-2xl bg-accent/40 border border-accent p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-accent-foreground">
                <Check className="h-4 w-4" /> Conectada vía Bluetooth
              </div>
              <p className="mt-1 text-xs text-accent-foreground/80">Tus porciones se sincronizan automáticamente con tu plan.</p>
            </div>
          </section>
        </>
      )}

      <div className="h-6" />
    </AppShell>
  );
}
