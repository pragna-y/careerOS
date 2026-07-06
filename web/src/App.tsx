import { useEffect, useState } from "react";
import { ApplicationEvent, STATUS_OPTIONS } from "./types";
import { fetchEvents } from "./api";
import { useOptimisticCorrection } from "./useOptimisticCorrection";
import "./App.css";

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const level = confidence >= 0.8 ? "high" : confidence >= 0.6 ? "medium" : "low";
  return (
    <span className={`confidence confidence--${level}`}>
      {Math.round(confidence * 100)}% confidence
    </span>
  );
}

function Dashboard({ events }: { events: ApplicationEvent[] }) {
  const total = events.length;
  const counts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, status) => {
    acc[status] = events.filter((e) => e.status === status).length;
    return acc;
  }, {});
  const responseRate =
    total === 0
      ? 0
      : Math.round(
          ((counts.interview + counts.rejected) / total) * 100
        );

  return (
    <section className="dashboard" aria-label="Application summary">
      <div className="stat">
        <span className="stat__value">{total}</span>
        <span className="stat__label">Total applications</span>
      </div>
      <div className="stat">
        <span className="stat__value">{responseRate}%</span>
        <span className="stat__label">Response rate</span>
      </div>
      {STATUS_OPTIONS.map((status) => (
        <div className="stat" key={status}>
          <span className="stat__value">{counts[status]}</span>
          <span className="stat__label">{status}</span>
        </div>
      ))}
    </section>
  );
}

function EventRow({
  event,
  onCorrect,
  pending
}: {
  event: ApplicationEvent;
  onCorrect: (id: string, status: ApplicationEvent["status"], forceFail?: boolean) => void;
  pending: boolean;
}) {
  return (
    <li className="event-row">
      <div className="event-row__info">
        <span className="event-row__role">{event.role}</span>
        <span className="event-row__company">{event.company}</span>
      </div>

      <div className="event-row__status">
        <span className={`status-badge status-badge--${event.status}`}>
          {event.status}
        </span>
        <ConfidenceBadge confidence={event.confidence} />
      </div>

      <div className="event-row__actions">
        <label className="sr-only" htmlFor={`correct-${event.id}`}>
          Correct status for {event.role} at {event.company}
        </label>
        <select
          id={`correct-${event.id}`}
          disabled={pending}
          defaultValue=""
          onChange={(e) => {
            const value = e.target.value as ApplicationEvent["status"];
            if (value) onCorrect(event.id, value);
            e.target.value = "";
          }}
        >
          <option value="" disabled>
            {pending ? "Saving…" : "Correct status…"}
          </option>
          {STATUS_OPTIONS.filter((s) => s !== event.status).map((s) => (
            <option key={s} value={s}>
              Mark as {s}
            </option>
          ))}
        </select>

        {/* Demo-only control: deterministically exercises the rollback path. */}
        <button
          type="button"
          className="demo-fail-btn"
          disabled={pending}
          onClick={() => onCorrect(event.id, "interview", true)}
          title="Demo only: forces a server error to show optimistic rollback"
        >
          Simulate failure
        </button>
      </div>
    </li>
  );
}

export default function App() {
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { correct, pendingId, error } = useOptimisticCorrection(events, setEvents);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="app">
      <header className="app__header">
        <h1>CareerOS</h1>
        <p>Application intelligence — event-sourced status tracking with human-in-the-loop correction.</p>
      </header>

      {loading && <p role="status">Loading applications…</p>}
      {loadError && (
        <p role="alert" className="error-banner">
          Could not load events: {loadError}. Is the API running on localhost:4000?
        </p>
      )}

      {!loading && !loadError && (
        <>
          <Dashboard events={events} />

          {error && (
            <p role="alert" className="error-banner">
              Correction failed: {error}. Reverted to the previous status.
            </p>
          )}

          <ul className="event-list">
            {events.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                onCorrect={correct}
                pending={pendingId === event.id}
              />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
