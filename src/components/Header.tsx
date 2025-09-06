import { Shirt, ShoppingCart, MessageCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/productStore';

interface HeaderProps {
  onShowCart: () => void;
}

export function Header({ onShowCart }: HeaderProps) {
  const { getCartCount, isAdmin, toggleAdmin } = useProductStore();
  const cartCount = getCartCount();

  return (
    <header className="bg-gradient-primary text-primary-foreground shadow-elegant sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shirt className="h-8 w-8" />
            <h1 className="text-3xl font-bold">ROMIX</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/5491154272065" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              +54 9 11 5427-2065
            </a>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAdmin}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Settings className="h-4 w-4" />
              {isAdmin ? 'Usuario' : 'Admin'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={onShowCart}
              className="relative text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}