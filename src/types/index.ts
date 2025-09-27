// Tipos de datos principales para la aplicación
export interface Recipe {
  id: string;
  name: string;
  image?: string;
  ingredients: Ingredient[];
  servings: number;
  category: MealCategory;
  tags?: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner';

export type IngredientCategory = 
  | 'verduras' 
  | 'frutas'
  | 'carnes' 
  | 'pescados'
  | 'lacteos' 
  | 'cereales'
  | 'legumbres'
  | 'despensa'
  | 'condimentos'
  | 'otros';

export interface MealSlot {
  day: string; // formato: 'YYYY-MM-DD'
  mealType: MealCategory;
  recipeId?: string;
}

export interface CalendarMeal {
  [key: string]: { // key formato: 'YYYY-MM-DD'
    breakfast?: string; // recipeId
    lunch?: string; // recipeId
    dinner?: string; // recipeId
  }
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
  checked: boolean;
  recipeNames: string[]; // para saber de qué recetas viene
}

export interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
  }
}

export interface AppState {
  recipes: Recipe[];
  calendar: CalendarMeal;
  shoppingList: ShoppingListItem[];
  currentWeek: number; // 0 = primera semana, 1 = segunda semana
}
