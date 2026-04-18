/* Phase: P1 — issue #7 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface UseStageGuardOptions {
  canAccess: boolean;
  redirectTo: string;
  message: string;
}

export function useStageGuard({ canAccess, redirectTo, message }: UseStageGuardOptions) {
  const [location, navigate] = useLocation();
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

  useEffect(() => {
    if (isDemoMode || canAccess || location === redirectTo) {
      return;
    }

    toast.info(message);
    navigate(redirectTo);
  }, [canAccess, isDemoMode, location, message, navigate, redirectTo]);
}
