
const findBestOffer= (offers,price)=> {

    let amount;
    let bestAmount= -Infinity;
    let bestoffer = null;

    offers.forEach(offer => {
        
       if( offer.type == "percentage" ) {

        amount= (price*offer.value)/100 ;

       } else if( offer.type == "flat" ) {

        amount= offer.value;
       }

       if( amount >= bestAmount ) {

        bestAmount= amount;
        offer.discount_price= amount;
        bestoffer= offer;
       }

    });

    return bestoffer;
}

export { findBestOffer }