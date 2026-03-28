import db from "../db.ts";

interface productParams {
    product_name: string,
    product_description: string,
    price: number, 
    stock: number,
    image: string, 
    SKU: string,
    weight: number,
    size: string,
    variants: string,
    category_name: string,
    brand: string,
    userId: number
}

const productModel = {
    //fetch all product
    getAllProduct: async () => {
        const [row] = `SELECT * FROM products WHERE product_id`;
        return row;
    },

    //fetch product by name
    getProductByName: async (product_name: string) => {
        const [row] = await db.query(
            `SELECT * FROM products WHERE product_name = ? 
        `, [product_name]);

        return row;
    },

    //delete product by name
    deleteProductById: async (id: number) => {
        const [row] = await db.query(`
            DELETE FROM products WHERE product_id = ?    
        `, [id]);

        return row;
    },

    //save product to database
    saveProduct: async ({
        product_name, product_description, price, stock, 
        image, SKU, weight, size, variants, category_name, 
        brand, userId
        }: productParams ) => {

        const [category]: any = await db.query(`
            SELECT * FROM product_categories WHERE category_name = ?
        `, [category_name]);
        
        if (category.length === 0) {
            throw new Error("Invalid category");
        }
        
        const categoryId = category[0].category_id;
        
        const [row]: any = await db.query(`
            INSERT INTO products (product_name, product_description, 
            price, stock, image, SKU, weight, size, variants, brand, category_id, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
                product_name, 
                product_description,
                price, stock, image, 
                SKU, weight, size, 
                variants, brand,
                categoryId, userId
        ]); 

        return {
            product_id: row.insertId,
            category_id: categoryId
        }
    },
    
    udpdateProduct: async() => {
        const [row] = await db.query(`
            UPDATE TABLE products
            SET product_name = ?, product_description = ?
            price = ?, stock = ?, image = ?, size = ? SKU = ?
            WHERE product_id = ?
        `);

        return row;
    }
}

export default productModel;