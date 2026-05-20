import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Calendar, Trophy, User } from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "Inicio" },
  { to: "/explorar", icon: Search, label: "Explorar" },
  { to: "/pedidos", icon: Calendar, label: "Pedidos" },
  { to: "/logros", icon: Trophy, label: "Logros" },
  { to: "/perfil", icon: User, label: "Perfil" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto max-w-md grid grid-cols-5">
        {items.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 py-2.5 transition-colors"
            >
              <Icon
                className={`h-5 w-5 transition-all ${active ? "text-primary scale-110" : "text-muted-foreground"}`}
              />
              <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
