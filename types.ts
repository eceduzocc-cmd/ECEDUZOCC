
export interface Student {
  id: string;
  name: string;
  email: string;
  career: string;
  semester: number;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  gpa: number;
}

export interface Teacher {
  id: string;
  name: string;
  identityCard: string;
  center: string;
  specialty: string;
  department: string;
  email: string;
  phone?: string;
  courses: string[];
  imageUrl: string;
  rating: number;
  hoursPerWeek: number;
  status: 'Disponible' | 'Carga Completa' | 'Licencia';
  isActive: boolean;
}

export interface AcademicPeriod {
  id: string;
  name: string;
  status: 'Abierto' | 'Cerrado';
  participatingTeacherIds: string[];
}

export interface PDIMapping {
  macroId: number;
  microIds: number[];
}

export interface EvidenceField {
  id: string;
  type: 'text' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
}

export interface MasterFunction {
  id: string;
  name: string;
  description: string;
  category?: string; // Nuevo: Para clasificación en Gestión Documental
  pdiMappings: PDIMapping[];
  substantiveFunctions: string[];
  contractualGeneral: string[];
  contractualDirector: string[];
  contractualLeader: string[];
  contractualResponsibility: string;
  suggestedEvidence: string;
  evidenceSchema: EvidenceField[];
}

export interface AssignedFunction {
  id: string;
  periodId: string;
  teacherId: string;
  masterFunctionId: string;
  name: string;
  description: string;
  category?: string; // Nuevo: Para clasificación en Gestión Documental
  evidenceUrl?: string;
  status: 'Pendiente' | 'Entregado';
  pdiMappings?: PDIMapping[];
  substantiveFunctions?: string[];
  contractualGeneral?: string[];
  contractualDirector?: string[];
  contractualLeader?: string[];
  evidenceSchema?: EvidenceField[];
  evidenceData?: Record<string, string | { name: string; size: number }>;
}

export interface Assignment {
  id: string;
  teacherId: string;
  courseName: string;
  schedule: string;
  room: string;
  group: string;
  periodId: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  MASTER_FUNCTIONS = 'MASTER_FUNCTIONS',
  TEACHER_PROFILES = 'TEACHER_PROFILES',
  ASSIGNMENTS = 'ASSIGNMENTS',
  TEACHER_FUNCTIONS = 'TEACHER_FUNCTIONS',
  DOCUMENT_MANAGEMENT = 'DOCUMENT_MANAGEMENT', // Nuevo
  AI_ASSISTANT = 'AI_ASSISTANT',
  SETTINGS = 'SETTINGS'
}
