"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabaseClient } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // 🧭 Load sessions when page mounts
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabaseClient
      .from("sessions")
      .select("*")
      .order("start_time", { ascending: true });

    if (error) {
      toast.error("Failed to load sessions");
    } else {
      setSessions(data || []);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !startTime || !endTime) {
      toast.error("Please fill all fields");
      return;
    }

    let formattedStart = new Date(startTime).toISOString();
    let formattedEnd = new Date(endTime).toISOString();

    // Swap if end is before start
    if (new Date(formattedStart) > new Date(formattedEnd)) {
      [formattedStart, formattedEnd] = [formattedEnd, formattedStart];
    }

    setLoading(true);
    try {
      if (selectedSession) {
        // ✏️ Update existing session
        const { error } = await supabaseClient
          .from("sessions")
          .update({
            title,
            start_time: formattedStart,
            end_time: formattedEnd,
          })
          .eq("id", selectedSession.id);

        if (error) throw error;
        toast.success("Session updated!");
      } else {
        // 🆕 Add new session
        const { error } = await supabaseClient.from("sessions").insert([
          {
            title,
            start_time: formattedStart,
            end_time: formattedEnd,
          },
        ]);
        if (error) throw error;
        toast.success("Session added!");
      }

      setTitle("");
      setStartTime("");
      setEndTime("");
      setSelectedSession(null);
      fetchSessions();
    } catch (error: any) {
      toast.error(error.message || "Error saving session");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session: any) => {
    setSelectedSession(session);
    setTitle(session.title);
    setStartTime(session.start_time);
    setEndTime(session.end_time);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabaseClient
      .from("sessions")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete session");
    } else {
      toast.success("Session deleted");
      fetchSessions();
    }
  };

  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center py-10 px-6">
      <motion.h1
        className="text-3xl font-bold text-orange-600 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      {/* 🧾 Add / Edit Session Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {selectedSession ? "Edit Session" : "Add New Session"}
        </h2>

        <input
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-400 outline-none"
        />

        <label className="text-gray-600 text-sm">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-400 outline-none"
        />

        <label className="text-gray-600 text-sm">End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-400 outline-none"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          {loading
            ? selectedSession
              ? "Updating..."
              : "Saving..."
            : selectedSession
            ? "Update Session"
            : "Add Session"}
        </button>
      </div>

      {/* 📅 Session List */}
      <div className="w-full max-w-2xl mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Your Sessions
        </h3>
        <div className="space-y-3">
          {sessions.length === 0 && (
            <p className="text-gray-500 text-center">No sessions found.</p>
          )}
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h4 className="font-semibold text-gray-800">{session.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(session.start_time).toLocaleString()} →{" "}
                  {new Date(session.end_time).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(session)}
                  className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(session.id)}
                  className="text-red-500 hover:text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
