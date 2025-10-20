"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../lib/supabaseClient";
import toast from "react-hot-toast";

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

    if (isSignup) {
      if (!fullName.trim()) {
        setErrorMsg("Full name is required");
        setLoading(false);
        return;
      }

      // SIGNUP
      const { data: signUpData, error: signUpError } =
        await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

      setLoading(false);
      if (signUpError) {
        setErrorMsg(signUpError.message);
        toast.error(signUpError.message);
        return;
      }

      toast.success("Signup successful! Please check your email to confirm.");
    } else {
      // LOGIN
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
        toast.error(error.message);
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-orange-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-5 text-gray-800">
            {isSignup ? "Sign Up" : "Sign In"}
          </h2>

          {errorMsg && (
            <p className="text-red-500 mb-4 font-medium">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-1 focus:ring-orange-400 outline-none text-gray-700 placeholder-gray-400"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-1 focus:ring-orange-400 outline-none text-gray-700 placeholder-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mb-6 rounded-lg border border-gray-300 focus:ring-1 focus:ring-orange-400 outline-none text-gray-700 placeholder-gray-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mb-4 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
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
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-orange-500" />
                <span>Remember Me</span>
              </label>
              <button className="hover:text-orange-500 font-medium transition">
                Forgot Password?
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:flex w-1/2 bg-orange-500 text-white flex-col items-center justify-center p-8 text-center transition-all">
          {isSignup ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
              <p className="mb-4">Already have an account?</p>
              <button
                onClick={() => setIsSignup(false)}
                className="px-6 py-3 rounded-lg border border-white hover:bg-white hover:text-orange-500 transition font-semibold"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
              <p className="mb-4">Don’t have an account?</p>
              <button
                onClick={() => setIsSignup(true)}
                className="px-6 py-3 rounded-lg border border-white hover:bg-white hover:text-orange-500 transition font-semibold"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
