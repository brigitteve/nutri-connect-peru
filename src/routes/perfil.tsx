import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Crown, ChevronRight, Scale, Bell, Shield, HelpCircle, LogOut, Settings } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  component: Perfil,
});

function Perfil() {
  return (
    <AppShell>
      <header className="px-5 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <Settings className="h-4 w-4" />
        </button>
      </header>

      <section className="px-5">
        <div className="rounded-3xl bg-card p-5 shadow-card flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-premium text-2xl font-bold text-primary-foreground">
            C
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg leading-tight">Camila Rojas</h2>
            <p className="text-xs text-muted-foreground">camila@example.com</p>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full premium-shine px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
              <Crown className="h-3 w-3" /> PREMIUM
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-card p-4 shadow-card">
          <Stat label="Pedidos" value="24" />
          <Stat label="Insignias" value="12" />
          <Stat label="Racha" value="7d" />
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Perfil nutricional</h2>
        <div className="space-y-2 rounded-2xl bg-card p-4 shadow-card">
          <Row label="Objetivo" value="Bajar peso" />
          <Row label="Calorías diarias" value="1,800 kcal" />
          <Row label="Alergias" value="Lactosa, maní" />
          <Row label="Restricciones" value="Bajo sodio" />
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Premium</h2>
        <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border">
          <LinkItem to="/balanza" icon={Scale} title="Balanza digital" subtitle="Conectada" />
          <LinkItem to="/progreso" icon={Crown} title="Mi progreso" subtitle="Gráficos y adherencia" />
          <LinkItem to="/nutricionistas" icon={Crown} title="Mi nutricionista" subtitle="Lucía Vargas" />
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border">
          <Item icon={Bell} title="Notificaciones" />
          <Item icon={Shield} title="Privacidad y datos" />
          <Item icon={HelpCircle} title="Ayuda" />
          <Item icon={LogOut} title="Cerrar sesión" danger />
        </div>
      </section>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Cumplimos con la Ley de Protección de Datos del Perú
      </p>

      <div className="mt-3 px-5 space-y-2">
        <Link
          to="/restaurante"
          className="block text-center rounded-full border border-border bg-card py-3 text-xs font-semibold text-muted-foreground"
        >
          Ir al panel de restaurante →
        </Link>
        <Link
          to="/bienvenida"
          className="block text-center rounded-full border border-border bg-card py-3 text-xs font-semibold text-muted-foreground"
        >
          Ver onboarding / Login →
        </Link>
      </div>

      <div className="h-6" />
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function Item({
  icon: Icon, title, subtitle, danger,
}: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle?: string; danger?: boolean }) {
  return (
    <button className="w-full flex items-center gap-3 p-4 text-left">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${danger ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${danger ? "text-destructive" : ""}`}>{title}</p>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function LinkItem({
  to, icon: Icon, title, subtitle,
}: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; subtitle?: string }) {
  return (
    <Link to={to} className="w-full flex items-center gap-3 p-4 text-left">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
