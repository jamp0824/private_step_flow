/*
 * DESIGN: Structural Brutalism — Step 4: 구조 분석/판단
 * Risk metrics, anomaly detection, deal adequacy, risk summary table
 */

import { Link } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";

const RISK_METRICS = [
  {
    label: "신용 리스크 (CREDIT)",
    level: "HIGH",
    value: "BB+",
    desc: "안정적 전망에서 부정적으로 하향 조정 가능성",
  },
  {
    label: "유동성 리스크 (LIQUIDITY)",
    level: "MODERATE",
    value: "0.82x",
    desc: "단기 상환 능력 주의 관찰 필요",
  },
  {
    label: "법률 리스크 (LEGAL)",
    level: "LOW",
    value: "CLEAN",
    desc: "특이 조항 및 분쟁 기록 없음",
  },
];

const ANOMALIES = [
  {
    title: "비정상 조항 감지",
    desc: "제8조에 정의되지 않은 용어 '특별상환권'이 사용됨.",
  },
  {
    title: "데이터 불일치",
    desc: "사인보고서와 투자설명서 내 총 부채 총계가 약 1.2억 원 상이.",
  },
];

const DEAL_ADEQUACY = [
  { label: "RATE (금리)", value: "5.2%", sub: "/ Bench: 4.8%", progress: 70 },
  { label: "STRUCTURE (구조)", value: "Standard bullet", sub: "시장 표준 부합", ok: true },
  { label: "AMOUNT (규모)", value: "500억", sub: "적정 수요 예측 범위 내" },
  { label: "SPREAD (가산금리)", value: "+120bp", sub: "Peer 대비 20bp 높음", highlight: true },
];

function RiskLevelBadge({ level }: { level: string }) {
  if (level === "HIGH") return <span className="px-2 py-0.5 text-[10px] font-bold bg-[#000000] text-[#ffffff]">HIGH</span>;
  if (level === "MODERATE") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#777777] text-[#000000]">MODERATE</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#c6c6c6] text-[#5e5e5e]">LOW</span>;
}

export default function Step4Review() {
  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="검토 지원 도구"
      citations={[
        {
          title: "계약서 제12조 3항",
          excerpt: '"발행인은 기한 이익상실 사유 발생 시 즉시 서면으로 통지해야 함..."',
          highlight: "현재 통지 지연 발생 (3일 경과)",
        },
        {
          title: "판례 2022다12345",
          excerpt: '"사모사채의 경우 담보권 실행 절차의 정당성은..."',
        },
      ]}
      recommendation="계약서 제12조 위반 여부를 법무팀과 즉시 협의하십시오."
      analysisLabel="분석 요청"
      extraActions={[
        { label: "채팅" },
        { label: "참조 문서" },
        { label: "메모" },
      ]}
    />
  );

  return (
    <AppShell currentStep={4} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        {/* Warning Banner */}
        <div className="mb-6 border border-[#ba1a1a] bg-[#ffdad6] p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-[#ba1a1a] flex-shrink-0 mt-0.5">warning</span>
          <div>
            <div className="text-sm font-bold text-[#ba1a1a]">중요 위험 감지: 발행사의 유동성 지표가 임계치를 초과했습니다.</div>
            <div className="text-xs text-[#ba1a1a] mt-1">최근 3분기 재무표 기준 부채비용이 계약성 제한 조건(Covenant)을 상회하고 있습니다. 즉각적인 확인이 필요합니다.</div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {RISK_METRICS.map((metric) => (
            <div key={metric.label} className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">{metric.label}</span>
                <RiskLevelBadge level={metric.level} />
              </div>
              <div className="text-2xl font-black text-[#000000] tracking-tight mb-1">{metric.value}</div>
              <div className="text-[10px] text-[#777777] leading-relaxed">{metric.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Anomaly Detection */}
          <div>
            <h2 className="text-sm font-bold text-[#000000] mb-3 border-l-4 border-[#000000] pl-3">이상 항목 감지 리스트</h2>
            <div className="space-y-3">
              {ANOMALIES.map((item) => (
                <div key={item.title} className="border border-[#c6c6c6] bg-[#ffffff] p-3 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] flex-shrink-0">error</span>
                  <div>
                    <div className="text-xs font-bold text-[#000000] mb-0.5">{item.title}</div>
                    <div className="text-[11px] text-[#5e5e5e] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Summary */}
          <div>
            <h2 className="text-sm font-bold text-[#000000] mb-3 border-l-4 border-[#000000] pl-3">검토 결과 요약</h2>
            <div className="space-y-3">
              <div className="border border-[#c6c6c6] bg-[#ffffff] p-3">
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-2">CONTRACT REVIEW FINDINGS</div>
                <p className="text-[11px] text-[#3a3c3c] leading-relaxed">
                  계약 조건 전반은 시장 표준에 부합하나, 기한전 상환권(Call Option)의 행사가격 산정 방식이 발행사에 유리하게 설정되어 있음.
                </p>
              </div>
              <div className="border border-[#c6c6c6] bg-[#ffffff] p-3">
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-2">CLAUSE DETECTION RESULTS</div>
                <p className="text-[11px] text-[#3a3c3c] leading-relaxed">
                  Cross-Default 조항이 모든 계열사로 확대 적용되어 있어, 특정 계열사의 부도가 본 채권의 조기 상환 사유가 될 수 있음.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Adequacy */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#000000] mb-3 border-l-4 border-[#000000] pl-3">적정성 검토 (Deal Adequacy)</h2>
          <div className="grid grid-cols-4 gap-3">
            {DEAL_ADEQUACY.map((item) => (
              <div key={item.label} className={`border p-4 ${item.highlight ? "border-[#ba1a1a] bg-[#fff5f5]" : "border-[#c6c6c6] bg-[#ffffff]"}`}>
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-2">{item.label}</div>
                <div className={`text-xl font-black tracking-tight mb-1 ${item.highlight ? "text-[#000000]" : "text-[#000000]"}`}>{item.value}</div>
                {item.sub && (
                  <div className={`text-[10px] font-medium ${item.highlight ? "text-[#ba1a1a] font-bold" : "text-[#777777]"}`}>{item.sub}</div>
                )}
                {item.ok && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[12px] text-[#000000]">check_circle</span>
                    <span className="text-[10px] font-bold text-[#000000]">시장 표준 부합</span>
                  </div>
                )}
                {(item as any).progress && (
                  <div className="mt-2 h-1 bg-[#e2e2e2]">
                    <div className="h-1 bg-[#000000]" style={{ width: `${(item as any).progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Risk Summary Table */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#000000] mb-3 border-l-4 border-[#000000] pl-3">통합 리스크 요약 테이블</h2>
          <div className="border border-[#777777] bg-[#ffffff]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f3f3f3] border-b border-[#777777]">
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">리스크 항목</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">등급</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">세부 내용</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase">조치 필요</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { item: "신용 리스크", grade: "HIGH", detail: "BB+ 등급, 부정적 전망", action: "즉시 검토" },
                  { item: "유동성 리스크", grade: "MODERATE", detail: "유동비율 0.82x", action: "모니터링" },
                  { item: "법률 리스크", grade: "LOW", detail: "특이사항 없음", action: "-" },
                  { item: "계약 조항 리스크", grade: "HIGH", detail: "Cross-Default 조항 광범위 적용", action: "법무팀 검토" },
                  { item: "금리 리스크", grade: "MODERATE", detail: "Spread +120bp, Peer 대비 높음", action: "재검토" },
                ].map((row) => (
                  <tr key={row.item} className="border-b border-[#e2e2e2] hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-[#000000]">{row.item}</td>
                    <td className="px-4 py-3"><RiskLevelBadge level={row.grade} /></td>
                    <td className="px-4 py-3 text-xs text-[#5e5e5e]">{row.detail}</td>
                    <td className="px-4 py-3">
                      {row.action !== "-" ? (
                        <span className={`text-[10px] font-bold ${row.grade === "HIGH" ? "text-[#ba1a1a]" : "text-[#5e5e5e]"}`}>{row.action}</span>
                      ) : (
                        <span className="text-[#c6c6c6] text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c6]">
          <Link href="/step3">
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 이전: 기본 분석
            </button>
          </Link>
          <Link href="/step56">
            <button className="px-6 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors">
              다음 단계: 보고서 작성 →
            </button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
