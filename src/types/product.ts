export interface Product {
    id: number | string;
    name: string;
    price: string;
    oldPrice?: string;
    img: string;
    tag?: string;
    rating?: number;
    reviews?: number;
    sizes?: string[];
    description?: string;
    fabric?: string;
    care?: string;
    color?: string;
    discount?: number;
    category?: string;
    showStockNote?: boolean;
}
