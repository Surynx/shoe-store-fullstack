export const cleanCartDoc= (cartDoc)=> {

    const cartItems= cartDoc?.items?.map((obj) => {
      const product = obj.product_id;
      const variant = obj.variant_id;

      return {
        id: obj._id,
        name: product.name,
        gender: product.gender,
        sales_price: obj.sales_price,
        original_price: obj.original_price,
        product_image: product?.productImages[0],
        quantity: obj.quantity,
        type: product.type,
        size: variant.size,
        product_id: product._id,
        stock: variant.stock,
        status: product.status,
      };
    }) || [];

    return cartItems;
}