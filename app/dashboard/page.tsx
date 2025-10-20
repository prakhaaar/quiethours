"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { Clock, Calendar, Moon, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

type QuietBlock = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  timezone: string;
  notified: boolean;
};

export default function Dashboard() {
  const [blocks, setBlocks] = useState<QuietBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string>("");

  const [editingBlock, setEditingBlock] = useState<QuietBlock | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();

        if (!user) {
          console.error("No authenticated user found");
          return;
        }

        setUserId(user.id);

        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        setFullName(profile?.full_name || "User");

        const { data: blocksData, error } = await supabaseClient
          .from("blocks")
          .select("*")
          .eq("user_id", user.id)
          .order("start_time", { ascending: true });

        if (error) console.error("Fetch blocks error:", error);
        else if (blocksData) setBlocks(blocksData as QuietBlock[]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setEditingBlock(null);
    setTitle("");
    setStartTime("");
    setEndTime("");
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!title || !startTime || !endTime) {
      alert("All fields are required");
      return;
    }

    if (!userId) {
      console.error("No user ID found. Are you logged in?");
      return;
    }

    const formattedStart = new Date(startTime).toISOString();
    const formattedEnd = new Date(endTime).toISOString();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      if (editingBlock) {
        const { error } = await supabaseClient
          .from("blocks")
          .update({
            title,
            start_time: formattedStart,
            end_time: formattedEnd,
            timezone,
          })
          .eq("id", editingBlock.id);

        if (error) {
          console.error("Update error:", error);
          return;
        }

        setBlocks(
          blocks.map((b) =>
            b.id === editingBlock.id
              ? {
                  ...b,
                  title,
                  start_time: formattedStart,
                  end_time: formattedEnd,
                  timezone,
                }
              : b
          )
        );
        resetForm();
      } else {
        const { data, error } = await supabaseClient
          .from("blocks")
          .insert([
            {
              id: uuidv4(),
              user_id: userId,
              title,
              start_time: formattedStart,
              end_time: formattedEnd,
              timezone,
              notified: false,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error("Insert error:", error);
          return;
        }

        if (data) {
          setBlocks([...blocks, data]);
          resetForm();
        }
      }
    } catch (err) {
      console.error("Unexpected JS error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this block?")) return;
    const { error } = await supabaseClient.from("blocks").delete().eq("id", id);
    if (error) return console.error("Delete error:", error);
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleEdit = (block: QuietBlock) => {
    setEditingBlock(block);
    setTitle(block.title);
    setStartTime(block.start_time);
    setEndTime(block.end_time);
    setShowForm(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (dateTime: string) =>
    new Date(dateTime).toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-white overflow-hidden px-6">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-1/4 w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-40 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent mb-4 leading-tight">
            {getGreeting()}
            {fullName ? `, ${fullName}` : ""}!
          </h1>

          <p className="text-2xl md:text-3xl text-gray-700 font-light mb-2">
            Welcome to{" "}
            <span className="font-semibold text-orange-600">Quiet Hours</span>
          </p>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;ll remind you{" "}
            <span className="font-semibold text-orange-600">
              10 minutes before
            </span>{" "}
            each session.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { title: "Total Sessions", value: blocks.length, icon: Calendar },
            {
              title: "Next Session",
              value: blocks[0] ? formatTime(blocks[0].start_time) : "None",
              icon: Clock,
            },
            { title: "Focus Mode", value: "Ready", icon: Moon },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-md">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sessions Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Sessions
            </h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition font-medium shadow"
              >
                + Add Session
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {editingBlock ? "Edit Session" : "New Session"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition font-medium shadow"
                >
                  {editingBlock ? "Update" : "Save"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  {[
                    "Title",
                    "Start",
                    "End",
                    "Timezone",
                    "Notified",
                    "Actions",
                  ].map((head) => (
                    <th key={head} className="px-4 py-2 text-left font-medium">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blocks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No sessions yet. Add one to get started!
                    </td>
                  </tr>
                ) : (
                  blocks.map((block) => (
                    <tr
                      key={block.id}
                      className="hover:bg-orange-50/50 transition"
                    >
                      <td className="px-4 py-2 font-medium">{block.title}</td>
                      <td className="px-4 py-2">
                        {new Date(block.start_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(block.end_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{block.timezone}</td>
                      <td className="px-4 py-2">
                        {block.notified ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(block)}
                          className="px-3 py-1.5 text-xs rounded-lg border border-yellow-400 text-yellow-600 hover:bg-yellow-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(block.id)}
                          className="px-3 py-1.5 text-xs rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
