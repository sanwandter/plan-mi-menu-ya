import { useState } from "react";
import { Plus, Search, Clock, Users, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AddRecipeModal } from "@/components/AddRecipeModal";
import { useAppContext } from "@/context/AppContext";
import { Recipe } from "@/types";

export default function Recipes() {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | undefined>(undefined);

  const filteredRecipes = state.recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRecipe = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setShowNewRecipeForm(true);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    dispatch({ type: 'DELETE_RECIPE', payload: recipeId });
  };

  const handleCloseModal = () => {
    setShowNewRecipeForm(false);
    setRecipeToEdit(undefined);
  };

  const getCategoryLabel = (category: 'breakfast' | 'lunch' | 'dinner') => {
    const labels = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena'
    };
    return labels[category];
  };

  const getCategoryColor = (category: 'breakfast' | 'lunch' | 'dinner') => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-purple-100 text-purple-800'
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Recetas</h1>
          <p className="text-gray-600">Administra tus recetas favoritas de la familia</p>
        </div>

        {/* Search and Add Recipe */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar recetas por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => {
              setRecipeToEdit(undefined);
              setShowNewRecipeForm(true);
            }}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Nueva Receta
          </Button>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron recetas
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Prueba con términos diferentes' : 'Comienza agregando tu primera receta'}
                </p>
              </div>
              {!searchTerm && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setRecipeToEdit(undefined);
                    setShowNewRecipeForm(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primera receta
                </Button>
              )}
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="group hover:shadow-lg transition-all duration-200 bg-white border-gray-200"
              >
                <div className="relative">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 hover:bg-white"
                        onClick={() => handleEditRecipe(recipe)}
                        title="Editar receta"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                            title="Eliminar receta"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar receta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que quieres eliminar la receta "{recipe.name}"? 
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                      {recipe.name}
                    </h3>
                  </div>
                  <Badge className={`w-fit ${getCategoryColor(recipe.category)}`}>
                    {getCategoryLabel(recipe.category)}
                  </Badge>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings} porciones</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>~45 min</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Ingredientes principales:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {recipe.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
                      {recipe.ingredients.length > 3 && '...'}
                    </p>
                  </div>

                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {recipe.tags.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{recipe.tags.length - 2} más
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recipe Form Modal */}
        <AddRecipeModal
          isOpen={showNewRecipeForm}
          onClose={handleCloseModal}
          recipeToEdit={recipeToEdit}
        />
      </div>
    </div>
  );
}