/*
 * DESIGN: Structural Brutalism — Step 5-6: 보고서 작성 및 승인
 * Report outline, risk summary, investment conditions, post-management, approval
 */

import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";

export default function Step56Report() {
  const [judgmentNote, setJudgmentNote] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="보고서 작성 지원"
      citations={[
        {
          title: "문장 자동 완성 제안",
          excerpt: '"발행사의 시장 점유율 확대로 인해 장기적인 채무 상환 능력은 침전적으로..."',
        },
        {
          title: "문장 자동 완성 제안",
          excerpt: '"해당 업종의 경기 순환 주기를 고려할 때, 2025년 성반기까지의 리스크 관련하여..."',
        },
      ]}
      recommendation="보고서 초안 검토 완료. 승인 준비 상태입니다."
      analysisLabel="보고서 초안 생성"
      extraActions={[{ label: "템플릿 불러오기" }]}
    />
  );

  return (
    <AppShell currentStep={5} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-7">
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Step 05-06</div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">보고서 작성 및 승인</h1>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Report Outline + Submission Readiness */}
          <div className="space-y-5">
            {/* Report Outline */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">REPORT OUTLINE</div>
              <div className="space-y-1.5">
                {[
                  { label: "리스크 요약", icon: "warning", active: true },
                  { label: "투자 조건", icon: "attach_money", active: true },
                  { label: "이자율 및 만기", icon: "schedule", indent: true },
                  { label: "사후 관리", icon: "manage_history", active: true },
                  { label: "총합 의견", icon: "summarize", active: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-[#f3f3f3] transition-colors ${item.indent ? "pl-6" : ""}`}
                    onClick={() => toast.info("준비 중인 기능입니다.")}
                  >
                    <span className="material-symbols-outlined text-[14px] text-[#5e5e5e]">{item.icon}</span>
                    <span className={`text-xs ${item.active ? "text-[#000000] font-medium" : "text-[#777777]"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Readiness */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">SUBMISSION READINESS</div>
              <div className="space-y-2">
                {[
                  { label: "모든 분석 완료", done: true },
                  { label: "증빙 서류 대칭", done: true },
                  { label: "오타 및 시식 검사", done: false },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-4 h-4 flex-shrink-0 flex items-center justify-center ${item.done ? "bg-[#000000]" : "border border-[#777777]"}`}>
                      {item.done && <span className="material-symbols-outlined text-[11px] text-[#ffffff]">check</span>}
                    </div>
                    <span className={`text-xs ${item.done ? "text-[#1a1c1c] font-medium" : "text-[#777777]"}`}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Approval Status */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">APPROVAL STATUS</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5e5e5e]">Status:</span>
                  <span className={`text-xs font-bold ${approvalStatus === "approved" ? "text-[#000000]" : approvalStatus === "rejected" ? "text-[#ba1a1a]" : "text-[#5e5e5e]"}`}>
                    {approvalStatus === "approved" ? "APPROVED" : approvalStatus === "rejected" ? "REJECTED" : "PENDING"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5e5e5e]">Approver:</span>
                  <span className="text-xs font-bold text-[#000000]">김철수 상무</span>
                </div>
                <div className="text-[10px] text-[#777777]">Last Modified: 2024.10.27 15:45:12</div>
              </div>
            </div>
          </div>

          {/* Center: Report Sections */}
          <div className="col-span-2 space-y-5">
            {/* Risk Summary Section */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#000000]">리스크 요약 섹션</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#e2e2e2] text-[#000000]">AI SUMMARIZED</span>
              </div>
              <div className="border border-[#c6c6c6] bg-[#f9f9f9] p-3">
                <p className="text-xs text-[#3a3c3c] leading-relaxed">
                  [AI 추천 요약] 본 자산은 발행사의 현금 흐름 안정성이 높으나, 매크로 환경 변화에 따른 금리 변동 리스크가 존재함. 과거 3년 데이터 기준 상환 지연 사례 없음. LTV 60% 수준으로 담보 안정성 확보됨.
                </p>
              </div>
            </div>

            {/* Investment Conditions */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <h3 className="text-sm font-bold text-[#000000] mb-3">투자 조건요약 섹션</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "RATE (이자율)", value: "5.25% (Fixed)" },
                  { label: "MATURITY (만기)", value: "36 Months" },
                  { label: "COLLATERAL (담보)", value: "Real Estate (Grade A)" },
                ].map((item) => (
                  <div key={item.label} className="border border-[#e2e2e2] p-3">
                    <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">{item.label}</div>
                    <div className="text-sm font-bold text-[#000000]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post-Management Criteria */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <h3 className="text-sm font-bold text-[#000000] mb-3">사후 관리기준 섹션</h3>
              <table className="w-full text-xs">
                <tbody>
                  {[
                    { label: "분기별 모니터링", value: "매 분기 15일 이내" },
                    { label: "신용등급 변동 트리거", value: "BBB+ 이하 하향 시 즉시 보고" },
                    { label: "LTV 재평가", value: "매 6개월 수기" },
                  ].map((item) => (
                    <tr key={item.label} className="border-b border-[#f3f3f3]">
                      <td className="py-2 text-[#5e5e5e] font-medium w-1/2">{item.label}</td>
                      <td className="py-2 text-[#000000] font-bold">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Conditional Approval List */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <h3 className="text-sm font-bold text-[#000000] mb-3">조건부 승인요건 리스트</h3>
              <div className="space-y-2">
                {[
                  "최종 실행 전 법률 심사 보고서 보완 완료",
                  "특수 관계인 연대보증인 인감 증명서 수취",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 border border-[#e2e2e2] p-3">
                    <span className="text-xs font-black text-[#5e5e5e] flex-shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="text-xs text-[#1a1c1c]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Result Record + Notification */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">RESULT RECORD</div>
                <div className="bg-[#f3f3f3] border border-[#e2e2e2] p-2 font-mono text-[10px] text-[#3a3c3c] leading-relaxed">
                  SYSTEM LOG<br />
                  [2024-10-27 14:22]:<br />
                  OUTCOME: BOND_ISSUANCE_CONFIRMED<br />
                  FINAL_SCORE: 88/100<br />
                  TX_HASH: 0x8a2...3f9c
                </div>
              </div>

              <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">NOTIFICATION HISTORY</div>
                <div className="space-y-2">
                  {[
                    { label: "발행사 이메일 발송", status: "SENT", ok: true },
                    { label: "승인자 내부 알림", status: "DELIVERED", ok: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-[10px] text-[#5e5e5e]">{item.label}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold ${item.ok ? "bg-[#000000] text-[#ffffff]" : "border border-[#777777] text-[#5e5e5e]"}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Judgment Board */}
            <div className="border-2 border-[#000000] p-4">
              <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">JUDGMENT BOARD</h3>
              <textarea
                value={judgmentNote}
                onChange={(e) => setJudgmentNote(e.target.value)}
                className="w-full border border-[#777777] bg-[#f9f9f9] p-3 text-xs text-[#1a1c1c] placeholder-[#777777] outline-none focus:border-[#000000] resize-none mb-3"
                rows={3}
                placeholder="최종 검토 의견을 입력하세요..."
              />
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => { setApprovalStatus("approved"); toast.success("승인이 완료되었습니다."); }}
                  className="flex-1 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors"
                >
                  최종 편집 완료
                </button>
                <button
                  onClick={() => { setApprovalStatus("approved"); toast.success("승인 준비가 확인되었습니다."); }}
                  className="flex-1 py-2.5 border border-[#777777] text-sm font-bold text-[#000000] hover:bg-[#f3f3f3] transition-colors"
                >
                  승인준비 확인
                </button>
              </div>
              <button
                onClick={() => { setApprovalStatus("approved"); toast.success("결과가 기록되었습니다."); }}
                className="w-full py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors"
              >
                결과 기록 확정
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#c6c6c6]">
          <Link href="/step4">
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 이전: 구조 분석/판단
            </button>
          </Link>
          <button
            onClick={() => toast.success("최종 승인이 완료되었습니다. 사건이 종결됩니다.")}
            className="px-6 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors"
          >
            최종 승인 완료 →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
