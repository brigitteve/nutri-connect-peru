import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, Lock, Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-5 pt-6">
        <Link to="/bienvenida" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">Hola otra vez 👋</h1>
          <p className="mt-2 text-muted-foreground">Ingresa para continuar tu plan nutricional</p>
        </div>

        <form className="mt-8 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <Field icon={Mail} label="Correo" type="email" placeholder="tu@correo.com" />
          <Field icon={Lock} label="Contraseña" type={show ? "text" : "password"} placeholder="••••••••"
            right={<button type="button" onClick={() => setShow(!show)}><Eye className="h-4 w-4 text-muted-foreground" /></button>} />
          <div className="flex justify-end">
            <button type="button" className="text-xs font-semibold text-primary">¿Olvidaste tu contraseña?</button>
          </div>
          <Link to="/" className="block w-full rounded-full gradient-premium py-4 text-center text-sm font-bold text-primary-foreground shadow-glow">
            Iniciar sesión
          </Link>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">o continúa con</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold">
            <span className="text-base">G</span> Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold">
            <span className="text-base"></span> Apple
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-bold text-primary">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, type, placeholder, right,
}: { icon: React.ComponentType<{ className?: string }>; label: string; type: string; placeholder: string; right?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input type={type} placeholder={placeholder} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        {right}
      </div>
    </label>
  );
}
