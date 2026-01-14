
const findSubtotal = ( order )=> {
console.log(order);
    const subtotal = order.items.reduce((acc, curr) => {
        acc += curr.original_price * curr.quantity;
        return acc;
    }, 0);

    return subtotal;
}

export {findSubtotal}