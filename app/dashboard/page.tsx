"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

import { v4 as uuidv4 } from "uuid";
import StatsSection from "../components/StatsSection";
import GradientBlobs from "../components/GradientBlobs";
import SessionsTable from "../components/SessionsTable";
import SessionForm from "../components/SessionForm";
import Header from "../components/Header";

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
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editingBlock, setEditingBlock] = useState<QuietBlock | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  // ✅ Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // ✅ Format time
  const formatTime = (time: string) => {
    try {
      return new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid time";
    }
  };

  // ✅ Fetch sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Fetch profile
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setFullName(profile?.full_name || "User");

      // Fetch blocks
      const { data, error } = await supabaseClient
        .from("blocks")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setBlocks(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // ✅ Save or update
  const handleSave = async () => {
    if (!title || !startTime || !endTime) {
      toast.error("Please fill all fields");
      return;
    }

    const blockData = {
      id: editingBlock ? editingBlock.id : uuidv4(),
      title,
      start_time: startTime,
      end_time: endTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notified: false,
      user_id: userId,
    };

    try {
      if (editingBlock) {
        const { error } = await supabaseClient
          .from("blocks")
          .update(blockData)
          .eq("id", editingBlock.id);
        if (error) throw error;
        toast.success("Session updated");
      } else {
        const { error } = await supabaseClient
          .from("blocks")
          .insert([blockData]);
        if (error) throw error;
        toast.success("Session added");
      }
      resetForm();
      fetchSessions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save session");
    }
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    try {
      const { error } = await supabaseClient
        .from("blocks")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Session deleted");
      fetchSessions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete session");
    }
  };

  // ✅ Edit
  const handleEdit = (block: QuietBlock) => {
    setEditingBlock(block);
    setTitle(block.title);
    setStartTime(block.start_time);
    setEndTime(block.end_time);
    setShowForm(true);
  };

  // ✅ Reset form
  const resetForm = () => {
    setTitle("");
    setStartTime("");
    setEndTime("");
    setEditingBlock(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-6 py-12 overflow-hidden">
      <GradientBlobs />

      <div className="max-w-6xl mx-auto">
        <Header fullName={fullName} getGreeting={getGreeting} />

        <StatsSection
          blocksLength={blocks.length}
          nextSessionTime={
            blocks[0] ? formatTime(blocks[0].start_time) : "None"
          }
        />

        {/* Sessions Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Sessions
            </h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                + Add Session
              </button>
            )}
          </div>

          {showForm && (
            <SessionForm
              title={title}
              startTime={startTime}
              endTime={endTime}
              editingBlock={editingBlock}
              setTitle={setTitle}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              handleSave={handleSave}
              resetForm={resetForm}
            />
          )}

          <SessionsTable
            blocks={blocks}
            visibleCount={visibleCount}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </section>
      </div>
    </main>
  );
}
