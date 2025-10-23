"use client";

import { motion } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";

interface SessionsTableProps {
  blocks: any[];
  visibleCount: number;
  handleEdit: (block: any) => void;
  handleDelete: (id: string) => void;
}

export default function SessionsTable({
  blocks,
  visibleCount,
  handleEdit,
  handleDelete,
}: SessionsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-md border border-orange-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-orange-400/20 to-red-400/20 text-gray-700">
            <tr>
              {["Title", "Start", "End", "Timezone", "Notified", "Actions"].map(
                (head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left font-semibold uppercase text-[13px] tracking-wide border-b border-orange-100"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {blocks.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500 italic bg-orange-50/40"
                >
                  No sessions yet — add one to get started ✨
                </td>
              </tr>
            ) : (
              blocks.slice(0, visibleCount).map((block, idx) => (
                <motion.tr
                  key={block.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`transition ${
                    idx % 2 === 0 ? "bg-orange-50/30" : "bg-white"
                  } hover:bg-orange-100/40`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {block.title}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(block.start_time).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(block.end_time).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{block.timezone}</td>
                  <td className="px-4 py-3">
                    {block.notified ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(block)}
                      className="flex items-center gap-1 px-3 py-1 text-xs border border-yellow-400 text-yellow-700 rounded-md hover:bg-yellow-50 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(block.id)}
                      className="flex items-center gap-1 px-3 py-1 text-xs border border-red-400 text-red-600 rounded-md hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {blocks.length === 0 ? (
          <p className="text-center py-8 text-gray-500 italic bg-orange-50/40 rounded-xl">
            No sessions yet add one to get started ✨
          </p>
        ) : (
          blocks.slice(0, visibleCount).map((block, idx) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-orange-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {block.title}
                </h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    block.notified
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {block.notified ? "Notified" : "Pending"}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Start:</span>{" "}
                  {new Date(block.start_time).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-700">End:</span>{" "}
                  {new Date(block.end_time).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Timezone:</span>{" "}
                  {block.timezone}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => handleEdit(block)}
                  className="flex items-center gap-1 px-3 py-1 text-xs border border-yellow-400 text-yellow-700 rounded-md hover:bg-yellow-50 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(block.id)}
                  className="flex items-center gap-1 px-3 py-1 text-xs border border-red-400 text-red-600 rounded-md hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
