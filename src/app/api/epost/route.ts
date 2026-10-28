import { NextRequest, NextResponse } from "next/server";

// ============================================
// 우체국택배 ePost API - 처음부터!
// 계약코드, API 문서 나중에 넣으면 바로 실연동!
// ============================================

type EPostConfig = {
  customer_code: string; // .env EPOST_CUSTOMER_CODE - 계약코드!
  api_key: string; // .env EPOST_API_KEY
  api_url: string; // .env EPOST_API_URL - ePost 문서 URL!
};

function getEPostConfig(): EPostConfig {
  return {
    customer_code: process.env.EPOST_CUSTOMER_CODE || "",
    api_key: process.env.EPOST_API_KEY || "",
    api_url: process.env.EPOST_API_URL || "https://www.epost.go.kr/api",
  };
}

// GET /api/epost?invoice=6123456789012 - 배송 조회
export async function GET(req: NextRequest) {
  const invoice = req.nextUrl.searchParams.get("invoice");
  const config = getEPostConfig();

  if (!invoice) {
    return NextResponse.json({ error: "invoice required - ?invoice=6..." }, { status: 400 });
  }

  if (!config.customer_code || !config.api_key) {
    return NextResponse.json({
      mode: "MOCK - 계약코드 없음",
      courier: "우체국택배",
      invoice,
      invoice_format: "13자리 - 6XXXXXXXXXXXX",
      status: "배송중 (목업)",
      events: [
        { time: "2024-10-28 10:00", location: "김포우체국", status: "접수" },
        { time: "2024-10-28 15:00", location: "고양우편집중국", status: "발송" },
      ],
      advantages: ["제주, 도서산간 저렴", "전국 3500개 우체국망", "토요일 배송"],
      next_step: ".env에 EPOST_CUSTOMER_CODE, EPOST_API_KEY 추가!",
      todo: "우체국 방문 - 계약택배 신청서, 사업자등록증! API 문서 받으면 URL 교체!"
    });
  }

  return NextResponse.json({
    mode: "REAL READY",
    courier: "우체국택배",
    invoice,
    config: { customer_code: config.customer_code.slice(0,4) + "****" },
    message: "계약코드 있음! ePost 문서 보고 fetch 코드 추가!"
  });
}

// POST /api/epost - 송장 발행
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recipient, invoice_product_name, orders } = body;
  const config = getEPostConfig();

  if (!recipient || !invoice_product_name) {
    return NextResponse.json({ error: "recipient, invoice_product_name required" }, { status: 400 });
  }

  if (!config.customer_code || !config.api_key) {
    const mockInvoice = `6${Date.now().toString().slice(-12)}`.slice(0,13);
    return NextResponse.json({
      mode: "MOCK",
      success: true,
      courier: "우체국택배",
      invoice_no: mockInvoice,
      invoice_product_name,
      invoice_format: "13자리",
      tracking_url: `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${mockInvoice}`,
      cost_advantage: "제주/도서산간 - CJ 3000원 추가 vs 우체국 1000원 추가 = 2000원 절감!",
      next_step: ".env에 계약코드 추가!",
    });
  }

  const mockInvoice = `6${Date.now().toString().slice(-12)}`.slice(0,13);
  return NextResponse.json({
    mode: "REAL READY",
    success: true,
    courier: "우체국택배",
    invoice_no: mockInvoice,
    invoice_product_name,
    tracking_url: `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${mockInvoice}`,
    message: "계약코드 있음! 문서 보고 실연동!"
  });
}
