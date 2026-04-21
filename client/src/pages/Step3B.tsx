/*
 * DESIGN: Structural Brutalism — Step 3-B: 후순위채 세부 분석
 * Analysis-only branch output screen
 */

import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { STAGE_ROUTE_MAP } from "@/config/stages";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useStageGuard } from "@/hooks/useStageGuard";
import { getAICopilotScenario } from "@/mocks/aiCopilot";

export default function Step3B() {
  const [, navigate] = useLocation();
  const { state, markBranchAnalysisReady } = useWorkflow();

  useStageGuard({
    canAccess:
      state.sessionStarted &&
      state.parseErrorResolved &&
      state.comparisonReviewed &&
      state.branchLocked &&
      state.supplementStatus === "resolved" &&
      state.commonAnalysisReady &&
      state.branchType === "subordinated",
    redirectTo: STAGE_ROUTE_MAP[3],
    message: "후순위 브랜치에 진입하려면 Stage 2 구조 확정과 Stage 3 공통 분석이 필요합니다.",
  });

  const copilotPanel = (
    <AICopilotPanel scenario={getAICopilotScenario(3, "subordinated")} />
  );

  return (
    <AppShell currentStage={3} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#4a6080] uppercase tracking-wider mb-1">Stage 3. Subordinated Branch Analysis</div>
          <h1 className="text-3xl font-black text-[#004999] tracking-tight">후순위채 세부 분석</h1>
          <p className="text-sm text-[#4a6080] mt-1.5">후순위 구조 분석 결과만 정리하고 최종 판단은 Stage 4에서 수행합니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="border border-[#b8c8d8] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#4a6080] uppercase tracking-wide mb-3">선·후순위 대출 스택</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-[#004999] text-[#ffffff] px-3 py-2.5">
                <span className="text-xs font-bold">SENIOR DEBT</span>
                <span className="text-sm font-black">65.0%</span>
              </div>
              <div className="flex items-center justify-between bg-[#dce8f0] border border-[#6b8199] px-3 py-2.5">
                <span className="text-xs font-bold text-[#004999]">SUBORDINATED</span>
                <span className="text-sm font-black text-[#004999]">20.0%</span>
              </div>
            </div>
          </div>

          <div className="border border-[#b8c8d8] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#4a6080] uppercase tracking-wide mb-3">가산 금리 적정성</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-[#6b8199] mb-0.5">Market Premium</div>
                <div className="text-xl font-black text-[#004999]">+2.45%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#6b8199] mb-0.5">Assessed Risk</div>
                <div className="text-xl font-black text-[#004999]">+2.80%</div>
              </div>
            </div>
            <div className="mt-3 border border-[#c0392b] bg-[#fff5f5] px-3 py-2 text-[10px] font-bold text-[#c0392b]">
              GAP ANALYSIS: -0.35%p
            </div>
          </div>
        </div>

        <div className="border border-[#b8c8d8] bg-[#ffffff] mb-5">
          <div className="px-4 py-3 border-b border-[#b8c8d8] bg-[#f0f5fa]">
            <h3 className="text-xs font-bold text-[#004999] uppercase tracking-wide">회수 순위 분석</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#dce8f0]">
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase">Rank</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase">Capital Type</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase">Priority Score</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase">Rights</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: "01", type: "Senior Bank Loan", score: "9.8/10", rights: "1st Lien" },
                { rank: "02", type: "Subordinated Note", score: "4.2/10", rights: "Junior Lien" },
                { rank: "03", type: "Preferred Equity", score: "2.1/10", rights: "Unsecured" },
              ].map((row) => (
                <tr key={row.rank} className="border-b border-[#dce8f0]">
                  <td className="px-4 py-3 text-xs font-bold text-[#4a6080]">{row.rank}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[#004999]">{row.type}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#004999]">{row.score}</td>
                  <td className="px-4 py-3 text-xs text-[#4a6080]">{row.rights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-[#6b8199] bg-[#f0f5fa] p-5 mb-5">
          <h3 className="text-sm font-bold text-[#004999] mb-2">Branch Output Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="border border-[#dce8f0] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#004999] mb-1">Key Findings</div>
              후순위 회수 순위가 선순위 대비 명확히 열위입니다.
            </div>
            <div className="border border-[#dce8f0] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#004999] mb-1">Open Issues</div>
              금리 프리미엄이 리스크 대비 부족합니다.
            </div>
            <div className="border border-[#dce8f0] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#004999] mb-1">Carry To Stage 4</div>
              손실흡수력, 회수 순위, 프리미엄 적정성 판단이 필요합니다.
            </div>
          </div>
          <button
            onClick={() => {
              markBranchAnalysisReady();
              toast.success("후순위채 브랜치 결과를 Stage 4 전달 준비 상태로 표시했습니다.");
            }}
            className={`mt-4 px-4 py-2 text-xs font-bold transition-colors ${
              state.branchAnalysisReady ? "border border-[#6b8199] text-[#004999]" : "bg-[#004999] text-[#ffffff] hover:bg-[#1a3a5c]"
            }`}
          >
            {state.branchAnalysisReady ? "브랜치 출력 준비 완료" : "브랜치 출력 준비 완료 표시"}
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#b8c8d8]">
          <Link href={STAGE_ROUTE_MAP[3]}>
            <button className="px-5 py-2.5 border border-[#6b8199] text-sm font-bold text-[#4a6080] hover:bg-[#f0f5fa] transition-colors">
              ← 이전: 공통 분석
            </button>
          </Link>
          <button
            onClick={() => navigate(STAGE_ROUTE_MAP[4])}
            disabled={!state.branchAnalysisReady}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${
              state.branchAnalysisReady ? "bg-[#004999] text-[#ffffff] hover:bg-[#1a3a5c]" : "border border-[#b8c8d8] text-[#6b8199] cursor-not-allowed"
            }`}
          >
            다음 단계: Stage 4 →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
