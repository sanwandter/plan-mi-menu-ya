import { Plus } from "lucide-react";

interface MealCardProps {
  mealType: {
    key: string;
    label: string;
    color: string;
  };
  meal?: {
    id: number;
    name: string;
    image: string;
  };
  onAddMeal: () => void;
}

export function MealCard({ mealType, meal, onAddMeal }: MealCardProps) {
  const getMealColorClasses = (color: string) => {
    switch (color) {
      case 'breakfast':
        return 'bg-breakfast text-breakfast-foreground border-breakfast/30';
      case 'lunch':
        return 'bg-lunch text-lunch-foreground border-lunch/30';
      case 'dinner':
        return 'bg-dinner text-dinner-foreground border-dinner/30';
      default:
        return 'bg-muted text-muted-foreground border-muted/30';
    }
  };

  const getMealGradientClasses = (color: string) => {
    switch (color) {
      case 'breakfast':
        return 'from-breakfast/20 to-breakfast/5';
      case 'lunch':
        return 'from-lunch/20 to-lunch/5';
      case 'dinner':
        return 'from-dinner/20 to-dinner/5';
      default:
        return 'from-muted/20 to-muted/5';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getMealGradientClasses(mealType.color)} border border-border rounded-lg p-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`px-2 py-1 rounded-md text-xs font-semibold ${getMealColorClasses(mealType.color)} border`}>
            {mealType.label}
          </div>
          
          {meal ? (
            <div className="flex items-center space-x-3">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-12 h-12 rounded-md object-cover shadow-soft"
              />
              <span className="text-sm font-medium text-foreground">{meal.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Sin plato asignado</span>
          )}
        </div>

        <button
          onClick={onAddMeal}
          className={`p-2 rounded-full border-2 border-dashed transition-all duration-300 hover:scale-110 ${
            meal 
              ? 'border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary' 
              : 'border-primary/50 text-primary hover:border-primary hover:bg-primary/10'
          }`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}