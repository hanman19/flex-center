import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div>
              <span className="font-semibold tracking-tight">FLEX CENTER</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-[13px] opacity-60">
              <Link href="/pricing" className="hover:opacity-100 transition">요금제</Link>
              <span className="opacity-30">물류 시스템</span>
              <span className="opacity-30">고객센터</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/pricing" className="hidden md:block text-[13px] px-4 py-2 rounded-full border border-black/10 hover:bg-black hover:text-white transition">요금제 보기</Link>
            <Link href="/dashboard" className="text-[13px] px-4 py-2 rounded-full bg-black text-white hover:bg-zinc-800 transition">내 창고 →</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Hero */}
        <div className="pt-20 md:pt-32 pb-16">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-widest border border-black/10 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            3PL 풀필먼트 · 김포
          </div>
          
          <h1 className="text-[40px] md:text-[72px] font-[800] tracking-[-0.04em] leading-[0.9] mt-8">
            풀필먼트,<br/>
            <span className="opacity-20">복잡할 필요 없다.</span>
          </h1>
          
          <p className="text-[16px] md:text-[18px] opacity-60 mt-8 max-w-[520px] leading-relaxed">
            보관부터 출고까지. 월 구독 한 번으로 끝.<br/>
            합포장, 바코드, 포장재 모두 포함된 투명한 가격.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link href="/pricing" className="bg-black text-white px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              요금제 보기 →
            </Link>
            <Link href="/dashboard" className="bg-white border border-black/10 px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-black hover:text-white hover:border-black transition-all">
              내 창고 들어가기
            </Link>
          </div>

          {/* Quick Pricing Preview */}
          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {name:"STARTER", price:"26,900원", desc:"월 10건 · 선반 1개", popular:false},
              {name:"LITE", price:"149,000원", desc:"월 100건 · 파렛트 1개", popular:true},
              {name:"STANDARD", price:"599,000원", desc:"월 500건 · 파렛트 5개", popular:false},
            ].map((p)=>(
              <Link key={p.name} href="/pricing" className={`group bg-white border rounded-[20px] p-6 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all ${p.popular ? 'border-blue-600/30 shadow-[0_8px_30px_rgba(37,99,235,0.12)]' : 'border-black/5'}`}>
                <div className="flex justify-between items-start">
                  <span className="text-[11px] tracking-widest font-semibold opacity-40">{p.name}</span>
                  {p.popular && <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full tracking-widest">MOST POPULAR</span>}
                </div>
                <p className="text-[22px] font-bold tracking-tight mt-3 group-hover:scale-105 transition-transform origin-left">{p.price}</p>
                <p className="text-[12px] opacity-50 mt-1">{p.desc}</p>
                <p className="text-[11px] mt-4 opacity-0 group-hover:opacity-60 transition-opacity">클릭해서 전체 보기 →</p>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center md:text-left">
            <Link href="/pricing" className="inline-flex items-center gap-2 text-[13px] opacity-60 hover:opacity-100 border-b border-black/20 hover:border-black pb-1 transition-all">
              전체 6개 플랜 비교하기 →
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-black/5 py-20 grid md:grid-cols-3 gap-8">
          {[
            {title:"보관은 필요한 만큼", desc:"선반 1개부터 파렛트 40개까지. 초과 시에도 합리적인 추가비용만."},
            {title:"숨겨진 비용 없음", desc:"합포장 3개, 바코드 라벨링, 박스+완충재+인쇄까지 모두 포함."},
            {title:"야간·주말 투명하게", desc:"평일 09-18시는 포함. 연장·야간·휴일은 +300~600원, 정해진 기준대로만."},
          ].map((f)=>(
            <div key={f.title} className="bg-white border border-black/5 rounded-[20px] p-7">
              <h3 className="font-semibold text-[15px]">{f.title}</h3>
              <p className="text-[13px] opacity-60 mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pb-32 pt-12">
          <div className="bg-black text-white rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight leading-[0.95]">지금 시작하면,<br/>내일부터 출고.</h2>
              <p className="text-[13px] opacity-60 mt-3">사업자 정보만 입력하면 바로 시작. 김포 물류센터에서 안전하게.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/pricing" className="bg-white text-black px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-zinc-100 transition">요금제 보기</Link>
              <Link href="/onboarding" className="bg-white/10 text-white border border-white/20 px-7 py-4 rounded-full text-[14px] font-semibold hover:bg-white/20 transition">입점 신청 →</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
