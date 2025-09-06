import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductStore } from '@/store/productStore';
import { ProductCard } from './ProductCard';
import { ProductForm } from './ProductForm';
import { Product } from '@/types/product';

interface ProductGridProps {
  category: 'mujer' | 'hombre' | 'ninos';
  title: string;
  icon: React.ReactNode;
}

export function ProductGrid({ category, title, icon }: ProductGridProps) {
  const { products, isAdmin } = useProductStore();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categoryProducts = products.filter(product => product.category === category);
  
  const filteredProducts = selectedType === 'all' 
    ? categoryProducts 
    : categoryProducts.filter(product => product.type === selectedType);

  const availableTypes = Array.from(new Set(categoryProducts.map(product => product.type)));

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          {icon}
          {title}
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                {availableTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isAdmin && (
            <Button onClick={handleAddProduct} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No hay productos disponibles</p>
          {isAdmin && (
            <Button onClick={handleAddProduct} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Agregar el primer producto
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={handleEditProduct}
            />
          ))}
        </div>
      )}

      <ProductForm 
        isVisible={showForm}
        onClose={handleCloseForm}
        editingProduct={editingProduct}
      />
    </section>
  );
}