"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      // 1. Supabase 로그아웃
      try { await supabase.auth.signOut(); } catch {}

      // 2. localStorage, sessionStorage 싹!
      try { localStorage.clear(); } catch {}
      try { sessionStorage.clear(); } catch {}

      // 3. IndexedDB 싹! Supabase가 여기 숨겨놓음!
      try {
        if (typeof indexedDB !== "undefined" && indexedDB.databases) {
          const dbs = await indexedDB.databases();
          for (const db of dbs) {
            if (db.name) indexedDB.deleteDatabase(db.name);
          }
        }
        // 이름 모르는 DB도 삭제 시도
        indexedDB.deleteDatabase("supabase-auth");
        indexedDB.deleteDatabase("keyval-store");
      } catch {}

      // 4. 쿠키 싹!
      try {
        document.cookie.split(";").forEach(c => {
          const name = c.split("=")[0].trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        });
      } catch {}

      // 5. 서버 쿠키 삭제하러 이동!
      setTimeout(() => {
        window.location.href = "/api/auth/logout";
      }, 500);
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="bg-white border rounded-[20px] p-8 text-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-bold text-[13px]">로그아웃 중... IndexedDB까지 삭제!</p>
      </div>
    </div>
  );
}
