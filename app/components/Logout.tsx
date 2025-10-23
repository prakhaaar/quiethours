"use client";

import { supabaseClient } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium shadow"
    >
      Logout
    </button>
  );
}
