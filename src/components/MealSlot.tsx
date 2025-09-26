import { Plus } from "lucide-react";

interface MealSlotProps {
  meal?: {
    id: number;
    name: string;
    image: string;
  };
  mealType: {
    key: string;
    label: string;
    fullLabel: string;
    color: string;
    icon: string;
  };
  onAddMeal: () => void;
}

export function MealSlot({ meal, mealType, onAddMeal }: MealSlotProps) {
  const getMealColorClasses = (color: string) => {
    switch (color) {
      case 'breakfast':
        return 'border-breakfast/30 hover:border-breakfast/60';
      case 'lunch':
        return 'border-lunch/30 hover:border-lunch/60';
      case 'dinner':
        return 'border-dinner/30 hover:border-dinner/60';
      default:
        return 'border-muted/30 hover:border-muted/60';
    }
  };

  const getMealBgClasses = (color: string) => {
    switch (color) {
      case 'breakfast':
        return 'bg-breakfast/5 hover:bg-breakfast/10';
      case 'lunch':
        return 'bg-lunch/5 hover:bg-lunch/10';
      case 'dinner':
        return 'bg-dinner/5 hover:bg-dinner/10';
      default:
        return 'bg-muted/5 hover:bg-muted/10';
    }
  };

  return (
    <button
      onClick={onAddMeal}
      className={`w-full h-16 rounded-lg border-2 border-dashed transition-all duration-300 hover:scale-105 ${getMealColorClasses(mealType.color)} ${getMealBgClasses(mealType.color)} group relative overflow-hidden`}
    >
      {meal ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-1">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-8 object-cover rounded-sm mb-1"
          />
          <span className="text-xs font-medium text-foreground leading-tight line-clamp-1 px-1">
            {meal.name}
          </span>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Plus className={`h-4 w-4 transition-all duration-300 group-hover:scale-110 ${
            mealType.color === 'breakfast' ? 'text-breakfast' :
            mealType.color === 'lunch' ? 'text-lunch' :
            mealType.color === 'dinner' ? 'text-dinner' : 'text-muted-foreground'
          }`} />
        </div>
      )}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}