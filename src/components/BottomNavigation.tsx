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
      label: "Compras",
    },
    {
      to: "/recetas",
      icon: ChefHat,
      label: "Recetas",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors duration-200 min-w-0 flex-1 ${
                isActive 
                  ? 'text-orange-600 bg-orange-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon 
                className={`h-6 w-6 mb-1 ${
                  isActive ? 'text-orange-600' : 'text-gray-500'
                }`} 
              />
              <span className={`text-xs font-medium ${
                isActive ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}