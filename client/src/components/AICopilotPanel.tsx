/*
 * DESIGN: Structural Brutalism — AI Copilot Panel
 * Right panel: Evidence citations, recommendations, analysis actions
 */

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AICopilotScenario } from "@/mocks/aiCopilot";

interface AICopilotPanelProps {
  scenario: AICopilotScenario;
  onAnalyze?: () => void;
}

export default function AICopilotPanel({
  scenario,
  onAnalyze,
}: AICopilotPanelProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChat = () => {
    const message = chatInput.trim();

    if (!message) return;

    setChatMessages((prev) => [...prev, { role: "user", text: message }]);
    setChatInput("");
    setIsTyping(true);

    const replyIndex = chatMessages.filter((item) => item.role === "assistant").length % scenario.chatReplies.length;
    const delay = 300 + Math.floor(Math.random() * 501);

    // TODO(phase-2): replace with /v1/analysis/jobs
    timeoutRef.current = window.setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "assistant", text: scenario.chatReplies[replyIndex] }]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-4 py-4 border-b border-[#6b8199] bg-[#ffffff]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#004999]">smart_toy</span>
          <div>
            <div className="text-sm font-black text-[#004999] tracking-tight">{scenario.title}</div>
            <div className="text-[10px] text-[#4a6080] font-medium">{scenario.subtitle}</div>
          </div>
        </div>
        <div className="mt-2 text-[10px] font-mono text-[#6b8199]">triggerApi: {scenario.triggerApi}</div>
      </div>

      {/* System Suggestion */}
      {scenario.systemSuggestion && (
        <div className="mx-3 mt-3 border border-[#004999] bg-[#f0f5fa] p-3">
          <div className="text-[10px] font-bold text-[#4a6080] uppercase tracking-wider mb-1.5">시스템 분석 제안</div>
          <p className="text-xs text-[#0d1b2a] leading-relaxed">{scenario.systemSuggestion}</p>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={() => toast.success("템플릿이 생성되었습니다.")}
              className="flex-1 py-1.5 bg-[#004999] text-[#ffffff] text-[10px] font-bold hover:bg-[#1a3a5c] transition-colors"
            >
              예, 템플릿 생성
            </button>
            <button
              onClick={() => toast.info("무시되었습니다.")}
              className="px-3 py-1.5 border border-[#6b8199] text-[10px] font-bold text-[#4a6080] hover:bg-[#dce8f0] transition-colors"
            >
              무시
            </button>
          </div>
        </div>
      )}

      {/* Evidence Citations */}
      {scenario.citations.length > 0 && (
        <div className="px-3 py-3 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-[#4a6080] uppercase tracking-wider mb-2">
            근거 인용 (EVIDENCE CITATIONS)
          </div>
          <div className="space-y-2">
            {scenario.citations.map((citation, idx) => (
              <div key={idx} className="border border-[#b8c8d8] bg-[#ffffff] p-3">
                <div className="text-xs font-bold text-[#004999] mb-1">{citation.title}</div>
                <p className="text-[11px] text-[#1a3a5c] leading-relaxed">{citation.excerpt}</p>
                {citation.highlight && (
                  <div className="mt-1.5 text-[10px] font-bold text-[#c0392b]">→ {citation.highlight}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      {scenario.recommendation && (
        <div className="mx-3 mb-3 border-l-2 border-[#004999] pl-3 py-2 bg-[#f5f8fc]">
          <div className="text-[10px] font-bold text-[#4a6080] uppercase tracking-wider mb-1">AI 권고</div>
          <p className="text-xs text-[#0d1b2a] leading-relaxed">{scenario.recommendation}</p>
        </div>
      )}

      {(chatMessages.length > 0 || isTyping) && (
        <div className="mx-3 mb-3 space-y-2">
          {chatMessages.slice(-4).map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`border px-3 py-2 text-[11px] ${
                message.role === "assistant"
                  ? "border-[#6b8199] bg-[#ffffff] text-[#0d1b2a]"
                  : "border-[#004999] bg-[#004999] text-[#ffffff]"
              }`}
            >
              <div className="text-[9px] font-bold uppercase mb-1 opacity-70">{message.role === "assistant" ? "AI" : "USER"}</div>
              <div>{message.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="border border-[#6b8199] bg-[#f0f5fa] px-3 py-2 text-[11px] text-[#4a6080] animate-pulse">
              AI가 응답을 작성 중입니다...
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#b8c8d8] mx-3" />

      {/* Action Buttons */}
      <div className="px-3 py-3 space-y-2">
        <button
          onClick={onAnalyze || (() => toast.info("분석을 시작합니다."))}
          className="w-full py-2.5 bg-[#004999] text-[#ffffff] text-sm font-bold hover:bg-[#1a3a5c] transition-colors"
        >
          {scenario.analysisLabel}
        </button>
        {scenario.extraActions && scenario.extraActions.length > 0 && (
          <div className="flex gap-2">
            {scenario.extraActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => toast.info(action.phase2Message || "준비 중인 기능입니다.")}
                className="flex-1 py-2 border border-[#6b8199] text-xs font-bold text-[#004999] hover:bg-[#004999] hover:text-[#ffffff] transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="px-3 pb-3 border-t border-[#b8c8d8] pt-3">
        <div className="flex border border-[#6b8199] bg-[#ffffff]">
          <input
            type="text"
            placeholder="AI에게 질문하기..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChat()}
            className="flex-1 px-3 py-2 text-xs outline-none bg-transparent text-[#0d1b2a] placeholder-[#6b8199]"
          />
          <button
            onClick={handleChat}
            className="px-3 py-2 text-[#4a6080] hover:text-[#004999] hover:bg-[#f0f5fa] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>

      {/* Guide */}
      <div className="mx-3 mb-3 border border-[#b8c8d8] bg-[#f0f5fa] p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-[14px] text-[#4a6080]">help_outline</span>
          <span className="text-[10px] font-bold text-[#4a6080]">가이드</span>
        </div>
        <p className="text-[10px] text-[#6b8199] leading-relaxed">{scenario.guideText}</p>
      </div>
    </div>
  );
}
