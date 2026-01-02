


export interface Student {
  id: string;
  name: string;
  email: string;
  career: string;
  semester: number;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  gpa: number;
  lastAccess?: string;
  alerts?: number;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  type: 'Teórico' | 'Práctico' | 'Metodológico';
  semester: number;
}

export interface Program {
  id: string;
  name: string;
  level: 'Grado' | 'Posgrado';
  modality: 'Virtual' | 'Distancia';
  totalCredits: number;
  snies: string;
  courses: Course[];
  description: string;
}

export interface QualityFactor {
  id: number;
  name: string;
  progress: number;
  status: 'Cumplido' | 'En Proceso' | 'Crítico';
  evidenceCount: number;
}

export interface AcademicDegree {
  id: string;
  level: 'Pregrado' | 'Especialización' | 'Maestría' | 'Doctorado' | 'Posdoctorado';
  title: string;
}

export interface TrainingItem {
  diplomaName: string;
  certificationDate: string;
  evidence?: { name: string; size: string };
}

export interface Teacher {
  id: string;
  name: string;
  identityCard: string;
  center: string;
  educationLevel: string; // Nivel máximo (Admin)
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
  // Campos de Autogestión (Dinámicos)
  detailedDegrees?: AcademicDegree[];
  foreignLanguageLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  trainingRoute?: TrainingItem[]; // Ruta formativa de formador de formadores
  moocIngreso?: TrainingItem; // Nuevo: MOC de Ingreso
  profileCompleted?: boolean;
}

export interface AcademicPeriod {
  id: string;
  name: string;
  status: 'Abierto' | 'Cerrado';
  participatingTeacherIds: string[];
  teacherWorkloads?: Record<string, 'TC' | 'MT' | 'HC' | 'A'>;
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
  category?: string;
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
  category?: string;
  evidenceUrl?: string;
  status: 'Pendiente' | 'Entregado';
  pdiMappings?: PDIMapping[];
  substantiveFunctions?: string[];
  contractualGeneral?: string[];
  contractualDirector?: string[];
  contractualLeader?: string[];
  evidenceSchema?: EvidenceField[];
  // Fix: evidenceData expects size as string for formatted size strings, and optional type/data for PDF generation
  evidenceData?: Record<string, string | { name: string; size: string; type?: string; data?: string }>;
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
  DOCUMENT_MANAGEMENT = 'DOCUMENT_MANAGEMENT',
  CURRICULUM = 'CURRICULUM',
  QUALITY = 'QUALITY',
  AI_ASSISTANT = 'AI_ASSISTANT',
  SETTINGS = 'SETTINGS'
}