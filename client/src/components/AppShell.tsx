/*
 * DESIGN: IBK시스템 — 승인심사 AI 플랫폼
 * 3-panel layout: Left Nav (240px) + Main Workspace + Right AI Copilot (288px)
 * Clean professional: white/light-gray base, IBK Blue for accents only
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { getStageRoute, STAGE_LABELS } from "@/config/stages";
import { useDemoCase } from "@/contexts/DemoCaseContext";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { cn } from "@/lib/utils";

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
const NAV_COLLAPSE_STORAGE_KEY = "ibk-app-shell-nav-collapsed";

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
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const { activeCaseId } = useDemoCase();
  const { state } = useWorkflow();
  const displayCaseId = caseId || activeCaseId;

  useEffect(() => {
    try {
      const savedValue = window.localStorage.getItem(NAV_COLLAPSE_STORAGE_KEY);
      if (savedValue !== null) {
        setIsNavCollapsed(savedValue === "true");
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(NAV_COLLAPSE_STORAGE_KEY, String(isNavCollapsed));
    } catch {
      /* ignore storage errors */
    }
  }, [isNavCollapsed]);

  const handlePlaceholderClick = () => {
    toast.info("준비 중인 기능입니다.");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9fa] text-[#111827]" style={{ fontFamily: "'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif" }}>
      {/* ── LEFT SIDEBAR ── */}
      <nav
        className={cn(
          "flex-shrink-0 flex flex-col border-r border-[#e5e7eb] bg-[#ffffff] z-20 transition-[width] duration-300 ease-out",
          isNavCollapsed ? "w-[96px]" : "w-60",
        )}
      >
        {/* Brand */}
        <div className={cn("h-[108px] border-b border-[#e5e7eb] flex items-center", isNavCollapsed ? "px-3" : "px-5")}>
          <div className={cn("flex items-center", isNavCollapsed ? "justify-center" : "justify-between gap-3")}>
            <div className={cn("flex min-w-0", isNavCollapsed ? "justify-center" : "items-center gap-3")}>
              {isNavCollapsed ? (
                <button
                  type="button"
                  aria-label="사이드 메뉴 펼치기"
                  onClick={() => setIsNavCollapsed(false)}
                  className="group relative overflow-hidden bg-[#004999] flex items-center justify-center flex-shrink-0 text-[#ffffff] font-black transition-all duration-300 w-11 h-11 !rounded-[16px]"
                >
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:opacity-0 group-hover:scale-90 text-xl">
                    IBK
                  </span>
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 scale-90 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4.5" y="3.5" width="15" height="17" rx="1.5" />
                      <path d="M10 4v16" />
                      <path d="m13.5 12 2.5-2.5" />
                      <path d="M13.5 12 16 14.5" />
                    </svg>
                  </span>
                </button>
              ) : (
                <div className="bg-[#004999] flex items-center justify-center flex-shrink-0 text-[#ffffff] font-black transition-all duration-300 w-11 h-11 !rounded-[16px] text-sm">
                  IBK
                </div>
              )}
              {!isNavCollapsed && (
                <div className="min-w-0">
                  <div className="text-[15px] font-extrabold text-[#111827] truncate">심사지원플랫폼</div>
                  <div className="text-xs text-[#94a3b8] font-medium">AI Copilot</div>
                </div>
              )}
            </div>
            {!isNavCollapsed && (
              <button
                type="button"
                aria-label="사이드 메뉴 축소하기"
                onClick={() => setIsNavCollapsed(true)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center !rounded-[14px] text-[#94a3b8] hover:bg-[#eff6ff] hover:text-[#004999] transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[22px]">left_panel_close</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={cn("flex-1 overflow-y-auto", isNavCollapsed ? "px-2 py-5" : "px-3 py-4")}>
          <div className={cn("flex", isNavCollapsed ? "flex-col items-center gap-3" : "flex-col gap-1.5")}>
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && item.href !== "#" && location.startsWith(item.href));
              const isPlaceholder = item.href === "#";

              const navContent = (
                <div
                  title={item.label}
                  className={cn(
                    "group transition-all duration-200",
                    isNavCollapsed
                      ? cn(
                          "flex h-18 w-16 items-center justify-center !rounded-[20px] border border-transparent",
                          isActive
                            ? "bg-[#e8f0fe] text-[#004999]"
                            : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#004999]",
                        )
                      : cn(
                          "flex h-16 w-full items-center gap-3 px-4 !rounded-[20px] border border-transparent text-left",
                          isActive
                            ? "bg-[#dfeafe] text-[#004999]"
                            : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]",
                        ),
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined transition-colors duration-200",
                      isNavCollapsed ? "text-[28px]" : "text-[24px]",
                      isActive ? "text-[#004999]" : "text-[#64748b] group-hover:text-[#004999]",
                    )}
                  >
                    {item.icon}
                  </span>
                  {!isNavCollapsed && (
                    <span className={cn("text-[15px] leading-none", isActive ? "font-extrabold" : "font-semibold")}>
                      {item.label}
                    </span>
                  )}
                </div>
              );

              return (
                <div key={item.label} className={cn(isNavCollapsed ? "w-full flex justify-center" : "w-full")}>
                  {isPlaceholder ? (
                    <button
                      type="button"
                      aria-label={item.label}
                      onClick={handlePlaceholderClick}
                      className={cn(isNavCollapsed ? "block" : "block w-full")}
                    >
                      {navContent}
                    </button>
                  ) : (
                    <Link href={item.href}>
                      <div className={cn(isNavCollapsed ? "block" : "w-full")}>
                        {navContent}
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom user area */}
        <div className={cn("border-t border-[#e5e7eb]", isNavCollapsed ? "px-2 py-4" : "p-4")}>
          {isNavCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                title="AI Copilot"
                onClick={handlePlaceholderClick}
                className="flex h-12 w-12 items-center justify-center !rounded-[16px] bg-[#004999] text-[#ffffff] transition-transform duration-200 hover:scale-[1.03]"
              >
                <span className="text-xs font-bold">AI</span>
              </button>
              <button
                type="button"
                title="설정"
                onClick={handlePlaceholderClick}
                className="flex h-12 w-12 items-center justify-center !rounded-[16px] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#004999] transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">settings</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#004999] !rounded-[14px] flex items-center justify-center flex-shrink-0">
                <span className="text-[#ffffff] text-xs font-bold">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#111827] truncate">IBK System</div>
                <div className="text-[11px] text-[#94a3b8]">AI Copilot</div>
              </div>
              <button
                onClick={handlePlaceholderClick}
                className="w-10 h-10 !rounded-[12px] flex items-center justify-center text-[#94a3b8] hover:text-[#004999] hover:bg-[#eff6ff] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Header */}
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-[#e5e7eb] bg-[#ffffff] z-10">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-[#111827]">승인심사 AI 플랫폼</span>
            {displayCaseId && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#6b7280]">
                <span className="text-[#9ca3af]">#</span>
                <span className="font-semibold text-[#374151]">사건번호: {displayCaseId}</span>
              </div>
            )}
            {currentStage > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                <span className="material-symbols-outlined text-[14px] text-[#9ca3af]">play_circle</span>
                <span className="font-medium">진행단계: {stageLabels[currentStage - 1] || `Stage ${currentStage}`}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[#e5e7eb] bg-[#ffffff]">
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs outline-none bg-transparent w-44 text-[#111827] placeholder-[#9ca3af]"
              />
              <button className="px-2 py-1.5 text-[#9ca3af] hover:text-[#374151]">
                <span className="material-symbols-outlined text-[16px]">search</span>
              </button>
            </div>
            <button onClick={handlePlaceholderClick} className="p-1.5 text-[#9ca3af] hover:text-[#374151] transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button onClick={handlePlaceholderClick} className="p-1.5 text-[#9ca3af] hover:text-[#374151] transition-colors">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </button>
          </div>
        </header>

        {/* Step Progress Bar */}
        {currentStage > 0 && (
          <div className="flex-shrink-0 flex items-center px-6 py-2 border-b border-[#e5e7eb] bg-[#ffffff] overflow-x-auto">
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
                            ? "bg-[#eff6ff] text-[#004999] border border-[#bfdbfe] hover:bg-[#dbeafe] transition-colors"
                            : "bg-[#ffffff] text-[#9ca3af] border border-[#e5e7eb]"
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
                          ? "bg-[#eff6ff] text-[#004999] border border-[#bfdbfe]"
                          : "bg-[#ffffff] text-[#9ca3af] border border-[#e5e7eb]"
                      }`}
                    >
                      <span className="font-black">{String(stageNum).padStart(2, "0")}</span>
                      <span>{label}</span>
                    </div>
                  )}
                  {idx < stageLabels.length - 1 && (
                    <div className="w-6 h-px bg-[#e5e7eb] mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Content + Right Panel */}
        <div className="flex-1 flex min-h-0">
          {/* Main Workspace */}
          <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">
            {children}
          </main>

          {/* Right AI Copilot Panel */}
          {showRightPanel && rightPanel && (
            <aside className="w-72 flex-shrink-0 border-l border-[#e5e7eb] bg-[#ffffff] flex flex-col overflow-y-auto">
              {rightPanel}
            </aside>
          )}
        </div>

        {/* Footer */}
        <footer className="flex-shrink-0 h-8 flex items-center justify-between px-6 border-t border-[#e5e7eb] bg-[#ffffff] text-[10px] text-[#9ca3af]">
          <span>© 2024 IBK시스템. 승인심사 AI 플랫폼. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button onClick={handlePlaceholderClick} className="hover:text-[#374151]">보안 가이드</button>
            <button onClick={handlePlaceholderClick} className="hover:text-[#374151]">감사 로그</button>
            <button onClick={handlePlaceholderClick} className="hover:text-[#374151]">지원</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
