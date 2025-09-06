import { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductStore } from '@/store/productStore';
import { Product, Color, Size } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  isVisible: boolean;
  onClose: () => void;
  editingProduct?: Product | null;
}

export function ProductForm({ isVisible, onClose, editingProduct }: ProductFormProps) {
  const { addProduct, updateProduct } = useProductStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    price: editingProduct?.price || 0,
    originalPrice: editingProduct?.originalPrice || 0,
    category: editingProduct?.category || 'mujer' as const,
    type: editingProduct?.type || '',
    description: editingProduct?.description || '',
    image: editingProduct?.image || '',
    badge: editingProduct?.badge || '',
    colors: editingProduct?.colors || [{ name: '', hex: '#000000' }] as Color[],
    sizes: editingProduct?.sizes || [{ size: '', stock: 0, status: 'available' as const }] as Size[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.type || !formData.image) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const validColors = formData.colors.filter(color => color.name && color.hex);
    const validSizes = formData.sizes.filter(size => size.size && size.stock >= 0);

    if (validColors.length === 0 || validSizes.length === 0) {
      toast({
        title: "Colores y talles requeridos",
        description: "Agrega al menos un color y un talle válido",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      ...formData,
      colors: validColors,
      sizes: validSizes,
      originalPrice: formData.originalPrice || undefined,
      description: formData.description || undefined,
      badge: formData.badge || undefined,
      isNew: formData.badge === 'Nuevo',
      isBestSeller: formData.badge === 'Más vendido',
      isOnSale: formData.badge === 'Oferta'
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado correctamente",
      });
    } else {
      addProduct(productData);
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado correctamente",
      });
    }

    onClose();
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', hex: '#000000' }]
    }));
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index: number, field: keyof Color, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: 0, status: 'available' }]
    }));
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const updateSize = (index: number, field: keyof Size, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { 
          ...size, 
          [field]: field === 'stock' ? Number(value) : value,
          status: field === 'stock' ? (Number(value) === 0 ? 'unavailable' : Number(value) <= 2 ? 'low-stock' : 'available') : size.status
        } : size
      )
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-soft">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <CardTitle>
              {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </CardTitle>
            <Button variant="ghost" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Calza Térmica Lycra"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Ej: calzas, pantalones, camperas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: 'mujer' | 'hombre' | 'ninos') => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mujer">Mujer</SelectItem>
                    <SelectItem value="hombre">Hombre</SelectItem>
                    <SelectItem value="ninos">Niños</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Etiqueta</Label>
                <Select 
                  value={formData.badge} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, badge: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar etiqueta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin etiqueta</SelectItem>
                    <SelectItem value="Nuevo">Nuevo</SelectItem>
                    <SelectItem value="Más vendido">Más vendido</SelectItem>
                    <SelectItem value="Oferta">Oferta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="8999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Precio Original</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                  placeholder="9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de la Imagen *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del producto"
              />
            </div>

            {/* Colors Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Colores *</Label>
                <Button type="button" onClick={addColor} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Color
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={color.name}
                      onChange={(e) => updateColor(index, 'name', e.target.value)}
                      placeholder="Nombre del color"
                      className="flex-1"
                    />
                    <Input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(index, 'hex', e.target.value)}
                      className="w-16"
                    />
                    {formData.colors.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeColor(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Talles *</Label>
                <Button type="button" onClick={addSize} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Talle
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={size.size}
                      onChange={(e) => updateSize(index, 'size', e.target.value)}
                      placeholder="Talle (ej: S, M, L, 1, 2, 3)"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={size.stock}
                      onChange={(e) => updateSize(index, 'stock', Number(e.target.value))}
                      placeholder="Stock"
                      className="w-24"
                      min="0"
                    />
                    {formData.sizes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSize(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {editingProduct ? 'Actualizar' : 'Agregar'} Producto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}