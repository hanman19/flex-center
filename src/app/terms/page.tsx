import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[800px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div>
            <span className="font-semibold">FLEX CENTER</span>
          </Link>
          <Link href="/onboarding" className="text-[13px] px-4 py-2 rounded-full bg-black text-white">회원가입으로 돌아가기</Link>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-6 py-12">
        <h1 className="text-[32px] font-bold tracking-tight">풀필먼트 이용약관</h1>
        <p className="text-[13px] opacity-60 mt-2">FLEX CENTER 마이크로 풀필먼트 서비스 이용약관</p>

        <div className="mt-10 space-y-6 text-[13px] leading-relaxed">
          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold">제1조 (목적)</h2>
            <p className="mt-2 opacity-80">본 약관은 FLEX CENTER(이하 "회사")가 제공하는 마이크로 풀필먼트 서비스(보관, 피킹, 포장, 출고, 반품)의 이용 조건 및 절차를 규정함을 목적으로 합니다.</p>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold">제2조 (가입 및 승인)</h2>
            <ul className="mt-2 list-disc ml-5 opacity-80 space-y-1">
              <li>사업자등록번호, 상호, 대표자명, 서류 4종 제출 필수</li>
              <li>신분증 주민번호 뒷자리 마스킹 필수, 미처리 시 반려</li>
              <li>관리자가 24시간 이내 승인 심사 (서류 불일치, 휴폐업 사업자 등 거부 가능)</li>
              <li>동일 사업자등록번호로 1계정만 생성 가능</li>
            </ul>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold">제3조 (요금 및 정산)</h2>
            <ul className="mt-2 list-disc ml-5 opacity-80 space-y-1">
              <li>요금은 월 구독제: STARTER 26,900원 ~ VIP 5,349,000원</li>
              <li>합포장 3개 무료, 바코드 라벨링 무료, 일반 포장 무료</li>
              <li>보관 초과 시 플랜별 2~3만원/월, 야간/주말 할증 +300~600원/건</li>
              <li>매월 1일 자동 결제, 미납 시 서비스 중지 및 보증금에서 차감</li>
            </ul>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold">제4조 (입고 및 보관)</h2>
            <ul className="mt-2 list-disc ml-5 opacity-80 space-y-1">
              <li>입고 전 FMS에 상품 등록 필수, 미등록 상품은 회송</li>
              <li>바코드 없는 상품은 바코드 부착비 100원/개 청구</li>
              <li>보관 중 분실/파손 시 회사 책임은 상품 원가의 최대 50만원까지 (고가품은 별도 보험 가입 권장)</li>
              <li>60일 이상 장기 보관 시 50% 할증</li>
            </ul>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold">제5조 (출고 및 반품)</h2>
            <ul className="mt-2 list-disc ml-5 opacity-80 space-y-1">
              <li>오후 2시 이전 주문은 당일 출고, 이후 주문은 익일 출고</li>
              <li>오배송은 회사 책임, 24시간 이내 재출고</li>
              <li>반품 입고 시 검수비 500원/건, 양품화 300원/건</li>
            </ul>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold">제6조 (개인정보)</h2>
            <p className="mt-2 opacity-80">개인정보 처리는 개인정보처리방침을 따릅니다. 주민등록번호는 수집하지 않으며, 신분증은 마스킹 후 업로드해야 합니다.</p>
          </section>
        </div>

        <div className="mt-12 flex gap-3">
          <Link href="/onboarding" className="flex-1 bg-black text-white rounded-full py-4 text-center text-[14px] font-semibold">동의하고 회원가입으로 →</Link>
          <Link href="/" className="px-7 py-4 rounded-full border border-black/10 text-[14px] font-semibold">홈으로</Link>
        </div>
      </main>
    </div>
  );
}
