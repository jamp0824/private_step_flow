/*
 * DESIGN: Structural Brutalism — Step 3: 수집 및 사실 분석 (일반채)
 * Financial analysis, credit evaluation, industry analysis, cash flow
 */

import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";

const ANALYSIS_ITEMS = [
  { label: "재무 분석", icon: "bar_chart", status: "완료", done: true },
  { label: "신용 평가", icon: "credit_score", status: "분석 진행 중", done: false },
  { label: "산업 및 시장 분석", icon: "store", status: "완료", done: true },
  { label: "현금흐름 분석", icon: "water_drop", status: "분석 진행 중", done: false },
];

const REQUIRED_DOCS = [
  { label: "최근 3개년 재무제표", done: true },
  { label: "감사보고서", done: true },
  { label: "신용평가 자료", done: true },
  { label: "사업보고서", done: true },
  { label: "주주현황 자료", done: false },
  { label: "부채현황표", done: false },
  { label: "담보 관련 약정서", done: false },
];

export default function Step3Analysis() {
  const [bondType, setBondType] = useState<"일반" | "후순위" | "영구">("일반");
  const [memo, setMemo] = useState("");

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="실시간 분석 지원"
      citations={[
        {
          title: "2023 감사보고서 (p.42)",
          excerpt: "동사의 유동비율은 전년 대비 15% 하락하였으니, 이는 단기 차입금 증가에 기인하며 향후 자산 매각을 통해 해소될 것으로 전망됨.",
        },
        {
          title: "최근 3개년 현금흐름표",
          excerpt: "영업활동 현금흐름 3년 연속 양(+), 투자활동 현금흐름 확대 추세.",
        },
      ]}
      recommendation="후순위채 전환 시 리스크 요인을 추가 검토하십시오."
      analysisLabel="분석 시작"
      extraActions={[
        { label: "유사 사례 검색" },
        { label: "내부 가이드라인" },
      ]}
    />
  );

  return (
    <AppShell currentStep={3} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-7">
          <div className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wider mb-1">Step 3. 수집 및 사실 분석</div>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">기본 데이터 분석 및 외부 정보 교차 검증</h1>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Document Upload */}
            <div className="border border-[#777777] bg-[#f3f3f3] p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[18px] text-[#5e5e5e]">upload_file</span>
                <h3 className="text-sm font-bold text-[#000000]">추가 증빙 서류 업로드</h3>
              </div>
              <div
                className="border-2 border-dashed border-[#777777] bg-[#ffffff] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#f9f9f9] transition-colors"
                onClick={() => toast.info("파일 선택 (준비 중)")}>
                <span className="material-symbols-outlined text-2xl text-[#5e5e5e] mb-2">cloud_upload</span>
                <p className="text-xs font-medium text-[#000000] mb-1">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-[10px] text-[#777777]">PDF, Excel, Word (최대 50MB)</p>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-bold text-[#5e5e5e] uppercase mb-2">필수 항목 리스트</div>
                <div className="space-y-1.5">
                  {REQUIRED_DOCS.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 flex-shrink-0 flex items-center justify-center ${item.done ? "bg-[#000000]" : "border border-[#777777]"}`}>
                        {item.done && <span className="material-symbols-outlined text-[9px] text-[#ffffff]">check</span>}
                      </div>
                      <span className={`text-[10px] ${item.done ? "text-[#1a1c1c] font-medium" : "text-[#777777]"}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Internal & External Search */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[16px] text-[#5e5e5e]">search</span>
                <h3 className="text-sm font-bold text-[#000000]">내부 및 외부 자료 검색</h3>
              </div>
              <input
                type="text"
                placeholder="이력검색이 업투..."
                className="w-full border border-[#777777] px-3 py-2 text-xs outline-none focus:border-[#000000] mb-2"
              />
              <div className="space-y-1.5">
                {["유사 사례 검색", "내부 가이드라인 검색", "외부 공시/뉴스/신용정보 검색"].map((item) => (
                  <button
                    key={item}
                    onClick={() => toast.info("준비 중인 기능입니다.")}
                    className="w-full flex items-center justify-between px-3 py-2 border border-[#c6c6c6] text-xs text-[#1a1c1c] hover:bg-[#f3f3f3] transition-colors"
                  >
                    <span>{item}</span>
                    <span className="material-symbols-outlined text-[14px] text-[#777777]">chevron_right</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column (spans 2) */}
          <div className="col-span-2 space-y-5">
            {/* Analysis Status Grid */}
            <div>
              <h3 className="text-sm font-bold text-[#000000] mb-3 border-b border-[#c6c6c6] pb-2">기본 분석 현황</h3>
              <div className="grid grid-cols-2 gap-3">
                {ANALYSIS_ITEMS.map((item) => (
                  <div key={item.label} className={`border p-4 ${item.done ? "border-[#c6c6c6] bg-[#ffffff]" : "border-[#000000] bg-[#f9f9f9]"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#000000]">{item.label}</span>
                      <span className="material-symbols-outlined text-[18px] text-[#5e5e5e]">{item.icon}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 ${item.done ? "bg-[#000000]" : "bg-[#e2e2e2] border border-[#777777]"}`} />
                      <span className={`text-[10px] font-bold ${item.done ? "text-[#000000]" : "text-[#5e5e5e]"}`}>
                        {item.done ? "■ 완료" : "◌ " + item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bond Detail Extraction */}
            <div className="border border-[#c6c6c6] bg-[#ffffff] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#5e5e5e]">receipt_long</span>
                  <h3 className="text-sm font-bold text-[#000000]">사모사채 세부 정보 추출</h3>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#e2e2e2] text-[#000000]">추출 완료</span>
              </div>
              <div className="space-y-2">
                <div className="border-l-2 border-[#000000] pl-3 py-1">
                  <div className="text-xs font-bold text-[#000000]">상환 일정 분석</div>
                  <div className="text-[11px] text-[#5e5e5e] mt-0.5">2024-06-30 (10%), 2024-12-31 (20%), 2025-12-31 (70%)</div>
                </div>
                <div className="border-l-2 border-[#000000] pl-3 py-1">
                  <div className="text-xs font-bold text-[#000000]">표면 금리 vs 실효 금리 분석</div>
                  <div className="text-[11px] text-[#5e5e5e] mt-0.5">표면 5.5% / 실효 6.2% (발행 세비용 감안)</div>
                </div>
              </div>
            </div>

            {/* Bond Type Selection */}
            <div className="border border-[#777777] bg-[#f3f3f3] p-4">
              <h3 className="text-sm font-bold text-[#000000] mb-1">구조 분기 선택</h3>
              <p className="text-xs text-[#5e5e5e] mb-3">수집된 정보를 바탕으로 다음 단계 분석 구조를 확정합니다.</p>
              <div className="flex gap-2">
                {(["일반", "후순위", "영구"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBondType(type)}
                    className={`px-4 py-2 text-sm font-bold transition-colors ${
                      bondType === type
                        ? "bg-[#000000] text-[#ffffff]"
                        : "border border-[#777777] text-[#000000] hover:bg-[#f3f3f3]"
                    }`}
                  >
                    {type}채
                  </button>
                ))}
              </div>
            </div>

            {/* Reviewer Memo */}
            <div>
              <h3 className="text-sm font-bold text-[#000000] mb-2 border-b border-[#c6c6c6] pb-2">검토자 메모 및 외부 정보 활용 기록</h3>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full border border-[#777777] bg-[#ffffff] p-3 text-sm text-[#1a1c1c] placeholder-[#777777] outline-none focus:border-[#000000] resize-none"
                rows={4}
                placeholder="검토 의견을 입력하세요..."
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c6]">
              <Link href="/step2">
                <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
                  ← 이전: 업로드/분류
                </button>
              </Link>
              <Link href="/step4">
                <button className="px-6 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors">
                  다음 단계: 구조 분석/판단 →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
