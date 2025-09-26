import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock recipes data
const mockRecipes = [
  {
    id: 1,
    name: "Lentejas con verduras",
    image: "/src/assets/lentejas-verduras.jpg",
    category: "Almuerzo",
    prepTime: "45 min",
  },
  {
    id: 2,
    name: "Tostadas con palta",
    image: "/src/assets/tostadas-palta.jpg",
    category: "Desayuno",
    prepTime: "10 min",
  },
  {
    id: 3,
    name: "Pollo al horno",
    image: "/src/assets/pollo-horno.jpg",
    category: "Cena",
    prepTime: "60 min",
  },
  {
    id: 4,
    name: "Ensalada fresca",
    image: "/src/assets/ensalada-fresca.jpg",
    category: "Almuerzo",
    prepTime: "15 min",
  },
  {
    id: 5,
    name: "Pancakes integrales",
    image: "/src/assets/pancakes-integrales.jpg",
    category: "Desayuno",
    prepTime: "20 min",
  },
  {
    id: 6,
    name: "Salmón a la plancha",
    image: "/src/assets/salmon-plancha.jpg",
    category: "Cena",
    prepTime: "25 min",
  },
];

export default function Recipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes] = useState(mockRecipes);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewRecipe = () => {
    // Simulated add recipe functionality
    alert("Funcionalidad para añadir nueva receta");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Header */}
      <div className="bg-card shadow-soft">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Mis Recetas</h1>
              <p className="text-muted-foreground text-sm">
                {filteredRecipes.length} recetas encontradas
              </p>
            </div>
            <Button 
              onClick={handleAddNewRecipe}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-warm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Añadir
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar recetas por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-border focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-card rounded-xl shadow-card border border-border overflow-hidden hover:shadow-warm hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {recipe.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {recipe.category}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {recipe.prepTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg mb-2">
              No se encontraron recetas
            </p>
            <p className="text-muted-foreground text-sm">
              Intenta buscar con otros términos
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button for mobile */}
      <div className="fixed bottom-24 right-6">
        <Button
          onClick={handleAddNewRecipe}
          size="lg"
          className="rounded-full w-14 h-14 shadow-warm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:scale-110 transition-all duration-300"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}