import Link from "next/link";
import Image from "next/image";

const PLANS = [
  { id: "STARTER", name: "STARTER", quota: "월 10건", price: "26,900", over: "1,600원", range: "11-100건", switchText: "87건부터 LITE가 더 저렴", storage: "선반 1개", size: "300×450×250 / 1 SKU", badge: "BETA" },
  { id: "LITE", name: "LITE", quota: "월 100건", price: "149,000", over: "1,400원", range: "101-500건", switchText: "421건부터 STANDARD가 더 저렴", storage: "파렛트 1개", size: "1.1×1.1×1.8m", badge: "ORIGINAL", popular: true },
  { id: "STANDARD", name: "STANDARD", quota: "월 500건", price: "599,000", over: "1,200원", range: "501-1000건", switchText: "993건부터 GOLD가 더 저렴", storage: "파렛트 5개", size: "" },
  { id: "GOLD", name: "GOLD", quota: "월 1,000건", price: "1,190,000", over: "1,150원", range: "1001-3000건", switchText: "2,826건부터 PLATINUM이 더 저렴", storage: "파렛트 10개", size: "" },
  { id: "PLATINUM", name: "PLATINUM", quota: "월 3,000건", price: "3,290,000", over: "1,100원", range: "3001-5000건", switchText: "4,871건부터 VIP가 더 저렴", storage: "파렛트 25개", size: "" },
  { id: "VIP", name: "VIP", quota: "월 5,000건", price: "5,349,000", over: "1,050원", range: "5001건~", switchText: "대량 협의·규모 경제", storage: "파렛트 40개", size: "" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111]">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div>
            <span className="font-semibold tracking-tight">FLEX CENTER</span>
            <span className="ml-2 text-[10px] bg-black/5 px-2 py-1 rounded-full hidden md:inline">GIMPO · MICRO FULFILLMENT</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="#pricing" className="text-[13px] px-4 py-2 rounded-full border border-black/10 hover:bg-black hover:text-white transition">요금제</Link>
            <Link href="/dashboard" className="text-[13px] px-4 py-2 rounded-full bg-black text-white hover:bg-zinc-800 transition">회원전용 →</Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO - AI 이미지 포함 원본 복구 */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 pt-12 md:pt-20">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 text-[11px] tracking-widest border border-black/10 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                MICRO FULFILLMENT CENTER · GIMPO
              </div>
              <h1 className="text-[38px] md:text-[64px] font-[800] tracking-[-0.04em] leading-[0.9] mt-6">
                작은 브랜드를 위한<br/>
                <span className="opacity-20">큰 물류.</span>
              </h1>
              <p className="text-[16px] md:text-[18px] opacity-60 mt-6 max-w-[480px] leading-relaxed break-keep">
                집이 창고가 되었다면, 이제 맡기세요.<br/>
                보관, 피킹, 포장, 출고까지 월 구독 한 번으로 끝.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="#pricing" className="bg-black text-white px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                  요금제 보기 →
                </Link>
                <Link href="/dashboard" className="bg-white border border-black/10 px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-black hover:text-white transition-all">
                  회원전용 입장
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 text-[12px]">
                <div><p className="font-bold text-[20px]">500+</p><p className="opacity-50">출고 처리</p></div>
                <div className="w-px h-8 bg-black/10"></div>
                <div><p className="font-bold text-[20px]">99.2%</p><p className="opacity-50">정확도</p></div>
                <div className="w-px h-8 bg-black/10"></div>
                <div><p className="font-bold text-[20px]">당일</p><p className="opacity-50">출고</p></div>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-black/5 border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                <Image src="/fulfillment-1.jpg" alt="Flex Center Micro Fulfillment" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Company Intro - 이미지 포함 */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 pt-20 md:pt-32">
          <div className="grid md:grid-cols-12 gap-8 border-t border-black/5 pt-12">
            <div className="md:col-span-5">
              <p className="text-[11px] tracking-widest opacity-30">ABOUT FLEX CENTER</p>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight leading-[0.95] mt-4 break-keep">
                소규모 셀러를 위해<br/>만든 물류.
              </h2>
              <p className="text-[14px] opacity-60 mt-6 leading-relaxed break-keep">
                대형 3PL은 월 1000건 이상만 받습니다.<br/>
                우리는 월 10건부터 시작합니다.<br/>
                작은 브랜드가 커질 때까지 함께합니다.
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-black/5 rounded-[20px] p-7">
                  <h3 className="font-semibold text-[14px]">왜 Flex Center?</h3>
                  <p className="text-[13px] opacity-60 mt-3 leading-relaxed break-keep">
                    집이 창고가 되어버린 사장님들. 재고 관리하느라 밤새는 사장님들을 위해 만들었습니다.
                  </p>
                </div>
                <div className="bg-white border border-black/5 rounded-[20px] p-7">
                  <h3 className="font-semibold text-[14px]">어떻게 다르죠?</h3>
                  <p className="text-[13px] opacity-60 mt-3 leading-relaxed break-keep">
                    합포장 3개 무료, 바코드 라벨링 무료, 박스+완충재+인쇄 무료. 추가 비용 없이 투명하게.
                  </p>
                </div>
              </div>
              <div className="mt-4 relative aspect-[16/9] rounded-[20px] overflow-hidden bg-black/5 border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                <Image src="/fulfillment-2.jpg" alt="Packing" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* How it works + Small business image */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 pt-20">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <p className="text-[11px] tracking-widest opacity-30">HOW IT WORKS</p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                {[
                  {step:"01", title:"입고", desc:"택배로 보내기만 하세요. 검수 후 선반/파렛트에 보관."},
                  {step:"02", title:"주문 연동", desc:"카페24, 스마트스토어 자동 연동. 주문 들어오면 바로 피킹."},
                  {step:"03", title:"출고", desc:"포장부터 송장까지 당일 출고. 배송조회 문자 자동 발송."},
                ].map((s)=>(
                  <div key={s.step} className="bg-white border border-black/5 rounded-[20px] p-7 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                    <p className="text-[11px] font-bold tracking-widest opacity-20">{s.step}</p>
                    <h3 className="font-semibold text-[18px] mt-2">{s.title}</h3>
                    <p className="text-[13px] opacity-60 mt-2 leading-relaxed break-keep">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-black/5 border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                <Image src="/fulfillment-3.jpg" alt="Small Business Owner" fill className="object-cover" />
              </div>
              <div className="mt-3 bg-black text-white rounded-full px-4 py-2 inline-flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                방금 12건 출고 완료 · 실시간 알림
              </div>
            </div>
          </div>
        </section>

        {/* Pricing - 건당 단가 삭제 버전! */}
        <section id="pricing" className="max-w-[1200px] mx-auto px-6 md:px-8 pt-20 md:pt-32">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] tracking-widest opacity-30">PRICING</p>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight mt-3">필요한 만큼만,<br/>투명하게.</h2>
              <p className="text-[13px] opacity-60 mt-3">합포장 3개, 바코드 라벨링, 박스+완충재+인쇄까지 모두 포함.</p>
            </div>
            <Link href="/pricing" className="text-[13px] border-b border-black/20 hover:border-black pb-1 transition hidden md:block">전체 요금제 자세히 보기 →</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {PLANS.slice(0,3).map((p)=>(
              <div key={p.id} className={`group bg-white border rounded-[24px] p-6 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all ${p.popular ? 'border-blue-600/30 shadow-[0_8px_30px_rgba(37,99,235,0.12)] pt-8 relative' : 'border-black/5'}`}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-blue-600 text-white px-3 py-1 rounded-full font-black tracking-widest">MOST POPULAR</span>}
                <div className="flex items-start justify-between">
                  <div><span className="text-[11px] tracking-widest font-semibold opacity-40">{p.name}</span>{p.badge && <span className="ml-2 text-[9px] bg-black text-white px-2 py-0.5 rounded-full">{p.badge}</span>}<p className="text-[11px] opacity-50 mt-1">{p.quota}</p></div>
                  <div className="text-right"><span className="text-[11px] bg-black/5 px-2.5 py-1 rounded-full font-bold">{p.storage}</span></div>
                </div>
                <p className="text-[28px] font-black tracking-tight mt-5">{p.price}<span className="text-[13px] font-normal opacity-40"> 원 / 월</span></p>
                <p className="text-[11px] opacity-50 mt-1">{p.size}</p>
                <div className="mt-5 space-y-2 text-[12px]"><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>합포장 3개 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>바코드 라벨링 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>일반 포장 무료</p></div>
                <div className="mt-5 bg-[#fafaf8] border border-black/5 rounded-[12px] p-3"><p className="text-[10px] opacity-40">초과 건당</p><p className="text-[12px] font-bold mt-1">{p.over} ({p.range})</p><p className="text-[10px] opacity-40 mt-1">{p.switchText}</p></div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {PLANS.slice(3).map((p)=>(
              <div key={p.id} className="bg-white border border-black/5 rounded-[24px] p-6 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
                <div className="flex items-start justify-between"><div><span className="text-[11px] tracking-widest font-semibold opacity-40">{p.name}</span><p className="text-[11px] opacity-50 mt-1">{p.quota}</p></div><span className="text-[11px] bg-black/5 px-2.5 py-1 rounded-full font-bold">{p.storage}</span></div>
                <p className="text-[28px] font-black tracking-tight mt-5">{p.price}<span className="text-[13px] font-normal opacity-40"> 원 / 월</span></p>
                <div className="mt-5 space-y-2 text-[12px] opacity-60"><p>✓ 합포장 3개 무료</p><p>✓ 바코드 라벨링 무료</p><p>✓ 일반 포장 무료</p></div>
                <div className="mt-5 bg-[#fafaf8] border border-black/5 rounded-[12px] p-3"><p className="text-[10px] opacity-40">초과 건당</p><p className="text-[12px] font-bold mt-1">{p.over} ({p.range})</p><p className="text-[10px] opacity-40 mt-1">{p.switchText}</p></div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center"><Link href="/pricing" className="text-[13px] bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-zinc-800 transition">전체 요금제 비교표 보기 →</Link></div>
        </section>

        {/* CTA */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-32">
          <div className="bg-black text-white rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight leading-[0.95] break-keep">지금 시작하면,<br/>내일부터 출고.</h2>
              <p className="text-[13px] opacity-60 mt-3 break-keep">사업자 정보만 입력하면 바로 시작. 김포 물류센터에서 안전하게.</p>
            </div>
            <div className="flex gap-3">
              <Link href="#pricing" className="bg-white text-black px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-zinc-100 transition">요금제 보기</Link>
              <Link href="/dashboard" className="bg-white/10 text-white border border-white/20 px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-white/20 transition">회원전용 입장 →</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between gap-4 text-[11px] opacity-40">
          <p>FLEX CENTER · Micro Fulfillment · Gimpo, Korea · 회원전용 물류센터</p>
          <p>© 2026 Flex Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
