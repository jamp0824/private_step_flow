import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { STAGE_ROUTE_MAP } from "@/config/stages";
import { useWorkflow } from "@/contexts/WorkflowContext";

function getApprovalLabel(status: string) {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  if (status === "returned") return "RETURNED";
  if (status === "submitted") return "SUBMITTED";
  return "UNDER REVIEW";
}

export default function Step6Approval() {
  const [, navigate] = useLocation();
  const { state, setApproverComment, approveCase, rejectCase, returnForRework } = useWorkflow();

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="승인 단계 지원"
      citations={[
        {
          title: "승인 패키지 점검",
          excerpt: "종합 판단, 보고서 초안, 조건부 승인 항목이 모두 포함되었습니다.",
        },
      ]}
      recommendation="반려 또는 재작업 요청 시 코멘트를 남겨 Stage 5로 명확히 되돌리십시오."
      analysisLabel="승인 패키지 검토"
    />
  );

  const effectiveStatus = state.reviewStatus === "submitted" ? "under_review" : state.reviewStatus;

  const handleApprove = () => {
    approveCase(state.approverComment || "승인 완료");
    toast.success("승인이 완료되고 결과가 기록되었습니다.");
    navigate(STAGE_ROUTE_MAP[7]);
  };

  const handleReject = () => {
    rejectCase(state.approverComment || "반려 사유를 검토 후 재기안 필요");
    toast.error("승인이 반려되었습니다.");
  };

  const handleReturn = () => {
    returnForRework(state.approverComment || "보고서 보완 후 재제출 필요");
    toast.info("재작업 요청 상태로 Stage 5로 복귀합니다.");
    navigate(STAGE_ROUTE_MAP[5]);
  };

  return (
    <AppShell currentStage={6} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Stage 6. 승인 / 결과 기록</div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">승인, 반려, 재작업 처리</h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5 font-medium">승인자는 이 단계에서만 최종 승인, 반려, 재작업 요청을 수행합니다.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-5">
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">APPROVAL STATUS</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5e5e5e]">Current</span>
                  <span className="text-xs font-bold text-[#000000]">{getApprovalLabel(effectiveStatus)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5e5e5e]">Branch</span>
                  <span className="text-xs font-bold text-[#000000]">
                    {state.branchType === "general" ? "일반채" : state.branchType === "subordinated" ? "후순위채" : "영구채"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5e5e5e]">Submission</span>
                  <span className="text-xs font-bold text-[#000000]">{state.reviewStatus === "submitted" ? "제출 완료" : "검토 중"}</span>
                </div>
              </div>
            </div>

            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">STATE TRANSITIONS</div>
              <div className="space-y-2 text-xs text-[#1a1c1c]">
                <div className="border border-[#e2e2e2] px-3 py-2">승인: 사건 종료 및 결과 통보</div>
                <div className="border border-[#e2e2e2] px-3 py-2">반려: 승인 거절 및 사유 기록</div>
                <div className="border border-[#e2e2e2] px-3 py-2">재작업: Stage 5로 복귀</div>
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-5">
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <h3 className="text-sm font-bold text-[#000000] mb-3">Approval Decision</h3>
              <textarea
                value={state.approverComment}
                onChange={(e) => setApproverComment(e.target.value)}
                className="w-full border border-[#777777] bg-[#f9f9f9] p-3 text-xs text-[#1a1c1c] placeholder-[#777777] outline-none focus:border-[#000000] resize-none mb-3"
                rows={4}
                placeholder="승인 / 반려 / 재작업 사유를 입력하세요..."
              />
              <div className="grid grid-cols-3 gap-3">
                <button onClick={handleApprove} className="py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors">
                  승인
                </button>
                <button onClick={handleReject} className="py-2.5 border border-[#ba1a1a] text-[#ba1a1a] text-sm font-bold hover:bg-[#fff5f5] transition-colors">
                  반려
                </button>
                <button onClick={handleReturn} className="py-2.5 border border-[#777777] text-[#000000] text-sm font-bold hover:bg-[#f3f3f3] transition-colors">
                  재작업 요청
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">RESULT RECORD</div>
                <div className="bg-[#f3f3f3] border border-[#e2e2e2] p-3 font-mono text-[10px] text-[#3a3c3c] leading-relaxed">
                  STATUS: {getApprovalLabel(effectiveStatus)}<br />
                  REVIEW_STATUS: {state.reviewStatus}<br />
                  BRANCH: {state.branchType}<br />
                  DECISION: {state.decisionStatus}
                </div>
              </div>

              <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">NOTIFICATION STATE</div>
                <div className="space-y-2">
                  {[
                    { label: "승인자 내부 알림", status: "DELIVERED" },
                    { label: "결과 통보", status: state.reviewStatus === "approved" ? "READY TO SEND" : state.reviewStatus === "rejected" ? "REJECTION NOTICE READY" : "PENDING" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-[10px] text-[#5e5e5e]">{item.label}</span>
                      <span className="px-2 py-0.5 text-[9px] font-bold border border-[#777777] text-[#000000]">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#c6c6c6]">
          <Link href={STAGE_ROUTE_MAP[5]}>
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 이전: 보고서 작성
            </button>
          </Link>
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide">
            {state.reviewStatus === "approved" ? "승인 완료" : state.reviewStatus === "rejected" ? "반려 완료" : "승인 대기 중"}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
