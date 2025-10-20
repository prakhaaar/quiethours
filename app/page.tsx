"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth"); // matches app/auth/page.tsx
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-orange-50 via-orange-100 to-white px-4 overflow-hidden">
      {/* Radial Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-200 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-3xl mx-auto text-center pt-32">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-700 font-sans"
        >
          Stay{" "}
          <span className="italic font-serif text-orange-500">Focused</span>.
          <br />
          Schedule Your Quiet Hours.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-12 font-sans"
        >
          Block distractions, stay productive, and take control of your focus
          with a simple quiet hours scheduler.
        </motion.p>

        {/* Login Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center"
        >
          <button
            onClick={handleLogin}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition font-sans"
          >
            Login to Schedule Your Blocks
          </button>
        </motion.div>
      </div>
    </main>
  );
}
