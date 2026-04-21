/*
 * DESIGN: Structural Brutalism — Step 4: 종합 판단
 * Integrated analysis, human confirmation, supplement/condition handling
 */

import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { getBranchStageRoute, STAGE_ROUTE_MAP } from "@/config/stages";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useStageGuard } from "@/hooks/useStageGuard";
import { getAICopilotScenario } from "@/mocks/aiCopilot";

const RISK_METRICS = [
  { label: "신용 리스크", level: "HIGH", value: "BB+", desc: "부정적 전망 가능성" },
  { label: "유동성 리스크", level: "MODERATE", value: "0.82x", desc: "단기 상환 능력 주의 관찰" },
  { label: "법률 리스크", level: "LOW", value: "CLEAN", desc: "법률 이슈는 제한적" },
];

function RiskLevelBadge({ level }: { level: string }) {
  if (level === "HIGH") return <span className="px-2 py-0.5 text-[10px] font-bold bg-[#004999] text-[#ffffff]">HIGH</span>;
  if (level === "MODERATE") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#e5e7eb] text-[#004999]">MODERATE</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#e5e7eb] text-[#6b7280]">LOW</span>;
}

export default function Step4Review() {
  const [, navigate] = useLocation();
  const {
    state,
    setDecisionStatus,
    setDecisionRationale,
    requestSupplement,
    canAdvanceFromStep4,
  } = useWorkflow();

  useStageGuard({
    canAccess: state.commonAnalysisReady && (state.branchType === "general" || state.branchAnalysisReady),
    redirectTo: state.branchType === "general" ? STAGE_ROUTE_MAP[3] : getBranchStageRoute(state.branchType),
    message: "Stage 3 출력 조건이 완료되지 않아 이전 단계로 이동합니다.",
  });

  const copilotPanel = (
    <AICopilotPanel scenario={getAICopilotScenario(4, state.branchType)} />
  );

  const branchLabel = state.branchType === "general" ? "일반채" : state.branchType === "subordinated" ? "후순위채" : "영구채";
  const branchIssues =
    state.branchType === "subordinated"
      ? ["회수 순위 적정성", "후순위 프리미엄 적정성"]
      : state.branchType === "perpetual"
      ? ["자본 인정 여부", "이자지급 정지 영향", "콜옵션 행사 기대"]
      : ["사모 적격성 1차 결과", "조건 비교 결과"];

  const handleMoveNext = () => {
    if (canAdvanceFromStep4) {
      navigate(STAGE_ROUTE_MAP[5]);
      return;
    }

    if (state.decisionStatus === "supplement_requested") {
      navigate(STAGE_ROUTE_MAP[2]);
      return;
    }

    toast.error("확정 또는 수정 확정 상태에서만 Stage 5로 이동할 수 있습니다.");
  };

  return (
    <AppShell currentStage={4} rightPanel={copilotPanel}>
      <div className="p-8 max-w-5xl">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Stage 4. Integrated Review / Human Confirm</div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">종합 판단 및 사람 확인</h1>
          <p className="text-sm text-[#6b7280] mt-1.5 font-medium">공통 분석과 브랜치 분석을 병합하고 인간 판단으로 결과를 확정합니다.</p>
        </div>

        <div className="mb-6 border border-[#004999] bg-[#004999] p-4 text-[#ffffff]">
          <div className="text-[10px] font-bold uppercase tracking-wide mb-1">Branch Merge Context</div>
          <div className="text-lg font-black">{branchLabel} + 공통 분석 병합</div>
          <div className="text-xs text-[#dbeafe] mt-1">Carry-forward issues: {branchIssues.join(" / ")}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {RISK_METRICS.map((metric) => (
            <div key={metric.label} className="border border-[#e5e7eb] bg-[#ffffff] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wide">{metric.label}</span>
                <RiskLevelBadge level={metric.level} />
              </div>
              <div className="text-2xl font-black text-[#111827] tracking-tight mb-1">{metric.value}</div>
              <div className="text-[10px] text-[#6b7280] leading-relaxed">{metric.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-5">
            <div className="border border-[#e5e7eb] bg-[#ffffff] p-4">
              <h2 className="text-sm font-semibold text-[#111827] mb-3">A. Integrated Analysis</h2>
              <div className="space-y-3 text-xs text-[#111827]">
                <div className="border border-[#e5e7eb] p-3 bg-[#f8f9fa]">계약조건 전반은 시장 표준과 유사하나, 스프레드 및 구조 리스크가 추가 확인 대상입니다.</div>
                <div className="border border-[#e5e7eb] p-3 bg-[#f8f9fa]">브랜치 특화 분석은 Stage 4의 human confirm 없이는 최종 판단으로 취급되지 않습니다.</div>
              </div>
            </div>

            <div className="border border-[#004999] p-5">
              <h2 className="text-sm font-semibold text-[#111827] mb-3">B. Human Confirmation</h2>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <button
                  onClick={() => {
                    setDecisionStatus("confirmed");
                    toast.success("AI 결과를 확정 상태로 표시했습니다.");
                  }}
                  className={`py-2 text-xs font-bold transition-colors ${state.decisionStatus === "confirmed" ? "bg-[#004999] text-[#ffffff]" : "border border-[#e5e7eb] text-[#004999] hover:bg-[#f3f4f6]"}`}
                >
                  확정
                </button>
                <button
                  onClick={() => {
                    setDecisionStatus("modified");
                    toast.success("수정 후 확정 상태로 표시했습니다.");
                  }}
                  className={`py-2 text-xs font-bold transition-colors ${state.decisionStatus === "modified" ? "bg-[#004999] text-[#ffffff]" : "border border-[#e5e7eb] text-[#004999] hover:bg-[#f3f4f6]"}`}
                >
                  수정 후 확정
                </button>
                <button
                  onClick={() => {
                    setDecisionStatus("rejected");
                    toast.error("거절 상태로 표시했습니다.");
                  }}
                  className={`py-2 text-xs font-bold transition-colors ${state.decisionStatus === "rejected" ? "bg-[#c0392b] text-[#ffffff]" : "border border-[#c0392b] text-[#c0392b] hover:bg-[#fff5f5]"}`}
                >
                  거절
                </button>
                <button
                  onClick={() => {
                    setDecisionStatus("supplement_requested");
                    requestSupplement();
                    toast.info("보완 요청 상태로 전환했습니다.");
                  }}
                  className={`py-2 text-xs font-bold transition-colors ${state.decisionStatus === "supplement_requested" ? "bg-[#004999] text-[#ffffff]" : "border border-[#e5e7eb] text-[#004999] hover:bg-[#f3f4f6]"}`}
                >
                  보완 요청
                </button>
              </div>
              <textarea
                value={state.decisionRationale}
                onChange={(e) => setDecisionRationale(e.target.value)}
                className="w-full border border-[#e5e7eb] bg-[#ffffff] p-3 text-xs text-[#111827] placeholder-[#9ca3af] outline-none focus:border-[#004999] resize-none"
                rows={4}
                placeholder="인간 판단 근거와 수정 / 거절 / 보완 요청 사유를 기록하세요..."
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="border border-[#e5e7eb] bg-[#ffffff] p-4">
              <h2 className="text-sm font-semibold text-[#111827] mb-3">C. Collaboration / Conditions</h2>
              <div className="space-y-2 text-xs">
                <div className="border border-[#e5e7eb] p-3 bg-[#f8f9fa]">보완 요청 상태: {state.supplementStatus}</div>
                <div className="border border-[#e5e7eb] p-3 bg-[#f8f9fa]">조건 변경 이력: 아직 없음</div>
                <div className="border border-[#e5e7eb] p-3 bg-[#f8f9fa]">공유 메모: 법무팀 협의 필요 여부 검토</div>
              </div>
            </div>

            <div className="border border-[#e5e7eb] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wide mb-2">Decision State</div>
              <div className="text-sm font-black text-[#111827] mb-1">{state.decisionStatus.toUpperCase()}</div>
              <div className="text-xs text-[#6b7280]">
                {canAdvanceFromStep4
                  ? "보고서 작성 단계로 이동할 준비가 완료되었습니다."
                  : state.decisionStatus === "supplement_requested"
                  ? "보완 루프로 되돌아가 추가 자료를 받아야 합니다."
                  : state.decisionStatus === "rejected"
                  ? "거절 상태에서는 다음 단계로 진행하지 않습니다."
                  : "이 단계에서 확정 또는 수정 확정이 필요합니다."}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#e5e7eb]">
          <Link href={state.branchType === "general" ? STAGE_ROUTE_MAP[3] : getBranchStageRoute(state.branchType)}>
            <button className="px-5 py-2.5 border border-[#e5e7eb] text-sm font-bold text-[#6b7280] hover:bg-[#f3f4f6] transition-colors">
              ← 이전: 구조 분석
            </button>
          </Link>
          <button
            onClick={handleMoveNext}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${
              canAdvanceFromStep4 || state.decisionStatus === "supplement_requested"
                ? "bg-[#004999] text-[#ffffff] hover:bg-[#003a7a]"
                : "border border-[#e5e7eb] text-[#6b7280] cursor-not-allowed"
            }`}
          >
            {state.decisionStatus === "supplement_requested" ? "보완 루프로 이동 →" : "다음 단계: 보고서 작성 →"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
