import db from "../db";
import { ResultSetHeader } from "mysql2";
import { UserOrders, DeleteResponse, FetchUserOrder, AddToCart, UpdateOrderStatus } from "../types/types";

export async function getUserOrders(customer_id: number): Promise<UserOrders[]> {
    try {
        const query = `
            SELECT 
                orders AS o
            FROM o
            INNER JOIN products AS p ON o.user_id = p.user_id
            WHERE o.user_id = ?
        `
        const [rows] = await db.query<UserOrders[]>(query, customer_id);
        return rows;
    } catch (err) {
        throw err;
    }
}

export async function addToCart(productId: number, userId: number): Promise<AddToCart> {
    try {
        const query = `                                        
            INSERT INTO carts (user_id) VALUES (?)
        `;

        const [result] = await db.query<ResultSetHeader>(query, [userId]);
        const cartId = result.insertId;

        const query2 = `
            INSERT INTO cart_items (cart_id, product_id) VALUES (?, ?)
        `;

        const [result2] = await db.query<ResultSetHeader>(query2, [cartId, productId])

        return {
            success: true,
            msg: "Product successfully added to your cart"
        };
    } catch (err) {
        throw err;
    }
}

export async function cancelOrder(reason: string, orderId: number, customerId: number, productId: number): Promise<DeleteResponse> {
    try {    
        const query = `
            UPDATE orders 
            SET order_status = 'Cancelled', updated_at = NOW()
            WHERE order_id = ?
        `

        const [result] = await db.query<ResultSetHeader>(query, [orderId]);
        
        if (result.affectedRows === 0) {
            return {
                ok: false,
                msg: "Order not found" 
            }
        }

        return {
            ok: true,
            msg: "Order cancellation successfull",
            result 
        }
    } catch (err) {
        throw err;
    }
}

export async function fetchUserOrder(orderId: number): Promise<FetchUserOrder[]> {
    try {
        const query = `
            SELECT * FROM orders WHERE order_id = ?
        `

        const [rows] = await db.query<FetchUserOrder[]>(query, orderId);
        return rows;    

    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateOrderStatus(order_status: string, orderId: number, customerId: number): Promise<UpdateOrderStatus> {
    try {
        const query = `
            UPDATE order_items 
            SET item_status = ?
            WHERE orderId = ?
        `

        const [result] = await db.query<ResultSetHeader>(query, [order_status, orderId]);

        if (result.affectedRows === 0) {
            return {
                ok: false,
                msg: "Order not found" 
            }
        }

        return {
            ok: true,
            msg: "Order status updated successfully",
            res
        }
    } catch (err) {
        throw err;
    }
}