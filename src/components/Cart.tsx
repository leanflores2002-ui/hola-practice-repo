import { Minus, Plus, Trash2, ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductStore } from '@/store/productStore';
import { useToast } from '@/hooks/use-toast';

interface CartProps {
  isVisible: boolean;
  onClose: () => void;
}

export function Cart({ isVisible, onClose }: CartProps) {
  const { cart, updateCartQuantity, removeFromCart, clearCart, getCartTotal } = useProductStore();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (productId: string, colorName: string, sizeName: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId, colorName, sizeName);
      return;
    }
    updateCartQuantity(productId, colorName, sizeName, newQuantity);
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
      toast({
        title: "Carrito vaciado",
        description: "Se han eliminado todos los productos del carrito",
      });
    }
  };

  const handleSendToWhatsApp = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de enviar el pedido",
        variant: "destructive",
      });
      return;
    }

    let message = "¡Hola! Me interesa realizar el siguiente pedido:\n\n";
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Color: ${item.selectedColor.name}\n`;
      message += `   Talle: ${item.selectedSize.size}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: ${formatPrice(item.product.price * item.quantity)}\n\n`;
    });

    message += `TOTAL: ${formatPrice(getCartTotal())}\n\n`;
    message += "¡Espero tu respuesta!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5491154272065?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-soft">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrito de Compras
            </CardTitle>
            <Button variant="ghost" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/10">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.selectedColor.name}-${item.selectedSize.size}`} 
                       className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Color: {item.selectedColor.name}</span>
                        <span>Talle: {item.selectedSize.size}</span>
                      </div>
                      <p className="font-semibold text-primary">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(
                          item.productId, 
                          item.selectedColor.name, 
                          item.selectedSize.size, 
                          item.quantity - 1
                        )}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(
                          item.productId, 
                          item.selectedColor.name, 
                          item.selectedSize.size, 
                          item.quantity + 1
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(
                          item.productId, 
                          item.selectedColor.name, 
                          item.selectedSize.size
                        )}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleClearCart} className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar Carrito
                </Button>
                <Button onClick={handleSendToWhatsApp} className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar Pedido
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}