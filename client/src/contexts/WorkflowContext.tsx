import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getBranchStageRoute } from "@/config/stages";

export type BranchType = "general" | "subordinated" | "perpetual";
export type ReviewStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected" | "returned";
export type SupplementStatus = "none" | "required" | "requested" | "waiting" | "reuploaded" | "rechecking" | "resolved";
export type StageState = "idle" | "loading" | "processing" | "blocked" | "ready" | "error";
export type DecisionStatus = "pending" | "confirmed" | "modified" | "rejected" | "supplement_requested";

interface WorkflowState {
  branchType: BranchType;
  branchLocked: boolean;
  reviewStatus: ReviewStatus;
  supplementStatus: SupplementStatus;
  stageState: StageState;
  sessionStarted: boolean;
  parseErrorResolved: boolean;
  comparisonReviewed: boolean;
  commonAnalysisReady: boolean;
  branchAnalysisReady: boolean;
  decisionStatus: DecisionStatus;
  decisionRationale: string;
  approverComment: string;
}

interface WorkflowContextType {
  state: WorkflowState;
  setBranchType: (branch: BranchType) => void;
  lockBranch: () => void;
  startSession: () => void;
  resolveParseError: () => void;
  markComparisonReviewed: () => void;
  setDecisionRationale: (value: string) => void;
  advanceSupplement: () => void;
  requestSupplement: () => void;
  markCommonAnalysisReady: () => void;
  markBranchAnalysisReady: () => void;
  setDecisionStatus: (status: DecisionStatus) => void;
  submitForApproval: () => void;
  approveCase: (comment: string) => void;
  rejectCase: (comment: string) => void;
  returnForRework: (comment: string) => void;
  setApproverComment: (value: string) => void;
  resetWorkflow: () => void;
  canProceedFromStep2: boolean;
  branchRoute: string;
  canAdvanceFromStep3: boolean;
  canAdvanceFromStep4: boolean;
  canSubmitFromStep5: boolean;
}

export const WORKFLOW_STORAGE_KEY = "bond-review-workflow-v2";

const DEFAULT_STATE: WorkflowState = {
  branchType: "general",
  branchLocked: false,
  reviewStatus: "draft",
  supplementStatus: "required",
  stageState: "blocked",
  sessionStarted: false,
  parseErrorResolved: false,
  comparisonReviewed: false,
  commonAnalysisReady: false,
  branchAnalysisReady: false,
  decisionStatus: "pending",
  decisionRationale: "",
  approverComment: "",
};

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

function getNextSupplementStatus(status: SupplementStatus): SupplementStatus {
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

function deriveStageState(state: WorkflowState): StageState {
  if (!state.sessionStarted) return "idle";
  if (!state.parseErrorResolved) return "error";
  if (state.supplementStatus === "requested" || state.supplementStatus === "waiting") return "blocked";
  if (state.supplementStatus === "rechecking") return "processing";
  if (!state.comparisonReviewed || !state.branchLocked) return "blocked";
  if (state.reviewStatus === "submitted" || state.reviewStatus === "under_review") return "processing";
  if (state.reviewStatus === "returned") return "blocked";
  return "ready";
}

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkflowState>(() => {
    if (typeof window === "undefined") return DEFAULT_STATE;

    const stored = window.localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;

    try {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    const nextState = { ...state, stageState: deriveStageState(state) };
    window.localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(nextState));
  }, [state]);

  const value = useMemo<WorkflowContextType>(() => {
    const canProceedFromStep2 =
      state.sessionStarted &&
      state.parseErrorResolved &&
      state.comparisonReviewed &&
      state.branchLocked &&
      state.supplementStatus === "resolved";

    const branchRoute = getBranchStageRoute(state.branchType);

    const canAdvanceFromStep3 =
      state.commonAnalysisReady && (state.branchType === "general" || state.branchAnalysisReady);

    const canAdvanceFromStep4 =
      (state.decisionStatus === "confirmed" || state.decisionStatus === "modified") && state.supplementStatus === "resolved";

    const canSubmitFromStep5 =
      state.reviewStatus === "draft" || state.reviewStatus === "returned";

    return {
      state: { ...state, stageState: deriveStageState(state) },
      setBranchType: (branch) =>
        setState((prev) => ({
          ...prev,
          branchType: branch,
          branchLocked: false,
          branchAnalysisReady: branch === "general" ? true : false,
        })),
      lockBranch: () => setState((prev) => ({ ...prev, branchLocked: true })),
      startSession: () => setState((prev) => ({ ...prev, sessionStarted: true })),
      resolveParseError: () => setState((prev) => ({ ...prev, parseErrorResolved: true })),
      markComparisonReviewed: () => setState((prev) => ({ ...prev, comparisonReviewed: true })),
      setDecisionRationale: (value) => setState((prev) => ({ ...prev, decisionRationale: value })),
      advanceSupplement: () =>
        setState((prev) => ({
          ...prev,
          supplementStatus: getNextSupplementStatus(prev.supplementStatus),
        })),
      requestSupplement: () =>
        setState((prev) => ({
          ...prev,
          supplementStatus: "requested",
          decisionStatus: prev.decisionStatus === "pending" ? "pending" : "supplement_requested",
        })),
      markCommonAnalysisReady: () => setState((prev) => ({ ...prev, commonAnalysisReady: true })),
      markBranchAnalysisReady: () => setState((prev) => ({ ...prev, branchAnalysisReady: true })),
      setDecisionStatus: (status) => setState((prev) => ({ ...prev, decisionStatus: status })),
      submitForApproval: () =>
        setState((prev) => ({
          ...prev,
          reviewStatus: "submitted",
          approverComment: prev.reviewStatus === "returned" ? prev.approverComment : "",
        })),
      approveCase: (comment) => setState((prev) => ({ ...prev, reviewStatus: "approved", approverComment: comment })),
      rejectCase: (comment) => setState((prev) => ({ ...prev, reviewStatus: "rejected", approverComment: comment })),
      returnForRework: (comment) =>
        setState((prev) => ({
          ...prev,
          reviewStatus: "returned",
          approverComment: comment,
          decisionStatus: prev.decisionStatus === "pending" ? "pending" : prev.decisionStatus,
        })),
      setApproverComment: (value) => setState((prev) => ({ ...prev, approverComment: value })),
      resetWorkflow: () => {
        window.localStorage.removeItem(WORKFLOW_STORAGE_KEY);
        setState(DEFAULT_STATE);
      },
      canProceedFromStep2,
      branchRoute,
      canAdvanceFromStep3,
      canAdvanceFromStep4,
      canSubmitFromStep5,
    };
  }, [state]);

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);

  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }

  return context;
}
