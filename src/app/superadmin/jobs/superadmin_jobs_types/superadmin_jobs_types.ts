export interface BackgroundJob {
  id: string;
  queueName: string;
  jobName: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'DELAYED';
  attempts: number;
  error?: string;
  createdAt: string;
  finishedAt?: string;
  durationMs?: number;
  payload?: Record<string, unknown>;
}

export interface JobsMetrics {
  activeJobs: number;
  completed24h: number;
  failed24h: number;
  delayed: number;
}
