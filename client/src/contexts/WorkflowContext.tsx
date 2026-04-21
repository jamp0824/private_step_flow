import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getBranchStageRoute } from "@/config/stages";
import { canAdvanceFromStep3, canAdvanceFromStep4, deriveStageState, getNextSupplementStatus } from "@/lib/workflow";

export type BranchType = "general" | "subordinated" | "perpetual";
export type ReviewStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected" | "returned";
export type SupplementStatus = "none" | "required" | "requested" | "waiting" | "reuploaded" | "rechecking" | "resolved";
export type StageState = "idle" | "loading" | "processing" | "blocked" | "ready" | "error";
export type DecisionStatus = "pending" | "confirmed" | "modified" | "rejected" | "supplement_requested";

export interface WorkflowState {
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

export const WORKFLOW_STORAGE_KEY = "ibk-approval-workflow-v1";

function getWorkflowStorageKey(caseId: string) {
  return `${WORKFLOW_STORAGE_KEY}:${caseId}`;
}

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

export function WorkflowProvider({ children, caseId }: { children: React.ReactNode; caseId: string }) {
  const [state, setState] = useState<WorkflowState>(() => {
    if (typeof window === "undefined") return DEFAULT_STATE;

    const stored = window.localStorage.getItem(getWorkflowStorageKey(caseId));
    if (!stored) return DEFAULT_STATE;

    try {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    const nextState = { ...state, stageState: deriveStageState(state) };
    window.localStorage.setItem(getWorkflowStorageKey(caseId), JSON.stringify(nextState));
  }, [caseId, state]);

  const value = useMemo<WorkflowContextType>(() => {
    const canProceedFromStep2 =
      state.sessionStarted &&
      state.parseErrorResolved &&
      state.comparisonReviewed &&
      state.branchLocked &&
      state.supplementStatus === "resolved";

    const branchRoute = getBranchStageRoute(state.branchType);

    const canAdvanceFromStep3Result = canAdvanceFromStep3(state);
    const canAdvanceFromStep4Result = canAdvanceFromStep4(state);

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
        window.localStorage.removeItem(getWorkflowStorageKey(caseId));
        setState(DEFAULT_STATE);
      },
      canProceedFromStep2,
      branchRoute,
      canAdvanceFromStep3: canAdvanceFromStep3Result,
      canAdvanceFromStep4: canAdvanceFromStep4Result,
      canSubmitFromStep5,
    };
  }, [caseId, state]);

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);

  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }

  return context;
}
