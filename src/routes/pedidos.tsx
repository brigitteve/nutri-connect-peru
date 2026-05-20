import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ChefHat, Package, Bike, Check, MessageCircle, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/pedidos")({
  component: Pedidos,
});

const stepDefs = [
  { icon: ChefHat, label: "Preparando" },
  { icon: Package, label: "Listo" },
  { icon: Bike, label: "En camino" },
  { icon: Check, label: "Entregado" },
];

function Pedidos() {
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate order progress
  useEffect(() => {
    if (currentStep >= stepDefs.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentStep(s => s + 1);
    }, 3000); // Advances every 3 seconds for demo purposes
    return () => clearTimeout(timer);
  }, [currentStep]);

  const progressPercentage = (currentStep / (stepDefs.length - 1)) * 100;

  return (
    <AppShell>
      <header className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-bold">Mis pedidos</h1>
      </header>

      {currentStep === stepDefs.length - 1 && (
        <div className="mx-5 mb-4 animate-in slide-in-from-top-2 fade-in duration-300 rounded-2xl bg-success/15 border-2 border-success p-3 flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground shrink-0">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-success">¡Tu pedido ha llegado!</p>
            <p className="text-xs text-success/80 mt-0.5">Disfruta tu plato a medida. No olvides calificar al restaurante.</p>
          </div>
        </div>
      )}

      <section className="px-5 mt-2">
        <div className="rounded-3xl bg-card shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pedido #N-2847</p>
              <h2 className="font-bold mt-0.5">Lomo Saltado Fit</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Sazón Saludable · S/ 32</p>
            </div>
            <span className="rounded-full bg-secondary/20 px-2.5 py-1 text-[10px] font-bold text-secondary-foreground uppercase">
              {stepDefs[currentStep].label}
            </span>
          </div>

          {/* Tracker */}
          <div className="mt-6 relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
            <div 
              className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-1000 ease-in-out" 
              style={{ width: `calc(${progressPercentage}% - ${progressPercentage === 100 ? '40px' : '20px'})` }} 
            />
            <div className="relative grid grid-cols-4">
              {stepDefs.map((s, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${
                        isDone || isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      } ${isActive && i !== stepDefs.length - 1 ? "ring-4 ring-primary/20 animate-pulse" : ""}
                        ${isActive && i === stepDefs.length - 1 ? "shadow-glow scale-110" : ""}
                      `}
                    >
                      <s.icon className="h-4 w-4" />
                    </div>
                    <p className={`mt-2 text-[10px] font-semibold transition-colors duration-300 ${isDone || isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-5 text-center text-sm">
            Llegada estimada <strong>1:42 PM</strong>
          </p>

          <Link to="/chat" className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold hover:bg-muted transition-colors">
            <MessageCircle className="h-4 w-4" /> Chatear con el restaurante
          </Link>
          
          {currentStep === stepDefs.length - 1 && (
            <Link to="/valoracion" className="mt-3 w-full flex items-center justify-center gap-2 rounded-full gradient-premium text-primary-foreground py-3 text-sm font-bold shadow-glow animate-in fade-in zoom-in duration-500">
               Valorar ahora
            </Link>
          )}
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">Anteriores</h2>
        <div className="space-y-2.5">
          {["Bowl Quinoa Andina", "Ceviche Light", "Bowl Quinoa Andina"].map((n, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card">
              <div>
                <p className="font-semibold text-sm">{n}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Hace {i + 2} días · Entregado</p>
              </div>
              <Link to="/valoracion" className="text-xs font-bold text-primary">Valorar</Link>
            </div>
          ))}
        </div>
      </section>
      
      <div className="h-24" />
    </AppShell>
  );
}
