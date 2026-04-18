/*
 * DESIGN: Structural Brutalism — Step 3-C: 영구채 세부 분석
 * Analysis-only branch output screen
 */

import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { STAGE_ROUTE_MAP } from "@/config/stages";
import { useWorkflow } from "@/contexts/WorkflowContext";

export default function Step3C() {
  const [, navigate] = useLocation();
  const { state, markBranchAnalysisReady } = useWorkflow();

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="영구채 구조 분석"
      citations={[
        {
          title: "영구채 약정서",
          excerpt: "콜옵션, 스텝업, 이자지급 연기 조항이 모두 확인되었습니다.",
        },
      ]}
      recommendation="인간 판단이 필요한 영구채 특화 포인트는 Stage 4에서 확정하십시오."
      analysisLabel="브랜치 분석 갱신"
    />
  );

  return (
    <AppShell currentStage={3} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Stage 3. Perpetual Branch Analysis</div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">영구채 세부 분석</h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5">콜옵션, 스텝업, 이자지급 정지 구조를 정리하고 Stage 4로 전달합니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">CALL OPTION STRUCTURE</h3>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">행사 시점</div>
                <div className="border border-[#777777] px-3 py-2 text-xs font-medium text-[#000000] bg-[#f9f9f9]">발행일로부터 5년 후 매 이자지급일</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">조기상환 조건</div>
                <div className="border border-[#777777] px-3 py-2 text-xs text-[#1a1c1c] bg-[#f9f9f9]">Tax Event, Accounting Event 발생 시 전액 상환 가능</div>
              </div>
            </div>
          </div>

          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">STEP-UP REVIEW</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#e2e2e2]">
                  <th className="py-1.5 text-left text-[10px] font-bold text-[#5e5e5e]">Trigger</th>
                  <th className="py-1.5 text-right text-[10px] font-bold text-[#5e5e5e]">Hike</th>
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
          </div>

          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">COUPON DEFERRAL RULES</h3>
            <div className="space-y-2.5">
              {[
                { label: "배당금 지급 시 제한", value: "Dividend Stopper" },
                { label: "이자 누적 여부", value: "Cumulative" },
                { label: "스텝업 조건", value: "연 100bps 가산" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#5e5e5e]">{item.label}</span>
                  <span className="text-xs font-bold text-[#000000]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">ANALYSIS NOTE</h3>
            <div className="border border-[#e2e2e2] bg-[#f9f9f9] p-3 text-xs text-[#1a1c1c] leading-relaxed">
              자본 인정 가능성은 높으나, 인간 판단이 필요한 포인트는 Stage 4의 직접 판단 블록에서 확정해야 합니다.
            </div>
          </div>
        </div>

        <div className="border border-[#777777] bg-[#f3f3f3] p-5 mb-5">
          <h3 className="text-sm font-bold text-[#000000] mb-2">Branch Output Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="border border-[#e2e2e2] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#000000] mb-1">Key Findings</div>
              콜옵션 행사 조건과 스텝업 트리거가 구조적으로 확인되었습니다.
            </div>
            <div className="border border-[#e2e2e2] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#000000] mb-1">Open Issues</div>
              자본 인정 여부와 이자지급 정지 영향은 human-only 판단이 필요합니다.
            </div>
            <div className="border border-[#e2e2e2] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#000000] mb-1">Carry To Stage 4</div>
              자본성, 콜옵션 행사 기대, 이자지급 정지 가능성을 종합 판단으로 전달합니다.
            </div>
          </div>
          <button
            onClick={() => {
              markBranchAnalysisReady();
              toast.success("영구채 브랜치 결과를 Stage 4 전달 준비 상태로 표시했습니다.");
            }}
            className={`mt-4 px-4 py-2 text-xs font-bold transition-colors ${
              state.branchAnalysisReady ? "border border-[#777777] text-[#000000]" : "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]"
            }`}
          >
            {state.branchAnalysisReady ? "브랜치 출력 준비 완료" : "브랜치 출력 준비 완료 표시"}
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c6]">
          <Link href={STAGE_ROUTE_MAP[3]}>
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 이전: 공통 분석
            </button>
          </Link>
          <button
            onClick={() => navigate(STAGE_ROUTE_MAP[4])}
            disabled={!state.branchAnalysisReady}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${
              state.branchAnalysisReady ? "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]" : "border border-[#c6c6c6] text-[#777777] cursor-not-allowed"
            }`}
          >
            다음 단계: Stage 4 →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
