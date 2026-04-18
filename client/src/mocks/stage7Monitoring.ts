/* Phase: P0 — issue #2 */

export interface Stage7MonitoringMock {
  summary: {
    caseId: string;
    issuer: string;
    facilityType: string;
    watchStatus: string;
    nextReviewDate: string;
  };
  covenantTracker: Array<{
    covenant: string;
    threshold: string;
    latestValue: string;
    status: "ON TRACK" | "WATCH" | "BREACH RISK";
    owner: string;
  }>;
  financialSignals: Array<{
    label: string;
    value: string;
    delta: string;
    tone: "stable" | "watch" | "risk";
  }>;
  alerts: Array<{
    time: string;
    type: string;
    title: string;
    detail: string;
  }>;
  reminders: Array<{
    title: string;
    detail: string;
    phase2Label: string;
  }>;
}

export const STAGE7_MONITORING_MOCK: Stage7MonitoringMock = {
  summary: {
    caseId: "DEMO-BOND-071",
    issuer: "노스 필드",
    facilityType: "일반사채",
    watchStatus: "WATCHLIST",
    nextReviewDate: "2026-05-12",
  },
  covenantTracker: [
    {
      covenant: "Interest Coverage",
      threshold: "2.5x 이상",
      latestValue: "2.9x",
      status: "ON TRACK",
      owner: "심사1팀",
    },
    {
      covenant: "Debt / EBITDA",
      threshold: "4.0x 이하",
      latestValue: "3.8x",
      status: "WATCH",
      owner: "리스크관리",
    },
    {
      covenant: "Quarterly Reporting",
      threshold: "분기 종료 후 20일 이내",
      latestValue: "18일 경과",
      status: "BREACH RISK",
      owner: "사후관리",
    },
  ],
  financialSignals: [
    { label: "Liquidity Runway", value: "5.4개월", delta: "+0.3개월", tone: "stable" },
    { label: "Cash Conversion", value: "78%", delta: "-4%p", tone: "watch" },
    { label: "Refinancing Pressure", value: "중간", delta: "+1 단계", tone: "risk" },
  ],
  alerts: [
    {
      time: "08:40",
      type: "Delay Alert",
      title: "분기 재무자료 제출 임박",
      detail: "필수 첨부 1건이 아직 미수신 상태입니다.",
    },
    {
      time: "07:25",
      type: "EOD Signal",
      title: "지연 가능성 조기 감지",
      detail: "현금전환률 저하와 보고 일정 지연이 동시에 감지되었습니다.",
    },
    {
      time: "전일",
      type: "Covenant Watch",
      title: "레버리지 지표 재확인 필요",
      detail: "Debt / EBITDA가 내부 경계값에 근접했습니다.",
    },
  ],
  reminders: [
    {
      title: "CFO 확인 메일 초안 제안",
      detail: "분기 재무자료와 자금집행 계획을 함께 요청하도록 문구가 준비되었습니다.",
      phase2Label: "Phase 2: reminder send automation",
    },
    {
      title: "감시 등급 상향 검토 메모",
      detail: "다음 내부 회의에서 watchlist 사유를 3줄로 요약한 초안을 생성했습니다.",
      phase2Label: "Phase 2: approval workflow",
    },
  ],
};
