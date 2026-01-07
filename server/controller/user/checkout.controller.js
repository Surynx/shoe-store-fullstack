import { findBestOffer } from "../../computation/offer.computation.js";
import STATUS from "../../constants/status.constant.js";
import Address from "../../models/address.model.js";
import Cart from "../../models/cart.model.js";
import Coupon from "../../models/coupon.model.js";
import Offer from "../../models/offer.model.js";
import User from "../../models/user.model.js";
import { cleanCartDoc } from "../../utils/cart.util.js";


const getCheckoutData = async (req, res) => {

    try {

        const email = req.email;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(STATUS.ERROR.NOT_FOUND).json({ success: false, message: "User not found" });
        }

        const addressDocs = await Address.find({ user_id: user._id }).sort({ isDefault:-1,createdAt:-1 });

        const cartDoc = await Cart.findOne({ user_id: user._id }).populate("items.product_id").populate("items.variant_id");

        const cartItems = cleanCartDoc(cartDoc);

        const cartItemsWithOffers = await Promise.all(cartItems.map(async (item) => {

            const offers = await Offer.find({ $or: [{ category_id: item.category_id }, { product_id: item.product_id }], start_date: { $lte: new Date() }, end_date: { $gte: new Date() } })
            const bestOffer = findBestOffer(offers, item.sales_price);

            return { ...item, bestOffer: bestOffer }
        }));

        const itemTotal = cartItemsWithOffers.reduce((acc, curr) => {

            (curr.bestOffer) ? acc += (curr.sales_price * curr.quantity) - curr.bestOffer.discount_price : acc += curr.sales_price * curr.quantity;

            return acc;
        }, 0);

        const tax = (itemTotal * 0.18);

        const total_amount = itemTotal + tax;

        const coupon = await Coupon.find({
            min_purchase: { $lte: total_amount },
            applied_by:{ $ne:user._id },
            start_date: { $lte: new Date() },
            end_date: { $gte: new Date() },
            status: true,
            $expr: { $lt: ["$usageCount", "$usageLimit"] },
            $or: [
                { createdFor: user._id },
                { createdFor: null }
            ]
        });

        res.status(STATUS.SUCCESS.OK).send({ cartItemsWithOffers, addressDocs, coupon });

    } catch (error) {

        console.log("Error in getcheckoutData", error);
    }
}

export { getCheckoutData }