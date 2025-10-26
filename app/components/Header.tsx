"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutButton from "./Logout";

interface HeaderProps {
  fullName: string;
  getGreeting: () => string;
}

export default function Header({ fullName, getGreeting }: HeaderProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center text-center mb-16"
    >
      {/* Animated Icon Button */}
      <motion.button
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.1, rotate: 6 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg transition-transform focus:outline-none"
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.button>

      {/* Animated Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3"
      >
        {getGreeting()},{" "}
        <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
          {fullName || "User"}
        </span>
        !
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg md:text-xl text-gray-600 max-w-2xl"
      >
        Welcome to{" "}
        <span className="font-semibold text-orange-600">Quiet Hours</span>,
        we’ll remind you{" "}
        <span className="font-medium text-orange-600">10 minutes before</span>{" "}
        each session.
      </motion.p>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6"
      >
        <LogoutButton />
      </motion.div>
    </motion.div>
  );
}
