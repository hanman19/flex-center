"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try { await supabase.auth.signOut(); } catch {}

      try { localStorage.clear(); } catch {}
      try { sessionStorage.clear(); } catch {}

      try {
        if (typeof indexedDB !== "undefined" && indexedDB.databases) {
          const dbs = await indexedDB.databases();
          for (const db of dbs) {
            if (db.name) indexedDB.deleteDatabase(db.name);
          }
        }
      } catch {}

      try {
        document.cookie.split(";").forEach(c => {
          const name = c.split("=")[0].trim();
          if (name.startsWith("sb-") || name.includes("supabase") || name === "flex-auth") {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
          }
        });
        document.cookie = `logged_out=1; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("logged_out", "1");
      } catch {}

      setTimeout(() => {
        window.location.href = "/api/auth/logout";
      }, 300);
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="bg-white border rounded-[20px] p-8 text-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-bold text-[13px]">로그아웃 중... logged_out 플래그 설정!</p>
      </div>
    </div>
  );
}
