/*
 * DESIGN: Structural Brutalism — Dashboard
 * Overview of active cases, recent activity, system status
 */

import { Link } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";

const CASES = [
  { id: "2024-BOND-082", issuer: "㈜테크파트너스", type: "일반사채", amount: "500억", step: 4, stepLabel: "구조 분석/판단", status: "진행중", risk: "HIGH" },
  { id: "2024-BOND-079", issuer: "㈜그린에너지", type: "후순위채", amount: "300억", step: 2, stepLabel: "업로드/분류", status: "진행중", risk: "MODERATE" },
  { id: "2024-BOND-075", issuer: "㈜메디컬코어", type: "영구채", amount: "200억", step: 6, stepLabel: "보고서 생성", status: "검토중", risk: "LOW" },
  { id: "2024-BOND-071", issuer: "㈜스마트로지스", type: "일반사채", amount: "150억", step: 7, stepLabel: "최종 승인", status: "완료", risk: "LOW" },
];

const STATS = [
  { label: "진행 중 사건", value: "12", sub: "이번 분기" },
  { label: "검토 완료", value: "47", sub: "누적" },
  { label: "평균 처리 시간", value: "3.2일", sub: "이번 달" },
  { label: "AI 분석 정확도", value: "94.1%", sub: "최근 30건" },
];

function getRiskBadge(risk: string) {
  if (risk === "HIGH") return <span className="px-2 py-0.5 text-[10px] font-bold bg-[#000000] text-[#ffffff]">HIGH</span>;
  if (risk === "MODERATE") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#777777] text-[#000000]">MODERATE</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#c6c6c6] text-[#5e5e5e]">LOW</span>;
}

function getStatusBadge(status: string) {
  if (status === "진행중") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#000000] text-[#000000]">진행중</span>;
  if (status === "검토중") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#777777] bg-[#f3f3f3] text-[#5e5e5e]">검토중</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold bg-[#e2e2e2] text-[#777777]">완료</span>;
}

export default function Dashboard() {
  return (
    <AppShell currentStep={0} showRightPanel={false}>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">대시보드</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 font-medium">사모사채 심사 현황 및 진행 중인 사건 목록</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="text-2xl font-black text-[#000000] tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-[#000000] mt-1">{stat.label}</div>
              <div className="text-[10px] text-[#777777] mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="mb-8 border border-[#000000] bg-[#000000] p-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#ffffff]">새 채권 심사 시작</div>
            <div className="text-xs text-[#c6c6c6] mt-0.5">새로운 사모사채 투자 건을 접수하고 AI 보조 심사를 시작합니다.</div>
          </div>
          <Link href="/step2">
            <button className="px-5 py-2.5 bg-[#ffffff] text-[#000000] text-sm font-bold hover:bg-[#e2e2e2] transition-colors flex-shrink-0">
              심사 시작 →
            </button>
          </Link>
        </div>

        {/* Active Cases Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#000000]">진행 중인 사건</h2>
            <button onClick={() => toast.info("준비 중인 기능입니다.")} className="text-xs text-[#5e5e5e] hover:text-[#000000] font-medium">
              전체 보기 →
            </button>
          </div>
          <div className="border border-[#777777] bg-[#ffffff]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f3f3f3] border-b border-[#777777]">
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">사건번호</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">발행사</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">채권 유형</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">발행 규모</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">현재 단계</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">리스크</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">상태</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">액션</th>
                </tr>
              </thead>
              <tbody>
                {CASES.map((c) => (
                  <tr key={c.id} className="border-b border-[#e2e2e2] hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#000000]">{c.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#1a1c1c]">{c.issuer}</td>
                    <td className="px-4 py-3 text-xs text-[#5e5e5e]">{c.type}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#000000]">{c.amount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#5e5e5e]">Step {c.step}</span>
                        <span className="text-[10px] text-[#777777]">{c.stepLabel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getRiskBadge(c.risk)}</td>
                    <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={
                          c.step === 2
                            ? "/step2"
                            : c.step === 3
                            ? "/step3"
                            : c.step === 4
                            ? c.type === "후순위채"
                              ? "/step3b"
                              : c.type === "영구채"
                              ? "/step3c"
                              : "/step3"
                            : c.step === 5
                            ? "/step4"
                            : c.step === 6
                            ? "/step5"
                            : "/step6"
                        }
                      >
                        <button className="px-3 py-1 text-[10px] font-bold border border-[#777777] hover:bg-[#000000] hover:text-[#ffffff] hover:border-[#000000] transition-colors">
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
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-sm font-bold text-[#000000] mb-3 border-b border-[#e2e2e2] pb-2">최근 활동</h3>
            <div className="space-y-2.5">
              {[
                { time: "14:22", action: "2024-BOND-082 구조 분석 완료", user: "김검토" },
                { time: "13:45", action: "2024-BOND-079 문서 파싱 오류 발생", user: "시스템" },
                { time: "11:30", action: "2024-BOND-075 AI 분석 시작", user: "AI 코파일럿" },
                { time: "09:15", action: "2024-BOND-071 최종 승인 완료", user: "이승인" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[10px] font-mono text-[#777777] flex-shrink-0 mt-0.5">{item.time}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#1a1c1c]">{item.action}</div>
                    <div className="text-[10px] text-[#777777]">{item.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
            <h3 className="text-sm font-bold text-[#000000] mb-3 border-b border-[#e2e2e2] pb-2">시스템 상태</h3>
            <div className="space-y-2.5">
              {[
                { name: "AI 분석 엔진", status: "정상", ok: true },
                { name: "문서 파싱 서비스", status: "정상", ok: true },
                { name: "외부 신용 데이터", status: "정상", ok: true },
                { name: "감사 로그 시스템", status: "정상", ok: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-[#1a1c1c]">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 ${item.ok ? "bg-[#000000]" : "bg-[#ba1a1a]"}`} />
                    <span className={`text-[10px] font-bold ${item.ok ? "text-[#000000]" : "text-[#ba1a1a]"}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
