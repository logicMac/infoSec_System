//add product parameters
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

//update data parameters 
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

//order data parameters
export interface orderDataParams {
    token: string, 
    product_id: number, 
    quantity: number, 
    orderDetails: any
}