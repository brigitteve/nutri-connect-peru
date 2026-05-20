import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Crown, Trophy } from "lucide-react";

export const Route = createFileRoute("/bienvenida")({
  component: Onboarding,
});

function Onboarding() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <div className="mx-auto max-w-md w-full flex-1 flex flex-col px-6 pt-12">
        {/* Logo animado */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 gradient-premium rounded-3xl blur-2xl opacity-50 animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl gradient-premium shadow-glow">
              <span className="text-3xl">🥗</span>
            </div>
          </div>
        </div>

        <h1 className="text-center text-4xl font-bold leading-tight">
          Nutri<span className="text-primary">Connect</span>
        </h1>
        <p className="mt-3 text-center text-muted-foreground text-base px-4 leading-relaxed">
          Crea y reserva platos completamente <strong className="text-foreground">personalizados</strong>, sigue tus metas y gana logros.
        </p>

        {/* Features flotantes */}
        <div className="mt-10 space-y-3">
          <FeatureRow icon={<Crown className="h-5 w-5" />} title="Platos a medida" desc="Diseñados por nutricionistas" tint="bg-primary text-primary-foreground" />
          <FeatureRow icon={<Trophy className="h-5 w-5" />} title="Gamificación" desc="Puntos, retos e insignias" tint="bg-accent text-accent-foreground" />
          <FeatureRow icon={<Sparkles className="h-5 w-5" />} title="Sabor peruano" desc="Recetas locales y balanceadas" tint="bg-secondary text-secondary-foreground" />
        </div>

        <div className="flex-1" />

        <div className="space-y-3 pb-8 pt-8">
          <Link
            to="/registro"
            className="block w-full rounded-full gradient-premium py-4 text-center text-sm font-bold text-primary-foreground shadow-glow"
          >
            Crear cuenta
          </Link>
          <Link
            to="/login"
            className="block w-full rounded-full border border-border bg-card py-4 text-center text-sm font-bold"
          >
            Iniciar sesión
          </Link>
          <Link to="/" className="block text-center text-xs text-muted-foreground pt-2">
            Continuar como invitado →
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc, tint }: { icon: React.ReactNode; title: string; desc: string; tint: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tint}`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
