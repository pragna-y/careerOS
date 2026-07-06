import { ApplicationEvent, ApplicationStatus } from "./types";

const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchEvents(): Promise<ApplicationEvent[]> {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }
  return res.json();
}

export async function correctEvent(
  id: string,
  status: ApplicationStatus,
  forceFail = false
): Promise<ApplicationEvent> {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, forceFail })
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}
