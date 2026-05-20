import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/restaurante/login")({
  component: RestauranteLogin,
});

function RestauranteLogin() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-5 pt-6">
        <Link to="/perfil" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Modo restaurante</p>
            <h1 className="text-2xl font-bold leading-tight">Ingresa a tu cocina</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Gestiona pedidos, platos y ranking de tu local.</p>

        <form className="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <Field icon={Mail} label="Correo del restaurante" type="email" placeholder="contacto@misazon.pe" />
          <Field icon={Lock} label="Contraseña" type="password" placeholder="••••••••" />
          <Link
            to="/restaurante"
            className="block w-full rounded-full bg-foreground py-4 text-center text-sm font-bold text-background"
          >
            Entrar al panel
          </Link>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿Aún no eres partner?{" "}
          <Link to="/restaurante/registro" className="font-bold text-primary">Regístrate</Link>
        </p>

        <Link to="/login" className="mt-4 block text-center text-xs text-muted-foreground">
          ← Volver al modo usuario
        </Link>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type, placeholder }: { icon: React.ComponentType<{ className?: string }>; label: string; type: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input type={type} placeholder={placeholder} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
    </label>
  );
}
