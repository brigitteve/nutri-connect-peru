import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, ChefHat, CheckCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

type Msg = { id: string; from: "me" | "them"; text: string; time: string };

const initial: Msg[] = [
  { id: "1", from: "them", text: "¡Hola Camila! Tu pedido ya está en preparación 👨‍🍳", time: "1:15 PM" },
  { id: "2", from: "me", text: "Gracias! ¿Pueden agregar menos sal por favor?", time: "1:16 PM" },
  { id: "3", from: "them", text: "¡Por supuesto! Lo prepararemos con sal mínima 👌", time: "1:17 PM" },
];

const quick = ["Sin sal extra", "¿Está listo?", "Gracias!", "Cero ají"];

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isTyping]);

  const send = (t: string) => {
    if (!t.trim()) return;
    
    const newMsg: Msg = { id: Date.now().toString(), from: "me", text: t, time: "ahora" };
    setMsgs((prev) => [...prev, newMsg]);
    setText("");
    
    // Simulate restaurant reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMsgs((prev) => [
        ...prev, 
        { id: Date.now().toString(), from: "them", text: "¡Entendido! Lo tendremos en cuenta para tu preparación.", time: "ahora" }
      ]);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border px-5 py-3 shadow-sm">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <Link to="/pedidos" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition active:scale-95">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-premium">
              <ChefHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-card" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm leading-tight">Sazón Saludable</p>
            <p className="text-[11px] text-success font-semibold flex items-center gap-1">
              En línea
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 bg-muted/20">
        <div className="mx-auto max-w-md space-y-4">
          <div className="flex justify-center">
            <span className="bg-muted px-3 py-1 rounded-full text-[10px] text-muted-foreground font-semibold">Hoy</span>
          </div>

          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                m.from === "me"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card border border-border rounded-bl-sm"
              }`}>
                <p className="text-sm leading-snug">{m.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  <span className="text-[9px]">{m.time}</span>
                  {m.from === "me" && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-md px-5 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-3">
            {quick.map((q) => (
              <button 
                key={q} 
                onClick={() => send(q)} 
                className="shrink-0 rounded-full border border-border bg-background hover:bg-muted transition px-3 py-1.5 text-xs font-semibold"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(text)}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary transition-colors"
            />
            <button 
              onClick={() => send(text)} 
              disabled={!text.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
