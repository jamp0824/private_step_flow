/*
 * DESIGN: IBK시스템 — 승인심사 AI 플랫폼
 * 3-panel layout: Left Nav (240px) + Main Workspace + Right AI Copilot (288px)
 * Sharp edges, 1px borders, IBK Deep Blue palette
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { getStageRoute, STAGE_LABELS } from "@/config/stages";
import { useDemoCase } from "@/contexts/DemoCaseContext";
import { useWorkflow } from "@/contexts/WorkflowContext";

interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

interface AppShellProps {
  children: React.ReactNode;
  caseId?: string;
  currentStage?: number;
  stageLabels?: string[];
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", icon: "dashboard", href: "/stage1" },
  { label: "승인심사", icon: "analytics", href: "/stage2" },
  { label: "포트폴리오", icon: "folder_open", href: "#" },
  { label: "규제 준수", icon: "gavel", href: "#" },
  { label: "보고서", icon: "description", href: "#" },
];

const DEFAULT_STAGE_LABELS = Object.values(STAGE_LABELS);

export default function AppShell({
  children,
  caseId,
  currentStage = 1,
  stageLabels = DEFAULT_STAGE_LABELS,
  rightPanel,
  showRightPanel = true,
}: AppShellProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { activeCaseId } = useDemoCase();
  const { state } = useWorkflow();
  const displayCaseId = caseId || activeCaseId;

  const handlePlaceholderClick = () => {
    toast.info("준비 중인 기능입니다.");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f5f8fc] text-[#0d1b2a]" style={{ fontFamily: "'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif" }}>
      {/* ── LEFT SIDEBAR ── */}
      <nav className="w-60 flex-shrink-0 flex flex-col border-r border-[#6b8199] bg-[#f5f8fc] z-20">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-[#6b8199]">
          <div className="text-xl font-black tracking-tighter text-[#004999]">IBK시스템</div>
          <div className="text-[10px] font-bold text-[#4a6080] mt-0.5 uppercase tracking-widest">승인심사 AI</div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const isPlaceholder = item.href === "#";

            return (
              <div key={item.label}>
                {isPlaceholder ? (
                  <button
                    onClick={handlePlaceholderClick}
                    className="w-full flex items-center px-6 py-3 text-[#4a6080] hover:bg-[#004999] hover:text-[#ffffff] transition-colors duration-100 text-sm font-medium"
                  >
                    <span className="material-symbols-outlined mr-4 text-[20px]">{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href}>
                    <div
                      className={
                        isActive
                          ? "flex items-center px-6 py-3 text-[#004999] font-bold border-l-4 border-[#004999] bg-[#dce8f0] text-sm cursor-pointer"
                          : "flex items-center px-6 py-3 text-[#4a6080] hover:bg-[#004999] hover:text-[#ffffff] transition-colors duration-100 text-sm font-medium cursor-pointer"
                      }
                    >
                      <span className={`material-symbols-outlined mr-4 text-[20px] ${isActive ? "" : ""}`}>{item.icon}</span>
                      {item.label}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Settings */}
        <div className="border-t border-[#6b8199] p-4">
          <button
            onClick={handlePlaceholderClick}
            className="flex items-center px-2 py-2 text-[#4a6080] hover:text-[#004999] transition-colors text-sm font-medium w-full"
          >
            <span className="material-symbols-outlined mr-3 text-[18px]">settings</span>
            설정
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Header */}
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-[#6b8199] bg-[#ffffff] z-10">
          <div className="flex items-center gap-6">
            <span className="text-base font-bold text-[#004999]">승인심사 AI 플랫폼</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#4a6080]">
              <span className="text-[#6b8199]">#</span>
              <span className="font-bold text-[#004999]">사건번호: {displayCaseId}</span>
            </div>
            {currentStage > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#4a6080]">
                <span className="material-symbols-outlined text-[14px]">play_circle</span>
                <span className="font-medium">진행단계: {stageLabels[currentStage - 1] || `Stage ${currentStage}`}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[#b8c8d8] bg-[#ffffff]">
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs outline-none bg-transparent w-44 text-[#0d1b2a] placeholder-[#6b8199]"
              />
              <button className="px-2 py-1.5 text-[#4a6080] hover:text-[#004999]">
                <span className="material-symbols-outlined text-[16px]">search</span>
              </button>
            </div>
            <button onClick={handlePlaceholderClick} className="p-1.5 text-[#4a6080] hover:text-[#004999] transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button onClick={handlePlaceholderClick} className="p-1.5 text-[#4a6080] hover:text-[#004999] transition-colors">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </button>
          </div>
        </header>

        {/* Step Progress Bar */}
        {currentStage > 0 && (
          <div className="flex-shrink-0 flex items-center px-6 py-2.5 border-b border-[#b8c8d8] bg-[#f5f8fc] overflow-x-auto">
            {stageLabels.map((label, idx) => {
              const stageNum = idx + 1;
              const isActive = stageNum === currentStage;
              const isComplete = stageNum < currentStage;
              const route = getStageRoute(stageNum as 1 | 2 | 3 | 4 | 5 | 6 | 7, state.branchType);
              return (
                <div key={stageNum} className="flex items-center flex-shrink-0">
                  {route && isComplete ? (
                    <Link href={route}>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold cursor-pointer ${
                          isActive
                            ? "bg-[#004999] text-[#ffffff]"
                            : isComplete
                            ? "bg-[#dce8f0] text-[#004999] border border-[#6b8199] hover:bg-[#004999] hover:text-[#ffffff] transition-colors"
                            : "bg-[#f5f8fc] text-[#6b8199] border border-[#b8c8d8]"
                        }`}
                      >
                        <span className="font-black">{String(stageNum).padStart(2, "0")}</span>
                        <span>{label}</span>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold ${
                        isActive
                          ? "bg-[#004999] text-[#ffffff]"
                          : isComplete
                          ? "bg-[#dce8f0] text-[#004999] border border-[#6b8199]"
                          : "bg-[#f5f8fc] text-[#6b8199] border border-[#b8c8d8]"
                      }`}
                    >
                      <span className="font-black">{String(stageNum).padStart(2, "0")}</span>
                      <span>{label}</span>
                    </div>
                  )}
                  {idx < stageLabels.length - 1 && (
                    <div className="w-8 h-px bg-[#b8c8d8] mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Content + Right Panel */}
        <div className="flex-1 flex min-h-0">
          {/* Main Workspace */}
          <main className="flex-1 overflow-y-auto bg-[#f5f8fc]">
            {children}
          </main>

          {/* Right AI Copilot Panel */}
          {showRightPanel && rightPanel && (
            <aside className="w-72 flex-shrink-0 border-l border-[#6b8199] bg-[#f5f8fc] flex flex-col overflow-y-auto">
              {rightPanel}
            </aside>
          )}
        </div>

        {/* Footer */}
        <footer className="flex-shrink-0 h-8 flex items-center justify-between px-6 border-t border-[#b8c8d8] bg-[#f0f5fa] text-[10px] text-[#6b8199]">
          <span>© 2024 IBK시스템. 승인심사 AI 플랫폼. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button onClick={handlePlaceholderClick} className="hover:text-[#004999]">보안 가이드</button>
            <button onClick={handlePlaceholderClick} className="hover:text-[#004999]">감사 로그</button>
            <button onClick={handlePlaceholderClick} className="hover:text-[#004999]">지원</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
