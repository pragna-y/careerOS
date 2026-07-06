import { ApplicationEvent } from "./types";

// In-memory store standing in for the event log / database at this scope.
// Deliberately not persisted — this is the honest, disclosed simplification
// for a 2-hour build, per the frozen architecture's "synthetic data" default.
export const events: ApplicationEvent[] = [
  { id: "1", company: "Google", role: "Software Engineer", status: "interview", confidence: 0.94, updatedAt: "2026-06-20T09:00:00Z" },
  { id: "2", company: "Microsoft", role: "Frontend Engineer", status: "applied", confidence: 0.88, updatedAt: "2026-06-22T10:15:00Z" },
  { id: "3", company: "Stripe", role: "Backend Engineer", status: "rejected", confidence: 0.91, updatedAt: "2026-06-18T14:30:00Z" },
  { id: "4", company: "Atlassian", role: "Product Engineer", status: "viewed", confidence: 0.62, updatedAt: "2026-06-25T08:45:00Z" },
  { id: "5", company: "OpenAI", role: "Full Stack Engineer", status: "applied", confidence: 0.97, updatedAt: "2026-06-27T11:00:00Z" },
  { id: "6", company: "CommBank", role: "Software Engineer", status: "viewed", confidence: 0.55, updatedAt: "2026-06-19T16:20:00Z" },
  { id: "7", company: "OpenText", role: "Backend Developer", status: "applied", confidence: 0.49, updatedAt: "2026-06-28T09:30:00Z" },
  { id: "8", company: "Bright", role: "Frontend Developer", status: "interview", confidence: 0.85, updatedAt: "2026-06-24T13:10:00Z" },
  { id: "9", company: "Eightfold", role: "ML Engineer", status: "rejected", confidence: 0.58, updatedAt: "2026-06-17T15:45:00Z" },
  { id: "10", company: "Atlassian", role: "Platform Engineer", status: "applied", confidence: 0.72, updatedAt: "2026-06-29T10:00:00Z" },
  { id: "11", company: "Google", role: "Site Reliability Engineer", status: "viewed", confidence: 0.44, updatedAt: "2026-06-21T12:00:00Z" },
  { id: "12", company: "Stripe", role: "Infrastructure Engineer", status: "interview", confidence: 0.89, updatedAt: "2026-06-26T14:00:00Z" }
];
