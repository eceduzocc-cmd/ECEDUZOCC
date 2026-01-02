import React, { useState, useRef, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ShieldCheck,
  Building2, 
  Power, 
  MoreVertical, 
  Mail, 
  User, 
  Users,
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Image as ImageIcon, 
  GraduationCap,
  Fingerprint,
  Award,
  BookOpen,
  Bookmark,
  Medal,
  Activity,
  Sparkles,
  Contact, 
  AtSign,
  Verified,
  CreditCard,
  XCircle,
  Globe,
  GitMerge,
  Binary,
  Calendar,
  FileText,
  ChevronRight,
  TrendingUp,
  Briefcase,
  IdCard,
  Hash,
  Map as MapIcon,
  PieChart,
  BarChart4,
  Layers,
  Filter,
  Cpu,
  BarChart as ChartIcon,
  Settings2,
  ArrowUpRight,
  ArrowDownRight,
  Save,
  LayoutGrid,
  BarChart3,
  History,
  Lock,
  Database,
  Eye,
  Activity as PerformanceIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Teacher, AcademicDegree, TrainingItem, AcademicPeriod } from '../types';

interface TeacherProfilesProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  periods: AcademicPeriod[]; 
}

const TeacherProfiles: React.FC<TeacherProfilesProps> = ({ teachers, setTeachers, periods }) => {
  const [subView, setSubView] = useState<'directory' | 'analytics'>('directory');
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingExpediente, setViewingExpediente] = useState<Teacher | null>(null);
  
  const [territoryPeriodId, setTerritoryPeriodId] = useState<string>(periods.length > 0 ? periods[0].id : 'all');

  const centers = [
    "CEAD MEDELLÍN", "CEAD LA DORADA", "CIP DOS QUEBRADAS", 
    "CIP TURBO", "CIP SANTA FE DE ANTIOQUIA", "CCAV QUIBDÓ", "UDR LA TEBAIDA"
  ];

  const educationLevels = [
    { label: "Pregrado", icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', hex: '#2563eb' },
    { label: "Especialización", icon: Award, color: 'text-cyan-600', bg: 'bg-cyan-50', hex: '#0891b2' },
    { label: "Maestría", icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', hex: '#4f46e5' },
    { label: "Doctorado", icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', hex: '#9333ea' },
    { label: "Posdoctorado", icon: Medal, color: 'text-rose-600', bg: 'bg-rose-50', hex: '#e11d48' }
  ];

  const customYAxisTicks = [2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000];

  const [historicalData, setHistoricalData] = useState<any>(() => {
    const saved = localStorage.getItem('ece_baseline_final_2025');
    if (saved) return JSON.parse(saved);
    const defaultData: any = {
      levels: { Pregrado: 400, Especialización: 300, Maestría: 800, Doctorado: 400, Posdoctorado: 100 },
      centers: {},
      centersDetailed: {}
    };
    centers.forEach(c => {
      defaultData.centers[c] = 2000;
      defaultData.centersDetailed[c] = { Pregrado: 400, Especialización: 300, Maestría: 800, Doctorado: 400, Posdoctorado: 100 };
    });
    return defaultData;
  });

  const [historicalArchive, setHistoricalArchive] = useState<any[]>(() => {
    const saved = localStorage.getItem('ece_historical_archive_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCalibrating, setIsCalibrating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPeriodContext = useMemo(() => {
    if (territoryPeriodId === 'all') return { name: 'Consolidado Anual 2026', status: 'Global', count: teachers.length };
    const p = periods.find(per => per.id === territoryPeriodId);
    return { name: p?.name || 'Periodo Desconocido', status: p?.status || 'N/A', count: p?.participatingTeacherIds.length || 0 };
  }, [territoryPeriodId, periods, teachers]);

  const labData = useMemo(() => {
    // Verificación de calibración: si no existe el registro en localStorage, el eje Y no tendrá datos
    const isCalibrated = localStorage.getItem('ece_baseline_final_2025') !== null;

    return educationLevels.map((lvl) => {
      if (!isCalibrated) {
        return {
          name: lvl.label,
          errorPos: 0,
          errorUnit: 0,
          errorPosSec: 0
        };
      }
      
      const baseValue = historicalData.levels[lvl.label] || 0;
      const current = teachers.filter(t => t.educationLevel === lvl.label).length;
      return {
        name: lvl.label,
        errorPos: baseValue + current,
        errorUnit: baseValue + current,
        errorPosSec: baseValue + current
      };
    });
  }, [teachers, historicalData]);

  const territorialStats = useMemo(() => {
    const targetPeriod = periods.find(p => p.id === territoryPeriodId);
    return centers.map(center => {
      const teachersInCenter = teachers.filter(t => t.center === center);
      let activeInContext = [];
      if (territoryPeriodId === 'all') {
        const allActiveIds = new Set(periods.flatMap(p => p.participatingTeacherIds));
        activeInContext = teachersInCenter.filter(t => allActiveIds.has(t.id));
      } else if (targetPeriod) {
        activeInContext = teachersInCenter.filter(t => targetPeriod.participatingTeacherIds.includes(t.id));
      }
      const educationLevelsCount = educationLevels.reduce((acc, level) => {
        acc[level.label] = activeInContext.filter(t => t.educationLevel === level.label).length;
        return acc;
      }, {} as Record<string, number>);
      const modalitiesCount = { TC: 0, MT: 0, HC: 0, A: 0 };
      if (territoryPeriodId === 'all') {
         activeInContext.forEach(t => {
            for (const p of periods) {
               const workload = p.teacherWorkloads?.[t.id];
               if (workload) { modalitiesCount[workload]++; break; }
            }
         });
      } else if (targetPeriod && targetPeriod.teacherWorkloads) {
        activeInContext.forEach(t => {
          const workload = targetPeriod.teacherWorkloads?.[t.id];
          if (workload) modalitiesCount[workload]++;
        });
      }
      return {
        name: center, historicTotal: teachersInCenter.length, activeTotal: activeInContext.length,
        education: educationLevelsCount, modalities: modalitiesCount
      };
    });
  }, [teachers, periods, territoryPeriodId]);

  const statsBreakdown = useMemo(() => {
    const certifiedCount = teachers.filter(t => t.profileCompleted).length;
    const stats = [];
    stats.push({ label: 'Censo Global 2026', value: teachers.length, icon: Users, color: 'text-slate-900', bg: 'bg-slate-100', subtext: 'Registros en Sistema' });
    educationLevels.forEach(lvl => {
      const count = teachers.filter(t => t.educationLevel === lvl.label).length;
      stats.push({ label: `Total ${lvl.label}`, value: count, icon: lvl.icon, color: lvl.color, bg: lvl.bg, subtext: 'Talento 2026' });
    });
    stats.push({ label: 'Sello de Calidad', value: certifiedCount, icon: Verified, color: 'text-purple-600', bg: 'bg-purple-50', subtext: 'Perfiles Auditados' });
    return stats;
  }, [teachers]);

  /* =========================================================================================
   * BLOQUE RESTAURADO: FORMULARIO DE VINCULACIÓN COMPLETO (PROTEGIDO)
   * ========================================================================================= */
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '', identityCard: '', center: '', educationLevel: 'Maestría',
    specialty: '', department: 'Escuela de Ciencias de la Educación', email: '', 
    isActive: true, status: 'Disponible', hoursPerWeek: 40, rating: 5.0, 
    courses: [], imageUrl: '', profileCompleted: false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewTeacher({ ...newTeacher, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!newTeacher.name || !newTeacher.identityCard || !newTeacher.center || !newTeacher.email || !newTeacher.educationLevel) {
      alert("⚠️ Error: Los datos de Identidad, Grado Académico y Centro de Labores son requeridos por administración.");
      return;
    }
    const finalImageUrl = newTeacher.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
    const teacherToAdd: Teacher = {
      ...newTeacher as Teacher,
      imageUrl: finalImageUrl,
      id: (teachers.length + 1).toString(),
      isActive: true,
      status: 'Disponible',
      courses: [],
      detailedDegrees: [],
      trainingRoute: []
    };
    setTeachers([...teachers, teacherToAdd]);
    setIsCreating(false);
    setNewTeacher({
      name: '', identityCard: '', center: '', educationLevel: 'Maestría',
      specialty: '', department: 'Escuela de Ciencias de la Educación', email: '', isActive: true,
      status: 'Disponible', hoursPerWeek: 40, rating: 5.0, courses: [], imageUrl: ''
    });
  };

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
        <div className="flex items-center justify-between mb-10 px-6">
          <button onClick={() => setIsCreating(false)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Directorio
          </button>
          <div className="bg-slate-900 px-8 py-3 rounded-full shadow-2xl border border-white/5">
             <span className="text-white text-[9px] font-black uppercase tracking-[0.4em]">Paso 1: Diligencia Administrativa</span>
          </div>
        </div>
        <div className="space-y-12">
          {/* SECCIÓN 1: FOTO */}
          <div className="bg-white rounded-[60px] shadow-3xl border border-slate-100 p-16 flex flex-col items-center space-y-10 relative overflow-hidden">
            <div className="text-center space-y-3 relative z-10">
               <h3 className="text-3xl font-brand font-black text-slate-900 uppercase tracking-tighter">Imagen del Maestro</h3>
               <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.3em]">Carga obligatoria para identificación institucional.</p>
            </div>
            <div className="relative group p-4">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-600/30 animate-[spin_10s_linear_infinite]"></div>
              <div onClick={() => fileInputRef.current?.click()} className="relative w-72 h-72 rounded-full border-[12px] border-white shadow-3xl cursor-pointer overflow-hidden group/photo transition-all flex flex-col items-center justify-center text-center bg-slate-900">
                {newTeacher.imageUrl ? (
                  <>
                    <img src={newTeacher.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                      <Camera size={32} />
                      <span className="text-[8px] font-black uppercase tracking-widest mt-2">Sustituir</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center p-10 text-center">
                    <ImageIcon className="text-white/40 mb-4" size={32} />
                    <span className="text-[9px] font-black uppercase text-white/50 tracking-[0.4em]">Vincular Fotografía</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>
          </div>
          {/* SECCIÓN 2: DATOS */}
          <div className="bg-white rounded-[60px] shadow-3xl border border-slate-100 p-12 space-y-12">
             <div className="flex items-center gap-5 border-b border-slate-50 pb-8">
                <div className="p-5 bg-indigo-600 text-white rounded-[24px] shadow-xl"><Contact size={28} /></div>
                <div>
                   <h3 className="text-3xl font-brand font-black text-slate-900 uppercase tracking-tighter">Información de Identidad</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Diligenciado para registro en nómina</p>
                </div>
             </div>
             <div className="space-y-10">
                <div className="relative bg-slate-50/50 border-2 border-slate-100 focus-within:border-indigo-500 rounded-[30px] p-8 flex items-center gap-6">
                   <div className={`p-4 rounded-2xl ${newTeacher.name ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300'}`}><User size={28} /></div>
                   <div className="flex-1">
                      <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Nombre Completo</label>
                      <input type="text" className="w-full bg-transparent border-none outline-none text-2xl font-brand font-black text-slate-800 uppercase" value={newTeacher.name} onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})} placeholder="APELLIDOS Y NOMBRES" />
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-slate-50/50 border-2 border-slate-100 rounded-[30px] p-6 flex items-center gap-5">
                      <Fingerprint size={22} className="text-slate-300" />
                      <div className="flex-1">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Cédula de Ciudadanía</label>
                         <input type="text" className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-700" value={newTeacher.identityCard} onChange={(e) => setNewTeacher({...newTeacher, identityCard: e.target.value})} placeholder="1.000.000.000" />
                      </div>
                   </div>
                   <div className="bg-slate-50/50 border-2 border-slate-100 rounded-[30px] p-6 flex items-center gap-5">
                      <AtSign size={22} className="text-slate-300" />
                      <div className="flex-1">
                         <label className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em]">Correo Institucional</label>
                         <input type="email" className="w-full bg-transparent border-none outline-none font-bold text-lg text-slate-700 lowercase" value={newTeacher.email} onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})} placeholder="usuario@unad.edu.co" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
          {/* SECCIÓN 3: GRADO */}
          <div className="bg-white rounded-[60px] shadow-3xl border border-slate-100 p-12 space-y-8">
             <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-sm"><GraduationCap size={24} /></div>
                <h3 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">Formación Académica Base</h3>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {educationLevels.map((lvl) => (
                  <button key={lvl.label} onClick={() => setNewTeacher({...newTeacher, educationLevel: lvl.label})} className={`flex flex-col items-center gap-4 p-6 rounded-[35px] border-2 transition-all ${newTeacher.educationLevel === lvl.label ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-[1.05]' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white'}`}>
                    <lvl.icon size={24} />
                    <span className="text-[9px] font-black uppercase text-center">{lvl.label}</span>
                  </button>
                ))}
             </div>
          </div>
          {/* SECCIÓN 4: CENTRO */}
          <div className="bg-white rounded-[60px] shadow-3xl border border-slate-100 p-12 space-y-8">
             <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-sm"><MapPin size={24} /></div>
                <h3 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">Centro de Labores</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {centers.map((center) => (
                  <button key={center} onClick={() => setNewTeacher({...newTeacher, center})} className={`flex items-center gap-4 p-5 rounded-[28px] border-2 transition-all text-left ${newTeacher.center === center ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white'}`}>
                    <Building2 size={20} />
                    <span className="text-[9px] font-black uppercase flex-1">{center}</span>
                  </button>
                ))}
             </div>
          </div>
          <div className="flex justify-end pt-10">
             <button onClick={handleCreate} className="bg-slate-900 text-white px-20 py-8 rounded-[45px] font-black text-sm uppercase tracking-[0.4em] hover:bg-emerald-600 shadow-4xl transition-all flex items-center gap-4">
               REGISTRAR Y VINCULAR <CheckCircle2 size={32} />
             </button>
          </div>
        </div>
      </div>
    );
  }
  /* ========================================================================================= */

  const handleSaveHistorical = () => {
    localStorage.setItem('ece_baseline_final_2025', JSON.stringify(historicalData));
    setIsCalibrating(false);
    alert("✓ Línea base calibrada y sellada en almacenamiento local.");
  };

  const handleSealYear = () => {
    if (!confirm(`¿Desea sellar las estadísticas de ${selectedPeriodContext.name}?`)) return;
    const snapshot = {
      year: selectedPeriodContext.name,
      timestamp: new Date().toISOString(),
      stats: {
        levels: educationLevels.reduce((acc, lvl) => {
          acc[lvl.label] = teachers.filter(t => t.educationLevel === lvl.label).length;
          return acc;
        }, {} as any),
        centers: centers.reduce((acc, center) => {
          acc[center] = teachers.filter(t => t.center === center).length;
          return acc;
        }, {} as any)
      }
    };
    const newArchive = [...historicalArchive, snapshot];
    setHistoricalArchive(newArchive);
    localStorage.setItem('ece_historical_archive_v2', JSON.stringify(newArchive));
    alert("✓ Ciclo sellado.");
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.identityCard.includes(searchTerm)
  );

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
        <div>
          <h1 className="text-5xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">Perfiles <span className="text-indigo-600">Maestros</span></h1>
          <p className="text-slate-500 font-bold text-lg mt-2 opacity-60">Arquitectura de Talento Humano • ECE</p>
        </div>
        <div className="flex bg-white p-2 rounded-[35px] shadow-xl border border-slate-100">
           <button onClick={() => setSubView('directory')} className={`flex items-center gap-4 px-10 py-5 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all ${subView === 'directory' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={18} /> Directorio</button>
           <button onClick={() => setSubView('analytics')} className={`flex items-center gap-4 px-10 py-5 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all ${subView === 'analytics' ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-400 hover:text-slate-600'}`}><BarChart3 size={18} /> Analítica</button>
        </div>
      </div>

      {subView === 'directory' ? (
        <div className="space-y-12 animate-in slide-in-from-left-6 duration-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[60px] shadow-sm border border-slate-100">
            <div className="relative group flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[35px] py-6 pl-16 pr-8 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
            </div>
            <button onClick={() => setIsCreating(true)} className="bg-slate-900 text-white px-12 py-6 rounded-[35px] font-black text-[11px] uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-indigo-600 shadow-4xl transition-all"><Plus size={24} /> Vincular Maestro</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} onClick={() => setViewingExpediente(teacher)} className="group bg-white rounded-[70px] overflow-hidden shadow-sm hover:shadow-4xl transition-all duration-700 border-2 border-slate-50 cursor-pointer flex flex-col relative">
                <div className="relative h-80 overflow-hidden bg-slate-100">
                  <img src={teacher.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <h3 className="text-3xl font-brand font-black text-white tracking-tighter uppercase leading-none">{teacher.name}</h3>
                    <p className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em] mt-3 flex items-center gap-2"><MapPin size={12}/> {teacher.center}</p>
                  </div>
                </div>
                <div className="p-12 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-50"><p className="text-xs font-bold text-slate-600 truncate">{teacher.email}</p><ChevronRight className="text-slate-200" size={24} /></div>
                  <div className={`text-[10px] font-black uppercase text-center py-2 rounded-full ${teacher.profileCompleted ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>{teacher.profileCompleted ? 'Certificado' : 'Pendiente'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-20 animate-in slide-in-from-right-6 duration-700">
          {/* PARTE 1: KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-6">
            {statsBreakdown.map(stat => (
              <div key={stat.label} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                 <div className="flex-1 mr-3">
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1.5 leading-none">{stat.label}</p>
                    <h4 className={`text-3xl font-brand font-black tracking-tighter ${stat.color}`}>{stat.value}</h4>
                 </div>
                 <div className={`p-4 rounded-[22px] ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
              </div>
            ))}
          </div>

          {/* PARTE 2: GESTIÓN TERRITORIAL */}
          <div className="space-y-8">
             <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"><MapIcon size={32} /></div>
                   <h2 className="text-3xl font-brand font-black text-slate-900 uppercase tracking-tighter">Gestión Territorial</h2>
                </div>
                <div className="flex gap-2 bg-slate-50 p-2 rounded-[30px]">
                   <button onClick={() => setTerritoryPeriodId('all')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${territoryPeriodId === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}>Global</button>
                   {periods.map(p => (
                     <button key={p.id} onClick={() => setTerritoryPeriodId(p.id)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${territoryPeriodId === p.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}>{p.name}</button>
                   ))}
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {territorialStats.map(stat => (
                  <div key={stat.name} className="bg-white rounded-[60px] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="font-brand font-black text-lg text-slate-800 uppercase leading-none">{stat.name}</h3>
                        <div className="p-4 bg-slate-900 text-white rounded-[24px] shadow-xl"><h4 className="text-xl font-brand font-black">{stat.activeTotal}</h4></div>
                     </div>
                     <div className="space-y-3 mt-auto pt-6 border-t border-slate-50">
                        {educationLevels.map(lvl => (
                          <div key={lvl.label} className="space-y-1">
                             <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-500">
                                <span>{lvl.label}</span>
                                <span>{stat.education[lvl.label]}</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${stat.activeTotal > 0 ? (stat.education[lvl.label]/stat.activeTotal)*100 : 0}%` }}></div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* PARTE 3: LABORATORIO DE ANALÍTICA (3 GRÁFICOS FULL WIDTH CON EJE Y AJUSTADO) */}
          <div className="space-y-12">
             <div className="bg-slate-900 p-12 rounded-[60px] shadow-4xl flex items-center justify-between text-white overflow-hidden relative">
                <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                <div className="flex items-center gap-8 relative z-10">
                   <div className="p-6 bg-white/10 rounded-3xl border border-white/20"><Database size={40} className="text-indigo-400" /></div>
                   <h2 className="text-4xl font-brand font-black uppercase tracking-tighter">Laboratorio de Analítica</h2>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button onClick={handleSealYear} className="bg-emerald-600 text-white px-10 py-5 rounded-[35px] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-4 shadow-3xl"><Lock size={18} /> Sellar Ciclo</button>
                    <button onClick={() => setIsCalibrating(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-[35px] font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center gap-4 shadow-3xl"><Settings2 size={18} /> Calibrar Línea Base</button>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-16">
                {/* GRÁFICO 1: Total de perfiles docentes */}
                <div className="bg-white p-14 rounded-[70px] border border-slate-100 shadow-sm flex flex-col h-[700px]">
                   <div className="mb-10">
                      <h3 className="text-3xl font-brand font-black text-slate-800 uppercase tracking-tighter">Total de perfiles docentes</h3>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Métrica de Precisión de Gestión v2026</p>
                   </div>
                   <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={labData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '900'}} dy={20} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '900'}} domain={[0, 11000]} ticks={customYAxisTicks} />
                            <Tooltip contentStyle={{ borderRadius: '30px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.2)' }} />
                            <Bar dataKey="errorPos" fill="#4f46e5" radius={[20, 20, 0, 0]} barSize={80}>
                               {labData.map((entry, index) => <Cell key={`cell-${index}`} fill={educationLevels[index % educationLevels.length].hex} />)}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* GRÁFICO 2: Total de docentes según grado de formación */}
                <div className="bg-white p-14 rounded-[70px] border border-slate-100 shadow-sm flex flex-col h-[700px]">
                   <div className="mb-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-brand font-black text-slate-800 uppercase tracking-tighter">Total de docentes según grado de formación</h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Flujo de Datos y Rendimiento Administrativo</p>
                      </div>
                      <PerformanceIcon size={32} className="text-emerald-500" />
                   </div>
                   <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={labData} layout="vertical" margin={{ top: 0, right: 60, left: 100, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" domain={[0, 11000]} ticks={customYAxisTicks} hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '900'}} width={180} />
                            <Tooltip contentStyle={{ borderRadius: '30px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.2)' }} />
                            <Bar dataKey="errorUnit" fill="#0f172a" radius={[0, 15, 15, 0]} barSize={40} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* GRÁFICO 3: Total de docentes según nivel de formación por centro */}
                <div className="bg-white p-14 rounded-[70px] border border-slate-100 shadow-sm flex flex-col h-[700px]">
                   <div className="mb-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-brand font-black text-slate-800 uppercase tracking-tighter">Total de docentes según nivel de formación por cada uno de los centros</h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Seguimiento de Trayectoria y Convergencia Educativa</p>
                      </div>
                      <TrendingUp size={32} className="text-indigo-500" />
                   </div>
                   <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={labData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '900'}} dy={20} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '900'}} domain={[0, 11000]} ticks={customYAxisTicks} />
                            <Tooltip contentStyle={{ borderRadius: '30px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.2)' }} />
                            <Line type="monotone" dataKey="errorPosSec" stroke="#4f46e5" strokeWidth={6} dot={{ r: 10, fill: '#4f46e5', strokeWidth: 4, stroke: '#fff' }} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* EXPEDIENTE MAESTRO */}
      {viewingExpediente && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-[1400px] h-[90vh] rounded-[80px] overflow-hidden shadow-4xl flex flex-col relative border border-white/20">
              <div className="px-14 py-12 bg-indigo-900 text-white flex items-center justify-between shrink-0">
                 <h3 className="text-4xl font-brand font-black uppercase tracking-tighter">Expediente Maestro</h3>
                 <button onClick={() => setViewingExpediente(null)} className="p-6 hover:bg-white/10 rounded-full border border-white/10"><XCircle size={44} className="text-white/30 hover:text-red-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-16 space-y-20 custom-scrollbar bg-slate-50/50 text-center text-slate-300 font-brand font-black uppercase text-xl">
                 Cargando Expediente Oficial...
              </div>
           </div>
        </div>
      )}

      {/* CALIBRACIÓN MANUAL EXTENDIDA 2025 */}
      {isCalibrating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/98 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-[1400px] h-[90vh] rounded-[80px] overflow-hidden shadow-4xl flex flex-col border border-white/20">
              <div className="px-14 py-12 bg-indigo-600 text-white flex items-center justify-between shrink-0">
                 <h3 className="text-4xl font-brand font-black uppercase tracking-tighter">Calibración de Línea Base 2025</h3>
                 <button onClick={() => setIsCalibrating(false)} className="p-5 hover:bg-white/10 rounded-full border border-white/10"><XCircle size={44} className="text-white/30" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-16 space-y-12 custom-scrollbar bg-slate-50/50">
                 <div className="bg-white p-12 rounded-[50px] border shadow-sm">
                    <h4 className="text-2xl font-brand font-black text-slate-900 uppercase border-b pb-6 mb-8">Fuerza Académica Global (Base 2000)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                       {educationLevels.map(lvl => (
                         <div key={lvl.label} className="bg-slate-50 p-8 rounded-3xl">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-4">{lvl.label}</p>
                            <input type="number" value={historicalData.levels[lvl.label]} onChange={(e) => setHistoricalData({...historicalData, levels: { ...historicalData.levels, [lvl.label]: parseInt(e.target.value) || 0 }})} className="w-full bg-white border-none rounded-2xl py-4 px-6 text-2xl font-brand font-black text-slate-900" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-12 border-t bg-white flex justify-end gap-6">
                 <button onClick={() => setIsCalibrating(false)} className="px-12 py-7 text-slate-400 font-black uppercase tracking-widest">Descartar</button>
                 <button onClick={handleSaveHistorical} className="bg-slate-900 text-white px-20 py-7 rounded-[45px] font-black uppercase tracking-[0.4em] flex items-center gap-4 shadow-4xl hover:bg-emerald-600"><Save size={28} /> SELLAR LÍNEA BASE</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfiles;