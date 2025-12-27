
const getSalesData = (orders) => {

    const salesData = orders.map((order) => {

        const date = new Date(order?.createdAt)?.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return { date, sales: order.total_amount }
    });

    return salesData;
}

export {getSalesData}