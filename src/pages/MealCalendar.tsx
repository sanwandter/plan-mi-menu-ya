import { useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/MealCard";
import { AddMealModal } from "@/components/AddMealModal";

// Mock data for demonstration
const mockRecipes = [
  { id: 1, name: "Lentejas con verduras", image: "/src/assets/lentejas-verduras.jpg", category: "lunch" },
  { id: 2, name: "Tostadas con palta", image: "/src/assets/tostadas-palta.jpg", category: "breakfast" },
  { id: 3, name: "Pollo al horno", image: "/src/assets/pollo-horno.jpg", category: "dinner" },
  { id: 4, name: "Ensalada fresca", image: "/src/assets/ensalada-fresca.jpg", category: "lunch" },
];

export default function MealCalendar() {
  const [selectedMeals, setSelectedMeals] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number, mealType: string } | null>(null);

  // Generate 14 days starting from today
  const generateDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('es-ES', { month: 'short' }),
      });
    }
    
    return days;
  };

  const days = generateDays();
  const mealTypes = [
    { key: 'breakfast', label: 'Desayuno', color: 'breakfast' },
    { key: 'lunch', label: 'Almuerzo', color: 'lunch' },
    { key: 'dinner', label: 'Cena', color: 'dinner' },
  ];

  const handleAddMeal = (day: number, mealType: string) => {
    setSelectedSlot({ day, mealType });
    setIsModalOpen(true);
  };

  const handleSelectRecipe = (recipe: any) => {
    if (selectedSlot) {
      const key = `${selectedSlot.day}-${selectedSlot.mealType}`;
      setSelectedMeals(prev => ({
        ...prev,
        [key]: recipe
      }));
    }
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-soft/20">
      {/* Header */}
      <div className="bg-card shadow-soft">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Menú Semanal</h1>
              <p className="text-muted-foreground text-sm">Planifica las comidas de tu familia</p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-warm">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Generar Lista
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 gap-4">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/20 px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                      {day.dayName}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {day.dayNumber} {day.month}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meals */}
              <div className="p-4 space-y-3">
                {mealTypes.map((mealType) => {
                  const key = `${dayIndex}-${mealType.key}`;
                  const selectedMeal = selectedMeals[key];

                  return (
                    <MealCard
                      key={mealType.key}
                      mealType={mealType}
                      meal={selectedMeal}
                      onAddMeal={() => handleAddMeal(dayIndex, mealType.key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectRecipe={handleSelectRecipe}
        recipes={mockRecipes}
      />
    </div>
  );
}