import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, ChefHat } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

type Msg = { from: "me" | "them"; text: string; time: string };

const initial: Msg[] = [
  { from: "them", text: "¡Hola Camila! Tu pedido ya está en preparación 👨‍🍳", time: "1:15 PM" },
  { from: "me", text: "Gracias! ¿Pueden agregar menos sal por favor?", time: "1:16 PM" },
  { from: "them", text: "¡Por supuesto! Lo prepararemos con sal mínima 👌", time: "1:17 PM" },
];

const quick = ["Sin sal extra", "¿Está listo?", "Gracias!", "Cambiar dirección"];

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");

  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs([...msgs, { from: "me", text: t, time: "ahora" }]);
    setText("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-5 py-3">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <Link to="/pedidos" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-premium">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Sazón Saludable</p>
            <p className="text-[11px] text-secondary-foreground flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary-foreground animate-pulse" /> En línea
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-md space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                m.from === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              }`}>
                <p className="text-sm">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-md px-5 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
            {quick.map((q) => (
              <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pb-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(text)}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button onClick={() => send(text)} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
