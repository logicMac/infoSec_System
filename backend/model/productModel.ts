import db from "../db.ts";

interface productParams {
    product_name: string,
    product_description: string,
    price: number, 
    stock: number,
    image: string, 
    size: string, 
    SKU: string
}

const productModel = {
    getAllProduct: async () => {
        const [row] = `SELECT * FROM products WHERE product_id`;
        return row;
    },

    getProductByName: async (product_name: string) => {
        const [row] = await db.query(
            `SELECT * FROM products WHERE product_name = ? 
        `, [product_name]);

        return row;
    },

    deleteProductById: async (id: number) => {
        const [row] = await db.query(`
            DELETE FROM products WHERE product_id = ?    
        `, [id]);

        return row;
    },

    saveProduct: async ({
        product_name, product_description, price, stock, 
        image, size, SKU}: productParams ) => {

        const [row] = await db.query(`
            INSERT INTO products (product_name, product_description, 
            price, stock, image, size, SKU)
        `, [
            product_name, 
            product_description,
            price, stock, image, 
            size, SKU
        ]);

        return row;
    }
}

export default productModel;