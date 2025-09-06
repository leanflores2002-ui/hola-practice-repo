import { useState } from 'react';
import { User, Users, Baby } from 'lucide-react';
import { Header } from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { Cart } from '@/components/Cart';

const Index = () => {
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header onShowCart={() => setShowCart(true)} />
      
      <main className="container mx-auto px-4 py-8 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ROMIX
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra colección de invierno 2025. Moda cómoda y elegante para toda la familia.
          </p>
        </div>

        <ProductGrid 
          category="mujer" 
          title="Ropa para Mujer" 
          icon={<User className="h-8 w-8 text-primary" />} 
        />
        
        <ProductGrid 
          category="hombre" 
          title="Ropa para Hombre" 
          icon={<Users className="h-8 w-8 text-primary" />} 
        />
        
        <ProductGrid 
          category="ninos" 
          title="Ropa para Niños" 
          icon={<Baby className="h-8 w-8 text-primary" />} 
        />
      </main>

      <footer className="bg-gradient-primary text-primary-foreground py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ROMIX</h3>
              <p className="text-primary-foreground/80">
                Tu tienda de confianza para ropa de calidad. Moda cómoda y elegante para toda la familia.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <p>📱 +54 9 11 5427-2065</p>
                <p>📧 info@romix.com.ar</p>
                <p>📍 Buenos Aires, Argentina</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Horarios</h4>
              <div className="space-y-1 text-primary-foreground/80 text-sm">
                <p>Lunes a Viernes: 9:00 - 18:00</p>
                <p>Sábados: 9:00 - 15:00</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2025 ROMIX. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <Cart isVisible={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
};

export default Index;
