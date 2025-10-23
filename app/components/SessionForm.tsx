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
      alert("Failed to save session. " + (error.message || "Unknown error."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFCF9] border border-[#FFE1DF] rounded-2xl p-8 shadow-sm max-w-4xl mx-auto my-8">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        {editingBlock ? "Edit Session" : "Add New Session"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Session Title
          </label>
          <input
            type="text"
            placeholder="Enter session name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[#FFE1DF] rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#FFE1DF] focus:border-[#FFE1DF] outline-none transition"
          />
        </div>

        {/* Start Time */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-[#FFE1DF] rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#FFE1DF] focus:border-[#FFE1DF] outline-none transition"
          />
        </div>

        {/* End Time */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-[#FFE1DF] rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#FFE1DF] focus:border-[#FFE1DF] outline-none transition"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#FFE1DF] text-gray-800 px-6 py-2.5 rounded-lg font-medium hover:bg-[#FFD2CB] transition disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : editingBlock
            ? "Update Session"
            : "Save Session"}
        </button>

        <button
          onClick={resetForm}
          className="px-6 py-2.5 border border-[#FFE1DF] text-gray-700 rounded-lg hover:bg-[#FFE1DF] transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
