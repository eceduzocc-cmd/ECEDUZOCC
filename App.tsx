
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Cloud, 
  LogOut, 
  ShieldCheck, 
  Database,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  Menu,
  ChevronRight,
  Sparkles,
  LogIn,
  GraduationCap,
  BookOpen,
  UserCheck,
  ArrowRight,
  ClipboardCheck,
  Search
} from 'lucide-react';
import { View, Teacher, AcademicPeriod, AssignedFunction, MasterFunction } from './types';
import Dashboard from './components/Dashboard';
import MasterFunctions from './components/MasterFunctions';
import TeacherProfiles from './components/TeacherProfiles';
import Assignments from './components/Assignments';
import TeacherFunctions from './components/TeacherFunctions';
import DocumentManagement from './components/DocumentManagement';
import AIAssistant from './components/AIAssistant';
import Students from './components/Students';
import CurriculumManagement from './components/CurriculumManagement';
import QualityManagement from './components/QualityManagement';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(() => {
    const saved = localStorage.getItem('edupro_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [view, setView] = useState<View>(View.DASHBOARD);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
  const [masterFunctionsBank, setMasterFunctionsBank] = useState<MasterFunction[]>([]);
  const [assignedFunctions, setAssignedFunctions] = useState<AssignedFunction[]>([]);

  useEffect(() => {
    if (user) {
      setIsSyncing(true);
      setTimeout(() => {
        const cached = localStorage.getItem('edupro_db_cache');
        if (cached) {
          try {
            const db = JSON.parse(cached);
            setTeachers(db.teachers || []);
            setPeriods(db.periods || []);
            setMasterFunctionsBank(db.masterFunctionsBank || []);
            setAssignedFunctions(db.assignedFunctions || []);
          } catch (e) {
            console.error("Error loading cache", e);
          }
        }
        setIsSyncing(false);
        setLastSync(new Date().toLocaleTimeString());
      }, 1000);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const saveToCloud = () => {
      setIsSyncing(true);
      const db = { teachers, periods, masterFunctionsBank, assignedFunctions };
      localStorage.setItem('edupro_db_cache', JSON.stringify(db));
      setTimeout(() => {
        setIsSyncing(false);
        setLastSync(new Date().toLocaleTimeString());
      }, 800);
    };
    const debounce = setTimeout(saveToCloud, 3000);
    return () => clearTimeout(debounce);
  }, [teachers, periods, masterFunctionsBank, assignedFunctions, user]);

  const handleLogin = () => {
    const mockUser = {
      name: "Dr. Roberto Valenzuela",
      email: "rvalenzuela@unad.edu.co",
      picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=UNAD"
    };
    setUser(mockUser);
    localStorage.setItem('edupro_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    if(confirm("¿Cerrar sesión institucional?")) {
      setUser(null);
      localStorage.removeItem('edupro_user');
      setView(View.DASHBOARD);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[50px] shadow-2xl overflow-hidden animate-slide-up">
          <div className="p-12 text-center">
            <div className="bg-amber-400 p-5 rounded-[30px] w-fit mx-auto mb-8 shadow-xl shadow-amber-500/20">
              <GraduationCap size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-brand font-black text-slate-900 tracking-tighter uppercase mb-2">EduPro <span className="text-amber-500">Cloud</span></h1>
            <p className="text-slate-500 font-medium mb-10 text-sm">Escuela de Ciencias de la Educación</p>
            
            <div className="space-y-4">
              <button 
                onClick={handleLogin}
                className="w-full bg-slate-900 text-white py-5 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3 group"
              >
                Ingreso Institucional <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronizado con UNAD Identity</p>
            </div>
          </div>
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Acceso Restringido a Personal Administrativo</p>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.QUALITY, label: 'Acreditación SNIES', icon: ClipboardCheck },
    { id: View.MASTER_FUNCTIONS, label: 'Arquitectura PDI', icon: Database },
    { id: View.CURRICULUM, label: 'Curriculum Hub', icon: BookOpen },
    { id: View.DOCUMENT_MANAGEMENT, label: 'Bóveda Documental', icon: FileText },
    { id: View.TEACHER_PROFILES, label: 'Perfiles Maestros', icon: Users },
    { id: View.STUDENTS, label: 'Estudiantes', icon: UserCheck },
    { id: View.ASSIGNMENTS, label: 'Asignaciones', icon: Briefcase },
    { id: View.TEACHER_FUNCTIONS, label: 'Mi Autogestión', icon: ShieldCheck },
    { id: View.AI_ASSISTANT, label: 'Asistente IA', icon: MessageSquare, special: true },
  ];

  const renderContent = () => {
    switch (view) {
      case View.DASHBOARD: return <Dashboard />;
      case View.QUALITY: return <QualityManagement />;
      case View.MASTER_FUNCTIONS: return <MasterFunctions periods={periods} setPeriods={setPeriods} teachers={teachers} masterFunctionsBank={masterFunctionsBank} setMasterFunctionsBank={setMasterFunctionsBank} />;
      // Actualizado: Ahora TeacherProfiles recibe periods
      case View.TEACHER_PROFILES: return <TeacherProfiles teachers={teachers} setTeachers={setTeachers} periods={periods} />;
      case View.STUDENTS: return <Students />;
      case View.CURRICULUM: return <CurriculumManagement />;
      case View.ASSIGNMENTS: return <Assignments periods={periods} teachers={teachers} masterFunctionsBank={masterFunctionsBank} assignedFunctions={assignedFunctions} setAssignedFunctions={setAssignedFunctions} />;
      case View.TEACHER_FUNCTIONS: return <TeacherFunctions teachers={teachers} setTeachers={setTeachers} periods={periods} setPeriods={setPeriods} assignedFunctions={assignedFunctions} setAssignedFunctions={setAssignedFunctions} />;
      case View.DOCUMENT_MANAGEMENT: return <DocumentManagement assignedFunctions={assignedFunctions} teachers={teachers} periods={periods} />;
      case View.AI_ASSISTANT: return <AIAssistant />;
      case View.SETTINGS: return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={`bg-[#002a4a] text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-80' : 'w-24'}`}>
        <div className="p-8 flex items-center gap-4">
          <div className="bg-amber-400 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
            <GraduationCap size={24} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-brand font-black text-xl tracking-tighter uppercase">EduPro <span className="text-amber-400">Cloud</span></span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${view === item.id ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20} className={view === item.id ? 'text-amber-400' : 'group-hover:text-amber-400'} />
              {isSidebarOpen && (
                <div className="flex items-center justify-between flex-1">
                  <span className={`font-semibold text-sm ${item.special ? 'text-amber-400' : ''}`}>{item.label}</span>
                  {item.special && <Sparkles size={14} className="text-amber-400 animate-pulse" />}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <button onClick={() => setView(View.SETTINGS)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group mb-2 ${view === View.SETTINGS ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
            <Settings size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">Configuración</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <header className="h-20 glass sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm border-b border-slate-200">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
               <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {isSyncing ? 'Auto-sync Drive...' : `Actualizado: ${lastSync}`}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView(View.SETTINGS)}>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-slate-800 leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] font-bold text-[#004170] uppercase tracking-tighter">Administrador ECE</p>
              </div>
              <img src={user?.picture} alt="User" className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400 shadow-md transition-all group-hover:scale-105" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 animate-slide-up">
           <div className="max-w-[1600px] mx-auto">
              {renderContent()}
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
