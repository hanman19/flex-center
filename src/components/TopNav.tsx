"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menus = [
  { name: "대시보드", path: "/dashboard" },
  { name: "WMS Pro", path: "/admin/wms" },
  { name: "WMS Lite", path: "/wms" },
  { name: "주문", path: "/orders" },
  { name: "정산", path: "/settlement" },
  { name: "입고", path: "/admin/inbound" },
  { name: "재고", path: "/admin/inventory" },
  { name: "셀러 관리", path: "/admin/sellers" },
  { name: "플랫폼", path: "/platforms" },
  { name: "택배 API", path: "/shipments", badge: "NEW" },
  { name: "상품", path: "/products" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [role, setRole] = useState("admin");

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-black text-[16px]">Flex Center</Link>
          <div className="flex items-center gap-1">
            {menus.map(m => {
              const active = pathname?.startsWith(m.path);
              return (
                <Link key={m.path} href={m.path} className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${active ? "bg-black text-white" : "hover:bg-black/5"}`}>
                  {m.name}
                  {m.badge && <span className="bg-[#FFC61A] text-black px-1.5 py-0.5 rounded-full text-[8px] border border-black">{m.badge}</span>}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] opacity-60">phankyu@gmail.com / {role}</span>
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">P</div>
        </div>
      </div>
    </div>
  );
}
