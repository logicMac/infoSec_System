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
            console.log("[OrderModel] Creating order with:", {
                product_id,
                userId,
                quantity,
                totalPrice,
                payment_method,
                size,
                Vat
            });
            
            // Insert into orders table - using customer_id to match analytics query
            const [result]: any = await db.query(`
                INSERT INTO orders(product_id, user_id, payment_method) VALUES (?, ?, ?)`,
                [product_id, userId, payment_method]
            );

            const order_id = result.insertId;
            
            console.log("[OrderModel] Order created with ID:", order_id);

            // Insert into order_items table
            const [order_items] = await db.query(`
                INSERT INTO order_items(order_id, product_id, quantity, total_price, size, Vat) VALUES (?, ?, ?, ?, ?, ?)
            `,[order_id, product_id, quantity, totalPrice, size, Vat]);
            
            console.log("[OrderModel] Order items created successfully");

            return {
                result, 
                order_items
            }

        } catch (error) {
            console.error("[OrderModel] Error creating product order:", error);
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