import { useState, useMemo } from "react";
import { Share2, Check, RotateCcw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { IngredientCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function ShoppingList() {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();

  // Agrupar los items por categoría
  const groupedItems = useMemo(() => {
    const groups: Record<IngredientCategory, typeof state.shoppingList> = {
      verduras: [],
      frutas: [],
      carnes: [],
      pescados: [],
      lacteos: [],
      cereales: [],
      legumbres: [],
      despensa: [],
      condimentos: [],
      otros: []
    };

    state.shoppingList.forEach(item => {
      groups[item.category].push(item);
    });

    // Filtrar grupos vacíos
    return Object.entries(groups)
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({
        category: category as IngredientCategory,
        items
      }));
  }, [state.shoppingList]);

  const getCategoryLabel = (category: IngredientCategory) => {
    const labels: Record<IngredientCategory, string> = {
      verduras: 'Verduras',
      frutas: 'Frutas',
      carnes: 'Carnes',
      pescados: 'Pescados y Mariscos',
      lacteos: 'Lácteos y Huevos',
      cereales: 'Cereales y Panes',
      legumbres: 'Legumbres',
      despensa: 'Despensa',
      condimentos: 'Condimentos y Especias',
      otros: 'Otros'
    };
    return labels[category];
  };

  const getCategoryEmoji = (category: IngredientCategory) => {
    const emojis: Record<IngredientCategory, string> = {
      verduras: '🥕',
      frutas: '🍎',
      carnes: '🥩',
      pescados: '🐟',
      lacteos: '🥛',
      cereales: '🍞',
      legumbres: '🫘',
      despensa: '🥫',
      condimentos: '🧂',
      otros: '🛒'
    };
    return emojis[category];
  };

  const handleToggleItem = (itemId: string) => {
    dispatch({ type: 'TOGGLE_SHOPPING_ITEM', payload: itemId });
  };

  const handleShare = async () => {
    const uncheckedItems = state.shoppingList.filter(item => !item.checked);
    const checkedItems = state.shoppingList.filter(item => item.checked);
    
    let shareText = '🛒 Lista de Compras - Menú Familiar\n\n';
    
    if (uncheckedItems.length > 0) {
      shareText += '📋 PENDIENTES:\n';
      uncheckedItems.forEach(item => {
        shareText += `• ${item.name} - ${item.amount} ${item.unit}\n`;
      });
      shareText += '\n';
    }
    
    if (checkedItems.length > 0) {
      shareText += '✅ COMPLETADOS:\n';
      checkedItems.forEach(item => {
        shareText += `• ${item.name} - ${item.amount} ${item.unit}\n`;
      });
    }

    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "¡Lista copiada!",
        description: "La lista de compras se ha copiado al portapapeles",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      // Fallback si clipboard API no está disponible
      toast({
        title: "Error",
        description: "No se pudo copiar la lista al portapapeles",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleRegenerate = () => {
    dispatch({ type: 'GENERATE_SHOPPING_LIST' });
  };

  const totalItems = state.shoppingList.length;
  const checkedItems = state.shoppingList.filter(item => item.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Compras</h1>
          <p className="text-gray-600">
            Generada automáticamente desde tu menú semanal
          </p>
        </div>

        {/* Progress and Actions */}
        <div className="mb-6">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Progreso: {checkedItems} de {totalItems} items
                    </h2>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {Math.round(progress)}% completado
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRegenerate}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Regenerar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copiar Lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopping List */}
        {state.shoppingList.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Lista de compras vacía
              </h3>
              <p className="text-gray-500 mb-4">
                Agrega platos a tu calendario para generar automáticamente tu lista de compras
              </p>
              <Button 
                onClick={handleRegenerate}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Generar Lista
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {groupedItems.map(({ category, items }) => (
              <Card key={category} className="bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{getCategoryEmoji(category)}</span>
                    {getCategoryLabel(category)}
                    <Badge variant="outline" className="ml-auto">
                      {items.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div 
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                          item.checked 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-white border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => handleToggleItem(item.id)}
                          className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${
                            item.checked 
                              ? 'text-gray-500 line-through' 
                              : 'text-gray-900'
                          }`}>
                            {item.name}
                          </p>
                          <p className={`text-sm ${
                            item.checked 
                              ? 'text-gray-400' 
                              : 'text-gray-600'
                          }`}>
                            {item.amount} {item.unit}
                          </p>
                          {item.recipeNames.length > 0 && (
                            <p className="text-xs text-orange-600 mt-1">
                              Para: {item.recipeNames.join(', ')}
                            </p>
                          )}
                        </div>
                        {item.checked && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}