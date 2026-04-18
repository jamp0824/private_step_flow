/* Phase: P2 — issue #9 */

import type { StageState, SupplementStatus, WorkflowState } from "@/contexts/WorkflowContext";

export function getNextSupplementStatus(status: SupplementStatus): SupplementStatus {
  const cycle: Record<SupplementStatus, SupplementStatus> = {
    none: "required",
    required: "requested",
    requested: "waiting",
    waiting: "reuploaded",
    reuploaded: "rechecking",
    rechecking: "resolved",
    resolved: "resolved",
  };

  return cycle[status];
}

export function deriveStageState(state: WorkflowState): StageState {
  if (!state.sessionStarted) return "idle";
  if (!state.parseErrorResolved) return "error";
  if (state.supplementStatus === "requested" || state.supplementStatus === "waiting") return "blocked";
  if (state.supplementStatus === "rechecking") return "processing";
  if (!state.comparisonReviewed || !state.branchLocked) return "blocked";
  if (state.reviewStatus === "submitted" || state.reviewStatus === "under_review") return "processing";
  if (state.reviewStatus === "returned") return "blocked";
  return "ready";
}

export function canAdvanceFromStep3(state: WorkflowState) {
  return state.commonAnalysisReady && (state.branchType === "general" || state.branchAnalysisReady);
}

export function canAdvanceFromStep4(state: WorkflowState) {
  return (state.decisionStatus === "confirmed" || state.decisionStatus === "modified") && state.supplementStatus === "resolved";
}
