import { NextRequest, NextResponse } from "next/server";

// ============================================
// CJ 대한통운 API - 처음부터!
// 계약코드, API 문서 나중에 넣으면 바로 실연동!
// ============================================

type CJConfig = {
  customer_code: string; // .env CJ_CUSTOMER_CODE - 계약코드! 나중에 줄게!
  api_key: string; // .env CJ_API_KEY
  api_url: string; // .env CJ_API_URL - 대리점마다 다름! 문서 보면 URL 나옴!
};

// CJ 설정 가져오기
function getCJConfig(): CJConfig {
  return {
    customer_code: process.env.CJ_CUSTOMER_CODE || "",
    api_key: process.env.CJ_API_KEY || "",
    api_url: process.env.CJ_API_URL || "https://api.cjlogistics.com", // 기본 - 나중에 문서 URL로 교체!
  };
}

// GET /api/cj?invoice=630012345678 - 배송 조회
export async function GET(req: NextRequest) {
  const invoice = req.nextUrl.searchParams.get("invoice");
  const config = getCJConfig();

  if (!invoice) {
    return NextResponse.json({ error: "invoice required - ?invoice=6300..." }, { status: 400 });
  }

  // 계약코드 없으면 목업 - 나중에 계약코드 넣으면 실API 호출!
  if (!config.customer_code || !config.api_key) {
    return NextResponse.json({
      mode: "MOCK - 계약코드 없음",
      courier: "CJ대한통운",
      invoice,
      status: "배송중 (목업)",
      events: [
        { time: "2024-10-28 10:00", location: "김포센터", status: "집화", invoice_product_name: "무선이어폰 / 블랙" },
        { time: "2024-10-28 14:00", location: "곤지암HUB", status: "간선상차" },
        { time: "2024-10-28 18:00", location: "서울 강남", status: "배송중" },
      ],
      next_step: ".env에 CJ_CUSTOMER_CODE, CJ_API_KEY, CJ_API_URL 추가하면 실API 호출!",
      todo: "CJ 대리점에 API 문서 요청! 문서에 URL, 헤더, 바디 형식 있음!"
    });
  }

  // === 실제 CJ API 호출 - 계약코드 있으면 이 코드 실행! ===
  try {
    // TODO: API 문서 보고 아래 코드 수정!
    // 예시 1: Open API 형태
    // const res = await fetch(`${config.api_url}/tracking?invoice=${invoice}`, {
    //   headers: {
    //     "Authorization": `Bearer ${config.api_key}`,
    //     "Customer-Code": config.customer_code,
    //     "Content-Type": "application/json"
    //   }
    // });
    // const data = await res.json();
    // return NextResponse.json({ mode: "REAL", courier: "CJ대한통운", invoice, data });

    // 지금은 목업이지만 config 있으면 REAL로 표시!
    return NextResponse.json({
      mode: "REAL READY - 계약코드 있음!",
      courier: "CJ대한통운",
      invoice,
      config: { customer_code: config.customer_code.slice(0,4) + "****", api_url: config.api_url },
      status: "배송중",
      message: "계약코드 있음! API 문서 보고 fetch 코드 주석 해제하면 실연동!"
    });
  } catch (e:any) {
    return NextResponse.json({ error: e.message, config: getCJConfig() }, { status: 500 });
  }
}

// POST /api/cj - 송장 발행
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recipient, invoice_product_name, orders, box_type } = body;
  const config = getCJConfig();

  // 필수값 체크
  if (!recipient || !invoice_product_name) {
    return NextResponse.json({ error: "recipient, invoice_product_name required" }, { status: 400 });
  }

  // 계약코드 없으면 목업 송장 발행
  if (!config.customer_code || !config.api_key) {
    const mockInvoice = `6300${Date.now().toString().slice(-8)}`;
    return NextResponse.json({
      mode: "MOCK - 계약코드 없음",
      success: true,
      courier: "CJ대한통운",
      invoice_no: mockInvoice,
      invoice_product_name, // 송장 품명! 작업자가 보는 이름!
      recipient,
      orders,
      tracking_url: `https://www.cjlogistics.com/ko/tool/parcel/tracking?inv=${mockInvoice}`,
      next_step: ".env에 계약코드 추가하면 실발행!",
      todo: "API 문서 보고 POST 바디 수정! recipient, invoice_product_name 그대로 쓰면 됨!"
    });
  }

  // === 실제 CJ 송장 발행 ===
  try {
    // TODO: API 문서 보고 수정!
    // const res = await fetch(`${config.api_url}/invoice/create`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.api_key}` },
    //   body: JSON.stringify({
    //     customer_code: config.customer_code,
    //     recipient: {
    //       name: recipient.name,
    //       phone: recipient.phone,
    //       zipcode: recipient.zipcode,
    //       address: recipient.address
    //     },
    //     product: {
    //       name: invoice_product_name, // 송장 품명! 통합 품명!
    //       qty: orders?.reduce((s:any,o:any)=>s+o.qty,0) || 1,
    //       box_type: box_type || "A"
    //     },
    //     orders: orders // 상세 주문 - 송장 품명 기준!
    //   })
    // });

    const mockInvoice = `6300${Date.now().toString().slice(-8)}`;
    return NextResponse.json({
      mode: "REAL READY",
      success: true,
      courier: "CJ대한통운",
      invoice_no: mockInvoice,
      invoice_product_name,
      config: { customer_code: config.customer_code.slice(0,4) + "****" },
      tracking_url: `https://www.cjlogistics.com/ko/tool/parcel/tracking?inv=${mockInvoice}`,
      message: "계약코드 있음! API 문서 보고 fetch 주석 해제!"
    });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
