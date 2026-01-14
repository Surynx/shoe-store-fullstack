import Brand from "../models/brand.model.js";
import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";

const getTotal_revenue = async ( totalSuccessfullOrders ) => {
    
    let total_revenue = 0;
    
        for(let order of totalSuccessfullOrders) {
    
            let items = order.items.filter((item)=> (item.status != "canceled" && item.return_status != "Completed"));
    
            total_revenue += items.reduce((acc,curr)=> acc+=curr.sales_price * curr.quantity ,0);
    
            if(order?.coupon_id) {
    
                let orderItemTotal = order.items.reduce((acc, curr) => {  
    
                    acc += curr.sales_price * curr.quantity;
                    return acc;
                }, 0);
    
                let coupon = await Coupon.findById(order.coupon_id);
    
                let coupon_discount = coupon.type == "percentage" ? (orderItemTotal * coupon.value) / 100 : coupon.value;
    
                coupon_discount = Math.min(coupon_discount, orderItemTotal);
    
                total_revenue -= coupon_discount;
    
            }
        }

    return total_revenue;
}

const getTopProducts = async ( totalSuccessfullOrders ) => {

    let total_items = [];
    
    for(let order of totalSuccessfullOrders) {

       let items = order.items;
       
       items.forEach(item => {

            if(item.status != "canceled" && item.return_status != "Completed") {
                
                total_items.push(item);
            }

        });
    }

    const top_products_obj = total_items.reduce((acc,curr)=>{

        const product_id = curr.product_id;

        if( acc[product_id] ) {

            acc[product_id] += curr.quantity;

        }else {

            acc[product_id] = curr.quantity;
        }
        
        return acc;

    },{});

    const top_products_elem = Object.entries(top_products_obj)
    .map(([productId, qty]) => ({ productId, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

    let top_products = [];

    for(let elem of top_products_elem) {

        let product = await Product.findById(elem.productId);
        top_products.push(product);
    }

    return top_products;
    
}

const getTopBrand = async ( totalSuccessfullOrders ) => {

    let total_items = [];

    for (let order of totalSuccessfullOrders) {

        for (let item of order.items) {

            if (
                item.status !== "canceled" &&
                item.return_status !== "Completed"
            ) {
                total_items.push(item);
            }
        }
    }

    const productIds = total_items.map(item => item.product_id);

    const products = await Product.find(
        { _id: { $in: productIds } },
        { brand_id: 1 }
    );

    const productBrandMap = {};
    
    products.forEach(p => {
        productBrandMap[p._id.toString()] = p.brand_id?.toString();
    });

    const top_brands_obj = total_items.reduce((acc, curr) => {

        const productId = curr.product_id.toString();
        const brandId = productBrandMap[productId];

        if (!brandId) return acc;

        if (acc[brandId]) {
            acc[brandId] += curr.quantity;
        } else {
            acc[brandId] = curr.quantity;
        }

        return acc;

    }, {});

    const top_brands_elem = Object.entries(top_brands_obj)
        .map(([brandId, qty]) => ({ brandId, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

    let top_brands = [];

    for (let elem of top_brands_elem) {
        let brand = await Brand.findById(elem.brandId);
        if (brand) {
            top_brands.push(brand);
        }
    }

    return top_brands;
    
}

export { getTotal_revenue,getTopProducts,getTopBrand }