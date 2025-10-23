"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden text-gray-800">
      {/* Floating gradient blobs for depth */}
      <motion.div
        className="absolute top-0 left-1/3 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-40 -z-10"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-red-200 rounded-full blur-3xl opacity-40 -z-10"
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo and rings */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Outer glowing ring */}
        <motion.div
          className="absolute w-28 h-28 rounded-full border-4 border-orange-400/60 border-t-transparent animate-spin"
          style={{ borderTopColor: "transparent" }}
        />
        {/* Inner slow ring */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-4 border-red-400/60 border-b-transparent animate-spin-slow"
          style={{ borderBottomColor: "transparent" }}
        />
        {/* Sparkles logo */}
        <Sparkles className="w-10 h-10 text-orange-500 drop-shadow-md animate-pulse" />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="mt-10 text-xl font-medium text-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold">
          Quiet Hours
        </span>{" "}
        is getting ready ☀️
      </motion.p>
    </main>
  );
}
