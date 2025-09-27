import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddRecipeModal } from "@/components/AddRecipeModal";
import { useAppContext } from "@/context/AppContext";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMealSelected: (recipeId: string) => void;
  selectedSlot: { 
    day: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner' 
  } | null;
}

export function AddMealModal({ isOpen, onClose, onMealSelected, selectedSlot }: AddMealModalProps) {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const filteredRecipes = state.recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedSlot?.mealType ? recipe.category === selectedSlot.mealType : true)
  );

  const handleRecipeSelect = (recipeId: string) => {
    onMealSelected(recipeId);
    setSearchTerm("");
  };

  const getMealTypeLabel = () => {
    if (!selectedSlot) return 'comida';
    const labels = {
      breakfast: 'desayuno',
      lunch: 'almuerzo', 
      dinner: 'cena'
    };
    return labels[selectedSlot.mealType];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-white rounded-xl shadow-lg">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Selecciona un plato para {getMealTypeLabel()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar recetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Recipes list */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No se encontraron recetas</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRecipeModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear nueva receta
                </Button>
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
                  onClick={() => handleRecipeSelect(recipe.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {recipe.image && (
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {recipe.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {recipe.servings} porciones
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recipe.tags?.slice(0, 2).map((tag) => (
                            <span 
                              key={tag} 
                              className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setIsRecipeModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Receta
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>

      {/* Modal para agregar nueva receta */}
      <AddRecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
      />
    </Dialog>
  );
}