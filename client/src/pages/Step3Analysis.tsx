/*
 * DESIGN: Structural Brutalism — Step 3: 수집 및 사실 분석
 * Common analysis only, with locked branch carried from Step 2
 */

import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { STAGE_ROUTE_MAP } from "@/config/stages";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useStageGuard } from "@/hooks/useStageGuard";
import { getAICopilotScenario } from "@/mocks/aiCopilot";

const ANALYSIS_ITEMS = [
  { label: "재무 분석", icon: "bar_chart", status: "완료", done: true },
  { label: "신용 평가", icon: "credit_score", status: "완료", done: true },
  { label: "산업 및 시장 분석", icon: "store", status: "진행 중", done: false },
  { label: "현금흐름 분석", icon: "water_drop", status: "진행 중", done: false },
];

const REQUIRED_DOCS = [
  { label: "최근 3개년 재무제표", done: true },
  { label: "감사보고서", done: true },
  { label: "신용평가 자료", done: true },
  { label: "사업보고서", done: true },
  { label: "주주현황 자료", done: false },
  { label: "차입금 현황표", done: false },
  { label: "담보 관련 약정서", done: false },
];

export default function Step3Analysis() {
  const [, navigate] = useLocation();
  const { state, branchRoute, markCommonAnalysisReady, canAdvanceFromStep3 } = useWorkflow();

  useStageGuard({
    canAccess: state.sessionStarted && state.parseErrorResolved && state.comparisonReviewed && state.branchLocked && state.supplementStatus === "resolved",
    redirectTo: STAGE_ROUTE_MAP[2],
    message: "Stage 2 선행 조건이 완료되지 않아 이전 단계로 이동합니다.",
  });

  const copilotPanel = (
    <AICopilotPanel scenario={getAICopilotScenario(3, state.branchType)} />
  );

  const branchLabel = state.branchType === "general" ? "일반채" : state.branchType === "subordinated" ? "후순위채" : "영구채";
  const nextLabel = state.branchType === "general" ? "다음 단계: Stage 4 →" : "다음 단계: 브랜치 분석 →";

  return (
    <AppShell currentStage={3} rightPanel={copilotPanel}>
      <div className="p-8 max-w-5xl">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Stage 3. Common Analysis</div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">기본 데이터 분석 및 사실 검증</h1>
          <p className="text-sm text-[#6b7280] mt-1.5 font-medium">추가 자료 수집, 검색, 공통 분석, 세부 조건 추출을 수행하고 브랜치 출력으로 넘깁니다.</p>
        </div>

        <div className="mb-6 border border-[#004999] bg-[#004999] p-4 text-[#ffffff]">
          <div className="text-[10px] font-bold uppercase tracking-wide mb-1">Locked Branch</div>
          <div className="text-lg font-black">{branchLabel}</div>
          <div className="text-xs text-[#dbeafe] mt-1">이 분기는 Stage 2에서 확정되었으며 이 화면에서는 변경할 수 없습니다.</div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-5">
            <div className="border border-[#e5e7eb] bg-[#f3f4f6] p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[18px] text-[#6b7280]">upload_file</span>
                <h3 className="text-sm font-semibold text-[#111827]">A. Additional Materials</h3>
              </div>
              <div className="space-y-2">
                {REQUIRED_DOCS.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 flex items-center justify-center ${item.done ? "bg-[#004999]" : "border border-[#e5e7eb]"}`}>
                      {item.done && <span className="material-symbols-outlined text-[9px] text-[#ffffff]">check</span>}
                    </div>
                    <span className={`text-[10px] ${item.done ? "text-[#004999] font-medium" : "text-[#6b7280]"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#e5e7eb] bg-[#ffffff] p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[16px] text-[#6b7280]">search</span>
                <h3 className="text-sm font-semibold text-[#111827]">B. Reference Search Results</h3>
              </div>
              <div className="space-y-2">
                {[
                  "유사 사례 3건 선택됨",
                  "내부 기준 문서 2건 고정됨",
                  "외부 공시 1건 검토 대기",
                ].map((item) => (
                  <div key={item} className="border border-[#e5e7eb] px-3 py-2 text-xs text-[#111827] bg-[#f8f9fa]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-[#111827] mb-3 border-b border-[#e5e7eb] pb-2">C. Common Analysis Completion</h3>
              <div className="grid grid-cols-2 gap-3">
                {ANALYSIS_ITEMS.map((item) => (
                  <div key={item.label} className={`border p-4 ${item.done ? "border-[#e5e7eb] bg-[#ffffff]" : "border-[#004999] bg-[#f8f9fa]"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#374151]">{item.label}</span>
                      <span className="material-symbols-outlined text-[18px] text-[#6b7280]">{item.icon}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${item.done ? "text-[#004999]" : "text-[#6b7280]"}`}>{item.done ? "완료" : item.status}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  markCommonAnalysisReady();
                  toast.success("공통 분석을 Stage 3 출력 준비 상태로 표시했습니다.");
                }}
                className={`mt-4 px-4 py-2 text-xs font-bold transition-colors ${
                  state.commonAnalysisReady ? "border border-[#e5e7eb] text-[#004999]" : "bg-[#004999] text-[#ffffff] hover:bg-[#003a7a]"
                }`}
              >
                {state.commonAnalysisReady ? "공통 분석 완료" : "공통 분석 완료 표시"}
              </button>
            </div>

            <div className="border border-[#e5e7eb] bg-[#ffffff] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#111827]">D. Extracted Deal Terms</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#eff6ff] text-[#004999]">EXTRACTED</span>
              </div>
              <div className="space-y-2">
                <div className="border-l-2 border-[#004999] pl-3 py-1">
                  <div className="text-xs font-bold text-[#374151]">상환 일정</div>
                  <div className="text-[11px] text-[#6b7280] mt-0.5">2024-06-30 (10%), 2024-12-31 (20%), 2025-12-31 (70%)</div>
                </div>
                <div className="border-l-2 border-[#004999] pl-3 py-1">
                  <div className="text-xs font-bold text-[#374151]">표면 금리 / 실효 금리</div>
                  <div className="text-[11px] text-[#6b7280] mt-0.5">표면 5.5% / 실효 6.2%</div>
                </div>
              </div>
            </div>

            <div className="border border-[#e5e7eb] bg-[#f3f4f6] p-4">
              <h3 className="text-sm font-semibold text-[#111827] mb-2">E. Output Gate</h3>
              <div className="text-xs text-[#6b7280] mb-3">
                {state.branchType === "general"
                  ? "일반채는 공통 분석 결과를 바로 Stage 4로 전달합니다."
                  : "후순위채 / 영구채는 공통 분석 결과를 브랜치 분석 화면으로 전달합니다."}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border border-[#e5e7eb] bg-[#ffffff] px-3 py-2">
                  공통 분석 완료: <span className="font-bold text-[#004999]">{state.commonAnalysisReady ? "YES" : "NO"}</span>
                </div>
                <div className="border border-[#e5e7eb] bg-[#ffffff] px-3 py-2">
                  다음 대상: <span className="font-bold text-[#004999]">{state.branchType === "general" ? "Stage 4" : branchLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-6 border-t border-[#e5e7eb]">
          <Link href={STAGE_ROUTE_MAP[2]}>
            <button className="px-5 py-2.5 border border-[#e5e7eb] text-sm font-bold text-[#6b7280] hover:bg-[#f3f4f6] transition-colors">
              ← 이전: 업로드/분류
            </button>
          </Link>
          <button
            onClick={() => navigate(branchRoute)}
            disabled={!canAdvanceFromStep3}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${
              canAdvanceFromStep3 ? "bg-[#004999] text-[#ffffff] hover:bg-[#003a7a]" : "border border-[#e5e7eb] text-[#6b7280] cursor-not-allowed"
            }`}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
