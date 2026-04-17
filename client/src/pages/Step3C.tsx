/*
 * DESIGN: Structural Brutalism — Step 3-C: 영구채 세부 분석
 * Call option structure, step-up review, coupon deferral, human judgment
 */

import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";

export default function Step3C() {
  const [analysisNote, setAnalysisNote] = useState("");
  const [approveDecision, setApproveDecision] = useState<"approve" | "reject" | null>(null);
  const [signature, setSignature] = useState("");

  const copilotPanel = (
    <AICopilotPanel
      title="AI Copilot Analysis"
      subtitle="v1.2"
      citations={[
        {
          title: "CLAUSE 14.2 (DEFERRED INTEREST)",
          excerpt: '"발행인은 독자적인 재량에 따라 본 채권의 이자 지급을 무기한 연기할 수 있으며, 이는 채무불이행으로 간주되지 아니한다."',
        },
        {
          title: "CLAUSE 16.1 (STEP-UP)",
          excerpt: '"제 1회 초기상환기일 이후 매 이자지급일의 이자율은 연 100bps를 가산한 이자율로 조정한다."',
        },
      ]}
      recommendation="해당 채권은 K-IFRS 기준 자본 인정 요건(상환의무 부재)을 충족하는 것으로 분석됨."
      analysisLabel="분석 요청"
    />
  );

  return (
    <AppShell currentStep={3} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-xs text-[#5e5e5e] mb-2 font-medium">
          03-C &gt; 준비 &gt; 업로드/분류 &gt; 기본분석 &gt; <span className="font-bold text-[#000000]">구조분석</span> &gt; 종합판단 &gt; 보고서생성 &gt; 최종승인
        </div>

        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">영구채 세부 분석 <span className="text-xl font-bold">(Step 3-C)</span></h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5">Perpetual Bond Detailed Analysis: 영구채권의 특수한 구조적 위험과 자본 인정 요건을 심층 검토합니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Call Option Structure */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#5e5e5e]">loop</span>
              <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide">CALL OPTION STRUCTURE</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">행사 시점 (EXERCISE TIMING)</div>
                <div className="border border-[#777777] px-3 py-2 text-xs font-medium text-[#000000] bg-[#f9f9f9]">
                  발행일로부터 5년 후 매 이자지급일
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">조기상환 조건 (EARLY REDEMPTION)</div>
                <div className="border border-[#777777] px-3 py-2 text-xs text-[#1a1c1c] bg-[#f9f9f9] leading-relaxed">
                  Tax Event, Accounting Event 발생 시 전액 상환 가능
                </div>
              </div>
            </div>
          </div>

          {/* Step-Up Review */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#5e5e5e]">trending_up</span>
              <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide">STEP-UP REVIEW</h3>
            </div>
            <table className="w-full text-xs mb-3">
              <thead>
                <tr className="border-b border-[#e2e2e2]">
                  <th className="py-1.5 text-left text-[10px] font-bold text-[#5e5e5e]">Triggers</th>
                  <th className="py-1.5 text-right text-[10px] font-bold text-[#5e5e5e]">Hike (bps)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#f3f3f3]">
                  <td className="py-2 text-[#1a1c1c]">First Call Date</td>
                  <td className="py-2 text-right font-bold text-[#000000]">+100 bps</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#1a1c1c]">Rating Downgrade</td>
                  <td className="py-2 text-right font-bold text-[#000000]">+50 bps</td>
                </tr>
              </tbody>
            </table>
            <div className="border border-[#c6c6c6] bg-[#f3f3f3] px-3 py-2">
              <span className="text-[10px] font-bold text-[#5e5e5e]">Summary: </span>
              <span className="text-[10px] text-[#1a1c1c]">이자율 성형 조정 조건이 자본 인정 범위 내에 있음.</span>
            </div>
          </div>

          {/* Coupon Deferral Rules */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#5e5e5e]">receipt</span>
              <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide">COUPON DEFERRAL RULES</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "배당금 지급 시 제한", value: "Dividend Stopper 적용" },
                { label: "이자 누적 여부", value: "Cumulative" },
                { label: "언제 이자 발생", value: "연 5.0% 가산" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#5e5e5e]">{item.label}</span>
                  <span className="text-xs font-bold text-[#000000]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Memo */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#5e5e5e]">edit_note</span>
              <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide">ANALYSIS MEMO</h3>
            </div>
            <textarea
              value={analysisNote}
              onChange={(e) => setAnalysisNote(e.target.value)}
              className="w-full border border-[#777777] bg-[#f9f9f9] p-3 text-xs text-[#1a1c1c] placeholder-[#777777] outline-none focus:border-[#000000] resize-none"
              rows={5}
              placeholder="특이사항을 입력하세요..."
            />
          </div>
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
                {["자본성 인정 (Equity)", "부채로 분류 (Liability)", "조건부 인정 (Hybrid)"].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 flex-shrink-0 border border-[#777777]" />
                    <span className="text-xs text-[#1a1c1c]">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interest Deferral */}
            <div>
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">이자지급 정지 가능성</div>
              <div className="space-y-2">
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
        </div>

        {/* Human Judgment Board - Final Decision */}
        <div className="border border-[#c6c6c6] bg-[#f9f9f9] p-4 mb-5">
          <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">HUMAN JUDGMENT BOARD</h3>

          <div className="mb-3">
            <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-2">FINAL DECISION</div>
            <div className="flex gap-2">
              <button
                onClick={() => setApproveDecision("approve")}
                className={`px-6 py-2 text-sm font-bold transition-colors ${
                  approveDecision === "approve"
                    ? "bg-[#000000] text-[#ffffff]"
                    : "border border-[#777777] text-[#000000] hover:bg-[#f3f3f3]"
                }`}
              >
                APPROVE
              </button>
              <button
                onClick={() => setApproveDecision("reject")}
                className={`px-6 py-2 text-sm font-bold transition-colors ${
                  approveDecision === "reject"
                    ? "bg-[#ba1a1a] text-[#ffffff]"
                    : "border border-[#777777] text-[#000000] hover:bg-[#f3f3f3]"
                }`}
              >
                REJECT
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-2">APPROVAL SIGNATURE</div>
            <div className="border border-dashed border-[#777777] p-4 bg-[#ffffff] min-h-16">
              <input
                type="text"
                placeholder="Placeholder for Digital Signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full text-xs outline-none bg-transparent text-[#777777] placeholder-[#c6c6c6]"
              />
            </div>
            <p className="text-[10px] text-[#777777] mt-1.5">승인 시 분석 결과가 메인 대시보드에 즉시 반영됩니다.</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c6]">
          <Link href="/step3">
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 이전: 기본 분석
            </button>
          </Link>
          <button
            onClick={() => toast.success("영구채 분석이 완료되었습니다.")}
            className="px-6 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors"
          >
            APPROVE CASE
          </button>
        </div>
      </div>
    </AppShell>
  );
}
