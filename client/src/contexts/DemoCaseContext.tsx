/* Phase: P2 — issue #8 */

import { createContext, useContext, useMemo, useState } from "react";

interface DemoCaseContextType {
  activeCaseId: string;
  setActiveCaseId: (caseId: string) => void;
}

const DemoCaseContext = createContext<DemoCaseContextType | undefined>(undefined);

export function DemoCaseProvider({ children }: { children: React.ReactNode }) {
  const [activeCaseId, setActiveCaseId] = useState("DEMO-BOND-082");

  const value = useMemo(
    () => ({
      activeCaseId,
      setActiveCaseId,
    }),
    [activeCaseId]
  );

  return <DemoCaseContext.Provider value={value}>{children}</DemoCaseContext.Provider>;
}

export function useDemoCase() {
  const context = useContext(DemoCaseContext);

  if (!context) {
    throw new Error("useDemoCase must be used within DemoCaseProvider");
  }

  return context;
}
