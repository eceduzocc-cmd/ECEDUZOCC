
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X,
  LogOut,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Command,
  ClipboardList,
  UserCheck,
  ShieldAlert,
  FolderOpen
} from 'lucide-react';
import { View, Teacher, AcademicPeriod, AssignedFunction, MasterFunction } from './types';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import MasterFunctions from './components/MasterFunctions';
import TeacherProfiles from './components/TeacherProfiles';
import Assignments from './components/Assignments';
import TeacherFunctions from './components/TeacherFunctions';
import DocumentManagement from './components/DocumentManagement';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: '1', name: 'Dr. Fernando Ruiz', identityCard: '10928374', center: 'CEAD MEDELLÍN', specialty: 'Neuroeducación', department: 'Pedagogía', email: 'fruiz@edu.co', courses: ['Psicobiología'], imageUrl: 'https://picsum.photos/seed/fernando/200', rating: 4.9, hoursPerWeek: 32, status: 'Carga Completa', isActive: true },
    { id: '2', name: 'Msc. Elena Torres', identityCard: '22837465', center: 'CIP DOS QUEBRADAS', specialty: 'Inclusión Educativa', department: 'Pedagogía', email: 'etorres@edu.co', courses: ['Diseño Universal'], imageUrl: 'https://picsum.photos/seed/elena/200', rating: 4.8, hoursPerWeek: 20, status: 'Disponible', isActive: true },
    { id: '3', name: 'Lic. Roberto Diaz', identityCard: '33948576', center: 'CEAD LA DORADA', specialty: 'Tics en Educación', department: 'Tecnología', email: 'rdiaz@edu.co', courses: ['Software Educativo'], imageUrl: 'https://picsum.photos/seed/roberto/200', rating: 4.7, hoursPerWeek: 15, status: 'Disponible', isActive: false },
  ]);

  const [periods, setPeriods] = useState<AcademicPeriod[]>([
    { id: 'p1', name: 'Periodo 16-01 (2024)', status: 'Abierto', participatingTeacherIds: ['1', '2'] },
    { id: 'p2', name: 'Periodo 16-04 (2024)', status: 'Abierto', participatingTeacherIds: ['1'] }
  ]);

  const [masterFunctionsBank, setMasterFunctionsBank] = useState<MasterFunction[]>([
    { id: 'mf1', name: 'Dirección de Proyecto de Grado', description: 'Acompañamiento en el desarrollo de tesis de licenciatura.', category: 'Proyectos de investigación', pdiMappings: [{ macroId: 2, microIds: [6] }], substantiveFunctions: ['Formación'], contractualGeneral: [], contractualDirector: [], contractualLeader: [], contractualResponsibility: 'Responsabilidad Directa', suggestedEvidence: 'Acta de Sustentación', evidenceSchema: [] },
    { id: 'mf2', name: 'Investigación en Semillero', description: 'Liderazgo de grupo de investigación estudiantil.', category: 'Proyectos de investigación', pdiMappings: [{ macroId: 2, microIds: [7] }], substantiveFunctions: ['Investigación', 'Innovación'], contractualGeneral: [], contractualDirector: [], contractualLeader: [], contractualResponsibility: 'Carga Investigativa', suggestedEvidence: 'Reporte de Avance', evidenceSchema: [] }
  ]);

  const [assignedFunctions, setAssignedFunctions] = useState<AssignedFunction[]>([
    { id: 'f1', periodId: 'p1', teacherId: '1', masterFunctionId: 'mf1', name: 'Investigación Pedagógica', description: 'Desarrollo de artículo sobre IA', status: 'Pendiente', substantiveFunctions: ['Investigación'], category: 'Proyectos de investigación' },
    { id: 'f2', periodId: 'p1', teacherId: '1', masterFunctionId: 'mf2', name: 'Gestión Curricular', description: 'Revisión de malla de Licenciatura', status: 'Entregado', evidenceUrl: 'evidencia.pdf', substantiveFunctions: ['Innovación'], category: 'Programas académicos formales' }
  ]);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, view: View.DASHBOARD },
    { name: 'Funciones Maestras', icon: Command, view: View.MASTER_FUNCTIONS },
    { name: 'Gestión Documental', icon: FolderOpen, view: View.DOCUMENT_MANAGEMENT },
    { name: 'Perfiles Docentes', icon: UserSquare2, view: View.TEACHER_PROFILES },
    { name: 'Asignaciones', icon: ClipboardList, view: View.ASSIGNMENTS },
    { name: 'Estudiantes', icon: Users, view: View.STUDENTS },
    { name: 'Mis Funciones (Docente)', icon: UserCheck, view: View.TEACHER_FUNCTIONS, group: 'teacher' },
    { name: 'IA Assistant', icon: MessageSquare, view: View.AI_ASSISTANT, special: true },
    { name: 'Configuración', icon: Settings, view: View.SETTINGS },
  ];

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.STUDENTS: return <Students />;
      case View.MASTER_FUNCTIONS: 
        return <MasterFunctions 
          periods={periods} 
          setPeriods={setPeriods} 
          teachers={teachers} 
          masterFunctionsBank={masterFunctionsBank}
          setMasterFunctionsBank={setMasterFunctionsBank}
        />;
      case View.DOCUMENT_MANAGEMENT:
        return <DocumentManagement 
          assignedFunctions={assignedFunctions}
          teachers={teachers}
          periods={periods}
        />;
      case View.TEACHER_PROFILES: 
        return <TeacherProfiles teachers={teachers} setTeachers={setTeachers} />;
      case View.ASSIGNMENTS: 
        return <Assignments 
          periods={periods} 
          teachers={teachers} 
          masterFunctionsBank={masterFunctionsBank} 
          assignedFunctions={assignedFunctions}
          setAssignedFunctions={setAssignedFunctions}
        />;
      case View.TEACHER_FUNCTIONS: 
        return <TeacherFunctions 
          teachers={teachers} 
          periods={periods} 
          setPeriods={setPeriods}
          assignedFunctions={assignedFunctions}
          setAssignedFunctions={setAssignedFunctions}
        />;
      case View.AI_ASSISTANT: return <AIAssistant />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className={`bg-slate-900 text-white transition-all duration-500 ease-in-out flex flex-col z-30 relative ${isSidebarOpen ? 'w-72' : 'w-24'} hidden md:flex`}>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
        <div className="p-8 flex items-center gap-4 relative">
          <div className="mesh-gradient p-2.5 rounded-2xl shadow-xl shadow-indigo-500/20">
            <GraduationCap size={28} className="text-white" />
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in duration-500">
              <span className="font-brand font-black text-2xl tracking-tighter block leading-none uppercase">EduPro</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">School Control</span>
            </div>
          )}
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2 relative">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                currentView === item.view 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {currentView === item.view && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
              <div className={`p-2 rounded-xl transition-colors ${currentView === item.view ? (item.group === 'teacher' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400') : 'group-hover:bg-white/10'}`}>
                <item.icon size={20} />
              </div>
              {isSidebarOpen && (
                <div className="flex items-center justify-between flex-1 animate-in slide-in-from-left-2">
                  <span className={`font-semibold text-sm whitespace-nowrap ${item.special ? 'text-indigo-300' : (item.group === 'teacher' ? 'text-emerald-400/80' : '')}`}>{item.name}</span>
                  {item.special && <Sparkles size={14} className="text-indigo-400 animate-pulse ml-2" />}
                </div>
              )}
            </button>
          ))}
        </nav>
        <div className="p-6 mt-auto">
          <button className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group">
            <div className="p-2 rounded-xl group-hover:bg-red-500/10"><LogOut size={20} /></div>
            {isSidebarOpen && <span className="font-bold text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-24 glass-panel sticky top-0 z-20 px-8 flex items-center justify-between shadow-sm border-b border-slate-200/50">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-500 transition-all md:block hidden">
              <Menu size={20} />
            </button>
            <div className="relative md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
              <input type="text" placeholder="Buscar en el sistema..." className="w-full bg-slate-100/50 border border-slate-200/50 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-3 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl relative transition-all group">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white ring-2 ring-indigo-500/20"></span>
            </button>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-slate-800 leading-none mb-1">Dra. Marta Silva</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Administrador / Docente</p>
              </div>
              <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/10 shadow-md" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-[1600px] mx-auto">{renderView()}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
