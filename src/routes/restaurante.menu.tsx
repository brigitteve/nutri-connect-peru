import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Plus, Search, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/restaurante/menu")({
  component: MenuRestaurante,
});

type MenuItem = {
  id: string;
  name: string;
  price: number;
  active: boolean;
  category: "Principales" | "Entradas" | "Bebidas";
  customizable: boolean;
};

const initialMenu: MenuItem[] = [
  { id: "1", name: "Lomo Saltado Fit", price: 32, active: true, category: "Principales", customizable: true },
  { id: "2", name: "Bowl Quinoa Andina", price: 24, active: true, category: "Principales", customizable: true },
  { id: "3", name: "Ceviche Light", price: 35, active: true, category: "Principales", customizable: false },
  { id: "4", name: "Ensalada César", price: 18, active: false, category: "Entradas", customizable: false },
  { id: "5", name: "Chicha Morada sin azúcar", price: 8, active: true, category: "Bebidas", customizable: false },
];

function MenuRestaurante() {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [search, setSearch] = useState("");

  const toggleStatus = (id: string) => {
    setMenu(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  const filteredMenu = menu.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  const categories = ["Principales", "Entradas", "Bebidas"] as const;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border px-5 pt-6 pb-3">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <Link to="/restaurante" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition active:scale-95">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" /> Menú
            </h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition active:scale-95">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 mt-5">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar platos..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-full py-3 pl-10 pr-4 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-6">
          {categories.map(cat => {
            const items = filteredMenu.filter(item => item.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat}>
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">{cat}</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className={`rounded-2xl border p-4 transition-all ${item.active ? "bg-card border-border shadow-sm" : "bg-muted/50 border-transparent"}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold text-sm ${!item.active && "text-muted-foreground"}`}>{item.name}</h3>
                            {item.customizable && (
                              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">A medida</span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${!item.active ? "text-muted-foreground/70" : "font-medium"}`}>S/ {item.price.toFixed(2)}</p>
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={item.active} onChange={() => toggleStatus(item.id)} />
                          <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success"></div>
                        </label>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-dashed border-border flex justify-end gap-3">
                        <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                          <Edit2 className="h-3.5 w-3.5" /> Editar
                        </button>
                        <button className="text-xs font-bold text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
