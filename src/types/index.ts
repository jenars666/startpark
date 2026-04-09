export interface Product {
    id: number | string;
    name: string;
    price: string | number;
    oldPrice?: string | number;
    img: string;
    tag?: string;
    category?: string;
}

export interface CartItem {
  id: number | string;
  name: string;
  price: string | number;
  img: string;
  quantity: number;
  category?: string;
}

export interface WishlistItem {
  id: number | string;
  name: string;
  price: string | number;
  img: string;
}
