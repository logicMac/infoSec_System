export interface updateProductParams {
    product_name: string,
    product_description: string,
    price: number,
    stock: number,
    image: string,
    SKU: string,
    weight: number,
    size: string,
    variants: string,
    category_name: string,
    brand: string
}

export interface user {
    user?: string;
}