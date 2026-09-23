import React from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const mockRevenueData = [
  { month: "Jan", revenue: 120000, inquiries: 24 },
  { month: "Feb", revenue: 145000, inquiries: 30 },
  { month: "Mar", revenue: 130000, inquiries: 28 },
  { month: "Apr", revenue: 170000, inquiries: 42 },
  { month: "May", revenue: 195000, inquiries: 50 },
  { month: "Jun", revenue: 220000, inquiries: 65 },
];

const RevenueChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Monthly Rent Collection (KES)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickFormatter={(val) => `KES ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`KES ${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RevenueChart;