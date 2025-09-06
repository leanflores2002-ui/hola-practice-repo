export interface Color {
  name: string;
  hex: string;
}

export interface Size {
  size: string;
  stock: number;
  status: 'available' | 'low-stock' | 'unavailable';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'mujer' | 'hombre' | 'ninos';
  type: string;
  description?: string;
  image: string;
  colors: Color[];
  sizes: Size[];
  badge?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedColor: Color;
  selectedSize: Size;
  quantity: number;
}

export interface ProductFormData {
  name: string;
  price: number;
  originalPrice?: number;
  category: 'mujer' | 'hombre' | 'ninos';
  type: string;
  description?: string;
  image: string;
  colors: Color[];
  sizes: Size[];
  badge?: string;
}