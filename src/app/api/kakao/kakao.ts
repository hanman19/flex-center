import { NextRequest, NextResponse } from "next/server";

// ============================================
// 카카오 알림톡 API - 처음부터!
// 알리고, 비즈엠, 카카오 공식 중 하나! API 문서 나중에!
// ============================================

type KakaoConfig = {
  api_key: string; // .env KAKAO_API_KEY - 알리고/비즈엠 API 키!
  sender_key: string; // .env KAKAO_SENDER_KEY - 카카오 발신 프로필 키!
  api_url: string; // .env KAKAO_API_URL - 알리고면 https://kakaoapi.aligo.in
};

function getKakaoConfig(): KakaoConfig {
  return {
    api_key: process.env.KAKAO_API_KEY || "",
    sender_key: process.env.KAKAO_SENDER_KEY || "",
    api_url: process.env.KAKAO_API_URL || "https://kakaoapi.aligo.in",
  };
}

// GET /api/kakao - 템플릿 목록
export async function GET() {
  return NextResponse.json({
    mode: "TEMPLATE LIST",
    provider: "알리고 / 비즈엠 / 카카오 공식 - 셋 중 하나!",
    templates: [
      {
        code: "flex_001_출고완료",
        name: "출고 완료 - 고객용",
        content: "#{recipient}님, 주문하신 #{invoice_name} 출고되었습니다.\n택배: #{courier} #{tracking}\n배송조회: #{tracking_url}",
        variables: ["recipient", "invoice_name", "courier", "tracking", "tracking_url"],
        example: "김*수님, 주문하신 무선이어폰 / 블랙 외 1건 출고되었습니다. 택배: CJ대한통운 630012345678"
      },
      {
        code: "flex_002_배송중",
        name: "배송 중 - 고객용",
        content: "#{recipient}님, #{invoice_name} 배송중입니다. #{courier} #{tracking}",
        variables: ["recipient", "invoice_name", "courier", "tracking"]
      },
      {
        code: "flex_003_재고부족_관리자",
        name: "재고 부족 - 관리자용",
        content: "#{invoice_name} 재고 #{stock}개! 안전재고 #{safety}개 미만! 위치 #{location} 발주 필요!",
        variables: ["invoice_name", "stock", "safety", "location"]
      },
      {
        code: "flex_004_합포장_고객",
        name: "합포장 완료 - 고객용",
        content: "#{recipient}님, #{count}건 주문 합포장 완료! #{invoice_name} 1박스로 발송! 배송비 절약!",
        variables: ["recipient", "count", "invoice_name"]
      }
    ],
    next_step: "알리고(https://www.aligo.in) 또는 비즈엠 가입! 발신 프로필 심사 + 템플릿 심사 1~2일!",
    env_needed: ["KAKAO_API_KEY", "KAKAO_SENDER_KEY", "KAKAO_API_URL"]
  });
}

// POST /api/kakao - 알림톡 발송
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, template, variables } = body;
  // to: "010-1234-5678" - 고객 전화번호!
  // template: "flex_001_출고완료"
  // variables: { recipient: "김*수", invoice_name: "무선이어폰 / 블랙 외 1건", courier: "CJ대한통운", tracking: "630012345678", tracking_url: "https://..." }

  const config = getKakaoConfig();

  if (!to || !template) {
    return NextResponse.json({ error: "to, template required - to: 010-1234-5678, template: flex_001_출고완료" }, { status: 400 });
  }

  if (!config.api_key || !config.sender_key) {
    // 목업 발송
    return NextResponse.json({
      mode: "MOCK - API 키 없음",
      success: true,
      msg_id: `KAKAO_MOCK_${Date.now()}`,
      to,
      template,
      variables,
      message_preview: `${variables?.recipient || "고객"}님, ${variables?.invoice_name || "상품"} 출고! ${variables?.courier || "CJ"} ${variables?.tracking || "6300..."}`,
      next_step: ".env에 KAKAO_API_KEY, KAKAO_SENDER_KEY 추가!",
      todo: "1. 알리고 가입 (https://www.aligo.in) 2. 카카오 발신 프로필 등록 3. 템플릿 심사 신청 (flex_001_출고완료 등) 4. API 문서 보고 아래 fetch 코드 수정!"
    });
  }

  // === 실제 카카오 알림톡 발송 - 계약 후 ===
  try {
    // TODO: API 문서 보고 수정! 알리고 기준 예시!
    // const res = await fetch(`${config.api_url}/akv10/alimtalk/send/`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: new URLSearchParams({
    //     apikey: config.api_key,
    //     senderkey: config.sender_key,
    //     tpl_code: template,
    //     receiver_1: to,
    //     subject_1: "출고 완료",
    //     message_1: `${variables.recipient}님, 주문하신 ${variables.invoice_name} 출고되었습니다. 택배: ${variables.courier} ${variables.tracking}`,
    //     // ...
    //   })
    // });
    // const data = await res.json();

    return NextResponse.json({
      mode: "REAL READY - API 키 있음!",
      success: true,
      msg_id: `KAKAO_REAL_${Date.now()}`,
      to,
      template,
      variables,
      config: { sender_key: config.sender_key.slice(0,10) + "****", api_url: config.api_url },
      message: "API 키 있음! 문서 보고 fetch 주석 해제하면 실발송!"
    });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
