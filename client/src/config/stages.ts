/* Phase: P0 — issue #1 */

import type { BranchType } from "@/contexts/WorkflowContext";

export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const STAGE_LABELS: Record<StageNumber, string> = {
  1: "접수",
  2: "업로드/분류",
  3: "분석",
  4: "종합 판단",
  5: "보고서 작성",
  6: "승인",
  7: "모니터링",
};

export const STAGE_ROUTE_MAP: Record<StageNumber, string> = {
  1: "/stage1",
  2: "/stage2",
  3: "/stage3",
  4: "/stage4",
  5: "/stage5",
  6: "/stage6",
  7: "/stage7",
};

export const BRANCH_STAGE_ROUTES: Record<Exclude<BranchType, "general">, string> = {
  subordinated: "/stage3/subordinated",
  perpetual: "/stage3/perpetual",
};

export function getBranchStageRoute(branchType: BranchType) {
  if (branchType === "general") {
    return STAGE_ROUTE_MAP[4];
  }

  return BRANCH_STAGE_ROUTES[branchType];
}

export function getStageRoute(stage: StageNumber, branchType: BranchType = "general") {
  if (stage === 3 && branchType !== "general") {
    return getBranchStageRoute(branchType);
  }

  return STAGE_ROUTE_MAP[stage];
}
