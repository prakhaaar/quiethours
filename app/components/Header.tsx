"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import LogoutButton from "./Logout";
interface HeaderProps {
  fullName: string;
  getGreeting: () => string;
}

export default function Header({ fullName, getGreeting }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
        <Sparkles className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
        {getGreeting()},{" "}
        <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          {fullName || "User"}
        </span>
        !
      </h1>

      <p className="text-lg md:text-xl text-gray-600">
        Welcome to{" "}
        <span className="font-semibold text-orange-600">Quiet Hours</span>,
        we&apos;ll remind you{" "}
        <span className="font-medium text-orange-600">10 minutes before</span>{" "}
        each session.
      </p>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </motion.div>
  );
}
