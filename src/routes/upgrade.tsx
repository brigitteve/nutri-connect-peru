import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Crown, Check, Sparkles, Scale, BarChart3, MessageCircle, Shield, CreditCard } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/upgrade")({
  component: Upgrade,
});

type PlanId = "mensual" | "anual" | "familiar";

const plans: { id: PlanId; name: string; price: number; period: string; badge?: string; save?: string }[] = [
  { id: "mensual", name: "Mensual", price: 29, period: "mes" },
  { id: "anual", name: "Anual", price: 249, period: "año", badge: "MÁS POPULAR", save: "Ahorra 28%" },
  { id: "familiar", name: "Familiar", price: 59, period: "mes", save: "Hasta 4 perfiles" },
];

const benefits = [
  { icon: Sparkles, title: "Platos 100% personalizados", desc: "Diseñados por nutricionistas colegiados" },
  { icon: Scale, title: "Balanza digital conectada", desc: "Pesa porciones exactas vía Bluetooth" },
  { icon: BarChart3, title: "Gráficos de progreso", desc: "Adherencia, peso y macros semanales" },
  { icon: MessageCircle, title: "Chat con tu nutricionista", desc: "Respuestas en menos de 24h" },
];

function Upgrade() {
  const [selected, setSelected] = useState<PlanId>("anual");
  const [loading, setLoading] = useState(false);
  const plan = plans.find((p) => p.id === selected)!;

  const handleCheckout = () => {
    setLoading(true);
    // Simula la creación de sesión Stripe Checkout y redirige
    setTimeout(() => {
      // En producción: POST a /api/checkout/session → window.location = url
      window.open(`https://checkout.stripe.com/c/pay/cs_test_demo_nutriconnect_${plan.id}`, "_blank");
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Hero */}
      <div className="relative overflow-hidden gradient-premium px-5 pt-6 pb-10 text-primary-foreground">
        <Link to="/perfil" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="mt-6 flex items-center gap-2">
          <Crown className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest opacity-90">NutriConnect Premium</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold leading-tight">Platos hechos a tu medida, todos los días</h1>
        <p className="mt-2 text-sm opacity-95">Activa Premium y deja que un nutricionista colegiado diseñe tu menú.</p>
      </div>

      {/* Benefits */}
      <section className="-mt-6 px-5">
        <div className="rounded-3xl bg-card p-5 shadow-elevated space-y-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{b.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Elige tu plan</h2>
        <div className="space-y-3">
          {plans.map((p) => {
            const on = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`relative w-full text-left rounded-2xl border-2 p-4 transition ${
                  on ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-2 right-4 rounded-full premium-shine px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                    {p.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base">{p.name}</p>
                    {p.save && <p className="text-[11px] text-primary font-semibold mt-0.5">{p.save}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      S/ {p.price}
                      <span className="text-xs font-normal text-muted-foreground"> / {p.period}</span>
                    </p>
                  </div>
                </div>
                <div className={`mt-2 inline-flex h-5 w-5 items-center justify-center rounded-full ${on ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                  {on && <Check className="h-3 w-3" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trust */}
      <section className="px-5 mt-6">
        <div className="rounded-2xl bg-accent/40 border border-accent p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-accent-foreground">Pago seguro vía Stripe</p>
            <p className="text-[11px] text-accent-foreground/80 mt-0.5">
              Cancela cuando quieras. Tu suscripción se sincroniza con tu cuenta en NutriConnect Cloud.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky checkout */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-5 py-3">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground">Plan {plan.name}</p>
            <p className="text-base font-bold">S/ {plan.price}<span className="text-xs font-normal text-muted-foreground"> / {plan.period}</span></p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex items-center gap-2 rounded-full gradient-premium px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
          >
            <CreditCard className="h-4 w-4" />
            {loading ? "Redirigiendo…" : "Pagar con Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
}
