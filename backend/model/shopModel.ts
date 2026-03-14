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
            
        const [result] = await db.query(`
           INSERT INTO shop(user_id, shop_name, shop_description, shop_logo, status) 
                                    VALUES (?, ?, ?, ?, ?)
            `,[id, shop_name, shop_description, shop_logo, status] 
        );

        return result;
    }
}

export default shopModel;