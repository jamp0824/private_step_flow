/* Phase: P0 — issue #3 */

import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { STAGE_ROUTE_MAP } from "@/config/stages";
import { useWorkflow } from "@/contexts/WorkflowContext";

interface ReportSectionState {
  id: string;
  title: string;
  text: string;
  aiDraft: string;
  confidence: number;
  missingEvidence: string[];
  sources: string[];
}

const BASE_SECTION_CONTENT: Omit<ReportSectionState, "text">[] = [
  {
    id: "issuer-overview",
    title: "1. Issuer Overview",
    aiDraft:
      "발행사는 비상장 중견 제조업 기반의 더미 케이스로 설정되었으며, 최근 3개 분기 기준 영업 기반은 유지되고 있으나 운전자본 부담이 점진적으로 확대되는 흐름이 확인됩니다.",
    confidence: 92,
    missingEvidence: [],
    sources: ["issuer_profile_demo.pdf p.2", "management_brief_demo.pptx p.5"],
  },
  {
    id: "cashflow-analysis",
    title: "2. Cashflow Analysis",
    aiDraft:
      "영업현금흐름은 양(+)을 유지하고 있으나 분기별 회수 타이밍 편차가 커 단기 유동성 관리에 대한 사후 추적이 필요합니다. 상환 스케줄은 현금 유입 가정이 유지될 경우 대응 가능한 범위로 판단됩니다.",
    confidence: 88,
    missingEvidence: ["최근 자금집행 계획"],
    sources: ["cashflow_pack_demo.xlsx p.3", "repayment_terms_demo.pdf p.4"],
  },
  {
    id: "risk-summary",
    title: "3. Risk Summary",
    aiDraft:
      "주요 리스크는 레버리지 경계치 근접, 보고자료 제출 지연 가능성, 브랜치별 구조 리스크 메모 반영 필요로 요약됩니다. 단, 현재까지 확인된 조건만으로 즉시 반려 사유가 발생한 것은 아닙니다.",
    confidence: 84,
    missingEvidence: ["브랜치 특화 검토 메모 링크"],
    sources: ["risk_summary_demo.docx p.1", "branch_notes_demo.pdf p.2"],
  },
  {
    id: "conclusion",
    title: "4. Conclusion",
    aiDraft:
      "본 건은 조건부 승인 관점에서 검토를 지속할 수 있으며, 보고 일정 준수와 추가 재무자료 수신을 모니터링 조건으로 명시하는 방향이 적절합니다.",
    confidence: 90,
    missingEvidence: [],
    sources: ["review_decision_demo.md p.1", "monitoring_criteria_demo.pdf p.1"],
  },
];

export default function Step5Report() {
  const [, navigate] = useLocation();
  const { state, canSubmitFromStep5, submitForApproval } = useWorkflow();
  const [sections, setSections] = useState<ReportSectionState[]>(() =>
    BASE_SECTION_CONTENT.map((section) => ({
      ...section,
      text: section.id === "conclusion" && state.branchType !== "general"
        ? `${section.aiDraft} ${state.branchType === "subordinated" ? "후순위 구조 리스크 메모를 결론에 병기합니다." : "영구채 특화 판단 메모를 결론에 병기합니다."}`
        : section.aiDraft,
    }))
  );

  const unresolvedItems = [
    state.reviewStatus === "returned" ? "승인자 재작업 의견 반영 필요" : null,
    state.decisionStatus === "modified" ? "수정 확정 근거를 보고서 본문에 반영해야 함" : null,
    sections.some((section) => section.missingEvidence.length > 0) ? "근거 미연결 섹션 보강 필요" : null,
  ].filter(Boolean) as string[];

  const completenessScore = useMemo(() => {
    const filledSections = sections.filter((section) => section.text.trim().length > 0).length;
    const evidenceReadySections = sections.filter((section) => section.missingEvidence.length === 0).length;
    return Math.round((filledSections / sections.length) * 60 + (evidenceReadySections / sections.length) * 40);
  }, [sections]);

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="보고서 작성 지원"
      citations={[
        {
          title: "보고서 초안 제안",
          excerpt: "종합 판단 결과와 사후관리 조건을 섹션별 초안으로 정리했습니다.",
        },
      ]}
      recommendation="섹션별 AI 초안을 검토한 뒤 근거 미연결 배지를 우선 해소하십시오."
      analysisLabel="초안 재생성"
      extraActions={[{ label: "요약 문단 갱신" }]}
    />
  );

  const handleSectionChange = (sectionId: string, text: string) => {
    setSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, text } : section)));
  };

  const handleInsertDraft = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, text: section.aiDraft } : section))
    );
    toast.success("AI 초안을 본문에 반영했습니다.");
  };

  const handleSourceClick = () => {
    toast.info("Phase 2: source highlight viewer");
  };

  const handleSubmit = () => {
    submitForApproval();
    toast.success("제출 준비가 완료되어 승인 단계로 이동합니다.");
    navigate(STAGE_ROUTE_MAP[6]);
  };

  return (
    <AppShell currentStage={5} rightPanel={copilotPanel}>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Stage 5. 보고서 작성 및 제출</div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">보고서 패키징 및 제출 준비</h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5 font-medium">섹션별 본문을 편집하고 근거 연결 상태를 점검한 뒤 승인 제출 가능 여부를 확정합니다.</p>
        </div>

        {state.reviewStatus === "returned" && (
          <div className="mb-6 border border-[#ba1a1a] bg-[#fff5f5] p-4">
            <div className="text-sm font-bold text-[#ba1a1a]">재작업 요청 상태</div>
            <div className="text-xs text-[#ba1a1a] mt-1 leading-relaxed">{state.approverComment || "승인자 코멘트를 반영한 뒤 다시 제출해야 합니다."}</div>
          </div>
        )}

        <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-6">
          <div className="space-y-5">
            {sections.map((section) => (
              <section key={section.id} className="bp-card">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#000000]">{section.title}</h2>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="badge-active">{`Conf. ${section.confidence}%`}</span>
                      {section.missingEvidence.length > 0 ? (
                        <span className="badge-error">Missing Evidence</span>
                      ) : (
                        <span className="badge-complete">Evidence Linked</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleInsertDraft(section.id)} className="btn-secondary text-xs whitespace-nowrap">
                    Insert AI Draft
                  </button>
                </div>

                <textarea
                  value={section.text}
                  onChange={(event) => handleSectionChange(section.id, event.target.value)}
                  rows={6}
                  className="w-full border border-[#777777] bg-[#f9f9f9] p-3 text-xs text-[#1a1c1c] placeholder-[#777777] outline-none focus:border-[#000000] resize-y"
                  placeholder="보고서 본문을 입력하세요..."
                />

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {section.sources.map((source) => (
                    <button
                      key={source}
                      onClick={handleSourceClick}
                      className="px-2 py-1 border border-[#777777] text-[10px] font-bold text-[#000000] hover:bg-[#f3f3f3] transition-colors"
                    >
                      Source: [{source}]
                    </button>
                  ))}
                </div>

                {section.missingEvidence.length > 0 && (
                  <div className="mt-3 border border-[#ba1a1a] bg-[#fff5f5] p-3 text-[11px] text-[#ba1a1a]">
                    미연결 근거: {section.missingEvidence.join(" / ")}
                  </div>
                )}
              </section>
            ))}
          </div>

          <aside className="space-y-5">
            <section className="bp-card">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">Report Completeness</div>
              <div className="text-3xl font-black text-[#000000]">{completenessScore}/100</div>
              <div className="mt-3 h-3 border border-[#777777] bg-[#f3f3f3]">
                <div className="h-full bg-[#000000]" style={{ width: `${completenessScore}%` }} />
              </div>
              <div className="mt-3 space-y-2">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-[#5e5e5e]">{section.title}</span>
                    <span className={section.text.trim() ? "text-[#000000] font-bold" : "text-[#777777]"}>{section.text.trim() ? "READY" : "EMPTY"}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bp-card">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">Submission Readiness</div>
              <div className="space-y-2">
                {[
                  { label: "종합 판단 확정", done: state.decisionStatus === "confirmed" || state.decisionStatus === "modified" },
                  { label: "보완 루프 종료", done: state.supplementStatus === "resolved" },
                  { label: "보고서 근거 링크 점검", done: sections.every((section) => section.missingEvidence.length === 0) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 flex items-center justify-center ${item.done ? "bg-[#000000]" : "border border-[#777777]"}`}>
                      {item.done && <span className="material-symbols-outlined text-[11px] text-[#ffffff]">check</span>}
                    </div>
                    <span className={`text-xs ${item.done ? "text-[#000000] font-medium" : "text-[#777777]"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bp-card">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">Unresolved Items</div>
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
            </section>
          </aside>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#c6c6c6]">
          <Link href={STAGE_ROUTE_MAP[4]}>
            <button className="btn-secondary">← 이전: 종합 판단</button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!canSubmitFromStep5}
            className={canSubmitFromStep5 ? "btn-primary" : "px-4 py-2 border border-[#c6c6c6] text-sm font-bold text-[#777777] cursor-not-allowed"}
          >
            승인 단계로 제출 →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
