"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";

export default function Authpage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSignup) {
        if (!fullName.trim()) {
          setErrorMsg("Full name is required");
          setLoading(false);
          return;
        }

        const { error: signUpError } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });

        if (signUpError) throw signUpError;

        toast.success("Signup successful! Check your email to confirm.");
      } else {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      setErrorMsg(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-orange-50">
      {/* Orange Panel */}
      <div className="w-full md:w-1/2 bg-orange-500 text-white flex flex-col items-center justify-center px-6 py-10 md:p-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 flex flex-wrap items-center justify-center gap-2 leading-tight">
            <span>Welcome to</span>
            <b className="text-white">quiethours</b>
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed px-2">
            {isSignup
              ? "Create your account and join us today!"
              : "Sign in to schedule your blocks and boost your focus!"}
          </p>
        </motion.div>
      </div>

      {/* Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10 md:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-gray-800 text-center md:text-left">
            {isSignup ? "Sign Up" : "Sign In"}
          </h2>

          {errorMsg && (
            <p className="text-red-500 mb-4 font-medium text-center md:text-left">
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-gray-700 placeholder-gray-400"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-gray-700 placeholder-gray-400"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-gray-700 placeholder-gray-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              {loading
                ? isSignup
                  ? "Signing up..."
                  : "Logging in..."
                : isSignup
                ? "Sign Up"
                : "Sign In"}
            </button>
          </form>

          {!isSignup && (
            <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-orange-500" />
                <span>Remember Me</span>
              </label>
              <button className="hover:text-orange-500 font-medium transition">
                Forgot Password?
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignup ? (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="text-orange-500 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-orange-500 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
