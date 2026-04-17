import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { useWorkflow } from "@/contexts/WorkflowContext";

const SUPPORTING_BASIS = [
  { label: "종합 판단 결과", value: "확정 완료" },
  { label: "브랜치 분석 메모", value: "Step 4에 병합됨" },
  { label: "조건부 승인 요건", value: "2건 남음" },
];

export default function Step5Report() {
  const [, navigate] = useLocation();
  const { state, canSubmitFromStep5, submitForApproval } = useWorkflow();

  const unresolvedItems = [
    state.reviewStatus === "returned" ? "승인자 재작업 의견 반영 필요" : null,
    state.decisionStatus === "modified" ? "수정 확정 근거를 보고서 본문에 반영해야 함" : null,
    state.branchType !== "general" ? "브랜치 특화 검토 메모 링크 점검 필요" : null,
  ].filter(Boolean) as string[];

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="보고서 작성 지원"
      citations={[
        {
          title: "보고서 초안 제안",
          excerpt: "종합 판단 결과를 근거 링크와 함께 요약 문단으로 정리했습니다.",
        },
      ]}
      recommendation="보고서 본문과 조건부 승인 항목을 점검한 뒤 제출 준비 상태를 확정하십시오."
      analysisLabel="초안 재생성"
      extraActions={[{ label: "요약 문단 갱신" }]}
    />
  );

  const handleSubmit = () => {
    submitForApproval();
    toast.success("제출 준비가 완료되어 승인 단계로 이동합니다.");
    navigate("/step6");
  };

  return (
    <AppShell currentStep={6} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Step 5. 보고서 작성 및 제출</div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">보고서 패키징 및 제출 준비</h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5 font-medium">
            확정된 판단 결과를 심사보고서로 정리하고 승인 제출 가능 여부를 확인합니다.
          </p>
        </div>

        {state.reviewStatus === "returned" && (
          <div className="mb-6 border border-[#ba1a1a] bg-[#fff5f5] p-4">
            <div className="text-sm font-bold text-[#ba1a1a]">재작업 요청 상태</div>
            <div className="text-xs text-[#ba1a1a] mt-1 leading-relaxed">{state.approverComment || "승인자 코멘트를 반영한 뒤 다시 제출해야 합니다."}</div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-5">
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">REPORT STRUCTURE</div>
              <div className="space-y-1.5">
                {["리스크 요약", "투자 조건", "브랜치 특이사항", "사후 관리", "최종 의견"].map((item) => (
                  <div key={item} className="px-2 py-1.5 border border-[#e2e2e2] text-xs font-medium text-[#000000] bg-[#f9f9f9]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">UNRESOLVED ITEMS</div>
              <div className="space-y-2">
                {unresolvedItems.length > 0 ? (
                  unresolvedItems.map((item) => (
                    <div key={item} className="border border-[#ba1a1a] bg-[#fff5f5] px-3 py-2 text-xs text-[#ba1a1a]">
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="border border-[#c6c6c6] px-3 py-2 text-xs text-[#5e5e5e]">현재 제출을 막는 미해결 항목은 없습니다.</div>
                )}
              </div>
            </div>

            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">SUBMISSION READINESS</div>
              <div className="space-y-2">
                {[
                  { label: "종합 판단 확정", done: state.decisionStatus === "confirmed" || state.decisionStatus === "modified" },
                  { label: "보완 루프 종료", done: state.supplementStatus === "resolved" },
                  { label: "보고서 근거 링크 확인", done: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 flex items-center justify-center ${item.done ? "bg-[#000000]" : "border border-[#777777]"}`}>
                      {item.done && <span className="material-symbols-outlined text-[11px] text-[#ffffff]">check</span>}
                    </div>
                    <span className={`text-xs ${item.done ? "text-[#000000] font-medium" : "text-[#777777]"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-5">
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#000000]">보고서 본문 초안</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#e2e2e2] text-[#000000]">
                  {state.reviewStatus === "returned" ? "REVISION REQUIRED" : "DRAFT READY"}
                </span>
              </div>
              <div className="border border-[#c6c6c6] bg-[#f9f9f9] p-3 text-xs text-[#3a3c3c] leading-relaxed">
                본 건은 {state.branchType === "general" ? "일반 사모사채" : state.branchType === "subordinated" ? "후순위채" : "영구채"}로 분류되었으며,
                Step 4의 확정 판단을 기준으로 보고서 초안이 구성되었습니다. 핵심 리스크, 조건부 승인 요건, 사후 관리 기준이 반영되어 있습니다.
              </div>
            </div>

            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <h3 className="text-sm font-bold text-[#000000] mb-3">Supporting Basis</h3>
              <div className="grid grid-cols-3 gap-3">
                {SUPPORTING_BASIS.map((item) => (
                  <div key={item.label} className="border border-[#e2e2e2] p-3 bg-[#f9f9f9]">
                    <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">{item.label}</div>
                    <div className="text-xs font-bold text-[#000000]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <h3 className="text-sm font-bold text-[#000000] mb-3">조건부 승인 및 사후 관리</h3>
              <div className="space-y-2">
                {[
                  "법무 검토 메모를 첨부하여 승인 패키지에 포함",
                  "모니터링 기준: 분기별 재무 업데이트 확인",
                  "브랜치 특화 이슈를 심사보고서 부록에 명시",
                ].map((item) => (
                  <div key={item} className="border border-[#e2e2e2] px-3 py-2 text-xs text-[#1a1c1c]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#c6c6c6]">
          <Link href="/step4">
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 이전: 종합 판단
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!canSubmitFromStep5}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${
              canSubmitFromStep5 ? "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]" : "border border-[#c6c6c6] text-[#777777] cursor-not-allowed"
            }`}
          >
            승인 단계로 제출 →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
