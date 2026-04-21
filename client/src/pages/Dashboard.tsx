/*
 * DESIGN: Structural Brutalism — Dashboard
 * Overview of active cases, recent activity, system status
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { getStageRoute } from "@/config/stages";
import { STAGE_ROUTE_MAP } from "@/config/stages";
import { useDemoCase } from "@/contexts/DemoCaseContext";
import { useWorkflow } from "@/contexts/WorkflowContext";

const CASES = [
  { id: "DEMO-BOND-082", issuer: "프로젝트 오메가", type: "일반사채", amount: "124억", stage: 4, stageLabel: "종합 판단", status: "진행중", risk: "HIGH" },
  { id: "DEMO-BOND-079", issuer: "스튜디오 라인", type: "후순위채", amount: "86억", stage: 3, stageLabel: "브랜치 분석", status: "진행중", risk: "MODERATE" },
  { id: "DEMO-BOND-075", issuer: "시그널 워크스", type: "영구채", amount: "92억", stage: 5, stageLabel: "보고서 작성", status: "검토중", risk: "LOW" },
  { id: "DEMO-BOND-071", issuer: "노스 필드", type: "일반사채", amount: "68억", stage: 7, stageLabel: "모니터링", status: "완료", risk: "LOW" },
];

const STATS = [
  { label: "진행 중 사건", value: "12", sub: "이번 분기" },
  { label: "검토 완료", value: "47", sub: "누적" },
  { label: "평균 처리 시간", value: "3.2일", sub: "이번 달" },
  { label: "AI 분석 정확도", value: "94.1%", sub: "최근 30건" },
];

const REQUIRED_INTAKE_DOCS = [
  "투자검토요청서",
  "회사 개요서 / IM",
  "Term Sheet",
  "발행 개요서",
  "사모사채 발행 조건표",
];

function getRiskBadge(risk: string) {
  if (risk === "HIGH") return <span className="px-2 py-0.5 text-[10px] font-bold bg-[#004999] text-[#ffffff]">HIGH</span>;
  if (risk === "MODERATE") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#6b8199] text-[#004999]">MODERATE</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#b8c8d8] text-[#4a6080]">LOW</span>;
}

function getStatusBadge(status: string) {
  if (status === "진행중") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#004999] text-[#004999]">진행중</span>;
  if (status === "검토중") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#6b8199] bg-[#f0f5fa] text-[#4a6080]">검토중</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold bg-[#dce8f0] text-[#6b8199]">완료</span>;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [capturedFileName, setCapturedFileName] = useState("");
  const { setActiveCaseId } = useDemoCase();
  const { resetWorkflow } = useWorkflow();

  const handleCreateReviewRequest = () => {
    const caseSuffix = String(Date.now()).slice(-4);
    const nextCaseId = `DEMO-REQ-${caseSuffix}`;

    setActiveCaseId(nextCaseId);
    setIsIntakeOpen(false);
    toast.success("새 검토 요청이 접수되어 Stage 2로 이동합니다.");
    navigate(STAGE_ROUTE_MAP[2]);
  };

  return (
    <AppShell currentStage={0} showRightPanel={false}>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#004999] tracking-tight">대시보드</h1>
            <p className="text-sm text-[#4a6080] mt-1 font-medium">사모사채 심사 현황 및 진행 중인 사건 목록</p>
          </div>
          <button
            onClick={() => {
              const confirmed = window.confirm("데모 상태를 초기화하고 Stage 1으로 돌아갈까요?");

              if (!confirmed) return;

              resetWorkflow();
              navigate(STAGE_ROUTE_MAP[1]);
              toast.success("데모 상태를 초기화했습니다.");
            }}
            className="px-3 py-2 border border-[#6b8199] text-[11px] font-bold text-[#004999] hover:bg-[#f0f5fa] transition-colors"
          >
            Reset Demo State
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="border border-[#b8c8d8] bg-[#ffffff] p-4">
              <div className="text-2xl font-black text-[#004999] tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-[#004999] mt-1">{stat.label}</div>
              <div className="text-[10px] text-[#6b8199] mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="mb-8 border border-[#004999] bg-[#004999] p-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#ffffff]">새 채권 심사 시작</div>
            <div className="text-xs text-[#b8c8d8] mt-0.5">새로운 사모사채 투자 건을 접수하고 AI 보조 심사를 시작합니다.</div>
          </div>
          <button
            onClick={() => setIsIntakeOpen(true)}
            className="px-5 py-2.5 bg-[#ffffff] text-[#004999] text-sm font-bold hover:bg-[#dce8f0] transition-colors flex-shrink-0"
          >
            New Review Request →
          </button>
        </div>

        {/* Active Cases Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#004999]">진행 중인 사건</h2>
            <button onClick={() => toast.info("준비 중인 기능입니다.")} className="text-xs text-[#4a6080] hover:text-[#004999] font-medium">
              전체 보기 →
            </button>
          </div>
          <div className="border border-[#6b8199] bg-[#ffffff]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f0f5fa] border-b border-[#6b8199]">
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase tracking-wide">사건번호</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase tracking-wide">발행사</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase tracking-wide">채권 유형</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase tracking-wide">발행 규모</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase tracking-wide">현재 단계</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase tracking-wide">리스크</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase tracking-wide">상태</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#4a6080] uppercase tracking-wide">액션</th>
                </tr>
              </thead>
              <tbody>
                {CASES.map((c) => (
                  <tr key={c.id} className="border-b border-[#dce8f0] hover:bg-[#f5f8fc] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#004999]">{c.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#0d1b2a]">{c.issuer}</td>
                    <td className="px-4 py-3 text-xs text-[#4a6080]">{c.type}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#004999]">{c.amount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#4a6080]">Stage {c.stage}</span>
                        <span className="text-[10px] text-[#6b8199]">{c.stageLabel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getRiskBadge(c.risk)}</td>
                    <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                    <td className="px-4 py-3">
                      <Link href={getStageRoute(c.stage as 1 | 2 | 3 | 4 | 5 | 6 | 7, c.type === "후순위채" ? "subordinated" : c.type === "영구채" ? "perpetual" : "general")}>
                        <button
                          onClick={() => setActiveCaseId(c.id)}
                          className="px-3 py-1 text-[10px] font-bold border border-[#6b8199] hover:bg-[#004999] hover:text-[#ffffff] hover:border-[#004999] transition-colors"
                        >
                          검토 계속
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {/* Recent Activity */}
          <div className="border border-[#b8c8d8] bg-[#ffffff] p-4">
            <h3 className="text-sm font-bold text-[#004999] mb-3 border-b border-[#dce8f0] pb-2">최근 활동</h3>
            <div className="space-y-2.5">
              {[
                { time: "14:22", action: "2024-BOND-082 구조 분석 완료", user: "김검토" },
                { time: "13:45", action: "2024-BOND-079 문서 파싱 오류 발생", user: "시스템" },
                { time: "11:30", action: "2024-BOND-075 AI 분석 시작", user: "AI 코파일럿" },
                { time: "09:15", action: "2024-BOND-071 최종 승인 완료", user: "이승인" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[10px] font-mono text-[#6b8199] flex-shrink-0 mt-0.5">{item.time}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#0d1b2a]">{item.action}</div>
                    <div className="text-[10px] text-[#6b8199]">{item.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="border border-[#b8c8d8] bg-[#ffffff] p-4">
            <h3 className="text-sm font-bold text-[#004999] mb-3 border-b border-[#dce8f0] pb-2">시스템 상태</h3>
            <div className="space-y-2.5">
              {[
                { name: "AI 분석 엔진", status: "정상", ok: true },
                { name: "문서 파싱 서비스", status: "정상", ok: true },
                { name: "외부 신용 데이터", status: "정상", ok: true },
                { name: "감사 로그 시스템", status: "정상", ok: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-[#0d1b2a]">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 ${item.ok ? "bg-[#004999]" : "bg-[#c0392b]"}`} />
                    <span className={`text-[10px] font-bold ${item.ok ? "text-[#004999]" : "text-[#c0392b]"}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isIntakeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
            <div className="w-full max-w-4xl border border-[#004999] bg-[#f5f8fc]">
              <div className="flex items-center justify-between border-b border-[#6b8199] px-6 py-4 bg-[#ffffff]">
                <div>
                  <div className="text-xs font-bold text-[#4a6080] uppercase tracking-wider">Stage 1. Review Request Intake</div>
                  <div className="text-xl font-black text-[#004999] mt-1">New Review Request</div>
                </div>
                <button onClick={() => setIsIntakeOpen(false)} className="text-xs font-bold text-[#4a6080] hover:text-[#004999]">
                  닫기
                </button>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6 p-6">
                <div className="space-y-5">
                  <section className="bp-card">
                    <h3 className="text-sm font-bold text-[#004999] mb-3">파일 업로드 존</h3>
                    <label className="block border border-dashed border-[#6b8199] bg-[#ffffff] p-5 cursor-pointer hover:bg-[#f0f5fa] transition-colors">
                      <div className="text-xs font-bold text-[#004999]">파일명만 캡처합니다. 실제 업로드는 수행하지 않습니다.</div>
                      <div className="text-[11px] text-[#4a6080] mt-1">{capturedFileName || "예: private_bond_demo_request.pdf"}</div>
                      <input
                        type="file"
                        className="mt-3 block text-[11px] text-[#4a6080]"
                        onChange={(event) => setCapturedFileName(event.target.files?.[0]?.name || "")}
                      />
                    </label>
                  </section>

                  <section className="bp-card">
                    <h3 className="text-sm font-bold text-[#004999] mb-3">Required Document Checklist</h3>
                    <div className="space-y-2">
                      {REQUIRED_INTAKE_DOCS.map((doc) => (
                        <div key={doc} className="flex items-center gap-2 text-xs">
                          <div className={`w-4 h-4 flex items-center justify-center ${capturedFileName ? "bg-[#004999]" : "border border-[#6b8199]"}`}>
                            {capturedFileName && <span className="material-symbols-outlined text-[11px] text-[#ffffff]">check</span>}
                          </div>
                          <span className="text-[#004999]">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="space-y-5">
                  <section className="bp-card">
                    <div className="text-[10px] font-bold text-[#4a6080] uppercase tracking-wide mb-2">AI Product Classification</div>
                    <div className="text-3xl font-black text-[#004999]">98%</div>
                    <div className="text-sm font-bold text-[#004999] mt-1">General Private Bond</div>
                    <div className="text-[11px] text-[#4a6080] mt-2">콜옵션·후순위·영구채 키워드가 약하여 일반 사모사채 가능성이 가장 높게 분류되었습니다.</div>
                    <div className="mt-3 border border-[#6b8199] bg-[#f0f5fa] p-3 text-[11px] text-[#4a6080]">
                      분류 근거: 조건표 초안, 발행 개요, 요청서 메타정보
                    </div>
                  </section>

                  <section className="bp-card">
                    <div className="text-[10px] font-bold text-[#4a6080] uppercase tracking-wide mb-3">Intake Controls</div>
                    <button
                      onClick={handleCreateReviewRequest}
                      disabled={!capturedFileName}
                      className={
                        capturedFileName
                          ? "btn-primary w-full"
                          : "w-full px-4 py-2 border border-[#b8c8d8] text-sm font-bold text-[#6b8199] cursor-not-allowed"
                      }
                    >
                      Stage 2로 이동
                    </button>
                    <div className="text-[11px] text-[#4a6080] mt-2">업로드 파일은 저장되지 않으며 파일명만 현재 세션에 반영됩니다.</div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
