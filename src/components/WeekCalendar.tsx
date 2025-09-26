import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealSlot } from "./MealSlot";

interface WeekCalendarProps {
  selectedMeals: Record<string, any>;
  onAddMeal: (day: number, mealType: string) => void;
}

export function WeekCalendar({ selectedMeals, onAddMeal }: WeekCalendarProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Generate 7 days for the current week view
  const generateWeekDays = (weekOffset: number) => {
    const days = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + (weekOffset * 7));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('es-ES', { month: 'short' }),
        dayIndex: (weekOffset * 7) + i,
      });
    }
    
    return days;
  };

  const days = generateWeekDays(currentWeekOffset);
  const mealTypes = [
    { key: 'breakfast', label: 'D', fullLabel: 'Desayuno', color: 'breakfast', icon: '🌅' },
    { key: 'lunch', label: 'A', fullLabel: 'Almuerzo', color: 'lunch', icon: '☀️' },
    { key: 'dinner', label: 'C', fullLabel: 'Cena', color: 'dinner', icon: '🌙' },
  ];

  const goToPreviousWeek = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(currentWeekOffset - 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeekOffset < 1) { // Only allow 2 weeks ahead
      setCurrentWeekOffset(currentWeekOffset + 1);
    }
  };

  const getWeekTitle = () => {
    if (currentWeekOffset === 0) return "Esta Semana";
    if (currentWeekOffset === 1) return "Próxima Semana";
    return `Semana ${currentWeekOffset + 1}`;
  };

  return (
    <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
      {/* Week Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/20 px-4 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousWeek}
            disabled={currentWeekOffset <= 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <h2 className="text-lg font-bold text-foreground">{getWeekTitle()}</h2>
            <p className="text-xs text-muted-foreground">
              {days[0].dayNumber} {days[0].month} - {days[6].dayNumber} {days[6].month}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextWeek}
            disabled={currentWeekOffset >= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {days.map((day) => (
            <div key={day.dayIndex} className="text-center">
              <p className="text-xs font-medium text-muted-foreground capitalize mb-1">
                {day.dayName}
              </p>
              <div className={`text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                day.date.toDateString() === new Date().toDateString()
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground'
              }`}>
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>

        {/* Meal Rows */}
        {mealTypes.map((mealType) => (
          <div key={mealType.key} className="mb-4 last:mb-0">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">{mealType.icon}</span>
              <span className="text-sm font-medium text-muted-foreground">{mealType.fullLabel}</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const key = `${day.dayIndex}-${mealType.key}`;
                const meal = selectedMeals[key];

                return (
                  <MealSlot
                    key={key}
                    meal={meal}
                    mealType={mealType}
                    onAddMeal={() => onAddMeal(day.dayIndex, mealType.key)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}