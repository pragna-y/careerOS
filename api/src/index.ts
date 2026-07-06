import express, { Request, Response } from "express";
import cors from "cors";
import { events } from "./data";
import { ApplicationStatus, CorrectionRequest } from "./types";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const VALID_STATUSES: ApplicationStatus[] = ["applied", "viewed", "interview", "rejected"];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/events", (_req: Request, res: Response) => {
  res.json(events);
});

// PATCH /events/:id
// Simulates a human correcting a classification. Introduces a real,
// awaited network delay so the frontend's optimistic-update and
// rollback logic is exercised against genuine async behavior, not
// a client-side simulation.
app.patch("/events/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body as CorrectionRequest;

  if (!body || !VALID_STATUSES.includes(body.status)) {
    res.status(400).json({ error: "Invalid or missing status" });
    return;
  }

  const event = events.find((e) => e.id === id);
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  // Real, awaited delay — demonstrates handling of genuine latency,
  // not a cosmetic frontend timeout.
  await delay(800);

  // Deterministic failure path for demo purposes only (see CorrectionRequest.forceFail).
  if (body.forceFail) {
    res.status(500).json({ error: "Simulated server error" });
    return;
  }

  event.status = body.status;
  event.confidence = 1.0; // human correction is treated as ground truth
  event.updatedAt = new Date().toISOString();

  res.json(event);
});

app.listen(PORT, () => {
  console.log(`CareerOS API running on http://localhost:${PORT}`);
});
