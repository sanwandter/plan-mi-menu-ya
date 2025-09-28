import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Recipe, CalendarMeal, ShoppingListItem, IngredientCategory } from '@/types';
import { 
  lentejasVerduras,
  tostadasPalta,
  polloHorno,
  ensaladaFresca,
  pancakesIntegrales,
  salmonPlancha
} from '@/assets/images';

interface AppState {
  recipes: Recipe[];
  calendar: CalendarMeal;
  shoppingList: ShoppingListItem[];
  currentWeek: number;
}

type AppAction = 
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: Recipe }
  | { type: 'DELETE_RECIPE'; payload: string }
  | { type: 'SET_MEAL'; payload: { day: string; mealType: 'breakfast' | 'lunch' | 'dinner'; recipeId?: string } }
  | { type: 'CLEAR_MEAL'; payload: { day: string; mealType: 'breakfast' | 'lunch' | 'dinner' } }
  | { type: 'GENERATE_SHOPPING_LIST' }
  | { type: 'TOGGLE_SHOPPING_ITEM'; payload: string }
  | { type: 'SET_CURRENT_WEEK'; payload: number }
  | { type: 'LOAD_INITIAL_DATA'; payload: { recipes: Recipe[]; calendar?: CalendarMeal } };

const initialState: AppState = {
  recipes: [],
  calendar: {},
  shoppingList: [],
  currentWeek: 0
};

// Recetas iniciales de ejemplo
const initialRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Lentejas con verduras',
    image: lentejasVerduras,
    category: 'lunch',
    servings: 4,
    ingredients: [
      { id: '1-1', name: 'Lentejas', amount: 300, unit: 'g', category: 'legumbres' },
      { id: '1-2', name: 'Cebolla', amount: 1, unit: 'unidad', category: 'verduras' },
      { id: '1-3', name: 'Zanahoria', amount: 2, unit: 'unidades', category: 'verduras' },
      { id: '1-4', name: 'Apio', amount: 2, unit: 'tallos', category: 'verduras' },
      { id: '1-5', name: 'Aceite de oliva', amount: 3, unit: 'cucharadas', category: 'despensa' },
    ]
  },
  {
    id: '2',
    name: 'Tostadas con palta',
    image: tostadasPalta,
    category: 'breakfast',
    servings: 2,
    ingredients: [
      { id: '2-1', name: 'Pan integral', amount: 4, unit: 'rebanadas', category: 'cereales' },
      { id: '2-2', name: 'Palta', amount: 2, unit: 'unidades', category: 'frutas' },
      { id: '2-3', name: 'Limón', amount: 1, unit: 'unidad', category: 'frutas' },
      { id: '2-4', name: 'Tomate cherry', amount: 8, unit: 'unidades', category: 'verduras' },
      { id: '2-5', name: 'Sal', amount: 1, unit: 'pizca', category: 'condimentos' },
    ]
  },
  {
    id: '3',
    name: 'Pollo al horno',
    image: polloHorno,
    category: 'dinner',
    servings: 4,
    ingredients: [
      { id: '3-1', name: 'Pollo', amount: 1.5, unit: 'kg', category: 'carnes' },
      { id: '3-2', name: 'Papas', amount: 6, unit: 'unidades', category: 'verduras' },
      { id: '3-3', name: 'Cebolla', amount: 1, unit: 'unidad', category: 'verduras' },
      { id: '3-4', name: 'Pimentón', amount: 1, unit: 'unidad', category: 'verduras' },
      { id: '3-5', name: 'Aceite de oliva', amount: 4, unit: 'cucharadas', category: 'despensa' },
      { id: '3-6', name: 'Romero', amount: 2, unit: 'ramas', category: 'condimentos' },
    ]
  },
  {
    id: '4',
    name: 'Ensalada fresca',
    image: ensaladaFresca,
    category: 'lunch',
    servings: 2,
    ingredients: [
      { id: '4-1', name: 'Lechuga', amount: 1, unit: 'unidad', category: 'verduras' },
      { id: '4-2', name: 'Tomate', amount: 3, unit: 'unidades', category: 'verduras' },
      { id: '4-3', name: 'Pepino', amount: 1, unit: 'unidad', category: 'verduras' },
      { id: '4-4', name: 'Queso fresco', amount: 200, unit: 'g', category: 'lacteos' },
      { id: '4-5', name: 'Aceite de oliva', amount: 3, unit: 'cucharadas', category: 'despensa' },
      { id: '4-6', name: 'Vinagre', amount: 1, unit: 'cucharada', category: 'despensa' },
    ]
  },
  {
    id: '5',
    name: 'Pancakes integrales',
    image: pancakesIntegrales,
    category: 'breakfast',
    servings: 3,
    ingredients: [
      { id: '5-1', name: 'Harina integral', amount: 200, unit: 'g', category: 'cereales' },
      { id: '5-2', name: 'Huevos', amount: 2, unit: 'unidades', category: 'lacteos' },
      { id: '5-3', name: 'Leche', amount: 250, unit: 'ml', category: 'lacteos' },
      { id: '5-4', name: 'Mantequilla', amount: 50, unit: 'g', category: 'lacteos' },
      { id: '5-5', name: 'Miel', amount: 3, unit: 'cucharadas', category: 'despensa' },
      { id: '5-6', name: 'Polvo de hornear', amount: 1, unit: 'cucharadita', category: 'despensa' },
    ]
  },
  {
    id: '6',
    name: 'Salmón a la plancha',
    image: salmonPlancha,
    category: 'dinner',
    servings: 2,
    ingredients: [
      { id: '6-1', name: 'Salmón', amount: 500, unit: 'g', category: 'pescados' },
      { id: '6-2', name: 'Brócoli', amount: 300, unit: 'g', category: 'verduras' },
      { id: '6-3', name: 'Espárragos', amount: 200, unit: 'g', category: 'verduras' },
      { id: '6-4', name: 'Limón', amount: 1, unit: 'unidad', category: 'frutas' },
      { id: '6-5', name: 'Aceite de oliva', amount: 2, unit: 'cucharadas', category: 'despensa' },
    ]
  }
];

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_INITIAL_DATA':
      return {
        ...state,
        recipes: action.payload.recipes,
        calendar: action.payload.calendar || {}
      };
    case 'ADD_RECIPE':
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe => 
          recipe.id === action.payload.id ? action.payload : recipe
        )
      };
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
      };
    case 'SET_MEAL':
      const { day, mealType, recipeId } = action.payload;
      return {
        ...state,
        calendar: {
          ...state.calendar,
          [day]: {
            ...state.calendar[day],
            [mealType]: recipeId
          }
        }
      };
    case 'CLEAR_MEAL':
      const clearDay = action.payload.day;
      const clearMealType = action.payload.mealType;
      const dayMeals = { ...state.calendar[clearDay] };
      delete dayMeals[clearMealType];
      
      return {
        ...state,
        calendar: {
          ...state.calendar,
          [clearDay]: dayMeals
        }
      };
    case 'GENERATE_SHOPPING_LIST':
      const ingredientMap = new Map<string, ShoppingListItem>();
      
      Object.entries(state.calendar).forEach(([day, meals]) => {
        Object.entries(meals).forEach(([mealType, recipeId]) => {
          if (recipeId) {
            const recipe = state.recipes.find(r => r.id === recipeId);
            if (recipe) {
              recipe.ingredients.forEach(ingredient => {
                const key = `${ingredient.name}-${ingredient.unit}`;
                const existing = ingredientMap.get(key);
                
                if (existing) {
                  existing.amount += ingredient.amount;
                  if (!existing.recipeNames.includes(recipe.name)) {
                    existing.recipeNames.push(recipe.name);
                  }
                } else {
                  ingredientMap.set(key, {
                    id: `shopping-${ingredient.id}-${Date.now()}`,
                    name: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                    category: ingredient.category,
                    checked: false,
                    recipeNames: [recipe.name]
                  });
                }
              });
            }
          }
        });
      });
      
      return {
        ...state,
        shoppingList: Array.from(ingredientMap.values()).sort((a, b) => a.category.localeCompare(b.category))
      };
    case 'TOGGLE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingList: state.shoppingList.map(item =>
          item.id === action.payload ? { ...item, checked: !item.checked } : item
        )
      };
    case 'SET_CURRENT_WEEK':
      return {
        ...state,
        currentWeek: action.payload
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Cargar datos iniciales
  useEffect(() => {
    const savedData = localStorage.getItem('familyMenuApp');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Verificar si las rutas de imágenes son las correctas (sin hash de Vite)
        const hasOldImagePaths = parsedData.recipes?.some((recipe: any) => 
          recipe.image && (recipe.image.includes('-') && recipe.image.includes('.jpg'))
        );
        
        if (hasOldImagePaths) {
          // Si encuentra rutas antiguas, limpiar localStorage y usar datos iniciales
          localStorage.removeItem('familyMenuApp');
          dispatch({ 
            type: 'LOAD_INITIAL_DATA', 
            payload: { recipes: initialRecipes }
          });
        } else {
          dispatch({ 
            type: 'LOAD_INITIAL_DATA', 
            payload: { 
              recipes: parsedData.recipes || initialRecipes,
              calendar: parsedData.calendar || {}
            }
          });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        localStorage.removeItem('familyMenuApp');
        dispatch({ 
          type: 'LOAD_INITIAL_DATA', 
          payload: { recipes: initialRecipes }
        });
      }
    } else {
      dispatch({ 
        type: 'LOAD_INITIAL_DATA', 
        payload: { recipes: initialRecipes }
      });
    }
  }, []);

  // Guardar datos cuando cambien
  useEffect(() => {
    if (state.recipes.length > 0) {
      localStorage.setItem('familyMenuApp', JSON.stringify({
        recipes: state.recipes,
        calendar: state.calendar
      }));
    }
  }, [state.recipes, state.calendar]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
