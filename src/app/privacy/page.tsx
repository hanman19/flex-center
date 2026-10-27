import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="text-[32px] font-bold tracking-tight">개인정보처리방침</h1>
        <p className="text-[13px] opacity-60 mt-2">시행일: 2026년 10월 27일 | FLEX CENTER 마이크로 풀필먼트</p>

        <div className="mt-10 space-y-8 text-[13px] leading-relaxed">
          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold text-[16px]">1. 수집하는 개인정보 항목</h2>
            <div className="mt-4 space-y-3 opacity-80">
              <p><b>필수:</b> 이메일, 비밀번호(암호화), 휴대폰 번호, 사업자등록번호, 상호명, 대표자명, 개업일자, 사업장 주소, 업태/업종, 정산 계좌(은행, 계좌번호, 예금주), 세금계산서 이메일</p>
              <p><b>민감정보 (별도 동의):</b> 사업자등록증 사본, 통신판매업신고증, 대표자 신분증 사본(주민번호 뒷자리 마스킹 필수), 통장사본</p>
              <p><b>자동 수집:</b> 접속 IP, 접속 로그, 쿠키, 기기 정보</p>
              <p className="text-red-600 font-semibold">※ 주민등록번호는 수집하지 않습니다. 신분증 제출 시 뒷자리 6자리는 반드시 가림 처리해야 합니다.</p>
            </div>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold text-[16px]">2. 수집 및 이용 목적</h2>
            <ul className="mt-4 list-disc ml-5 space-y-2 opacity-80">
              <li>회원제 서비스 제공: 회원전용 풀필먼트 서비스 제공, 본인 확인, 사업자 진위 확인</li>
              <li>물류 서비스: 입고, 보관, 출고, 재고 관리, 배송</li>
              <li>정산 및 세무: 요금 정산, 세금계산서 발행, 현금영수증 발행</li>
              <li>고지 및 문의: 공지사항 전달, 민원 처리</li>
            </ul>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold text-[16px]">3. 보유 및 이용 기간</h2>
            <div className="mt-4 space-y-2 opacity-80">
              <p><b>승인 회원:</b> 회원 탈퇴 후 5년 보관 (전자상거래법, 세법) 후 파기. 단, 분쟁 대비를 위해 탈퇴 후 30일간은 별도 DB에 보관.</p>
              <p><b>미승인 회원:</b> 신청 후 30일 후 자동 파기</p>
              <p><b>서류:</b> 동일 기준. 단, 세법상 증빙 서류는 5년 보관 후 파기</p>
              <p><b>마케팅 동의:</b> 동의 철회 또는 탈퇴 시까지</p>
            </div>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold text-[16px]">4. 제3자 제공</h2>
            <p className="mt-4 opacity-80">원칙적으로 제3자에게 제공하지 않습니다. 단, 다음의 경우 예외:</p>
            <ul className="mt-2 list-disc ml-5 space-y-2 opacity-80">
              <li>택배사 (CJ대한통운 등): 수령인 이름, 주소, 연락처만 제공 (별도 동의 받음)</li>
              <li>법령에 따른 수사기관 요청</li>
            </ul>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold text-[16px]">5. 안전성 확보 조치</h2>
            <ul className="mt-4 list-disc ml-5 space-y-2 opacity-80">
              <li>암호화: 비밀번호는 bcrypt 암호화, 서류는 Supabase Storage AES-256 암호화 저장</li>
              <li>접근 제한: RLS 정책으로 본인 + 관리자(phankyu@gmail.com)만 조회 가능</li>
              <li>접속 기록: 모든 개인정보 조회는 로그로 기록</li>
              <li>마스킹: 신분증 주민번호 뒷자리 수집 금지, 가림 처리 후 업로드</li>
            </ul>
          </section>

          <section className="bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="font-bold text-[16px]">6. 정보주체의 권리</h2>
            <p className="mt-4 opacity-80 break-keep">언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 회원전용 dashboard {'>'} 설정에서 직접 하거나, 이메일(phankyu@gmail.com)로 요청하세요. 10일 이내 조치합니다.</p>
          </section>

          <section className="bg-black text-white rounded-[16px] p-6">
            <h2 className="font-bold text-[16px]">개인정보 보호 책임자</h2>
            <p className="mt-2 text-[13px] opacity-70">성명: 박한규 | 이메일: phankyu@gmail.com | 주소: 경기도 김포시 (FLEX CENTER)</p>
            <p className="mt-3 text-[11px] opacity-50">본 방침은 2026년 10월 27일부터 시행됩니다. 변경 시 7일 전 공지합니다.</p>
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
