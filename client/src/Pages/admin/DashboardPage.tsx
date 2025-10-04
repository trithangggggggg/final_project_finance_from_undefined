import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileDown } from "lucide-react";
// 👉 bạn tự import ảnh ở đây
import DevonLane from "../../images/DevonLane.png";
import DianneRussell from "../../images/DianneRussell.png";
import JaneCooper from "../../images/JaneCooper.png";
import JennyWilson from "../../images/JennyWilson.png";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("12 Months");

  const chartData = [
    { month: "Feb", value1: 55000, value2: 30000 },
    { month: "Mar", value1: 38000, value2: 33000 },
    { month: "Apr", value1: 42000, value2: 36000 },
    { month: "May", value1: 60000, value2: 35000 },
    { month: "Jun", value1: 45691, value2: 39000 },
    { month: "Jul", value1: 12000, value2: 37000 },
    { month: "Aug", value1: 46000, value2: 40000 },
    { month: "Sep", value1: 48000, value2: 42000 },
    { month: "Oct", value1: 80000, value2: 45000 },
    { month: "Nov", value1: 50000, value2: 44000 },
    { month: "Dec", value1: 54000, value2: 47000 },
    { month: "Jan", value1: 96000, value2: 49000 },
  ];

  const customers = [
    {
      name: "Jenny Wilson",
      email: "jenny-wilson@gmail.com",
      amount: "$11,234",
      location: "Austin",
      avatar: JennyWilson,
    },
    {
      name: "Devon Lane",
      email: "devon-lane@gmail.com",
      amount: "$11,159",
      location: "New York",
      avatar: DevonLane,
    },
    {
      name: "Jane Cooper",
      email: "jane-cooper@gmail.com",
      amount: "$10,483",
      location: "Toledo",
      avatar: JaneCooper,
    },
    {
      name: "Dianne Russell",
      email: "dianne-russell@gmail.com",
      amount: "$9,084",
      location: "Naperville",
      avatar: DianneRussell,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 shadow-lg rounded border border-gray-200">
          <p className="text-xs font-semibold text-gray-700">June 2025</p>
          <p className="text-sm font-bold text-gray-900">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* User Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-xs text-gray-500 uppercase mb-2">User</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-gray-900">1,500</div>
            <div className="text-sm text-green-600 font-medium">+ 36% ↑</div>
          </div>
        </div>

        {/* Category Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-xs text-gray-500 uppercase mb-2">Category</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-gray-900">500</div>
            <div className="text-sm text-red-600 font-medium">+ 14% ↓</div>
          </div>
        </div>

        {/* Spending Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-xs text-gray-500 uppercase mb-2">Spending</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-gray-900">84,382</div>
            <div className="text-sm text-green-600 font-medium">+ 36% ↑</div>
          </div>
        </div>

        {/* Total Money Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-xs text-gray-500 uppercase mb-2">Total Money</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-gray-900">33,493,022 $</div>
            <div className="text-sm text-green-600 font-medium">+ 36% ↑</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">report money</h2>
            <div className="flex items-center gap-2">
              {["12 Months", "6 Months", "30 Days", "7 Days"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 text-sm rounded ${
                    selectedPeriod === period
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {period}
                </button>
              ))}
              <button className="ml-4 flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                <FileDown size={16} />
                Export PDF
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value1"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#6366F1" }}
                />
                <Line
                  type="monotone"
                  dataKey="value2"
                  stroke="#A5B4FC"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Customers Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Recent Customers
            </h2>
            <p className="text-sm text-gray-500">Lorem ipsum dolor sit amekta</p>
          </div>

          <div className="space-y-4">
            {customers.map((customer, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {customer.avatar ? (
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">
                    {customer.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {customer.email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-sm">
                    {customer.amount}
                  </div>
                  <div className="text-xs text-gray-500">
                    {customer.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2">
            SEE ALL CUSTOMERS
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
