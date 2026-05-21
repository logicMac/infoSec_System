import db from "../db";

const analyticsModel = {
    getUserStats: async (customerId: number) => {
            const [result] = await db.query(
                `SELECT * 
                 FROM orders o 
                 INNER JOIN order_items oi ON o.product_id = oi.product_id
                 WHERE o.customer_id = ?
                `,[customerId]
            );
            return result;
    }
}

export default analyticsModel;

