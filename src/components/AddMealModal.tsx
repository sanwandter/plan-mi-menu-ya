import { useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Recipe {
  id: number;
  name: string;
  image: string;
  category: string;
}

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  recipes: Recipe[];
}

export function AddMealModal({ isOpen, onClose, onSelectRecipe, recipes }: AddMealModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card border border-border shadow-warm rounded-xl">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">
              Selecciona un plato
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar recetas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/50 border-border focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Recipes List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/50 transition-all duration-300 group"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-12 h-12 rounded-md object-cover shadow-soft group-hover:scale-105 transition-transform"
              />
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {recipe.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {recipe.category}
                </p>
              </div>
            </button>
          ))}
          
          {filteredRecipes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                No se encontraron recetas
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}