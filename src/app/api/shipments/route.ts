import { NextRequest, NextResponse } from "next/server";

// ============================================
// 통합 택배 API - CJ + 우체국 듀얼!
// POST /api/shipments - 송장 발행 (자동 선택!)
// GET /api/shipments?invoice=6300...&courier=cj - 배송 조회
// ============================================

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { courier, recipient, invoice_product_name, orders, address } = body;

  // 제주, 도서산간 자동 판단 - 우체국이 저렴!
  const fullAddress = address || recipient?.address || "";
  const zipcode = recipient?.zipcode || "";
  const isJejuOrIsland = 
    fullAddress.includes("제주") || 
    fullAddress.includes("도서") || 
    fullAddress.includes("울릉") || 
    fullAddress.includes("독도") ||
    zipcode.startsWith("63") || // 제주 우편번호 63xxx
    zipcode.startsWith("59"); // 도서산간 일부

  // courier 지정 없으면 자동 선택!
  let finalCourier = courier;
  if (!finalCourier) {
    finalCourier = isJejuOrIsland ? "epost" : "cj";
  }

  // 공통 응답 구조
  const baseResponse = {
    invoice_product_name, // 송장 품명! 핵심!
    recipient,
    orders,
    auto_selected: {
      requested: courier || "auto",
      final: finalCourier,
      reason: isJejuOrIsland ? "제주/도서산간이라 우체국 자동 선택 - 2000원 절감!" : "일반 지역이라 CJ 선택",
      is_jeju: isJejuOrIsland
    }
  };

  if (finalCourier === "cj") {
    // CJ 호출
    const cjRes = await fetch(`${req.nextUrl.origin}/api/cj`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, invoice_product_name, orders })
    });
    const cjData = await cjRes.json();
    return NextResponse.json({ ...baseResponse, ...cjData, courier: "CJ대한통운" });
  } else {
    // 우체국 호출
    const epostRes = await fetch(`${req.nextUrl.origin}/api/epost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, invoice_product_name, orders })
    });
    const epostData = await epostRes.json();
    return NextResponse.json({ ...baseResponse, ...epostData, courier: "우체국택배" });
  }
}

export async function GET(req: NextRequest) {
  const invoice = req.nextUrl.searchParams.get("invoice");
  const courier = req.nextUrl.searchParams.get("courier") || "cj";

  if (!invoice) return NextResponse.json({ error: "invoice required" }, { status: 400 });

  // invoice 번호로 택배사 자동 판단
  // CJ: 12자리, 6300... / 우체국: 13자리, 6...
  let finalCourier = courier;
  if (invoice.startsWith("6") && invoice.length === 13) finalCourier = "epost";
  if (invoice.startsWith("63") && invoice.length === 12) finalCourier = "cj";

  const apiPath = finalCourier === "cj" ? "/api/cj" : "/api/epost";
  const res = await fetch(`${req.nextUrl.origin}${apiPath}?invoice=${invoice}`);
  const data = await res.json();

  return NextResponse.json({ ...data, queried_courier: finalCourier });
}
