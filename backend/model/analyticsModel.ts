import db from "../db";
import { RowDataPacket } from "mysql2";

export interface UserStat extends RowDataPacket {
    [key: string]: any;
}

export async function getUserStats(customerId: number): Promise<UserStat[]> {
    try {
        const query = `
            SELECT 
                o.order_id,
                o.user_id,
                o.created_at,
                o.order_status,
                oi.product_id,
                oi.quantity,
                oi.total_price,
                oi.size,
                oi.Vat
            FROM orders o 
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.user_id = ?
        `;

        const [rows] = await db.query<UserStat[]>(query, [customerId]);
        return rows;
    } catch (error) {
        console.error("getUserStats error:", error);
        throw error;
    }
}


