const findRefundAmount= (orderDoc,item,coupon) => {

    let itemPrice = item.sales_price * item.quantity;

    if(coupon) {

        const orderItemTotal = orderDoc.items.reduce((acc, curr) => {
            
            acc += curr.sales_price * curr.quantity;
            return acc;

        }, 0);

        let coupon_discount = orderDoc.coupon_share;

        coupon_discount = Math.min(coupon_discount, orderItemTotal);

        const itemCouponShare = (itemPrice / orderItemTotal) * coupon_discount;

        itemPrice = itemPrice - itemCouponShare;
    }

    let itemTax = Math.round(itemPrice * 0.18);

    itemPrice = itemPrice + itemTax;

    return itemPrice;
    
}

export {findRefundAmount}