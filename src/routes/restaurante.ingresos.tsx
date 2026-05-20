import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Wallet, TrendingUp, Calendar, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/restaurante/ingresos")({
  component: RestauranteIngresos,
});

function RestauranteIngresos() {
  const [period, setPeriod] = useState<"semana" | "mes">("semana");

  const data = period === "semana" ? {
    ventas: 1240.50,
    comision: 124.05,
    neto: 1116.45,
    pedidos: 34,
    ticket: 36.50
  } : {
    ventas: 4850.00,
    comision: 485.00,
    neto: 4365.00,
    pedidos: 128,
    ticket: 37.89
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border px-5 pt-6 pb-3">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <Link to="/restaurante" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition active:scale-95">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" /> Ingresos
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 mt-5">
        {/* Verification Alert */}
        <div className="mb-6 rounded-2xl bg-success/15 border border-success/30 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-success">Cuenta verificada y activa</p>
            <p className="text-xs text-success/80 mt-1">Estás recibiendo pagos directamente a tu cuenta BCP terminada en ****4582. Los desembolsos se realizan cada martes.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex bg-muted rounded-full p-1 mb-6">
          <button 
            onClick={() => setPeriod("semana")}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition-colors ${period === "semana" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Esta semana
          </button>
          <button 
            onClick={() => setPeriod("mes")}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition-colors ${period === "mes" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Este mes
          </button>
        </div>

        {/* Main Balance */}
        <div className="rounded-3xl gradient-premium p-6 text-primary-foreground shadow-elevated text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative z-10">
            <p className="text-sm font-semibold opacity-90 uppercase tracking-wider">Ingreso Neto ({period})</p>
            <h2 className="text-5xl font-black mt-2 tracking-tight">S/ {data.neto.toFixed(2)}</h2>
            <div className="mt-4 inline-flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur">
              <TrendingUp className="h-3.5 w-3.5" /> +15% vs {period} anterior
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Desglose</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Ventas brutas</span>
              <span className="text-sm font-bold">S/ {data.ventas.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-destructive">
              <span className="text-sm font-medium">Comisión NutriConnect (10%)</span>
              <span className="text-sm font-bold">- S/ {data.comision.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-sm font-medium">Impuestos retenidos</span>
              <span className="text-sm font-bold">S/ 0.00</span>
            </div>
            <div className="pt-4 border-t border-dashed border-border flex justify-between items-center">
              <span className="text-base font-bold">Total a transferir</span>
              <span className="text-base font-bold text-primary">S/ {data.neto.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Activity */}
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-8 mb-4">Últimas transacciones</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between bg-card p-4 rounded-2xl shadow-sm border border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Pedido #N-284{i}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Hoy, 1:3{i} PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-success">+ S/ 28.80</p>
                <p className="text-[10px] text-muted-foreground">Neto</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-6 flex items-center justify-center gap-2 rounded-full border-2 border-primary text-primary py-3.5 text-sm font-bold hover:bg-primary/5 transition-colors">
          <Download className="h-4 w-4" /> Descargar reporte
        </button>
      </div>
    </div>
  );
}
