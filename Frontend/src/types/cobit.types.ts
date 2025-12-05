export interface CobitDomain {
  code: 'EDM' | 'APO' | 'BAI' | 'DSS' | 'MEA';
  name: string;
  description: string;
  fullName: string;
}

export interface ProcessMetrics {
  processId: number;
  processCode: string;
  totalControls: number;
  assessedControls: number;
  compliantControls: number;
  partiallyCompliantControls: number;
  nonCompliantControls: number;
  compliancePercentage: number;
  averageMaturityLevel: number;
}

export interface CobitMaturityModel {
  level: number;
  name: string;
  description: string;
  characteristics: string[];
}

export interface ProcessScope {
  processId: number;
  processCode: string;
  processName: string;
  domain: string;
  include: boolean;
}

export interface ControlAssessmentData {
  controlId: number;
  controlCode: string;
  complianceStatus: 'compliant' | 'partially_compliant' | 'non_compliant' | 'not_applicable';
  maturityLevel?: number;
  evidence: string[];
  notes?: string;
  assessedBy: number;
  assessedAt: string;
}
