import { useState, useMemo } from "react";
import { Plus, ShoppingCart, Calendar as CalendarIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddMealModal } from "@/components/AddMealModal";
import { useAppContext } from "@/context/AppContext";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

export default function MealCalendar() {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ 
    day: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner' 
  } | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');

  // Generar 14 días comenzando desde hoy
  const weekDays = useMemo(() => {
    const today = startOfDay(new Date());
    const days = [];
    
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      const dayKey = format(date, 'yyyy-MM-dd');
      const dayMeals = state.calendar[dayKey] || {};
      
      days.push({
        date,
        dayKey,
        dayName: format(date, 'EEEE', { locale: es }),
        dayNumber: format(date, 'd'),
        month: format(date, 'MMM', { locale: es }),
        isToday: isSameDay(date, today),
        week: i < 7 ? 1 : 2,
        meals: {
          breakfast: dayMeals.breakfast ? state.recipes.find(r => r.id === dayMeals.breakfast) : undefined,
          lunch: dayMeals.lunch ? state.recipes.find(r => r.id === dayMeals.lunch) : undefined,
          dinner: dayMeals.dinner ? state.recipes.find(r => r.id === dayMeals.dinner) : undefined,
        }
      });
    }
    
    return days;
  }, [state.calendar, state.recipes]);

  const currentWeekDays = weekDays.filter(day => 
    state.currentWeek === 0 ? day.week === 1 : day.week === 2
  );

  const handleAddMeal = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedSlot({ day, mealType });
    setIsModalOpen(true);
  };

  const handleMealSelected = (recipeId: string) => {
    if (selectedSlot) {
      dispatch({
        type: 'SET_MEAL',
        payload: {
          day: selectedSlot.day,
          mealType: selectedSlot.mealType,
          recipeId
        }
      });
    }
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleGenerateShoppingList = () => {
    dispatch({ type: 'GENERATE_SHOPPING_LIST' });
  };

  const getMealTypeLabel = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const labels = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo', 
      dinner: 'Cena'
    };
    return labels[mealType];
  };

  const getMealTypeEmoji = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const emojis = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙'
    };
    return emojis[mealType];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menú Semanal</h1>
          <p className="text-gray-600">Planifica las comidas de tu familia para las próximas 2 semanas</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={state.currentWeek === 0 ? "default" : "outline"}
              onClick={() => dispatch({ type: 'SET_CURRENT_WEEK', payload: 0 })}
            >
              Semana 1
            </Button>
            <Button
              variant={state.currentWeek === 1 ? "default" : "outline"}
              onClick={() => dispatch({ type: 'SET_CURRENT_WEEK', payload: 1 })}
            >
              Semana 2
            </Button>
          </div>
          
          <div className="flex gap-2 ml-auto">
            <Button
              variant={viewMode === 'week' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendario
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-7 gap-2 mb-6">
            {currentWeekDays.map((day) => (
              <Card 
                key={day.dayKey} 
                className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  day.isToday ? 'ring-2 ring-orange-400 bg-orange-50' : 'bg-white'
                }`}
              >
                <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100">
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-700 capitalize">
                        {day.dayName}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {day.dayNumber}
                      </p>
                    </div>
                    {day.isToday && (
                      <Badge variant="secondary" className="bg-orange-200 text-orange-800 text-xs px-1 py-0">
                        Hoy
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-2 space-y-1">
                  {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                    <div key={mealType} className="border rounded p-1 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          {getMealTypeEmoji(mealType)}
                        </span>
                      </div>
                      
                      {day.meals[mealType] ? (
                        <div 
                          className="cursor-pointer group"
                          onClick={() => handleAddMeal(day.dayKey, mealType)}
                        >
                          <div className="flex items-center gap-1">
                            {day.meals[mealType]?.image && (
                              <img
                                src={day.meals[mealType]!.image}
                                alt={day.meals[mealType]!.name}
                                className="w-6 h-6 rounded object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                {day.meals[mealType]!.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddMeal(day.dayKey, mealType)}
                          className="w-full border-2 border-dashed border-gray-300 rounded p-1 text-gray-400 hover:border-orange-400 hover:text-orange-600 transition-colors"
                        >
                          <Plus className="h-3 w-3 mx-auto" />
                          <p className="text-xs mt-1">Agregar</p>
                        </button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4 mb-6">
            {currentWeekDays.map((day) => (
              <Card key={day.dayKey} className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100">
                  <h3 className="font-bold text-lg text-gray-900 capitalize">
                    {day.dayName} {day.dayNumber} de {day.month}
                    {day.isToday && <Badge className="ml-2 bg-orange-600">Hoy</Badge>}
                  </h3>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                      <div key={mealType} className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-700 mb-2">
                          {getMealTypeEmoji(mealType)} {getMealTypeLabel(mealType)}
                        </h4>
                        {day.meals[mealType] ? (
                          <div 
                            className="cursor-pointer group"
                            onClick={() => handleAddMeal(day.dayKey, mealType)}
                          >
                            <div className="flex items-center gap-3">
                              {day.meals[mealType]?.image && (
                                <img
                                  src={day.meals[mealType]!.image}
                                  alt={day.meals[mealType]!.name}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                  {day.meals[mealType]!.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {day.meals[mealType]!.servings} porciones
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddMeal(day.dayKey, mealType)}
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-400 hover:border-orange-400 hover:text-orange-600 transition-colors"
                          >
                            <Plus className="h-5 w-5 mx-auto mb-1" />
                            <p className="text-sm">Agregar plato</p>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Generate Shopping List Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleGenerateShoppingList}
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Generar Lista de Compras
          </Button>
        </div>
      </div>

      {/* Modal para agregar comida */}
      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
        onMealSelected={handleMealSelected}
        selectedSlot={selectedSlot}
      />
    </div>
  );
}