import { useState } from "react";
import { ApplicationEvent, ApplicationStatus } from "./types";
import { correctEvent } from "./api";

interface CorrectionState {
  pendingId: string | null;
  error: string | null;
}

/**
 * Encapsulates the optimistic-update + rollback pattern:
 * 1. Apply the correction to local state immediately (optimistic).
 * 2. Send the real PATCH request.
 * 3. On success, keep the optimistic state (already correct).
 * 4. On failure, roll back to the previous value and surface an error.
 *
 * This is deliberately the most carefully built piece of the app —
 * it's the one genuinely hard frontend/state-management problem
 * in scope for this build.
 */
export function useOptimisticCorrection(
  events: ApplicationEvent[],
  setEvents: React.Dispatch<React.SetStateAction<ApplicationEvent[]>>
) {
  const [state, setState] = useState<CorrectionState>({
    pendingId: null,
    error: null
  });

  async function correct(id: string, newStatus: ApplicationStatus, forceFail = false) {
    const previous = events.find((e) => e.id === id);
    if (!previous) return;

    setState({ pendingId: id, error: null });

    // Optimistic update: apply immediately, before the server confirms.
    setEvents((current) =>
      current.map((e) =>
        e.id === id ? { ...e, status: newStatus, confidence: 1.0 } : e
      )
    );

    try {
      const updated = await correctEvent(id, newStatus, forceFail);
      setEvents((current) =>
        current.map((e) => (e.id === id ? updated : e))
      );
      setState({ pendingId: null, error: null });
    } catch (err) {
      // Rollback: revert to the pre-optimistic value on real failure.
      setEvents((current) =>
        current.map((e) => (e.id === id ? previous : e))
      );
      setState({
        pendingId: null,
        error: err instanceof Error ? err.message : "Correction failed"
      });
    }
  }

  return { correct, pendingId: state.pendingId, error: state.error };
}
