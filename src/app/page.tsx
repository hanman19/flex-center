import Link from "next/link";
import Image from "next/image";

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
            <Link href="/pricing" className="text-[13px] px-4 py-2 rounded-full border border-black/10 hover:bg-black hover:text-white transition">요금제</Link>
            <Link href="/dashboard" className="text-[13px] px-4 py-2 rounded-full bg-black text-white hover:bg-zinc-800 transition">회원전용 →</Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
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
                <Link href="/pricing" className="bg-black text-white px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
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

        {/* Company Intro */}
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
                    합포장 3개 무료, 바코드 라벨링 무료, 박스+완충재+인쇄 무료. 숨겨진 비용 0원.
                  </p>
                </div>
              </div>
              <div className="mt-4 relative aspect-[16/9] rounded-[20px] overflow-hidden bg-black/5 border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                <Image src="/fulfillment-2.jpg" alt="Packing" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* How it works + Small business */}
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

        {/* Pricing Preview */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 pt-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] tracking-widest opacity-30">PRICING PREVIEW</p>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight mt-3">요금제</h2>
              <p className="text-[13px] opacity-60 mt-2">필요한 만큼만, 투명하게.</p>
            </div>
            <Link href="/pricing" className="text-[13px] border-b border-black/20 hover:border-black pb-1 transition">전체 6개 플랜 보기 →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {name:"STARTER", price:"26,900원", desc:"월 10건 · 선반 1개"},
              {name:"LITE", price:"149,000원", desc:"월 100건 · 파렛트 1개", popular:true},
              {name:"STANDARD", price:"599,000원", desc:"월 500건 · 파렛트 5개"},
            ].map((p)=>(
              <Link key={p.name} href="/pricing" className={`group bg-white border rounded-[20px] p-6 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all ${p.popular ? 'border-blue-600/30 shadow-[0_8px_30px_rgba(37,99,235,0.12)]' : 'border-black/5'}`}>
                <div className="flex justify-between">
                  <span className="text-[11px] tracking-widest font-semibold opacity-40">{p.name}</span>
                  {p.popular && <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full">MOST POPULAR</span>}
                </div>
                <p className="text-[22px] font-bold tracking-tight mt-3 group-hover:scale-105 transition-transform origin-left">{p.price}</p>
                <p className="text-[12px] opacity-50 mt-1">{p.desc}</p>
                <p className="text-[11px] mt-4 opacity-0 group-hover:opacity-60 transition-opacity">클릭해서 전체 보기 →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-32">
          <div className="bg-black text-white rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight leading-[0.95] break-keep">지금 시작하면,<br/>내일부터 출고.</h2>
              <p className="text-[13px] opacity-60 mt-3 break-keep">사업자 정보만 입력하면 바로 시작. 김포 물류센터에서 안전하게.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/pricing" className="bg-white text-black px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-zinc-100 transition">요금제 보기</Link>
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
