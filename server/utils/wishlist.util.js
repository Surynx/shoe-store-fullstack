export const cleanWishlistDoc= (wishlistDoc)=> {

    const wishlistItem= wishlistDoc?.items?.map((obj) => {

      const product = obj.product_id;
      const variant = obj.variant_id;

      return {
        id: obj._id,
        name: product.name,
        gender: product.gender,
        sales_price: variant.sales_price,
        original_price: variant.original_price,
        product_image: product?.productImages[0],
        type: product.type,
        size: variant.size,
        product_id: product._id,
        status: product.status,
        category_id: product.category_id,
        variant_id:variant._id,
        stock: variant.stock,
        status: product.status
      };
    }) || [];

    return wishlistItem;
}