import db from "../db";

const orderModel = {
    orderProduct: async(
        product_id: string, 
        userId: number, 
        quantity: string, 
        totalPrice: string, 
        payment_method: string, 
        size: string,
        Vat: string) => {
            
        try {
            
            const [result]: any = await db.query(`
                INSERT INTO orders(product_id, user_Id, payment_Method) VALUES (?, ?, ?)`,
                [product_id, userId, payment_method]
            );

            const order_id = result.insertId;

            const [order_items] = await db.query(`
                INSERT INTO order_items(order_id, product_id, quantity, total_price, size, Vat) VALUES (?, ?, ?, ?, ?, ?)
            `,[order_id, product_id, quantity, totalPrice, size, Vat]);

            return {
                result, 
                order_items
            }

        } catch (error) {
            console.error("Error creating product order:", error);
            throw error;
        }
    },

    deleteOrder: async (order_id: number) => {
        try {
            const [result] = await db.query(`
                DELETE FROM orders WHERE order_id = ?     
            `, [order_id]);

            return result;

        } catch (error) {
            console.log(error);
        }
    }
}

export default orderModel;