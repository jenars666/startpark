export interface Product {
    id: number | string;
    name: string;
    price: string | number;
    oldPrice?: string | number;
    img: string;
    tag?: string;
}
