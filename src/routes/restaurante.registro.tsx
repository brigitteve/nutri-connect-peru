import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/restaurante/registro")({
  component: RestauranteRegistro,
});

const tags = ["Saludable", "Vegano", "Keto", "Gestantes", "Sin gluten", "Bajo sodio", "Proteico", "Andino"];

function RestauranteRegistro() {
  const [picked, setPicked] = useState<string[]>(["Saludable", "Andino"]);
  const toggle = (t: string) =>
    setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-md px-5 pt-6">
        <Link to="/restaurante/login" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Restaurante partner</p>
            <h1 className="text-2xl font-bold leading-tight">Crea tu cocina</h1>
          </div>
        </div>

        <form className="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <Input label="Nombre comercial" placeholder="Sazón Saludable" />
          <Input label="RUC" placeholder="20XXXXXXXXX" />
          <Input label="Distrito" placeholder="Miraflores, Lima" />
          <Input label="Correo de contacto" placeholder="contacto@misazon.pe" type="email" />
          <Input label="Contraseña" placeholder="••••••••" type="password" />

          <div className="pt-2">
            <span className="text-xs font-semibold text-muted-foreground">Especialidades</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => {
                const on = picked.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggle(t)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      on ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                    }`}
                  >
                    {on && <Check className="h-3.5 w-3.5" />} {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-accent/40 border border-accent p-4 mt-4">
            <p className="text-xs font-bold text-accent-foreground">Comisión 12% por pedido</p>
            <p className="text-[11px] text-accent-foreground/80 mt-0.5">
              Sin mensualidad. Pagos semanales vía Stripe Connect.
            </p>
          </div>
        </form>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur px-5 py-3">
        <div className="mx-auto max-w-md">
          <Link
            to="/restaurante"
            className="block w-full rounded-full bg-foreground py-4 text-center text-sm font-bold text-background"
          >
            Crear cocina y entrar al panel
          </Link>
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
