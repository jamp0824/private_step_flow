/* Phase: P0 — issue #2 */

import { Link } from "wouter";
import { toast } from "sonner";
import AICopilotPanel from "@/components/AICopilotPanel";
import AppShell from "@/components/AppShell";
import { STAGE_ROUTE_MAP } from "@/config/stages";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useStageGuard } from "@/hooks/useStageGuard";
import { getAICopilotScenario } from "@/mocks/aiCopilot";
import { STAGE7_MONITORING_MOCK } from "@/mocks/stage7Monitoring";

function getToneClass(tone: "stable" | "watch" | "risk") {
  if (tone === "stable") return "border-[#e5e7eb] text-[#004999] bg-[#ffffff]";
  if (tone === "watch") return "border-[#004999] text-[#004999] bg-[#f3f4f6]";
  return "border-[#c0392b] text-[#c0392b] bg-[#fff5f5]";
}

function getStatusBadge(status: "ON TRACK" | "WATCH" | "BREACH RISK") {
  if (status === "ON TRACK") {
    return <span className="badge-active">ON TRACK</span>;
  }
  if (status === "WATCH") {
    return <span className="badge-moderate">WATCH</span>;
  }
  return <span className="badge-error">BREACH RISK</span>;
}

export default function Stage7Monitoring() {
  const { state } = useWorkflow();
  const { summary, covenantTracker, financialSignals, alerts, reminders } = STAGE7_MONITORING_MOCK;

  useStageGuard({
    canAccess: state.reviewStatus === "approved",
    redirectTo: STAGE_ROUTE_MAP[6],
    message: "승인 완료 건만 Stage 7 모니터링 콘솔에 진입할 수 있습니다.",
  });

  const copilotPanel = (
    <AICopilotPanel scenario={getAICopilotScenario(7, state.branchType)} />
  );

  return (
    <AppShell caseId={summary.caseId} currentStage={7} rightPanel={copilotPanel}>
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="warning-banner">
          <div className="text-sm font-bold text-[#c0392b]">Phase 1 Scope: Monitoring Read-Only — Automated actions are Phase 2</div>
          <div className="text-xs text-[#c0392b] mt-1">이 화면은 상태 확인과 추천 메모만 제공합니다. 실제 알림 발송, 감시 등급 변경, 자동 조치는 데모 범위 밖입니다.</div>
        </div>

        <div>
          <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">Stage 7. Post-Approval Monitoring</div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">후속조치 및 운영 모니터링 콘솔</h1>
          <p className="text-sm text-[#6b7280] mt-1.5 font-medium">승인 이후 covenant, 재무신호, 지연위험, AI 추천 메모를 읽기 전용으로 통합 확인합니다.</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bp-card">
            <div className="text-[10px] font-bold text-[#6b7280] uppercase">Case</div>
            <div className="text-sm font-black text-[#111827] mt-1">{summary.caseId}</div>
            <div className="text-[11px] text-[#6b7280] mt-1">{summary.issuer}</div>
          </div>
          <div className="bp-card">
            <div className="text-[10px] font-bold text-[#6b7280] uppercase">Facility</div>
            <div className="text-sm font-black text-[#111827] mt-1">{summary.facilityType}</div>
            <div className="text-[11px] text-[#6b7280] mt-1">승인 후 사후관리 중</div>
          </div>
          <div className="bp-card">
            <div className="text-[10px] font-bold text-[#6b7280] uppercase">Watch Status</div>
            <div className="text-sm font-black text-[#111827] mt-1">{summary.watchStatus}</div>
            <div className="text-[11px] text-[#6b7280] mt-1">집중 모니터링 유지</div>
          </div>
          <div className="bp-card">
            <div className="text-[10px] font-bold text-[#6b7280] uppercase">Next Review</div>
            <div className="text-sm font-black text-[#111827] mt-1">{summary.nextReviewDate}</div>
            <div className="text-[11px] text-[#6b7280] mt-1">내부 캘린더 기준</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <section className="bp-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[#111827]">Covenant Tracker</h2>
                <button onClick={() => toast.info("Phase 2: covenant action queue")} className="btn-secondary text-xs">
                  Phase 2 액션 보기
                </button>
              </div>
              <table className="bp-table">
                <thead>
                  <tr>
                    <th>Covenant</th>
                    <th>Threshold</th>
                    <th>Latest</th>
                    <th>Status</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {covenantTracker.map((item) => (
                    <tr key={item.covenant}>
                      <td className="font-medium text-[#004999]">{item.covenant}</td>
                      <td>{item.threshold}</td>
                      <td>{item.latestValue}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>{item.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="bp-card">
              <h2 className="text-sm font-semibold text-[#111827] mb-4">Delay / EOD Detection Rail</h2>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={`${alert.time}-${alert.title}`} className="border border-[#e5e7eb] bg-[#f8f9fa] p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-[#6b7280] uppercase">{alert.type}</span>
                      <span className="text-[10px] font-mono text-[#6b7280]">{alert.time}</span>
                    </div>
                    <div className="text-xs font-bold text-[#374151]">{alert.title}</div>
                    <div className="text-[11px] text-[#6b7280] mt-1">{alert.detail}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bp-card">
              <h2 className="text-sm font-semibold text-[#111827] mb-4">Financial Covenant Monitoring</h2>
              <div className="space-y-3">
                {financialSignals.map((signal) => (
                  <div key={signal.label} className={`border p-3 ${getToneClass(signal.tone)}`}>
                    <div className="text-[10px] font-bold uppercase mb-1">{signal.label}</div>
                    <div className="text-xl font-black">{signal.value}</div>
                    <div className="text-[11px] mt-1">{signal.delta}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bp-card">
              <h2 className="text-sm font-semibold text-[#111827] mb-4">AI Reminder Suggestions</h2>
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <button
                    key={reminder.title}
                    onClick={() => toast.info(reminder.phase2Label)}
                    className="w-full border border-[#e5e7eb] bg-[#ffffff] p-3 text-left hover:bg-[#f3f4f6] transition-colors"
                  >
                    <div className="text-xs font-bold text-[#374151]">{reminder.title}</div>
                    <div className="text-[11px] text-[#6b7280] mt-1">{reminder.detail}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="bp-card">
              <h2 className="text-sm font-semibold text-[#111827] mb-3">Monitoring Summary</h2>
              <div className="space-y-2 text-xs text-[#111827]">
                <div className="border border-[#e5e7eb] bg-[#f8f9fa] p-3">3개 운영 신호 중 2개가 watch 이상으로 분류되었습니다.</div>
                <div className="border border-[#e5e7eb] bg-[#f8f9fa] p-3">다음 검토 전까지 분기 재무자료 수신 여부를 우선 확인해야 합니다.</div>
                <div className="border border-[#e5e7eb] bg-[#f8f9fa] p-3">실제 운영 조치와 감사 로그 기록은 Phase 2 범위입니다.</div>
              </div>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#e5e7eb]">
          <Link href={STAGE_ROUTE_MAP[6]}>
            <button className="btn-secondary">← 이전: 승인</button>
          </Link>
          <button onClick={() => toast.info("Phase 2: monitoring export")} className="btn-primary">
            모니터링 패키지 내보내기
          </button>
        </div>
      </div>
    </AppShell>
  );
}
