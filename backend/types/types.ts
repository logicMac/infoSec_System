import { RowDataPacket } from "mysql2";

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

export interface UserOrders extends RowDataPacket {
    [key: string]: any;
}

export interface DeleteResponse {
    ok: boolean;
    msg: string;
}

export interface FetchUserOrder extends RowDataPacket {
    [key: string]: any;
}