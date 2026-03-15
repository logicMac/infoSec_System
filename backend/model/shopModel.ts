import { ResultSetHeader } from "mysql2";
import db from "../db"

const shopModel = {
    getShopName: async(shop_name: string) => {
        const [result] = await db.query(`
            SELECT * FROM shops WHERE shop_name = ? 
            `,[shop_name]
        );

        return result;
    },

    saveShop: async(
        id: number, 
        shop_name: string, 
        shop_description: string, 
        shop_logo: string, 
        status: string
    ) => {
            
        const [result] = await db.query<ResultSetHeader>(`
           INSERT INTO shop(user_id, shop_name, shop_description, shop_logo, status) 
            VALUES (?, ?, ?, ?, ?)
            `,[id, shop_name, shop_description, shop_logo, status] 
        );

        return result;
    },

    saveSellerDocs: async(shop_id: number , document_type: string, document_file: string) => {
        const [result] = await db.query(`
            INSERT INTO seller_documents( shop_id, document_type, document_file) VALUES (?, ?, ?)      
            `,[ shop_id, document_type, document_file]
        )

        return result;
    },

    getAllSellerShops: async() => {
        const [result] = await db.query(`
            SELECT shops.shop_name, 
        `)
    }
}

export default shopModel;