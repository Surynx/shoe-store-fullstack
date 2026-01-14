import Product from "../models/product.model.js";

const findReturnRequest = async ( deliveredOrders ) => {

    let return_request = [];
    
    for(let order of deliveredOrders) {

        const items = order.items;

        for(let item of items) {

            if(item.return_status == "Requested" || item.return_status == "Approved") {

                const product = await Product.findById(item.product_id);

                return_request.push ({
                    id:order._id,
                    orderId:order.orderId,
                    customer:order.user_id.name,
                    product:product.name,
                    reason:item.return_reason,
                    date:item.return_date
                });
            }
        }

    }

    return return_request;
}

export { findReturnRequest }