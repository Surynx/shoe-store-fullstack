import React, { useEffect, useState } from "react";
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Filter,
  ShoppingBag,
  TrendingUp,
  Tag,
  Percent,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  downloadExcelReport,
  downloadPdfReport,
  getCustomSalesOverview,
  getDashboardInfo,
  getSalesOverview,
} from "../../Services/admin.api";


const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-info"],
    queryFn: getDashboardInfo,
  });

  const [dateFilter, setDateFilter] = useState("thisMonth");

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const handleSalesOverview = async () => {
      if (dateFilter != "custom") {
        const res = await getSalesOverview(dateFilter);

        if (res) {
          setSalesData(res.data.salesData);
        }
      }
    };

    handleSalesOverview();
  }, [dateFilter]);

  const admin = data?.data?.adminEmail;

  const [customStartDate, setCustomStartDate] = useState("");

  const [customEndDate, setCustomEndDate] = useState("");

  const [showCustomDate, setShowCustomDate] = useState(false);

  const stats = data?.data?.stats;

  const handleFilterChange = (value) => {
    setDateFilter(value);

    if (value === "custom") {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
    }
  };

  const handleCoustomeDateFilter = async () => {
    const res = await getCustomSalesOverview(customStartDate, customEndDate);

    if (res) {
      setSalesData(res.data.salesData);
    }
  };

  const handleExcelDownload = async () => {

    let res;

    if(dateFilter == "custom") {

      res = await downloadExcelReport(dateFilter,customStartDate,customEndDate);

    }else {
      res = await downloadExcelReport(dateFilter);
    }

    if (res) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sales-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handlePdfDownload = async () => {

    let res;

    if(dateFilter == "custom") {

      res = await downloadPdfReport(dateFilter,customStartDate,customEndDate);

    }else {
      res = await downloadPdfReport(dateFilter);
    }

    if (res) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sales-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const getFilteredData = () => {
    return salesData;
  };

  return (
    <div className="w-full mt-2">
      <div
        className="relative overflow-hidden rounded-xl p-6 mb-5 text-white
                bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
                shadow-sm shadow-black/40"
      >
        <h2 className="text-lg font-semibold mb-1">Welcome back, {admin} !</h2>
        <p className="text-gray-300 text-xs">
          Here's your business overview for today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Sales Count</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.salesCount}
              </p>
              <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Active
              </span>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Sales Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{stats?.totalSalesAmount?.toFixed(2)}
              </p>
              <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Revenue
              </span>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">₹</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Product Discount</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{stats?.productDiscountAmount?.toFixed(2)}
              </p>
              <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Tag className="w-3 h-3" /> Offers
              </span>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Coupon Discount</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{stats?.couponDiscount?.toFixed(2)}
              </p>
              <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Percent className="w-3 h-3" /> Coupons
              </span>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Percent className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-5 mb-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-5 gap-3">
          <h3 className="text-lg font-bold text-gray-800">Sales Overview</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-600 rounded-sm focus:outline-none bg-white cursor-pointer font-semibold"
              >
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
          </div>
        </div>

        {showCustomDate && (
          <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              className="px-4 py-1.5 text-sm bg-gray-600 hover:bg-gray-700  text-white rounded-lg transition-colors cursor-pointer"
              onClick={handleCoustomeDateFilter}
            >
              Apply
            </button>
          </div>
        )}

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getFilteredData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#111827"
                strokeWidth={2}
                dot={{ fill: "#111827", r: 3 }}
                activeDot={{ r: 5 }}
                name="Net Sales (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleExcelDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm text-black border rounded-sm hover:bg-gray-100 cursor-pointer transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={handlePdfDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 border border-red-700 cursor-pointer rounded-sm hover:bg-red-100 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Sales Report Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-gray-600 mb-1">Overall Sales Count</p>
            <p className="text-xl font-bold text-purple-600">
              {stats?.salesCount}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs text-gray-600 mb-1">Overall Order Amount</p>
            <p className="text-xl font-bold text-green-600">
              ₹{stats?.totalSalesAmount?.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-xs text-gray-600 mb-1">Product Discount</p>
            <p className="text-xl font-bold text-orange-600">
              ₹{stats?.productDiscountAmount?.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-xs text-gray-600 mb-1">Coupon Discount</p>
            <p className="text-xl font-bold text-red-600">
              ₹{stats?.couponDiscount?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
