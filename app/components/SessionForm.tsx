"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ---------- Supabase Setup ----------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ---------- Time Utilities ----------
const toUTC = (localDateTime: string) => {
  if (!localDateTime) return null;
  const date = new Date(localDateTime);
  return date.toISOString();
};

const toLocal = (utcDateString: string) => {
  if (!utcDateString) return "";
  const date = new Date(utcDateString);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

// ---------- Props ----------
interface SessionFormProps {
  editingBlock: any;
  resetForm: () => void;
  refreshSessions?: () => void;
}

export default function SessionForm({
  editingBlock,
  resetForm,
  refreshSessions,
}: SessionFormProps) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill form if editing
  useEffect(() => {
    if (editingBlock) {
      setTitle(editingBlock.title || "");
      setStartTime(toLocal(editingBlock.start_time));
      setEndTime(toLocal(editingBlock.end_time));
    } else {
      setTitle("");
      setStartTime("");
      setEndTime("");
    }
  }, [editingBlock]);

  // ---------- Handle Save ----------
  const handleSave = async () => {
    if (!title || !startTime || !endTime) {
      alert("Please fill all fields before saving.");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      alert("End time must be after start time.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to save sessions.");
        return;
      }

      const payload = {
        title,
        start_time: toUTC(startTime),
        end_time: toUTC(endTime),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notified: false,
        user_id: user.id,
      };

      let error = null;

      if (editingBlock) {
        const { error: updateError } = await supabase
          .from("blocks")
          .update(payload)
          .eq("id", editingBlock.id)
          .eq("user_id", user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("blocks")
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      if (typeof refreshSessions === "function") {
        await refreshSessions();
      }

      alert(
        editingBlock
          ? "Session updated successfully!"
          : "Session saved successfully!"
      );
      resetForm();
    } catch (error: any) {
      console.error("❌ Error saving session:", error);

      const msg = error?.message?.toLowerCase?.() || "";

      if (msg.includes("violates") && msg.includes("policy")) {
        alert(
          "You don't have permission to modify this session (RLS restriction)."
        );
      } else if (msg.includes("overlap") || msg.includes("conflict")) {
        alert(
          "This session overlaps with another one. Please choose a different time."
        );
      } else if (msg.includes("foreign key") || msg.includes("user_id")) {
        alert("User validation failed. Please log in again.");
      } else {
        alert("Failed to save session. " + (error.message || "Unknown error."));
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="bg-orange-50/40 border border-orange-100 rounded-xl p-6 mb-8 shadow-inner">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        {editingBlock ? "Edit Session" : "New Session"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-300 outline-none"
        />

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-300 outline-none"
        />

        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-orange-300 outline-none"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : editingBlock ? "Update" : "Save"}
        </button>

        <button
          onClick={resetForm}
          className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
