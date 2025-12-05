export interface AuditStatus {
  status: 'planned' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  label: string;
  color: string;
}

export interface AuditMetrics {
  totalControls: number;
  assessedControls: number;
  compliant: number;
  partiallyCompliant: number;
  nonCompliant: number;
  notApplicable: number;
  overallCompliance: number;
  averageMaturityLevel: number;
  riskScore: number;
}

export interface AuditProgress {
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  pendingAssessments: number;
  completionPercentage: number;
}

export interface AuditFindings {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  closed: number;
  open: number;
}

export interface AuditTimeline {
  plannedStart: string;
  actualStart?: string;
  plannedEnd: string;
  actualEnd?: string;
  elapsedDays: number;
  remainingDays: number;
}

export interface ComplianceScoreConfig {
  compliant: number;
  partiallyCompliant: number;
  nonCompliant: number;
  notApplicable: number | null;
}
