const findBestOffer= (offers,price)=> {

    let amount;
    let bestAmount= -Infinity;
    let bestoffer = null;

    offers.forEach(offer => {
        
       if( offer.type == "percentage" ) {

        amount= (price*offer.value)/100 ;

       } else if( offer.type == "flat" ) {

        if( price <= offer.value) return;

        amount= offer.value;
       }

       if( amount >= bestAmount ) {

        bestAmount= amount;
        
        bestoffer= {...offer.toObject(),discount_price: amount};
       }
    });
    
    return bestoffer;
}

export { findBestOffer }