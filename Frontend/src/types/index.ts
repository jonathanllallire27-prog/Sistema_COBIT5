// Tipos de usuario
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'auditor' | 'audit_leader' | 'process_owner' | 'reviewer';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Tipos de COBIT 5
export interface CobitProcess {
  id: number;
  domain: string;
  process_code: string;
  process_name: string;
  description?: string;
  process_goals?: string[];
}

export interface Control {
  id: number;
  process_id: number;
  control_code: string;
  control_statement: string;
  metrics?: string;
  maturity_levels: Record<number, string>;
  weight: number;
}

// Tipos de auditoría
export interface Audit {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: 'planned' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  scope_processes: number[];
  created_by: number;
  creator?: User;
  scoring_config: {
    compliant: number;
    partially_compliant: number;
    non_compliant: number;
    not_applicable: number | null;
  };
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: number;
  audit_id: number;
  control_id: number;
  status: 'pending' | 'in_progress' | 'completed';
  compliance?: 'compliant' | 'partially_compliant' | 'non_compliant' | 'not_applicable';
  score?: number;
  notes?: string;
  evidence_summary?: string;
  Control?: Control & { CobitProcess?: CobitProcess };
  Evidences?: Evidence[];
}

export interface Finding {
  id: number;
  audit_id: number;
  control_id?: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: number;
  impact: number;
  status: 'open' | 'investigating' | 'action_planned' | 'in_remediation' | 'verification' | 'closed';
  owner_id: number;
  action_plan?: string;
  due_date?: string;
  closed_at?: string;
  owner?: User;
  Control?: Control;
  risk_score?: number;
  risk_level?: string;
}

export interface Evidence {
  id: number;
  assessment_id: number;
  filename: string;
  filepath: string;
  filetype: string;
  filesize: number;
  classification: 'public' | 'internal' | 'confidential' | 'secret';
  description?: string;
  uploaded_by: number;
  uploader?: User;
  uploaded_at: string;
}

// Tipos para dashboard
export interface DashboardMetrics {
  totalAudits: number;
  activeAudits: number;
  totalFindings: number;
  openFindings: number;
  complianceRate: number;
  averageScore: number;
  findingsBySeverity: Record<string, number>;
  findingsByStatus: Record<string, number>;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}