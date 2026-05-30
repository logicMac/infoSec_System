import db from "../db";
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";
import { UserOrders, DeleteResponse, FetchUserOrder } from "../types/types";

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
            msg: "Order cancellation successfull"
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