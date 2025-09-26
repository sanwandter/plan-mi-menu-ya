import { Calendar, ShoppingCart, ChefHat } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    {
      to: "/",
      icon: Calendar,
      label: "Calendario",
    },
    {
      to: "/lista-compras",
      icon: ShoppingCart,
      label: "Lista",
    },
    {
      to: "/recetas",
      icon: ChefHat,
      label: "Recetas",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "text-primary bg-primary-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className={`h-6 w-6 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}