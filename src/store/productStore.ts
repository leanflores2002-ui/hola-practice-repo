import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Color, Size } from '@/types/product';

interface ProductStore {
  products: Product[];
  cart: CartItem[];
  isAdmin: boolean;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Cart actions
  addToCart: (productId: string, color: Color, size: Size, quantity?: number) => void;
  removeFromCart: (productId: string, colorName: string, sizeName: string) => void;
  updateCartQuantity: (productId: string, colorName: string, sizeName: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  
  // Admin actions
  toggleAdmin: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [
        // Productos de mujer
        {
          id: '1',
          name: 'Calza Térmica Lycra Chupin',
          price: 8499,
          originalPrice: 9999,
          category: 'mujer',
          type: 'calzas',
          image: 'https://via.placeholder.com/300x300?text=Calza+Térmica+Lycra',
          colors: [
            { name: 'Negro', hex: '#000000' },
            { name: 'Gris oscuro', hex: '#333333' },
            { name: 'Marrón', hex: '#654321' }
          ],
          sizes: [
            { size: '1', stock: 5, status: 'available' },
            { size: '2', stock: 3, status: 'available' },
            { size: '3', stock: 7, status: 'available' },
            { size: '4', stock: 4, status: 'available' },
            { size: '5', stock: 2, status: 'available' },
            { size: '6', stock: 1, status: 'low-stock' },
            { size: '7', stock: 6, status: 'available' },
            { size: '8', stock: 3, status: 'available' }
          ],
          badge: 'Nuevo',
          isNew: true
        },
        {
          id: '2',
          name: 'Pantalón Jogger Térmico Lycra',
          price: 12999,
          originalPrice: 14999,
          category: 'mujer',
          type: 'pantalones',
          image: 'https://via.placeholder.com/300x300?text=Pantalón+Jogger+Térmico',
          colors: [
            { name: 'Negro', hex: '#000000' },
            { name: 'Marrón', hex: '#654321' },
            { name: 'Gris oscuro', hex: '#333333' }
          ],
          sizes: [
            { size: '1', stock: 4, status: 'available' },
            { size: '2', stock: 3, status: 'available' },
            { size: '3', stock: 5, status: 'available' },
            { size: '4', stock: 2, status: 'available' },
            { size: '5', stock: 6, status: 'available' },
            { size: '6', stock: 3, status: 'available' },
            { size: '7', stock: 4, status: 'available' },
            { size: '8', stock: 2, status: 'available' }
          ],
          badge: 'Más vendido',
          isBestSeller: true
        },
        // Productos de hombre
        {
          id: '3',
          name: 'Pantalón Algodón Frisado Premium',
          price: 16999,
          originalPrice: 19999,
          category: 'hombre',
          type: 'pantalones',
          image: 'https://via.placeholder.com/300x300?text=Pantalón+Algodón+Frisado',
          colors: [
            { name: 'Negro', hex: '#000000' },
            { name: 'Gris oscuro', hex: '#333333' },
            { name: 'Marrón', hex: '#654321' }
          ],
          sizes: [
            { size: '1', stock: 3, status: 'available' },
            { size: '2', stock: 4, status: 'available' },
            { size: '3', stock: 2, status: 'available' },
            { size: '4', stock: 5, status: 'available' },
            { size: '5', stock: 3, status: 'available' },
            { size: '6', stock: 4, status: 'available' },
            { size: '7', stock: 2, status: 'available' },
            { size: '8', stock: 3, status: 'available' }
          ]
        }
      ],
      cart: [],
      isAdmin: false,

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString()
        };
        set((state) => ({
          products: [...state.products, newProduct]
        }));
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map(product =>
            product.id === id ? { ...product, ...productData } : product
          )
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter(product => product.id !== id),
          cart: state.cart.filter(item => item.productId !== id)
        }));
      },

      addToCart: (productId, color, size, quantity = 1) => {
        const product = get().products.find(p => p.id === productId);
        if (!product) return;

        const existingItemIndex = get().cart.findIndex(
          item => 
            item.productId === productId && 
            item.selectedColor.name === color.name && 
            item.selectedSize.size === size.size
        );

        if (existingItemIndex >= 0) {
          set((state) => ({
            cart: state.cart.map((item, index) =>
              index === existingItemIndex 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }));
        } else {
          const newItem: CartItem = {
            productId,
            product,
            selectedColor: color,
            selectedSize: size,
            quantity
          };
          set((state) => ({
            cart: [...state.cart, newItem]
          }));
        }
      },

      removeFromCart: (productId, colorName, sizeName) => {
        set((state) => ({
          cart: state.cart.filter(
            item => !(
              item.productId === productId && 
              item.selectedColor.name === colorName && 
              item.selectedSize.size === sizeName
            )
          )
        }));
      },

      updateCartQuantity: (productId, colorName, sizeName, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, colorName, sizeName);
          return;
        }
        
        set((state) => ({
          cart: state.cart.map(item =>
            item.productId === productId && 
            item.selectedColor.name === colorName && 
            item.selectedSize.size === sizeName
              ? { ...item, quantity }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      toggleAdmin: () => {
        set((state) => ({ isAdmin: !state.isAdmin }));
      }
    }),
    {
      name: 'romix-store'
    }
  )
);