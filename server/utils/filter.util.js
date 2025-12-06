export const filter_active_products= (items)=> {

    const active_products= items.filter((item)=> item.status);

    return active_products;
}