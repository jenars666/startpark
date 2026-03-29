export interface ProductType {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  img: string;
  length?: string;
  weight?: string;
  desc: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  stock?: number;
  video?: string | null;
}

