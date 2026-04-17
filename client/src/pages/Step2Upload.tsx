/*
 * DESIGN: Structural Brutalism — Step 2: 기초 준비 및 1차 검토
 * Session start, base packet validation, supplement loop, compare/history, branch lock
 */

import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";
import { type BranchType, useWorkflow } from "@/contexts/WorkflowContext";

const BASE_DOCS = [
  { name: "투자검토요청서_v1.pdf", upload: "완료", parse: "완료", classify: "요청서", error: "-", parseStatus: "done" },
  { name: "기업개요_IM_최종.pptx", upload: "완료", parse: "완료", classify: "IM", error: "-", parseStatus: "done" },
  { name: "텀시트_초안_오류.docx", upload: "완료", parse: "파싱오류", classify: "-", error: "페이지 누락 의심", parseStatus: "error" },
  { name: "발행총괄_사모사채.xlsx", upload: "완료", parse: "완료", classify: "발행 개요", error: "-", parseStatus: "done" },
];

const BASE_CHECKLIST = [
  "투자검토요청서",
  "회사 개요서 / IM",
  "Term Sheet",
  "발행 개요서",
  "사모사채 발행 조건표",
];

const BRANCH_OPTIONS: Array<{ value: BranchType; label: string; desc: string }> = [
  { value: "general", label: "일반채", desc: "추가 분기 없이 종합 판단으로 연결" },
  { value: "subordinated", label: "후순위채", desc: "후순위 구조 분석이 추가됨" },
  { value: "perpetual", label: "영구채", desc: "영구채 특화 분석이 추가됨" },
];

function StatusBadge({ tone, label }: { tone: "dark" | "light" | "warn" | "error"; label: string }) {
  const className =
    tone === "dark"
      ? "border border-[#000000] bg-[#000000] text-[#ffffff]"
      : tone === "warn"
      ? "border border-[#ba1a1a] bg-[#fff5f5] text-[#ba1a1a]"
      : tone === "error"
      ? "border border-[#ba1a1a] bg-[#ffffff] text-[#ba1a1a]"
      : "border border-[#777777] bg-[#ffffff] text-[#000000]";

  return <span className={`px-2 py-0.5 text-[10px] font-bold ${className}`}>{label}</span>;
}

function getSupplementCopy(status: string) {
  if (status === "required") return "누락 자료가 감지되었습니다. 보완 요청이 필요합니다.";
  if (status === "requested") return "보완 요청이 발송되었습니다. 제출자 응답 전까지 Step 2가 차단됩니다.";
  if (status === "waiting") return "제출자 응답 대기 중입니다.";
  if (status === "reuploaded") return "보완 자료가 재업로드되었습니다. 재점검을 진행하십시오.";
  if (status === "rechecking") return "재업로드 문서를 기준으로 재파싱 / 재체크 중입니다.";
  return "기본 누락 자료 체크가 완료되었습니다.";
}

export default function Step2Upload() {
  const [, navigate] = useLocation();
  const {
    state,
    startSession,
    resolveParseError,
    advanceSupplement,
    markComparisonReviewed,
    setBranchType,
    lockBranch,
    canProceedFromStep2,
  } = useWorkflow();

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="Step 2 검토 지원"
      systemSuggestion="누락 자료와 파싱 오류를 모두 해소한 뒤 구조 분기를 확정해야 다음 단계로 이동할 수 있습니다."
      citations={[]}
      analysisLabel="초기 점검 재실행"
      extraActions={[]}
    />
  );

  const handleProceed = () => {
    if (!canProceedFromStep2) {
      toast.error("세션 시작, 파싱 오류 해소, 보완 루프 종료, 비교 검토, 구조 확정이 모두 필요합니다.");
      return;
    }

    navigate("/step3");
  };

  return (
    <AppShell currentStep={2} rightPanel={copilotPanel}>
      <div className="p-8 max-w-5xl">
        <div className="mb-7">
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Step 2. Intake / Upload / Initial Check</div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">기초 준비 및 1차 검토</h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5 font-medium">세션 시작, 기본 문서 검증, 보완 루프, 비교 검토, 구조 확정을 한 화면에서 단계적으로 처리합니다.</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Session", value: state.sessionStarted ? "STARTED" : "NOT STARTED" },
            { label: "Supplement", value: state.supplementStatus.toUpperCase() },
            { label: "Branch", value: state.branchLocked ? "LOCKED" : "UNLOCKED" },
            { label: "Stage State", value: state.stageState.toUpperCase() },
          ].map((item) => (
            <div key={item.label} className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-1">{item.label}</div>
              <div className="text-sm font-black text-[#000000]">{item.value}</div>
            </div>
          ))}
        </div>

        <section className="mb-6 border border-[#777777] bg-[#f3f3f3] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#000000]">A. Session Start</h2>
              <p className="text-xs text-[#5e5e5e] mt-1">심사 건 생성과 담당자 착수 판단을 먼저 수행합니다.</p>
            </div>
            <button
              onClick={() => {
                startSession();
                toast.success("Review Session이 시작되었습니다.");
              }}
              className={`px-5 py-2.5 text-sm font-bold transition-colors ${
                state.sessionStarted ? "border border-[#777777] text-[#000000]" : "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]"
              }`}
            >
              {state.sessionStarted ? "세션 시작 완료" : "세션 시작"}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-3">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase">Owner</div>
              <div className="text-sm font-bold text-[#000000] mt-1">김검토 심사역</div>
            </div>
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-3">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase">Case State</div>
              <div className="text-sm font-bold text-[#000000] mt-1">{state.sessionStarted ? "검토 착수" : "미착수"}</div>
            </div>
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-3">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase">Entry Decision</div>
              <div className="text-sm font-bold text-[#000000] mt-1">기본 문서 검토 대기</div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold text-[#000000] mb-3 border-b border-[#c6c6c6] pb-2">B. Base Document Upload / Parse</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 border border-[#777777] bg-[#ffffff]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f3f3f3] border-b border-[#777777]">
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">문서명</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">업로드</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">파싱</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">분류</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">복구 액션</th>
                  </tr>
                </thead>
                <tbody>
                  {BASE_DOCS.map((doc) => (
                    <tr key={doc.name} className="border-b border-[#e2e2e2]">
                      <td className="px-4 py-3 text-xs font-medium text-[#000000]">{doc.name}</td>
                      <td className="px-4 py-3"><StatusBadge tone="light" label={doc.upload} /></td>
                      <td className="px-4 py-3">
                        {doc.parseStatus === "error" && !state.parseErrorResolved ? (
                          <StatusBadge tone="error" label={doc.parse} />
                        ) : (
                          <StatusBadge tone="light" label={doc.parseStatus === "error" ? "복구 완료" : doc.parse} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {doc.classify === "-" ? <span className="text-[#777777] text-xs">재분석 필요</span> : <StatusBadge tone="dark" label={doc.classify} />}
                      </td>
                      <td className="px-4 py-3">
                        {doc.parseStatus === "error" && !state.parseErrorResolved ? (
                          <button
                            onClick={() => {
                              resolveParseError();
                              toast.success("파싱 오류를 복구 완료 상태로 전환했습니다.");
                            }}
                            className="px-3 py-1 border border-[#ba1a1a] text-[10px] font-bold text-[#ba1a1a] hover:bg-[#fff5f5] transition-colors"
                          >
                            재파싱 완료 표시
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-[#5e5e5e]">정상</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-3">Base Packet Checklist</div>
              <div className="space-y-2">
                {BASE_CHECKLIST.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#000000] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[11px] text-[#ffffff]">check</span>
                    </div>
                    <span className="text-xs text-[#000000] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 border border-[#777777] bg-[#f3f3f3] p-5">
          <h2 className="text-sm font-bold text-[#000000] mb-2">C. Missing Document Check / Supplement Loop</h2>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-bold text-[#000000]">현재 상태: {state.supplementStatus.toUpperCase()}</div>
              <div className="text-xs text-[#5e5e5e] mt-1">{getSupplementCopy(state.supplementStatus)}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  advanceSupplement();
                  toast.info("보완 루프 상태를 다음 단계로 진행했습니다.");
                }}
                className="px-4 py-2 border border-[#777777] text-xs font-bold text-[#000000] hover:bg-[#ffffff] transition-colors"
              >
                다음 루프 상태
              </button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {[
              "required",
              "requested",
              "waiting",
              "reuploaded",
              "rechecking",
              "resolved",
            ].map((status) => (
              <div
                key={status}
                className={`border px-3 py-2 text-center text-[10px] font-bold uppercase ${
                  state.supplementStatus === status ? "border-[#000000] bg-[#000000] text-[#ffffff]" : "border-[#c6c6c6] bg-[#ffffff] text-[#5e5e5e]"
                }`}
              >
                {status}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6 border border-[#c6c6c6] bg-[#ffffff] p-5">
          <h2 className="text-sm font-bold text-[#000000] mb-2">D. Compare / History / Internal Basis</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border border-[#e2e2e2] p-3 bg-[#f9f9f9]">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">조건 비교</div>
              <div className="text-xs text-[#1a1c1c]">Call Option 조항이 내부 표준안 대비 발행사 친화적으로 설정됨</div>
            </div>
            <div className="border border-[#e2e2e2] p-3 bg-[#f9f9f9]">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">과거 기준</div>
              <div className="text-xs text-[#1a1c1c]">유사 사례 평균 가산금리 +110bp</div>
            </div>
            <div className="border border-[#e2e2e2] p-3 bg-[#f9f9f9]">
              <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-1">내부 자료</div>
              <div className="text-xs text-[#1a1c1c]">사모 적격성은 인원수 확인 후 확정 필요</div>
            </div>
          </div>
          <button
            onClick={() => {
              markComparisonReviewed();
              toast.success("비교 결과를 검토 완료로 표시했습니다.");
            }}
            className={`px-4 py-2 text-xs font-bold transition-colors ${
              state.comparisonReviewed ? "border border-[#777777] text-[#000000]" : "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]"
            }`}
          >
            {state.comparisonReviewed ? "비교 결과 검토 완료" : "비교 결과 검토 완료 표시"}
          </button>
        </section>

        <section className="mb-6 border border-[#777777] bg-[#f3f3f3] p-5">
          <h2 className="text-sm font-bold text-[#000000] mb-1">E. Structure Lock</h2>
          <p className="text-xs text-[#5e5e5e] mb-4">Step 2의 구조 분류 결과를 바탕으로 단일 브랜치를 확정합니다.</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {BRANCH_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setBranchType(option.value)}
                className={`border p-4 text-left transition-colors ${
                  state.branchType === option.value ? "border-[#000000] bg-[#000000] text-[#ffffff]" : "border-[#777777] bg-[#ffffff] text-[#000000] hover:bg-[#f9f9f9]"
                }`}
              >
                <div className="text-sm font-bold">{option.label}</div>
                <div className={`text-[11px] mt-1 ${state.branchType === option.value ? "text-[#e2e2e2]" : "text-[#5e5e5e]"}`}>{option.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#5e5e5e]">현재 선택: {BRANCH_OPTIONS.find((item) => item.value === state.branchType)?.label}</div>
            <button
              onClick={() => {
                lockBranch();
                toast.success("구조 분기가 Step 2 결과로 확정되었습니다.");
              }}
              className={`px-5 py-2.5 text-sm font-bold transition-colors ${
                state.branchLocked ? "border border-[#777777] text-[#000000]" : "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]"
              }`}
            >
              {state.branchLocked ? "구조 확정 완료" : "구조 확정"}
            </button>
          </div>
        </section>

        <div className="border border-[#c6c6c6] bg-[#ffffff] p-4 mb-6">
          <div className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide mb-2">Stage Exit</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-[#000000] mb-2">Proceed Blockers</div>
              <div className="space-y-1">
                {[
                  { label: "세션 시작", done: state.sessionStarted },
                  { label: "파싱 오류 해소", done: state.parseErrorResolved },
                  { label: "보완 루프 종료", done: state.supplementStatus === "resolved" },
                  { label: "비교 결과 검토", done: state.comparisonReviewed },
                  { label: "구조 확정", done: state.branchLocked },
                ].map((item) => (
                  <div key={item.label} className="text-xs">
                    <span className={item.done ? "text-[#000000] font-medium" : "text-[#ba1a1a]"}>{item.done ? "완료" : "미완료"}</span>
                    <span className="text-[#5e5e5e]"> · {item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#000000] mb-2">Next Transition</div>
              <div className="text-xs text-[#5e5e5e] leading-relaxed">
                {canProceedFromStep2 ? "Step 3 공통 분석으로 이동할 수 있습니다." : "Step 3로 이동하기 전에 모든 차단 항목을 해소해야 합니다."}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c6]">
          <Link href="/">
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 대시보드
            </button>
          </Link>
          <button
            onClick={handleProceed}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${
              canProceedFromStep2 ? "bg-[#000000] text-[#ffffff] hover:bg-[#3a3c3c]" : "border border-[#c6c6c6] text-[#777777] cursor-not-allowed"
            }`}
          >
            다음 단계: 기본 분석 →
          </button>
        </div>
      </div>
    </AppShell>
  );
}
