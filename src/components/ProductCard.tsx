import { useState } from 'react';
import { Heart, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProductStore } from '@/store/productStore';
import { Product, Color, Size } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const { isAdmin, addToCart, deleteProduct } = useProductStore();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Selecciona un talle",
        description: "Por favor selecciona un talle antes de agregar al carrito",
        variant: "destructive",
      });
      return;
    }

    if (selectedSize.status === 'unavailable') {
      toast({
        title: "Talle no disponible",
        description: "Este talle no está disponible actualmente",
        variant: "destructive",
      });
      return;
    }

    addToCart(product.id, selectedColor, selectedSize);
    toast({
      title: "¡Agregado al carrito!",
      description: `${product.name} - ${selectedColor.name} - Talle ${selectedSize.size}`,
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(product.id);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 bg-gradient-soft">
      <div className="relative">
        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden rounded-t-lg">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {product.badge && (
          <Badge 
            className={cn(
              "absolute top-2 right-2",
              product.isNew && "bg-primary",
              product.isBestSeller && "bg-secondary",
              product.isOnSale && "bg-warning text-warning-foreground"
            )}
          >
            {product.badge}
          </Badge>
        )}

        {isAdmin && (
          <div className="absolute top-2 left-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit?.(product)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-card-foreground line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Color:</p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all",
                  selectedColor.name === color.name
                    ? "border-primary scale-110"
                    : "border-muted-foreground/20 hover:border-muted-foreground"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Talle:</p>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                disabled={size.status === 'unavailable'}
                className={cn(
                  "px-3 py-1 text-xs border rounded transition-all",
                  selectedSize?.size === size.size && "border-primary bg-primary text-primary-foreground",
                  size.status === 'available' && selectedSize?.size !== size.size && "border-border hover:border-primary",
                  size.status === 'low-stock' && selectedSize?.size !== size.size && "border-warning bg-warning/10 text-warning-foreground",
                  size.status === 'unavailable' && "border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                )}
              >
                {size.size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleAddToCart}
            className="flex-1"
            disabled={!selectedSize || selectedSize.status === 'unavailable'}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Comprar
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}