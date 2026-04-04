export interface addProductParams {
    product_name: string,
    product_description: string,
    price: number,
    stock: number,
    SKU: string,
    weight: number,
    size: string,
    variants: string,
    category_name: string,
    brand: string,
    image: null
}

export interface userDataParams {
    token: string
}

export interface updateProductParams {
    product_name: string,
    product_description: string,
    price: number,
    stock: number,
    SKU: string,
    weight: number,
    size: string,
    variants: string,
    category_name: string,
    brand: string,
    image: null
} 