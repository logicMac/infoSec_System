import db from "../db";

const orderModel = {
    orderProduct: async(id: string) => {
        try {
            const [result] = await db.query(`
                INSERT INTO orders WHERE = ?`,[id]
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