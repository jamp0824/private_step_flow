/*
 * DESIGN: Structural Brutalism — Step 3-B: 후순위채 세부 분석
 * Analysis-only branch output screen
 */

import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { useWorkflow } from "@/contexts/WorkflowContext";

export default function Step3B() {
  const [, navigate] = useLocation();
  const { state, markBranchAnalysisReady } = useWorkflow();

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="후순위채 구조 분석"
      citations={[
        {
          title: "후순위 약정서",
          excerpt: "선순위 채무 상환 완료 후 후순위 상환이 가능한 구조가 명시되어 있습니다.",
        },
      ]}
      recommendation="후순위 구조 리스크를 Step 4에서 종합 판단할 수 있도록 핵심 메모를 이 단계에서 정리하십시오."
      analysisLabel="브랜치 분석 갱신"
      extraActions={[{ label: "회수 순위 재검토" }]}
    />
  );

  return (
    <AppShell currentStep={4} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Step 3-B. Branch Analysis</div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">후순위채 세부 분석</h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5">후순위 구조 분석 결과만 정리하고 최종 판단은 Step 4에서 수행합니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">선·후순위 대출 스택</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-[#000000] text-[#ffffff] px-3 py-2.5">
                <span className="text-xs font-bold">SENIOR DEBT</span>
                <span className="text-sm font-black">65.0%</span>
              </div>
              <div className="flex items-center justify-between bg-[#e2e2e2] border border-[#777777] px-3 py-2.5">
                <span className="text-xs font-bold text-[#000000]">SUBORDINATED</span>
                <span className="text-sm font-black text-[#000000]">20.0%</span>
              </div>
            </div>
          </div>

          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">가산 금리 적정성</h3>
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
            <div className="mt-3 border border-[#ba1a1a] bg-[#fff5f5] px-3 py-2 text-[10px] font-bold text-[#ba1a1a]">
              GAP ANALYSIS: -0.35%p
            </div>
          </div>
        </div>

        <div className="border border-[#c6c6c6] bg-[#ffffff] mb-5">
          <div className="px-4 py-3 border-b border-[#c6c6c6] bg-[#f3f3f3]">
            <h3 className="text-xs font-bold text-[#000000] uppercase tracking-wide">회수 순위 분석</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e2e2]">
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">Rank</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">Capital Type</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">Priority Score</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">Rights</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: "01", type: "Senior Bank Loan", score: "9.8/10", rights: "1st Lien" },
                { rank: "02", type: "Subordinated Note", score: "4.2/10", rights: "Junior Lien" },
                { rank: "03", type: "Preferred Equity", score: "2.1/10", rights: "Unsecured" },
              ].map((row) => (
                <tr key={row.rank} className="border-b border-[#e2e2e2]">
                  <td className="px-4 py-3 text-xs font-bold text-[#5e5e5e]">{row.rank}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[#000000]">{row.type}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#000000]">{row.score}</td>
                  <td className="px-4 py-3 text-xs text-[#5e5e5e]">{row.rights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-[#777777] bg-[#f3f3f3] p-5 mb-5">
          <h3 className="text-sm font-bold text-[#000000] mb-2">Branch Output Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="border border-[#e2e2e2] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#000000] mb-1">Key Findings</div>
              후순위 회수 순위가 선순위 대비 명확히 열위입니다.
            </div>
            <div className="border border-[#e2e2e2] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#000000] mb-1">Open Issues</div>
              금리 프리미엄이 리스크 대비 부족합니다.
            </div>
            <div className="border border-[#e2e2e2] bg-[#ffffff] px-3 py-2">
              <div className="font-bold text-[#000000] mb-1">Carry To Step 4</div>
              손실흡수력, 회수 순위, 프리미엄 적정성 판단이 필요합니다.
            </div>
          </div>
          <button
            onClick={() => {
              markBranchAnalysisReady();
              toast.success("후순위채 브랜치 결과를 Step 4 전달 준비 상태로 표시했습니다.");
            }}
            className={`mt-4 px-4 py-2 text-xs font-bold transition-colors ${
              state.branchAnalysisReady ? "border border-[#777777] text-[#000000]" : "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]"
            }`}
          >
            {state.branchAnalysisReady ? "브랜치 출력 준비 완료" : "브랜치 출력 준비 완료 표시"}
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c6]">
          <Link href="/step3">
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 이전: 기본 분석
            </button>
          </Link>
          <button
            onClick={() => navigate("/step4")}
            disabled={!state.branchAnalysisReady}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${
              state.branchAnalysisReady ? "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]" : "border border-[#c6c6c6] text-[#777777] cursor-not-allowed"
            }`}
          >
            다음 단계: 종합 판단 →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
