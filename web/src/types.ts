export type ApplicationStatus = "applied" | "viewed" | "interview" | "rejected";

export interface ApplicationEvent {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  confidence: number;
  updatedAt: string;
}

export const STATUS_OPTIONS: ApplicationStatus[] = [
  "applied",
  "viewed",
  "interview",
  "rejected"
];
