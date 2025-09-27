import { useState, useEffect } from "react";
import { Plus, X, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { Recipe, Ingredient, MealCategory, IngredientCategory } from "@/types";

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeToEdit?: Recipe;
}

export function AddRecipeModal({ isOpen, onClose, recipeToEdit }: AddRecipeModalProps) {
  const { dispatch } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '' as MealCategory,
    servings: 4,
    image: '',
    tags: [] as string[]
  });

  const [ingredients, setIngredients] = useState<Omit<Ingredient, 'id'>[]>([
    { name: '', amount: 0, unit: '', category: 'otros' as IngredientCategory }
  ]);

  const [currentTag, setCurrentTag] = useState('');

  // Cargar datos de la receta a editar
  useEffect(() => {
    if (recipeToEdit && isOpen) {
      setFormData({
        name: recipeToEdit.name,
        category: recipeToEdit.category,
        servings: recipeToEdit.servings,
        image: recipeToEdit.image || '',
        tags: recipeToEdit.tags || []
      });
      setIngredients(recipeToEdit.ingredients.map(({ id, ...rest }) => rest));
    } else if (isOpen) {
      // Reset form when opening for new recipe
      setFormData({
        name: '',
        category: '' as MealCategory,
        servings: 4,
        image: '',
        tags: []
      });
      setIngredients([{ name: '', amount: 0, unit: '', category: 'otros' }]);
    }
  }, [recipeToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || ingredients.some(ing => !ing.name)) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (recipeToEdit) {
      // Actualizar receta existente
      const updatedRecipe: Recipe = {
        ...recipeToEdit,
        name: formData.name,
        category: formData.category,
        servings: formData.servings,
        image: formData.image,
        tags: formData.tags,
        ingredients: ingredients.map((ing, index) => ({
          ...ing,
          id: recipeToEdit.ingredients[index]?.id || `${Date.now()}-${index}`
        }))
      };
      dispatch({ type: 'UPDATE_RECIPE', payload: updatedRecipe });
    } else {
      // Crear nueva receta
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        servings: formData.servings,
        image: formData.image,
        tags: formData.tags,
        ingredients: ingredients.map((ing, index) => ({
          ...ing,
          id: `${Date.now()}-${index}`
        }))
      };
      dispatch({ type: 'ADD_RECIPE', payload: newRecipe });
    }
    
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '' as MealCategory,
      servings: 4,
      image: '',
      tags: []
    });
    setIngredients([{ name: '', amount: 0, unit: '', category: 'otros' }]);
    setCurrentTag('');
    onClose();
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0, unit: '', category: 'otros' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Omit<Ingredient, 'id'>, value: any) => {
    setIngredients(ingredients.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto [&>[data-radix-dialog-close]]:top-4 [&>[data-radix-dialog-close]]:right-4 [&>[data-radix-dialog-close]]:bg-white [&>[data-radix-dialog-close]]:shadow-sm [&>[data-radix-dialog-close]]:border [&>[data-radix-dialog-close]]:z-50">
        <DialogHeader className="pb-4 border-b bg-white relative">
          <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
            {recipeToEdit ? 'Editar Receta' : 'Crear Nueva Receta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-1">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la receta *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Lentejas con verduras"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value: MealCategory) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Desayuno</SelectItem>
                    <SelectItem value="lunch">Almuerzo</SelectItem>
                    <SelectItem value="dinner">Cena</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="servings">Porciones</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="image">URL de imagen (opcional)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Etiquetas (opcional)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Ej: saludable, rápido, vegetariano"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-600" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-semibold">Ingredientes *</Label>
              <Button type="button" onClick={addIngredient} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar ingrediente
              </Button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <Input
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="Nombre del ingrediente"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <Button
                        type="button"
                        onClick={() => {
                          const newAmount = Math.max(0, (ingredient.amount || 0) - 1);
                          updateIngredient(index, 'amount', newAmount);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-none border-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        step="0.1"
                        value={ingredient.amount || ''}
                        onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        required
                        className="text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          const newAmount = (ingredient.amount || 0) + 1;
                          updateIngredient(index, 'amount', newAmount);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-none border-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      placeholder="Unidad"
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <Select 
                      value={ingredient.category} 
                      onValueChange={(value: IngredientCategory) => updateIngredient(index, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verduras">Verduras</SelectItem>
                        <SelectItem value="frutas">Frutas</SelectItem>
                        <SelectItem value="carnes">Carnes</SelectItem>
                        <SelectItem value="pescados">Pescados</SelectItem>
                        <SelectItem value="lacteos">Lácteos</SelectItem>
                        <SelectItem value="cereales">Cereales</SelectItem>
                        <SelectItem value="legumbres">Legumbres</SelectItem>
                        <SelectItem value="despensa">Despensa</SelectItem>
                        <SelectItem value="condimentos">Condimentos</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      disabled={ingredients.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t bg-white">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {recipeToEdit ? 'Actualizar Receta' : 'Crear Receta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
