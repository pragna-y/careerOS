export type ApplicationStatus = "applied" | "viewed" | "interview" | "rejected";

export interface ApplicationEvent {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  confidence: number; // 0.0 - 1.0
  updatedAt: string; // ISO timestamp
}

export interface CorrectionRequest {
  status: ApplicationStatus;
  /**
   * Demo-only flag: lets the frontend deterministically trigger the
   * server-error / rollback path during a live demo instead of relying
   * on random chance. Real clients would never send this.
   */
  forceFail?: boolean;
}
