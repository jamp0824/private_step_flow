/*
 * DESIGN: Structural Brutalism — AppShell
 * 3-panel layout: Left Nav (240px) + Main Workspace + Right AI Copilot (288px)
 * Sharp edges, 1px borders, monochrome palette
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

interface AppShellProps {
  children: React.ReactNode;
  caseId?: string;
  currentStep?: number;
  totalSteps?: number;
  stepLabels?: string[];
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", icon: "dashboard", href: "/" },
  { label: "채권 검토", icon: "analytics", href: "/step2" },
  { label: "포트폴리오", icon: "folder_open", href: "#" },
  { label: "규제 준수", icon: "gavel", href: "#" },
  { label: "보고서", icon: "description", href: "#" },
];

const STEP_LABELS = ["준비", "업로드/분류", "기본 분석", "구조 분석", "종합 판단", "보고서 생성", "최종 승인"];

const STEP_ROUTES: Record<number, string> = {
  1: "/",
  2: "/step2",
  3: "/step3",
  4: "/step4",
  5: "/step56",
  6: "/step56",
  7: "/step56",
};

export default function AppShell({
  children,
  caseId = "2024-BOND-082",
  currentStep = 1,
  stepLabels = STEP_LABELS,
  rightPanel,
  showRightPanel = true,
}: AppShellProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handlePlaceholderClick = () => {
    toast.info("준비 중인 기능입니다.");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f9f9f9] text-[#1a1c1c]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── LEFT SIDEBAR ── */}
      <nav className="w-60 flex-shrink-0 flex flex-col border-r border-[#777777] bg-[#f9f9f9] z-20">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-[#777777]">
          <div className="text-xl font-black tracking-tighter text-[#000000]">BOND REVIEW</div>
          <div className="text-[10px] font-bold text-[#5e5e5e] mt-0.5 uppercase tracking-widest">v1.2.0</div>
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
                    className="w-full flex items-center px-6 py-3 text-[#5e5e5e] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-100 text-sm font-medium"
                  >
                    <span className="material-symbols-outlined mr-4 text-[20px]">{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href}>
                    <div
                      className={
                        isActive
                          ? "flex items-center px-6 py-3 text-[#000000] font-bold border-l-4 border-[#000000] bg-[#e2e2e2] text-sm cursor-pointer"
                          : "flex items-center px-6 py-3 text-[#5e5e5e] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-100 text-sm font-medium cursor-pointer"
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
        <div className="border-t border-[#777777] p-4">
          <button
            onClick={handlePlaceholderClick}
            className="flex items-center px-2 py-2 text-[#5e5e5e] hover:text-[#000000] transition-colors text-sm font-medium w-full"
          >
            <span className="material-symbols-outlined mr-3 text-[18px]">settings</span>
            설정
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Header */}
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-[#777777] bg-[#ffffff] z-10">
          <div className="flex items-center gap-6">
            <span className="text-base font-bold text-[#000000]">채권 검토 시스템</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#5e5e5e]">
              <span className="text-[#777777]">#</span>
              <span className="font-bold text-[#000000]">사건번호: {caseId}</span>
            </div>
            {currentStep > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#5e5e5e]">
                <span className="material-symbols-outlined text-[14px]">play_circle</span>
                <span className="font-medium">진행단계: {stepLabels[currentStep - 1] || `Step ${currentStep}`}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[#c6c6c6] bg-[#ffffff]">
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs outline-none bg-transparent w-44 text-[#1a1c1c] placeholder-[#777777]"
              />
              <button className="px-2 py-1.5 text-[#5e5e5e] hover:text-[#000000]">
                <span className="material-symbols-outlined text-[16px]">search</span>
              </button>
            </div>
            <button onClick={handlePlaceholderClick} className="p-1.5 text-[#5e5e5e] hover:text-[#000000] transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button onClick={handlePlaceholderClick} className="p-1.5 text-[#5e5e5e] hover:text-[#000000] transition-colors">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </button>
          </div>
        </header>

        {/* Step Progress Bar */}
        {currentStep > 0 && (
          <div className="flex-shrink-0 flex items-center px-6 py-2.5 border-b border-[#c6c6c6] bg-[#f9f9f9] overflow-x-auto">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum === currentStep;
              const isComplete = stepNum < currentStep;
              const route = STEP_ROUTES[stepNum];
              return (
                <div key={stepNum} className="flex items-center flex-shrink-0">
                  {route && isComplete ? (
                    <Link href={route}>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold cursor-pointer ${
                          isActive
                            ? "bg-[#000000] text-[#ffffff]"
                            : isComplete
                            ? "bg-[#e2e2e2] text-[#000000] border border-[#777777] hover:bg-[#000000] hover:text-[#ffffff] transition-colors"
                            : "bg-[#f9f9f9] text-[#777777] border border-[#c6c6c6]"
                        }`}
                      >
                        <span className="font-black">{String(stepNum).padStart(2, "0")}</span>
                        <span>{label}</span>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold ${
                        isActive
                          ? "bg-[#000000] text-[#ffffff]"
                          : isComplete
                          ? "bg-[#e2e2e2] text-[#000000] border border-[#777777]"
                          : "bg-[#f9f9f9] text-[#777777] border border-[#c6c6c6]"
                      }`}
                    >
                      <span className="font-black">{String(stepNum).padStart(2, "0")}</span>
                      <span>{label}</span>
                    </div>
                  )}
                  {idx < stepLabels.length - 1 && (
                    <div className="w-8 h-px bg-[#c6c6c6] mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Content + Right Panel */}
        <div className="flex-1 flex min-h-0">
          {/* Main Workspace */}
          <main className="flex-1 overflow-y-auto bg-[#f9f9f9]">
            {children}
          </main>

          {/* Right AI Copilot Panel */}
          {showRightPanel && rightPanel && (
            <aside className="w-72 flex-shrink-0 border-l border-[#777777] bg-[#f9f9f9] flex flex-col overflow-y-auto">
              {rightPanel}
            </aside>
          )}
        </div>

        {/* Footer */}
        <footer className="flex-shrink-0 h-8 flex items-center justify-between px-6 border-t border-[#c6c6c6] bg-[#f3f3f3] text-[10px] text-[#777777]">
          <span>© 2024 채권 검토 시스템. 모든 권리 보유.</span>
          <div className="flex items-center gap-4">
            <button onClick={handlePlaceholderClick} className="hover:text-[#000000]">보안 가이드</button>
            <button onClick={handlePlaceholderClick} className="hover:text-[#000000]">감사 로그</button>
            <button onClick={handlePlaceholderClick} className="hover:text-[#000000]">지원</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
