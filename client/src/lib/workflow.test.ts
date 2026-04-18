/* Phase: P2 — issue #9 */

import { describe, expect, it } from "vitest";
import type { WorkflowState } from "@/contexts/WorkflowContext";
import { canAdvanceFromStep3, canAdvanceFromStep4, deriveStageState, getNextSupplementStatus } from "@/lib/workflow";

function makeState(overrides: Partial<WorkflowState> = {}): WorkflowState {
  return {
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
    ...overrides,
  };
}

describe("getNextSupplementStatus", () => {
  it("moves none to required", () => expect(getNextSupplementStatus("none")).toBe("required"));
  it("moves required to requested", () => expect(getNextSupplementStatus("required")).toBe("requested"));
  it("moves requested to waiting", () => expect(getNextSupplementStatus("requested")).toBe("waiting"));
  it("moves waiting to reuploaded", () => expect(getNextSupplementStatus("waiting")).toBe("reuploaded"));
  it("moves reuploaded to rechecking", () => expect(getNextSupplementStatus("reuploaded")).toBe("rechecking"));
  it("moves rechecking to resolved", () => expect(getNextSupplementStatus("rechecking")).toBe("resolved"));
  it("keeps resolved at resolved", () => expect(getNextSupplementStatus("resolved")).toBe("resolved"));
});

describe("deriveStageState", () => {
  it("returns idle before session start", () => expect(deriveStageState(makeState())).toBe("idle"));

  it("returns error when parse issues remain", () => {
    expect(deriveStageState(makeState({ sessionStarted: true }))).toBe("error");
  });

  it("returns blocked while supplement is requested", () => {
    expect(deriveStageState(makeState({ sessionStarted: true, parseErrorResolved: true, supplementStatus: "requested" }))).toBe("blocked");
  });

  it("returns processing while supplement is rechecking", () => {
    expect(deriveStageState(makeState({ sessionStarted: true, parseErrorResolved: true, supplementStatus: "rechecking" }))).toBe("processing");
  });

  it("returns blocked when comparison review is incomplete", () => {
    expect(deriveStageState(makeState({ sessionStarted: true, parseErrorResolved: true, supplementStatus: "resolved", branchLocked: true }))).toBe("blocked");
  });

  it("returns processing once submitted", () => {
    expect(
      deriveStageState(
        makeState({
          sessionStarted: true,
          parseErrorResolved: true,
          supplementStatus: "resolved",
          comparisonReviewed: true,
          branchLocked: true,
          reviewStatus: "submitted",
        })
      )
    ).toBe("processing");
  });

  it("returns ready when all intake conditions are satisfied", () => {
    expect(
      deriveStageState(
        makeState({
          sessionStarted: true,
          parseErrorResolved: true,
          supplementStatus: "resolved",
          comparisonReviewed: true,
          branchLocked: true,
        })
      )
    ).toBe("ready");
  });
});

describe("canAdvanceFromStep3", () => {
  it("allows general branch after common analysis", () => {
    expect(canAdvanceFromStep3(makeState({ branchType: "general", commonAnalysisReady: true }))).toBe(true);
  });

  it("blocks branched flow without branch analysis output", () => {
    expect(canAdvanceFromStep3(makeState({ branchType: "subordinated", commonAnalysisReady: true, branchAnalysisReady: false }))).toBe(false);
  });

  it("allows branched flow after branch output is ready", () => {
    expect(canAdvanceFromStep3(makeState({ branchType: "perpetual", commonAnalysisReady: true, branchAnalysisReady: true }))).toBe(true);
  });
});

describe("canAdvanceFromStep4", () => {
  it("allows confirmed decision when supplement loop is resolved", () => {
    expect(canAdvanceFromStep4(makeState({ decisionStatus: "confirmed", supplementStatus: "resolved" }))).toBe(true);
  });

  it("allows modified decision when supplement loop is resolved", () => {
    expect(canAdvanceFromStep4(makeState({ decisionStatus: "modified", supplementStatus: "resolved" }))).toBe(true);
  });

  it("blocks confirmed decision while supplement loop is still open", () => {
    expect(canAdvanceFromStep4(makeState({ decisionStatus: "confirmed", supplementStatus: "waiting" }))).toBe(false);
  });

  it("blocks pending decision even when supplement loop is resolved", () => {
    expect(canAdvanceFromStep4(makeState({ decisionStatus: "pending", supplementStatus: "resolved" }))).toBe(false);
  });
});
