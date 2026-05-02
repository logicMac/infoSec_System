import db from "../db";

const orderModel = {
    orderProduct: async(product_id: string, userId: number, quantity: string, totalPrice: string, payment_method: string, size: string) => {
        try {
            const [result] = await db.query(`
                INSERT INTO orders WHERE = ?`,[product_id, userId, quantity, payment_method, size]
            );

            return result;
        } catch (error) {
            console.log(error);
        }
    },

    deleteOrder: async (order_id: number) => {
        try {
            const [result] = await db.query(`
                DELETE FROM orders WHERE order_id = ?     
            `, [order_id]);
        } catch (error) {
            console.log(error);
        }
    }
}

export default orderModel;