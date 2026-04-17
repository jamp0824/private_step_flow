/*
 * DESIGN: Structural Brutalism — Step 3-B: 후순위채 세부 분석
 * Senior/subordinated debt stack, LTV analysis, recovery structure
 */

import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";

export default function Step3B() {
  const [memo, setMemo] = useState("");
  const [signature, setSignature] = useState("");
  const [equityChecked, setEquityChecked] = useState(false);
  const [liabilityChecked, setLiabilityChecked] = useState(false);
  const [hybridChecked, setHybridChecked] = useState(false);

  const copilotPanel = (
    <AICopilotPanel
      title="AI COPILOT"
      subtitle="실시간 분석 지원"
      citations={[
        {
          title: "Section 4.2 of Loan Agreement",
          excerpt: '"Subordinated lender acknowledges that 1st lien has preference in all liquidation proceeds..."',
        },
        {
          title: "Payment Waterfall Annex",
          excerpt: "Interest coverage threshold: 1.25x",
          highlight: "Interest coverage threshold: 1.25x",
        },
      ]}
      recommendation="후순위 리스크 가중치 상향 조정을 권고합니다. (+0.2%p)"
      analysisLabel="분석 요청"
      extraActions={[{ label: "AI에게 질문하기" }]}
    />
  );

  return (
    <AppShell currentStep={3} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-xs text-[#5e5e5e] mb-2 font-medium">
          준비 &gt; 업로드/분류 &gt; 기본분석 &gt; <span className="font-bold text-[#000000]">구조분석</span> &gt; 종합판단 &gt; 보고서생성 &gt; 최종승인
        </div>

        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">03-B. 후순위채 세부 분석</h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5">후순위 구조의 리스크와 회수 가능성을 심층 검토합니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Debt Stack */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">선·후순위 대출 스택</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-[#000000] text-[#ffffff] px-3 py-2.5">
                <span className="text-xs font-bold">SENIOR DEBT (선순위)</span>
                <span className="text-sm font-black">65.0%</span>
              </div>
              <div className="flex items-center justify-between bg-[#e2e2e2] border border-[#777777] px-3 py-2.5">
                <span className="text-xs font-bold text-[#000000]">SUBORDINATED (후순위)</span>
                <span className="text-sm font-black text-[#000000]">20.0%</span>
              </div>
              <div className="flex items-center justify-between border border-[#c6c6c6] px-3 py-2 bg-[#f9f9f9]">
                <span className="text-xs text-[#777777]">EQUITY / MEZZANINE (15.0%)</span>
              </div>
            </div>
          </div>

          {/* Senior Debt Ratio */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">선순위 부채 비율 분석</h3>
            <div className="text-4xl font-black text-[#000000] tracking-tight mb-1">4.2x</div>
            <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-3">DEBT SERVICE COVERAGE RATIO</div>
            <div className="h-2 bg-[#e2e2e2] mb-1">
              <div className="h-2 bg-[#000000]" style={{ width: "68%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#777777]">
              <span>SAFE ZONE</span>
              <span>LTV 68%</span>
            </div>
          </div>

          {/* Variable Rate Check */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">가산 금리 적정성 검토</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-[#777777] mb-0.5">Market Premium</div>
                <div className="text-xl font-black text-[#000000]">+2.45%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#777777] mb-0.5">Assessed Risk</div>
                <div className="text-xl font-black text-[#000000]">+2.80%</div>
              </div>
            </div>
            <div className="mt-3 border border-[#ba1a1a] bg-[#fff5f5] px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#ba1a1a] uppercase">GAP ANALYSIS</span>
                <span className="text-sm font-black text-[#ba1a1a]">-0.35% (Warning)</span>
              </div>
            </div>
          </div>

          {/* Loss Absorption */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">손실 흡수 구조</h3>
            <p className="text-xs text-[#3a3c3c] leading-relaxed mb-3">
              본 채권은 워터폴(Waterfall) 상 선순위 원리금 상환 완료 후 잔여 채원에서 상환되는 구조를 가짐. 담보가치 하락 시 후순위 리스크가 우선적으로 손실을 흡수하며, 현재 완충력은 약 15% 수준으로 판단됨.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#000000]">shield</span>
              <span className="text-[10px] font-bold text-[#000000]">RECOVERY BUFFER ADEQUATE</span>
            </div>
          </div>
        </div>

        {/* Recovery Priority Table */}
        <div className="border border-[#c6c6c6] bg-[#ffffff] mb-5">
          <div className="px-4 py-3 border-b border-[#c6c6c6] bg-[#f3f3f3]">
            <h3 className="text-xs font-bold text-[#000000] uppercase tracking-wide">회수 순위 분석</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e2e2]">
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">RANK</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">CAPITAL TYPE</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">PRIORITY SCORE</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">COLLATERAL RIGHTS</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: "01", type: "Senior Bank Loan", score: "9.8/10", rights: "1st Lien Mortgage", highlight: false },
                { rank: "02", type: "Subordinated Note (Target)", score: "4.2/10", rights: "Junior Lien", highlight: true },
                { rank: "03", type: "Preferred Equity", score: "2.1/10", rights: "Unsecured", highlight: false },
              ].map((row) => (
                <tr key={row.rank} className={`border-b border-[#e2e2e2] ${row.highlight ? "bg-[#f3f3f3]" : "hover:bg-[#f9f9f9]"}`}>
                  <td className="px-4 py-3 text-xs font-bold text-[#5e5e5e]">{row.rank}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${row.highlight ? "font-bold underline" : ""}`}>{row.type}</td>
                  <td className="px-4 py-3 text-xs font-bold">{row.score}</td>
                  <td className="px-4 py-3 text-xs text-[#5e5e5e]">{row.rights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Human Judgment Board */}
        <div className="border-2 border-[#000000] p-5 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-0.5 bg-[#000000] text-[#ffffff] text-[10px] font-bold uppercase">HUMAN REVIEW</span>
            <h3 className="text-base font-black text-[#000000]">종합 판단 (PROFESSIONAL JUDGMENT)</h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Capital Classification */}
            <div>
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">자본 인정 여부 판단</div>
              <div className="space-y-2">
                {[
                  { label: "자본성 인정 (Equity)", checked: equityChecked, onChange: setEquityChecked },
                  { label: "부채로 분류 (Liability)", checked: liabilityChecked, onChange: setLiabilityChecked },
                  { label: "조건부 인정 (Hybrid)", checked: hybridChecked, onChange: setHybridChecked },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`w-4 h-4 flex-shrink-0 flex items-center justify-center border ${item.checked ? "bg-[#000000] border-[#000000]" : "border-[#777777]"}`}
                      onClick={() => item.onChange(!item.checked)}
                    >
                      {item.checked && <span className="material-symbols-outlined text-[11px] text-[#ffffff]">check</span>}
                    </div>
                    <span className="text-xs text-[#1a1c1c]">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interest Deferral */}
            <div>
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">이자지급 정지 가능성</div>
              <div className="space-y-1.5">
                {["운영 펀드흐름 악화 리스크", "배당 제한에 따른 평판 리스크", "회계식 임계선 도달 여부"].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 flex-shrink-0 border border-[#777777]" />
                    <span className="text-xs text-[#1a1c1c]">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exit Strategy */}
            <div>
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">회수 전략 (Exit Strategy)</div>
              <select className="w-full border border-[#777777] px-3 py-2 text-xs outline-none focus:border-[#000000] bg-[#ffffff] mb-2">
                <option>Call Option 행사 기대</option>
                <option>만기 상환</option>
                <option>조기 상환 협의</option>
              </select>
              <p className="text-[10px] text-[#777777] leading-relaxed">
                행사 시점의 금리 환경과 발행사의 신용 등급을 고려한 판단이 필요합니다.
              </p>
            </div>
          </div>

          {/* Memo */}
          <div className="mt-4">
            <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">검토자 메모</div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-[#777777] bg-[#ffffff] p-3 text-xs text-[#1a1c1c] placeholder-[#777777] outline-none focus:border-[#000000] resize-none"
              rows={3}
              placeholder="후순위 구조에 대한 검토 의견을 입력하세요..."
            />
          </div>

          {/* Adequacy Check */}
          <div className="mt-4 border border-[#c6c6c6] p-3 bg-[#f9f9f9]">
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="w-4 h-4 flex-shrink-0 border border-[#777777] mt-0.5" />
              <span className="text-xs text-[#1a1c1c]">본 후순위 채권의 리스크가 가산 금리 대비 적정함을 수동 확인합니다.</span>
            </label>
          </div>

          {/* Signature */}
          <div className="mt-4">
            <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">SIGNATURE PLACEHOLDER</div>
            <input
              type="text"
              placeholder="Sign here..."
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full border border-dashed border-[#777777] px-3 py-2 text-xs outline-none focus:border-[#000000] bg-[#ffffff]"
            />
          </div>

          {/* Submit */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => toast.success("최종 분석 결과가 제출되었습니다.")}
              className="px-6 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors"
            >
              최종 분석 결과 제출
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c6]">
          <Link href="/step3">
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 이전: 기본 분석
            </button>
          </Link>
          <Link href="/step4">
            <button className="px-6 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors">
              다음 단계: 구조 분석/판단 →
            </button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
