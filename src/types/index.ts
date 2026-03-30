export interface Product {
    id: number | string;
    name: string;
    price: string | number;
    oldPrice?: string | number;
    img: string;
    tag?: string;
}

export interface CartItem {
  id: number | string;
  name: string;
  price: string | number;
  img: string;
  quantity: number;
}

export interface WishlistItem {
  id: number | string;
  name: string;
  price: string;
  img: string;
}
