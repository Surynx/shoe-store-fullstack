import { findCouponDiscount, findProductDiscount } from "../../computation/dashboard.computation.js";
import STATUS from "../../constants/status.constant.js";
import Admin from "../../models/admin.model.js";
import Order from "../../models/order.model.js";
import { findDateRange } from "../../utils/range.util.js";
import { getSalesData } from "../../utils/sales.util.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit-table";

const getDashboardInfo = async (req, res) => {

    try {
        const admin = await Admin.findOne({});

        const orders = await Order.find({ status: "delivered", payment_status: "paid" });

        const ordersWithCoupon = await Order.find({ status: "delivered", payment_status: "paid", coupon_id: { $ne: null } });

        const salesCount = await Order.countDocuments({ status: "delivered", payment_status: "paid" });

        const totalSales = await Order.aggregate([
            {
                $match: {
                    status: "delivered",
                    payment_status: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    sum: { $sum: "$total_amount" }
                }
            }
        ]);

        const totalSalesAmount = totalSales[0].sum;

        const productDiscountAmount = findProductDiscount(orders);

        const couponDiscount = findCouponDiscount(ordersWithCoupon);

        const stats = { salesCount, totalSalesAmount, productDiscountAmount, couponDiscount }

        return res.status(STATUS.SUCCESS.OK).json({ adminEmail: admin.email, stats });

    } catch (error) {

        console.log("Error in getDashboardInfo", error)
    }

}

const getSalesOverview = async (req, res) => {

    try {
        const { range } = req.query;

        const { start, end } = findDateRange(range);

        const orders = await Order.find({ status: "delivered", payment_status: "paid", createdAt: { $gte: start, $lte: end } }).select("total_amount createdAt");

        const salesData = getSalesData(orders);

        return res.status(STATUS.SUCCESS.OK).json({ salesData });

    } catch (error) {

        console.log("Error in getsalesOverview", error);
    }

}

const getSalesOverviewCustom = async (req, res) => {

    try {
        let { start, end } = req.query;

        start = new Date(start);
        start.setHours(0, 0, 0, 0);

        end = new Date(end);
        end.setHours(23, 59, 59, 999);

        const orders = await Order.find({ status: "delivered", payment_status: "paid", createdAt: { $gte: start, $lte: end } }).select("total_amount createdAt");

        const salesData = getSalesData(orders);

        return res.status(STATUS.SUCCESS.OK).json({ salesData });

    } catch (error) {

        console.log("Error in getSalesOverviewCustome", error);
    }

}

const getExcelSalesReport = async (req, res) => {

    try {
        const { range } = req.query;

        let start,end;

        if(range == "custom") {

            ({ start, end } = req.query);

            start = new Date(start);
            start.setHours(0, 0, 0, 0);

            end = new Date(end);
            end.setHours(23, 59, 59, 999);

        }else {

            ({ start, end } = findDateRange(range));
        }

        const orders = await Order.find({ status: "delivered", payment_status: "paid", createdAt: { $gte: start, $lte: end } }).select(
            "orderId createdAt payment_method total_amount tax discount delivery_charge payment_status").sort({ createdAt: 1 });


        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report");

        worksheet.columns = [
            { header: "Order ID", key: "orderId", width: 25 },
            { header: "Order Date", key: "date", width: 20 },
            { header: "Payment Method", key: "payment_method", width: 18 },
            { header: "Tax (₹)", key: "tax", width: 12 },
            { header: "Discount (₹)", key: "discount", width: 14 },
            { header: "Delivery (₹)", key: "delivery_charge", width: 14 },
            { header: "Total Amount (₹)", key: "total_amount", width: 18 },
            { header: "Payment Status", key: "payment_status", width: 18 }
        ];


        worksheet.getRow(1).font = { bold: true };

        orders.forEach(order => {
            worksheet.addRow({
                orderId: order.orderId,
                date: order.createdAt.toISOString().split("T")[0],
                payment_method: order.payment_method,
                tax: order.tax,
                discount: order.discount,
                delivery_charge: order.delivery_charge,
                total_amount: order.total_amount,
                payment_status: order.payment_status
            });
        });


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=sales-report.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {

        console.log("Error in getExcelSalesReport", error);
    }
}

const getPdfSalesReport = async (req, res) => {

    try {

        const { range } = req.query;
        let start, end;

        if (range == "custom") {

            ({ start, end } = req.query);

            start = new Date(start);
            start.setHours(0, 0, 0, 0);

            end = new Date(end);
            end.setHours(23, 59, 59, 999);

        } else {
            ({ start, end } = findDateRange(range));
        }

        const orders = await Order.find({ status: "delivered",payment_status: "paid",createdAt: { $gte: start, $lte: end }})
        .select("orderId createdAt payment_method total_amount tax discount delivery_charge payment_status")
        .sort({ createdAt: 1 });

        const doc = new PDFDocument({ margin: 30, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=sales-report.pdf");

        doc.pipe(res);
     
        doc.fontSize(20).text("Sales Report", { align: "center" });
        doc.moveDown();
        doc.fontSize(10).text(`Period: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`, { align: "center" });
        doc.moveDown();

      
        const startX = 30; 
        const rowHeight = 30; 
        
        
        const positions = {
            id: startX,
            date: startX + 60,       
            method: startX + 130,   
            tax: startX + 190,       
            disc: startX + 240,      
            del: startX + 290,       
            total: startX + 340,     
            status: startX + 410,    
            end: startX + 530       
        };


        const widths = {
            id: 60,
            date: 70,
            method: 60,
            tax: 50,
            disc: 50,
            del: 50,
            total: 70,
            status: 120 
        };

        let currentY = 150; 

 
        doc.fillColor("#eeeeee")
           .rect(startX, currentY, positions.end - startX, rowHeight)
           .fill();
        doc.fillColor("black");

     
        printRow(doc, currentY, {
            id: "Order ID", date: "Date", method: "Method",
            tax: "Tax", disc: "Disc", del: "Del", total: "Total", status: "Status"
        }, positions, widths, true);

      
        drawBorders(doc, currentY, positions, rowHeight);
        
        currentY += rowHeight;

        let grandTotal = 0;

        orders.forEach(order => {
            grandTotal += order.total_amount;

         
            if (currentY > 750) {
                doc.addPage();
                currentY = 50;
          
                doc.fillColor("#eeeeee").rect(startX, currentY, positions.end - startX, rowHeight).fill();
                doc.fillColor("black");
                printRow(doc, currentY, {
                    id: "Order ID", date: "Date", method: "Method",
                    tax: "Tax", disc: "Disc", del: "Del", total: "Total", status: "Status"
                }, positions, widths, true);
                drawBorders(doc, currentY, positions, rowHeight);
                currentY += rowHeight;
            }

           
            const rowData = {
                id: order.orderId.substring(0, 8),
                date: order.createdAt.toISOString().split("T")[0],
                method: order.payment_method,
                tax: (order.tax || 0).toString(),
                disc: (order.discount || 0).toString(),
                del: (order.delivery_charge || 0).toString(),
                total: order.total_amount.toString(),
                status: order.payment_status
            };

            printRow(doc, currentY, rowData, positions, widths, false);
            drawBorders(doc, currentY, positions, rowHeight);

            currentY += rowHeight;
        });

      
        doc.moveDown(2);
        doc.font('Helvetica-Bold').fontSize(12)
           .text(`Grand Total: ${grandTotal}`, { align: 'right', width: positions.end - 30 });

        doc.end();

    } catch (error) {
        console.log("Error generating PDF", error);
        res.status(500).send("Error");
    }
};



function printRow(doc, y, data, pos, width, isHeader) {
    const yText = y + 10; 
    const pad = 5; 
    
    doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(9);


    doc.text(data.id, pos.id + pad, yText, { width: width.id - (pad*2) });


    doc.text(data.date, pos.date, yText, { width: width.date, align: "center" });


    doc.text(data.method, pos.method, yText, { width: width.method, align: "center" });

    doc.text(data.tax, pos.tax, yText, { width: width.tax - pad, align: "right" });
    doc.text(data.disc, pos.disc, yText, { width: width.disc - pad, align: "right" });
    doc.text(data.del, pos.del, yText, { width: width.del - pad, align: "right" });
    doc.text(data.total, pos.total, yText, { width: width.total - pad, align: "right" });

    doc.text(data.status, pos.status, yText, { width: width.status, align: "center" });
}

function drawBorders(doc, y, pos, height) {
    doc.lineWidth(0.5).strokeColor("#000000");


    doc.rect(pos.id, y, pos.end - pos.id, height).stroke();

  
   
    [pos.date, pos.method, pos.tax, pos.disc, pos.del, pos.total, pos.status].forEach(x => {
        doc.moveTo(x, y).lineTo(x, y + height).stroke();
    });
}


export { getDashboardInfo, getSalesOverview, getSalesOverviewCustom, getExcelSalesReport, getPdfSalesReport };