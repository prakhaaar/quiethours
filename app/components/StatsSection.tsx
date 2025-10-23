"use client";
import { motion } from "framer-motion";
import { Clock, Calendar, Moon } from "lucide-react";

interface StatsSectionProps {
  blocksLength: number;
  nextSessionTime: string;
}

export default function StatsSection({
  blocksLength,
  nextSessionTime,
}: StatsSectionProps) {
  const stats = [
    { title: "Total Sessions", value: blocksLength, icon: Calendar },
    { title: "Next Session", value: nextSessionTime, icon: Clock },
    { title: "Focus Mode", value: "Ready", icon: Moon },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow">
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
