
const findProductDiscount= (orders)=> {

    let totalProductDiscount = 0;

    orders.forEach(order => {
        
        const itemArray= order.items;

        const productDiscountOfOrder = itemArray.reduce((acc,item)=> {

            acc += (item.original_price - item.sales_price) * item.quantity

            return acc;
        },0);

        totalProductDiscount += productDiscountOfOrder

    });

    return totalProductDiscount;

}

const findCouponDiscount= (orders)=> {

    let totalCouponDiscount = 0;

    orders.forEach((order)=>{
        
        let items = order.items;

        let original_price_total = items.reduce((acc,curr)=>{

            acc+= curr.original_price * curr.quantity;

            return acc;
        },0);

        let amountWithoutCouponDiscount = original_price_total - order.discount + order.tax + order.delivery_charge;

        totalCouponDiscount += amountWithoutCouponDiscount - order.total_amount;
    });
    
    return totalCouponDiscount;
}

export { findProductDiscount,findCouponDiscount }