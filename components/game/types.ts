export type WorkerStatus = "idle" | "working" | "done" | "failed";

export type POI = {
  name: string;
  x: number;
  y: number;
};

export type QueuedTask = {
  id: string;
  message: string;
};
