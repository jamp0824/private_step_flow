/*
 * DESIGN: Structural Brutalism — Step 2: 기초 준비 및 1차 검토
 * Document upload, parsing status table, AI initial classification
 */

import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import AICopilotPanel from "@/components/AICopilotPanel";

const DOCS = [
  { name: "투자검토요청서_v1.pdf", upload: "완료", parse: "파싱중", classify: "-", error: "-", parseStatus: "active" },
  { name: "기업개요_IM_최종.pptx", upload: "완료", parse: "완료", classify: "분류중", error: "-", parseStatus: "done" },
  { name: "텀시트_초안_오류.docx", upload: "완료", parse: "파싱오류", classify: "-", error: "페이지 누락 의심", parseStatus: "error" },
];

const AI_RESULTS = [
  { label: "구조 분류", icon: "account_tree", result: "무보증 사모사채", sub: "분석 결과" },
  { label: "사모 적격성", icon: "verified_user", result: "확인 필요 (50인 이상)", sub: "상태", highlight: true },
  { label: "사모 요건 체크", icon: "checklist", result: "완료 (특이사항 없음)", sub: "진행률" },
];

function ParseBadge({ status, label }: { status: string; label: string }) {
  if (status === "done") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#777777] bg-[#e2e2e2] text-[#000000]">{label}</span>;
  if (status === "active") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#000000] bg-[#ffffff] text-[#000000]">{label}</span>;
  if (status === "error") return <span className="px-2 py-0.5 text-[10px] font-bold border border-[#ba1a1a] bg-[#ffffff] text-[#ba1a1a]">{label}</span>;
  return <span className="text-[#777777] text-xs">-</span>;
}

export default function Step2Upload() {
  const [isDragging, setIsDragging] = useState(false);

  const copilotPanel = (
    <AICopilotPanel
      title="AI 코파일럿"
      subtitle="심사 보조 및 분석"
      systemSuggestion="현재 '이자율'이 내부 기준(6.0%)에 미달합니다. 예외 승인 품의서를 준비하시겠습니까?"
      citations={[]}
      analysisLabel="분석 시작"
      extraActions={[]}
    />
  );

  return (
    <AppShell currentStep={2} rightPanel={copilotPanel}>
      <div className="p-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-black text-[#000000] tracking-tight">기초 준비 및 1차 검토</h1>
          <p className="text-sm text-[#5e5e5e] mt-1.5 font-medium">Step 2: 필요 문서를 업로드하고 AI의 초기 분류 및 추출 결과를 확인합니다.</p>
        </div>

        {/* Document Upload Zone */}
        <section className="mb-6 border border-[#777777] bg-[#f3f3f3] p-5">
          <h2 className="text-sm font-bold text-[#000000] mb-4 border-b border-[#c6c6c6] pb-2">필수 문서 업로드</h2>
          <div
            className={`border-2 border-dashed ${isDragging ? "border-[#000000] bg-[#f3f3f3]" : "border-[#777777] bg-[#ffffff]"} p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#f9f9f9] transition-colors`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); toast.success("파일이 업로드되었습니다."); }}
            onClick={() => toast.info("파일 선택 다이얼로그 (준비 중)")}>
            <span className="material-symbols-outlined text-4xl text-[#5e5e5e] mb-3">cloud_upload</span>
            <p className="text-sm font-bold text-[#000000] mb-1">여기로 파일을 드래그하거나 클릭하여 업로드하세요</p>
            <p className="text-xs text-[#777777]">투자검토요청서, 기업개요/IM, 텀시트, 발행총괄, 사모사채 발행조건표</p>
          </div>
        </section>

        {/* Upload & Parsing Status */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <h2 className="text-sm font-bold text-[#000000] mb-3 border-b border-[#c6c6c6] pb-2">업로드 및 파싱 상태</h2>
            <div className="border border-[#777777] bg-[#ffffff]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f3f3f3] border-b border-[#777777]">
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">문서명</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">업로드</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">파싱</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">분류</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold text-[#5e5e5e] uppercase tracking-wide">에러</th>
                  </tr>
                </thead>
                <tbody>
                  {DOCS.map((doc) => (
                    <tr key={doc.name} className="border-b border-[#e2e2e2] hover:bg-[#f9f9f9] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#000000] text-xs">{doc.name}</td>
                      <td className="px-4 py-3"><ParseBadge status="done" label={doc.upload} /></td>
                      <td className="px-4 py-3"><ParseBadge status={doc.parseStatus} label={doc.parse} /></td>
                      <td className="px-4 py-3">
                        {doc.classify !== "-" ? <ParseBadge status="active" label={doc.classify} /> : <span className="text-[#777777] text-xs">-</span>}
                      </td>
                      <td className="px-4 py-3">
                        {doc.error !== "-" ? <span className="text-[10px] font-bold text-[#ba1a1a]">{doc.error}</span> : <span className="text-[#777777] text-xs">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h2 className="text-sm font-bold text-[#000000] mb-3 border-b border-[#c6c6c6] pb-2">필수 항목 리스트</h2>
            <div className="space-y-1.5">
              {[
                { label: "최근 3개년 재무제표", done: true },
                { label: "감사보고서", done: true },
                { label: "신용평가 자료", done: true },
                { label: "사업보고서", done: true },
                { label: "주주현황 자료", done: false },
                { label: "부채현황표", done: false },
                { label: "담보 관련 약정서", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center ${item.done ? "bg-[#000000]" : "border border-[#777777]"}`}>
                    {item.done && <span className="material-symbols-outlined text-[10px] text-[#ffffff]">check</span>}
                  </div>
                  <span className={`text-xs ${item.done ? "text-[#1a1c1c] font-medium" : "text-[#777777]"}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1차 자동 검토 (AI) */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-[#000000] mb-3 border-b border-[#c6c6c6] pb-2">1차 자동 검토 (AI)</h2>
          <div className="grid grid-cols-3 gap-4">
            {AI_RESULTS.map((item) => (
              <div key={item.label} className={`border p-4 ${item.highlight ? "border-[#ba1a1a] bg-[#fff5f5]" : "border-[#c6c6c6] bg-[#ffffff]"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#5e5e5e] uppercase tracking-wide">{item.label}</span>
                  <span className="material-symbols-outlined text-[16px] text-[#5e5e5e]">{item.icon}</span>
                </div>
                <div className="text-[10px] text-[#777777] mb-1">{item.sub}</div>
                <div className={`text-sm font-bold ${item.highlight ? "text-[#ba1a1a]" : "text-[#000000]"}`}>{item.result}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bond Type Selection */}
        <section className="mb-6 border border-[#777777] bg-[#f3f3f3] p-5">
          <h2 className="text-sm font-bold text-[#000000] mb-1">구조 분기 선택</h2>
          <p className="text-xs text-[#5e5e5e] mb-4">수집된 정보를 바탕으로 다음 단계 분석 구조를 확정합니다.</p>
          <div className="flex gap-3">
            <Link href="/step3">
              <button className="px-5 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors">
                일반채
              </button>
            </Link>
            <Link href="/step3b">
              <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors">
                후순위채
              </button>
            </Link>
            <Link href="/step3c">
              <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors">
                영구채
              </button>
            </Link>
          </div>
        </section>

        {/* Reviewer Memo */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-[#000000] mb-3 border-b border-[#c6c6c6] pb-2">검토자 메모</h2>
          <textarea
            className="w-full border border-[#777777] bg-[#ffffff] p-3 text-sm text-[#1a1c1c] placeholder-[#777777] outline-none focus:border-[#000000] resize-none"
            rows={4}
            placeholder="검토 의견을 입력하세요..."
          />
        </section>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c6]">
          <Link href="/">
            <button className="px-5 py-2.5 border border-[#777777] text-sm font-bold text-[#5e5e5e] hover:bg-[#f3f3f3] transition-colors">
              ← 대시보드
            </button>
          </Link>
          <Link href="/step3">
            <button className="px-6 py-2.5 bg-[#000000] text-[#ffffff] text-sm font-bold hover:bg-[#3a3c3c] transition-colors">
              다음 단계: 기본 분석 →
            </button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
