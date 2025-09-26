import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Mock shopping list data
const mockShoppingList = [
  {
    category: "Verduras y Frutas",
    items: [
      { id: 1, name: "Tomates", quantity: "500g", checked: false },
      { id: 2, name: "Cebollas", quantity: "2 unidades", checked: false },
      { id: 3, name: "Palta", quantity: "3 unidades", checked: true },
      { id: 4, name: "Lechuga", quantity: "1 unidad", checked: false },
    ]
  },
  {
    category: "Carnes y Pescados",
    items: [
      { id: 5, name: "Pollo entero", quantity: "1.5kg", checked: false },
      { id: 6, name: "Carne molida", quantity: "500g", checked: false },
    ]
  },
  {
    category: "Lácteos",
    items: [
      { id: 7, name: "Leche entera", quantity: "1 litro", checked: true },
      { id: 8, name: "Queso fresco", quantity: "200g", checked: false },
      { id: 9, name: "Yogur natural", quantity: "4 unidades", checked: false },
    ]
  },
  {
    category: "Despensa",
    items: [
      { id: 10, name: "Lentejas", quantity: "500g", checked: false },
      { id: 11, name: "Arroz", quantity: "1kg", checked: false },
      { id: 12, name: "Aceite de oliva", quantity: "500ml", checked: true },
    ]
  },
];

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState(mockShoppingList);

  const handleToggleItem = (categoryIndex: number, itemId: number) => {
    setShoppingList(prev =>
      prev.map((category, idx) =>
        idx === categoryIndex
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              )
            }
          : category
      )
    );
  };

  const handleShare = () => {
    // Simulated share functionality
    alert("Compartir lista de compras");
  };

  const getTotalItems = () => {
    return shoppingList.reduce((total, category) => total + category.items.length, 0);
  };

  const getCheckedItems = () => {
    return shoppingList.reduce((total, category) => 
      total + category.items.filter(item => item.checked).length, 0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-success-soft/20">
      {/* Header */}
      <div className="bg-card shadow-soft">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Lista de Compras</h1>
              <p className="text-muted-foreground text-sm">
                {getCheckedItems()} de {getTotalItems()} elementos completados
              </p>
            </div>
            <Button 
              onClick={handleShare}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Compartir
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(getCheckedItems() / getTotalItems()) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Shopping List */}
      <div className="px-4 py-6 space-y-6">
        {shoppingList.map((category, categoryIndex) => (
          <div key={category.category} className="bg-card rounded-xl shadow-card border border-border">
            <div className="bg-gradient-to-r from-primary/10 to-success/10 px-4 py-3 border-b border-border rounded-t-xl">
              <h2 className="text-lg font-semibold text-foreground">{category.category}</h2>
            </div>
            
            <div className="p-4 space-y-3">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                    item.checked 
                      ? 'bg-success-soft/50 border-success/30' 
                      : 'bg-background border-border hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.checked}
                    onCheckedChange={() => handleToggleItem(categoryIndex, item.id)}
                    className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                  />
                  
                  <div className="flex-1 flex items-center justify-between">
                    <label
                      htmlFor={`item-${item.id}`}
                      className={`text-sm font-medium cursor-pointer transition-all duration-300 ${
                        item.checked 
                          ? 'text-muted-foreground line-through' 
                          : 'text-foreground'
                      }`}
                    >
                      {item.name}
                    </label>
                    <span
                      className={`text-xs transition-all duration-300 ${
                        item.checked 
                          ? 'text-muted-foreground line-through' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </div>

                  {item.checked && (
                    <div className="flex items-center justify-center w-6 h-6 bg-success rounded-full">
                      <Check className="h-4 w-4 text-success-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}