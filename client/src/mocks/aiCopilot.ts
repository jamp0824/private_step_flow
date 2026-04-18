/* Phase: P0 — issue #4 */

import type { BranchType } from "@/contexts/WorkflowContext";

export interface AICopilotScenario {
  stage: 2 | 3 | 4 | 5 | 6 | 7;
  branchType: BranchType;
  triggerApi: string;
  title: string;
  subtitle: string;
  citations: Array<{
    title: string;
    excerpt: string;
    highlight?: string;
  }>;
  recommendation: string;
  systemSuggestion?: string;
  analysisLabel: string;
  extraActions?: Array<{
    label: string;
    phase2Message?: string;
  }>;
  guideText: string;
  chatReplies: string[];
}

type ScenarioCatalog = Record<2 | 3 | 4 | 5 | 6 | 7, Record<BranchType, AICopilotScenario>>;

const BRANCH_LABEL: Record<BranchType, string> = {
  general: "일반 사모사채",
  subordinated: "후순위채",
  perpetual: "영구채",
};

const BRANCH_SIGNAL: Record<BranchType, string> = {
  general: "공통 조건과 내부 기준 비교",
  subordinated: "회수 순위와 후순위 프리미엄",
  perpetual: "콜옵션, 스텝업, 자본성 판단",
};

function scenario(
  stage: 2 | 3 | 4 | 5 | 6 | 7,
  branchType: BranchType,
  config: Omit<AICopilotScenario, "stage" | "branchType">
): AICopilotScenario {
  return { stage, branchType, ...config };
}

export const AI_COPILOT_SCENARIOS: ScenarioCatalog = {
  2: {
    general: scenario(2, "general", {
      triggerApi: "POST /v1/review-sessions/{session_id}/checklist",
      title: "AI 코파일럿",
      subtitle: "Stage 2 검토 지원",
      citations: [
        {
          title: "기본 문서 세트 점검",
          excerpt: "누락 자료와 파싱 오류, 분기 후보를 한 번에 검토할 수 있도록 요약했습니다.",
        },
      ],
      recommendation: "누락 자료와 파싱 오류를 먼저 해소한 뒤 구조 분기를 확정하십시오.",
      systemSuggestion: "기본 문서 검증이 끝나야 다음 단계로 이동할 수 있습니다.",
      analysisLabel: "초기 점검 재실행",
      extraActions: [{ label: "보완 요청 초안", phase2Message: "Phase 2: supplement request composer" }],
      guideText: "문서 업로드 후 파싱 오류가 남아 있으면 현재 단계는 blocked 상태로 유지됩니다.",
      chatReplies: [
        "기본 문서 세트는 대부분 확보되었지만, 누락 문서 체크와 구조 분기 확정이 남아 있습니다.",
        "현재 케이스는 일반 사모사채 후보로 분류되며, 내부 기준 비교 결과를 함께 검토하는 것이 좋습니다.",
      ],
    }),
    subordinated: scenario(2, "subordinated", {
      triggerApi: "POST /v1/plugins/private_bond/classify-structure",
      title: "AI 코파일럿",
      subtitle: "Stage 2 검토 지원",
      citations: [
        {
          title: "구조 분기 후보",
          excerpt: "후순위 조항과 선순위 대비 회수 순위 문구가 반복적으로 확인되었습니다.",
        },
      ],
      recommendation: "후순위 구조 후보가 강하므로 branch lock 전에 회수 순위 관련 문구를 다시 확인하십시오.",
      systemSuggestion: "후순위 구조 후보가 감지되었습니다.",
      analysisLabel: "구조 분류 재실행",
      extraActions: [{ label: "회수 순위 후보 보기", phase2Message: "Phase 2: clause highlight viewer" }],
      guideText: "후순위채는 Stage 3에서 브랜치 분석 화면으로 이어집니다.",
      chatReplies: [
        "후순위 후보로 분류된 핵심 근거는 손실흡수와 회수 순위 관련 조항입니다.",
        "구조 확정 전에는 선순위 채무 대비 비중과 프리미엄 적정성 검토 준비를 권장합니다.",
      ],
    }),
    perpetual: scenario(2, "perpetual", {
      triggerApi: "POST /v1/plugins/private_bond/classify-structure",
      title: "AI 코파일럿",
      subtitle: "Stage 2 검토 지원",
      citations: [
        {
          title: "구조 분기 후보",
          excerpt: "콜옵션과 이자지급 연기 조항이 함께 탐지되어 영구채 가능성이 높습니다.",
        },
      ],
      recommendation: "영구채 구조 후보가 강하므로 branch lock 전에 콜옵션과 step-up 조항을 다시 확인하십시오.",
      systemSuggestion: "영구채 구조 후보가 감지되었습니다.",
      analysisLabel: "구조 분류 재실행",
      extraActions: [{ label: "콜옵션 후보 보기", phase2Message: "Phase 2: clause highlight viewer" }],
      guideText: "영구채는 Stage 3에서 human-only 판단 전 단계까지 별도 메모가 누적됩니다.",
      chatReplies: [
        "영구채 후보로 보이는 이유는 콜옵션과 step-up 트리거가 동시에 감지되었기 때문입니다.",
        "구조 확정 후에는 자본성 판단과 이자지급 정지 조건을 별도 메모로 넘기는 것이 좋습니다.",
      ],
    }),
  },
  3: {
    general: scenario(3, "general", {
      triggerApi: "POST /v1/analysis/financial",
      title: "AI 코파일럿",
      subtitle: "실시간 분석 지원",
      citations: [
        {
          title: "공통 분석 요약",
          excerpt: "재무, 신용, 산업, 현금흐름 분석이 일반 사모사채 기준으로 정리되었습니다.",
        },
      ],
      recommendation: "공통 분석이 끝나면 바로 Stage 4로 넘겨 종합 판단을 준비하십시오.",
      analysisLabel: "분석 갱신",
      extraActions: [{ label: "유사 사례 검색", phase2Message: "Phase 2: similar case search" }],
      guideText: "Stage 3는 사실 분석과 정리 단계이며 최종 판단은 Stage 4에서 수행합니다.",
      chatReplies: [
        "공통 분석 기준으로는 추가 자료 수집보다 조건 비교와 현금흐름 확인이 우선입니다.",
        "일반 사모사채 브랜치는 별도 구조 분석 없이 종합 판단 단계로 바로 연결됩니다.",
      ],
    }),
    subordinated: scenario(3, "subordinated", {
      triggerApi: "POST /v1/plugins/private_bond/subordinated/recovery-priority",
      title: "AI 코파일럿",
      subtitle: "후순위채 구조 분석",
      citations: [
        {
          title: "후순위 구조 분석",
          excerpt: "회수 순위, 손실흡수 구조, 후순위 프리미엄이 핵심 검토 포인트로 요약되었습니다.",
        },
      ],
      recommendation: "후순위 구조 리스크를 메모로 정리한 뒤 Stage 4에서 종합 판단하십시오.",
      analysisLabel: "브랜치 분석 갱신",
      extraActions: [{ label: "회수 순위 재검토", phase2Message: "Phase 2: recovery waterfall viewer" }],
      guideText: "후순위채는 공통 분석 결과 위에 구조 메모를 추가하는 방식으로 전달됩니다.",
      chatReplies: [
        "회수 순위와 프리미엄 적정성은 후순위채 판단의 핵심입니다.",
        "Stage 4에서는 손실흡수력과 선순위 대비 열위 구조를 함께 설명하는 편이 좋습니다.",
      ],
    }),
    perpetual: scenario(3, "perpetual", {
      triggerApi: "POST /v1/plugins/private_bond/perpetual/call-option",
      title: "AI 코파일럿",
      subtitle: "영구채 구조 분석",
      citations: [
        {
          title: "영구채 구조 분석",
          excerpt: "콜옵션, 스텝업, 이자지급 정지 조건이 영구채 판단 포인트로 정리되었습니다.",
        },
      ],
      recommendation: "영구채 특화 조건은 Stage 4의 human confirm을 위해 구조 메모로 요약하십시오.",
      analysisLabel: "브랜치 분석 갱신",
      extraActions: [{ label: "콜옵션 재검토", phase2Message: "Phase 2: call option viewer" }],
      guideText: "영구채는 자본성 관련 human-only 판단 메모를 별도로 남겨야 데모 흐름이 선명합니다.",
      chatReplies: [
        "영구채 브랜치에서는 콜옵션 시점과 step-up 조건을 함께 설명하는 것이 중요합니다.",
        "Stage 4로 넘길 때는 자본성 판단이 human-only라는 점을 분명히 남기는 것이 좋습니다.",
      ],
    }),
  },
  4: {
    general: scenario(4, "general", {
      triggerApi: "POST /v1/analysis/results/{result_id}/confirm",
      title: "AI 코파일럿",
      subtitle: "종합 판단 지원",
      citations: [
        {
          title: "종합 분석 결과",
          excerpt: "공통 분석과 조건 비교 결과를 통합해 리스크 드라이버를 요약했습니다.",
        },
      ],
      recommendation: "이 단계에서만 확정, 수정 확정, 거절, 보완 요청을 수행하십시오.",
      analysisLabel: "리스크 집계 갱신",
      extraActions: [{ label: "메모 갱신", phase2Message: "Phase 2: decision memo sync" }],
      guideText: "Stage 4는 AI 분석을 사람이 확정하는 단계입니다.",
      chatReplies: [
        "현재 핵심 쟁점은 조건부 승인 여부보다 보완 요청이 필요한지 판단하는 부분입니다.",
        "사람 판단 근거를 한두 문장으로 남기면 Stage 5 보고서 편집이 훨씬 자연스러워집니다.",
      ],
    }),
    subordinated: scenario(4, "subordinated", {
      triggerApi: "POST /v1/analysis/results/{result_id}/confirm",
      title: "AI 코파일럿",
      subtitle: "종합 판단 지원",
      citations: [
        {
          title: "후순위 구조 병합 메모",
          excerpt: "회수 순위와 프리미엄 적정성을 종합 판단표에 병합했습니다.",
        },
      ],
      recommendation: "후순위 구조 리스크를 반영해 확정 또는 수정 확정 여부를 결정하십시오.",
      analysisLabel: "리스크 집계 갱신",
      extraActions: [{ label: "조건 변경 기록", phase2Message: "Phase 2: condition change log" }],
      guideText: "후순위채는 구조 리스크 메모가 결론에 어떻게 반영되는지가 데모 포인트입니다.",
      chatReplies: [
        "후순위 구조에서는 회수 순위 설명과 금리 프리미엄 설명이 함께 있어야 설득력이 높습니다.",
        "수정 확정을 선택하면 Stage 5에서 조건부 승인 문구를 강화하는 흐름이 자연스럽습니다.",
      ],
    }),
    perpetual: scenario(4, "perpetual", {
      triggerApi: "POST /v1/analysis/results/{result_id}/confirm",
      title: "AI 코파일럿",
      subtitle: "종합 판단 지원",
      citations: [
        {
          title: "영구채 구조 병합 메모",
          excerpt: "콜옵션, step-up, 자본성 판단 포인트를 human confirm 블록에 병합했습니다.",
        },
      ],
      recommendation: "영구채 특화 판단은 human-only 메모를 포함해 확정 또는 수정 확정을 결정하십시오.",
      analysisLabel: "리스크 집계 갱신",
      extraActions: [{ label: "자본성 메모 갱신", phase2Message: "Phase 2: human-only decision log" }],
      guideText: "영구채는 AI 보조와 human-only 판단 경계가 가장 잘 드러나는 데모 구간입니다.",
      chatReplies: [
        "영구채는 구조 해석과 사람 판단의 경계가 분명해서 데모 설명에 적합합니다.",
        "Stage 5 보고서에서는 human-only 판단 포인트가 결론 섹션에 드러나야 합니다.",
      ],
    }),
  },
  5: {
    general: scenario(5, "general", {
      triggerApi: "POST /v1/reports/drafts",
      title: "AI 코파일럿",
      subtitle: "보고서 작성 지원",
      citations: [
        {
          title: "보고서 초안 제안",
          excerpt: "일반 사모사채용 본문 초안과 사후관리 기준 초안이 섹션별로 준비되었습니다.",
        },
      ],
      recommendation: "섹션별 AI 초안을 검토한 뒤 근거 미연결 배지를 우선 해소하십시오.",
      analysisLabel: "초안 재생성",
      extraActions: [{ label: "요약 문단 갱신", phase2Message: "Phase 2: report draft job" }],
      guideText: "Stage 5에서는 보고서 편집 가능성과 근거 연결 상태를 함께 보여주는 것이 중요합니다.",
      chatReplies: [
        "Issuer Overview와 Conclusion은 거의 제출 가능한 수준이며, Cashflow Analysis 보강이 가장 효과적입니다.",
        "근거 미연결 섹션을 먼저 해소하면 completeness 점수가 빠르게 올라갑니다.",
      ],
    }),
    subordinated: scenario(5, "subordinated", {
      triggerApi: "POST /v1/reports/drafts",
      title: "AI 코파일럿",
      subtitle: "보고서 작성 지원",
      citations: [
        {
          title: "보고서 초안 제안",
          excerpt: "후순위 구조 리스크 메모가 Risk Summary와 Conclusion 초안에 연결되었습니다.",
        },
      ],
      recommendation: "후순위 구조 메모와 근거 링크를 먼저 점검한 뒤 제출 준비를 확정하십시오.",
      analysisLabel: "초안 재생성",
      extraActions: [{ label: "구조 문단 갱신", phase2Message: "Phase 2: report draft job" }],
      guideText: "후순위채 보고서는 구조 리스크 문단이 빠지면 completeness가 높아도 설득력이 떨어집니다.",
      chatReplies: [
        "Risk Summary에 회수 순위와 프리미엄 적정성 문장을 먼저 넣는 것이 좋습니다.",
        "Conclusion에는 조건부 승인과 사후 모니터링 조건을 함께 적는 구성이 자연스럽습니다.",
      ],
    }),
    perpetual: scenario(5, "perpetual", {
      triggerApi: "POST /v1/reports/drafts",
      title: "AI 코파일럿",
      subtitle: "보고서 작성 지원",
      citations: [
        {
          title: "보고서 초안 제안",
          excerpt: "영구채 human-only 판단 메모가 Conclusion 초안에 연결되었습니다.",
        },
      ],
      recommendation: "영구채 특화 판단과 근거 링크를 먼저 점검한 뒤 제출 준비를 확정하십시오.",
      analysisLabel: "초안 재생성",
      extraActions: [{ label: "결론 문단 갱신", phase2Message: "Phase 2: report draft job" }],
      guideText: "영구채 보고서는 human-only 판단 흔적이 남아야 데모 설명이 정직해집니다.",
      chatReplies: [
        "Conclusion에 human-only 판단 메모를 병기하면 영구채 데모 흐름이 훨씬 명확해집니다.",
        "Cashflow Analysis보다 Risk Summary와 Conclusion의 연결 상태를 먼저 점검하는 편이 좋습니다.",
      ],
    }),
  },
  6: {
    general: scenario(6, "general", {
      triggerApi: "POST /v1/review-sessions/{session_id}/transitions",
      title: "AI 코파일럿",
      subtitle: "승인 단계 지원",
      citations: [
        {
          title: "승인 패키지 점검",
          excerpt: "종합 판단, 보고서 초안, 조건부 승인 항목이 모두 포함되었습니다.",
        },
      ],
      recommendation: "반려 또는 재작업 요청 시 코멘트를 남겨 Stage 5로 명확히 되돌리십시오.",
      analysisLabel: "승인 패키지 검토",
      guideText: "Stage 6은 승인자 책임이 드러나는 구간이라 승인/반려/재작업 구분이 분명해야 합니다.",
      chatReplies: [
        "승인 의견을 짧게 남기면 Stage 7 모니터링 콘솔과 자연스럽게 이어집니다.",
        "재작업 요청을 선택하면 보고서 근거와 결론 문단 보강을 우선 지시하는 것이 좋습니다.",
      ],
    }),
    subordinated: scenario(6, "subordinated", {
      triggerApi: "POST /v1/review-sessions/{session_id}/transitions",
      title: "AI 코파일럿",
      subtitle: "승인 단계 지원",
      citations: [
        {
          title: "승인 패키지 점검",
          excerpt: "후순위 구조 리스크와 조건부 승인 메모가 승인 패키지에 반영되었습니다.",
        },
      ],
      recommendation: "후순위 구조 리스크 코멘트를 남겨 승인 또는 재작업 요청을 명확히 하십시오.",
      analysisLabel: "승인 패키지 검토",
      guideText: "후순위채는 승인 코멘트에 구조 리스크 관리 조건이 드러나야 Stage 7과 연결됩니다.",
      chatReplies: [
        "승인 시에는 watchlist 유지 사유를 코멘트에 함께 남기면 Stage 7 설명이 쉬워집니다.",
        "재작업 요청 시에는 구조 리스크 서술 보강과 근거 링크 점검을 같이 지시하는 것이 좋습니다.",
      ],
    }),
    perpetual: scenario(6, "perpetual", {
      triggerApi: "POST /v1/review-sessions/{session_id}/transitions",
      title: "AI 코파일럿",
      subtitle: "승인 단계 지원",
      citations: [
        {
          title: "승인 패키지 점검",
          excerpt: "영구채 human-only 판단 메모가 승인 패키지에 반영되었습니다.",
        },
      ],
      recommendation: "영구채 특화 판단 코멘트를 남겨 승인 또는 재작업 요청을 명확히 하십시오.",
      analysisLabel: "승인 패키지 검토",
      guideText: "영구채는 승인자 코멘트에 human-only 판단 이유가 담겨야 데모가 정직해집니다.",
      chatReplies: [
        "승인 코멘트에는 자본성 판단과 모니터링 조건을 함께 적는 구성이 자연스럽습니다.",
        "재작업 요청을 선택하면 human-only 판단 근거를 더 명확히 적으라고 안내하는 것이 좋습니다.",
      ],
    }),
  },
  7: {
    general: scenario(7, "general", {
      triggerApi: "POST /v1/analysis/monitoring-criteria",
      title: "AI 코파일럿",
      subtitle: "사후관리 읽기 전용 지원",
      citations: [
        {
          title: "모니터링 요약",
          excerpt: "보고 지연, 레버리지 경계, 현금전환률 저하가 동시에 관찰되어 watchlist 유지가 권고됩니다.",
        },
      ],
      recommendation: "운영 조치 자동화는 Phase 2 범위이며, 현재 데모에서는 읽기 전용 모니터링과 추천 메모만 제공합니다.",
      analysisLabel: "모니터링 요약 갱신",
      extraActions: [{ label: "리마인더 초안 보기", phase2Message: "Phase 2: reminder composer" }],
      guideText: "Stage 7은 사후관리 콘솔의 형태를 보여주되 자동 조치는 하지 않는 것이 데모 원칙입니다.",
      chatReplies: [
        "현재 watchlist 유지 사유는 보고 일정 지연 가능성과 현금전환률 저하입니다.",
        "자동 리마인더 발송과 등급 조정은 Phase 2에서 백엔드 연동과 함께 구현될 예정입니다.",
      ],
    }),
    subordinated: scenario(7, "subordinated", {
      triggerApi: "POST /v1/analysis/monitoring-criteria",
      title: "AI 코파일럿",
      subtitle: "사후관리 읽기 전용 지원",
      citations: [
        {
          title: "모니터링 요약",
          excerpt: "후순위 구조 리스크와 covenant 경계 신호가 동시에 관찰되어 watchlist 유지가 권고됩니다.",
        },
      ],
      recommendation: "운영 조치 자동화는 Phase 2 범위이며, 현재 데모에서는 읽기 전용 모니터링과 추천 메모만 제공합니다.",
      analysisLabel: "모니터링 요약 갱신",
      extraActions: [{ label: "구조 리마인더 보기", phase2Message: "Phase 2: reminder composer" }],
      guideText: "Stage 7에서는 후순위 구조 리스크가 운영 모니터링으로 이어지는 그림을 보여줍니다.",
      chatReplies: [
        "후순위채 사후관리에서는 covenant 이상 신호와 회수 순위 관련 메모를 함께 추적하는 것이 중요합니다.",
        "자동 액션은 없지만, 어떤 운영 메모가 필요한지는 읽기 전용으로 충분히 설명할 수 있습니다.",
      ],
    }),
    perpetual: scenario(7, "perpetual", {
      triggerApi: "POST /v1/analysis/monitoring-criteria",
      title: "AI 코파일럿",
      subtitle: "사후관리 읽기 전용 지원",
      citations: [
        {
          title: "모니터링 요약",
          excerpt: "영구채 특화 조건과 보고 지연 가능성이 함께 관찰되어 watchlist 유지가 권고됩니다.",
        },
      ],
      recommendation: "운영 조치 자동화는 Phase 2 범위이며, 현재 데모에서는 읽기 전용 모니터링과 추천 메모만 제공합니다.",
      analysisLabel: "모니터링 요약 갱신",
      extraActions: [{ label: "영구채 리마인더 보기", phase2Message: "Phase 2: reminder composer" }],
      guideText: "Stage 7에서는 영구채 특화 판단 이후 어떤 운영 메모가 필요한지 읽기 전용으로 보여줍니다.",
      chatReplies: [
        "영구채 사후관리에서는 콜옵션 기대와 자본성 관련 해석 메모를 함께 유지하는 것이 좋습니다.",
        "자동 조치는 없지만, 어떤 지표를 watch해야 하는지 설명하는 데모 화면으로는 충분합니다.",
      ],
    }),
  },
};

export function getAICopilotScenario(stage: 2 | 3 | 4 | 5 | 6 | 7, branchType: BranchType) {
  return AI_COPILOT_SCENARIOS[stage][branchType];
}

export function getBranchSignal(branchType: BranchType) {
  return `${BRANCH_LABEL[branchType]} · ${BRANCH_SIGNAL[branchType]}`;
}
