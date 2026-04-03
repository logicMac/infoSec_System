import db from "../db.ts";
import { updateProductParams } from "../types/types.ts";

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
    getAllProduct: async() => {
        const [row] = await db.query(`
            SELECT *
            FROM products p 
            INNER JOIN product_categories pc ON p.category_id = pc.category_id
            WHERE p.status = "Active"
        `);

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
        product_name, 
        product_description, 
        price, 
        stock, 
        image, 
        SKU, 
        weight, 
        size, 
        variants, 
        category_name, 
        brand, 
        userId
    }: productParams ) => {

        // Get category_id from category_name
        const [category]: any = await db.query(`
            INSERT INTO product_categories (category_name) VALUES (?)
        `, [category_name]);
        
        const categoryId = category.insertId;
        
        const [row]: any = await db.query(`
            INSERT INTO products (product_name, product_description, 
            price, stock, image, SKU, weight, size, variants, brand, category_id, user_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
                product_name, 
                product_description,
                price, 
                stock, 
                image, 
                SKU, 
                weight, 
                size, 
                variants, 
                brand,
                categoryId, 
                userId, 
                "Active"
        ]); 

        return {
            product_id: row.insertId,
            category_id: categoryId
        };
    },
    
    udpdateProduct: async({
        product_name,
        product_description,
        price,
        stock,
        image,
        SKU,
        weight,
        size,
        variants,
        brand,
    }: updateProductParams) => {
        const [row] = await db.query(`
            UPDATE TABLE products
            SET product_name = ?, product_description = ?
            price = ?, stock = ?, weight = ?, size = ?,
            variants = ?, brand = ?, status = ?
        `);

        return row;
    },

    getAllProductQuantity: async () => {
        const [row]: any = await db.query(`
            SELECT COUNT(*) AS total FROM products
        `);

        return row[0].total;
    }
}

export default productModel;