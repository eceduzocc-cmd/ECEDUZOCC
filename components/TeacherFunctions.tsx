import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2,
  Plus,
  Layers,
  Type,
  Paperclip,
  FileCheck,
  ShieldCheck,
  Download,
  Fingerprint,
  Verified,
  Sparkles,
  MapPin,
  Award,
  Globe,
  Trash2,
  GraduationCap,
  Binary,
  User,
  Users,
  LayoutGrid,
  Activity,
  History,
  ClipboardList,
  Trophy,
  Zap,
  BookOpen,
  GitMerge,
  Upload,
  Calendar,
  Search,
  ChevronRight,
  XCircle,
  Mail,
  Shield,
  Edit3,
  Lock,
  Target,
  Link,
  Image as ImageIcon
} from 'lucide-react';
import { Teacher, AcademicPeriod, AssignedFunction, AcademicDegree, TrainingItem } from '../types';
import { jsPDF } from 'jspdf';
import { geminiService } from '../services/geminiService';

// Diccionario local para resolución de nombres PDI en el informe
const PDI_LABELS: Record<number, string> = {
  1: "Macroproyecto 1: Gestión holística para la educación",
  2: "Macroproyecto 2: Ampliación y consolidación del conocimiento",
  3: "Macroproyecto 3: Liderazgo transformacional territorial",
  4: "Macroproyecto 4: Plataformas escalares eficientes"
};

interface TeacherFunctionsProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  periods: AcademicPeriod[];
  setPeriods: React.Dispatch<React.SetStateAction<AcademicPeriod[]>>;
  assignedFunctions: AssignedFunction[];
  setAssignedFunctions: React.Dispatch<React.SetStateAction<AssignedFunction[]>>;
}

const TeacherFunctions: React.FC<TeacherFunctionsProps> = ({ 
  teachers, 
  setTeachers,
  periods, 
  assignedFunctions, 
  setAssignedFunctions 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'evidence'>('profile');
  const [showEvidenceForm, setShowEvidenceForm] = useState<string | null>(null);
  
  // Docente de referencia (Simulado para diseño)
  const foundTeacher: Teacher = teachers[0] || {
    id: 'dev-1',
    name: 'Docente de Prueba ECE',
    identityCard: '12345',
    center: 'CEAD MEDELLÍN',
    educationLevel: 'Maestría',
    specialty: 'Gestión Educativa',
    department: 'Escuela de Ciencias de la Educación',
    email: 'docente.prueba@unad.edu.co',
    courses: [],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher',
    rating: 5.0,
    hoursPerWeek: 40,
    status: 'Disponible',
    isActive: true,
    profileCompleted: false,
    detailedDegrees: [],
    foreignLanguageLevel: 'A1',
    trainingRoute: [],
    moocIngreso: { diplomaName: 'El docente tutor como gestor de cursos en AVA Versión 2.0', certificationDate: '' }
  };

  const participatingPeriods = useMemo(() => {
    return periods.filter(p => p.participatingTeacherIds.includes(foundTeacher.id));
  }, [periods, foundTeacher.id]);

  const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

  const FORMATION_ROLES = [
    {
      name: "Director de Curso",
      icon: <LayoutGrid size={24} />,
      diplomas: [
        "e-Mediador en AVA",
        "Gestor de Curso en Ambientes AVA",
        "Diseño de Recursos Educativos Digitales",
        "Evaluación del aprendizaje en AVA",
        "Internacionalización del Currículo",
        "Gamificación y Aprendizaje Basado en Juegos",
        "Liderazgo Transformacional"
      ]
    },
    {
      name: "Docente",
      icon: <Users size={24} />,
      diplomas: [
        "e-Mediador en AVA",
        "Apropiación de TIC en Escenarios Inclusivos",
        "Habilidades Socioemocionales del e-Mediador",
        "Gamificación y Aprendizaje Basado en Juegos",
        "Liderazgo Transformacional"
      ]
    },
    {
      name: "Docente Innovador",
      icon: <Zap size={24} />,
      diplomas: [
        "e-Mediador en AVA",
        "Apropiación de TIC en Escenarios Inclusivos",
        "Analítica de Datos y BigData aplicada en AVA",
        "Coaching Educativo desde el contexto de la UNAD",
        "Liderazgo Transformacional"
      ]
    },
    {
      name: "Docente Investigador",
      icon: <Microscope size={24} />,
      diplomas: [
        "e-Mediador en AVA",
        "e-Investigador",
        "IA aplicada a la Educación en AVA",
        "Liderazgo Transformacional"
      ]
    }
  ];

  const OFFICIAL_DIPLOMAS = Array.from(new Set(FORMATION_ROLES.flatMap(r => r.diplomas))).sort();

  const [localDegrees, setLocalDegrees] = useState<AcademicDegree[]>(foundTeacher.detailedDegrees || []);
  const [localLanguage, setLocalLanguage] = useState<Teacher['foreignLanguageLevel']>(foundTeacher.foreignLanguageLevel || 'A1');
  const [localRoute, setLocalRoute] = useState<TrainingItem[]>(foundTeacher.trainingRoute || []);
  const [localMOOC, setLocalMOOC] = useState<TrainingItem>(foundTeacher.moocIngreso || { diplomaName: 'El docente tutor como gestor de cursos en AVA Versión 2.0', certificationDate: '' });

  // Control de edición - Persistente con el estado del perfil
  const [isEditingProfile, setIsEditingProfile] = useState(!foundTeacher.profileCompleted);

  const toggleDiploma = (name: string) => {
    if (!isEditingProfile) return;
    const exists = localRoute.find(i => i.diplomaName === name);
    if (exists) {
      setLocalRoute(localRoute.filter(i => i.diplomaName !== name));
    } else {
      setLocalRoute([...localRoute, { diplomaName: name, certificationDate: '' }]);
    }
  };

  const updateDiplomaDate = (name: string, date: string) => {
    if (!isEditingProfile) return;
    setLocalRoute(prev => prev.map(i => i.diplomaName === name ? { ...i, certificationDate: date } : i));
  };

  const handleDiplomaEvidence = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditingProfile) return;
    const file = e.target.files?.[0];
    if (file) {
      setLocalRoute(prev => prev.map(i => i.diplomaName === name ? { ...i, evidence: { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' } } : i));
    }
  };

  const handleMOOCEvidence = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditingProfile) return;
    const file = e.target.files?.[0];
    if (file) {
      setLocalMOOC({ ...localMOOC, evidence: { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' } });
    }
  };

  const handleCertifyProfile = () => {
    setTeachers(prev => prev.map(t => {
      if (t.id === foundTeacher.id) {
        return {
          ...t,
          detailedDegrees: localDegrees,
          foreignLanguageLevel: localLanguage,
          trainingRoute: localRoute,
          moocIngreso: localMOOC,
          profileCompleted: true
        };
      }
      return t;
    }));
    setIsEditingProfile(false);
    alert("✓ Perfil Certificado e Institucionalmente Protegido.");
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const calculateProgress = (fn: AssignedFunction) => {
    if (!fn.evidenceSchema?.length) return 0;
    const completedFields = fn.evidenceSchema.filter(f => {
      const val = fn.evidenceData?.[f.id];
      return val !== undefined && val !== '' && (typeof val === 'string' ? val.trim() !== '' : true);
    }).length;
    return Math.round((completedFields / fn.evidenceSchema.length) * 100);
  };

  const generateInstitutionalPDF = (fn: AssignedFunction) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // --- ENCABEZADO INSTITUCIONAL ---
    doc.setFillColor(0, 65, 112); // UNAD BLUE
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("INFORME ESTRUCTURADO DE GESTIÓN ACADÉMICA", margin, 18);
    doc.setFontSize(10);
    doc.text("Escuela de Ciencias de la Educación - ECE", margin, 25);
    doc.text("Sistema de Gestión de Evidencias v5.0", margin, 31);
    
    y = 55;
    doc.setTextColor(0, 0, 0);

    // --- BLOQUE 1: FICHA ADMINISTRATIVA ---
    doc.setFontSize(12);
    doc.text("1. FICHA ADMINISTRATIVA", margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 12;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("DOCENTE:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(foundTeacher.name.toUpperCase(), margin + 50, y);
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text("CÉDULA DE CIUDADANÍA:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(foundTeacher.identityCard, margin + 50, y);
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text("CORREO INSTITUCIONAL:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(foundTeacher.email, margin + 50, y);
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text("NIVEL DE INFORMACIÓN BASE:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(foundTeacher.educationLevel.toUpperCase(), margin + 50, y);
    y += 15;

    // --- BLOQUE 2: ALINEACIÓN ESTRATÉGICA ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("2. ALINEACIÓN ESTRATÉGICA", margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 12;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("FUNCIÓN ASIGNADA:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(fn.name.toUpperCase(), margin + 50, y);
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text("CATEGORÍA DOCUMENTAL:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(fn.category?.toUpperCase() || "N/A", margin + 50, y);
    y += 7;

    // Mapeo PDI
    if (fn.pdiMappings && fn.pdiMappings.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("ALINEACIÓN PDI:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      fn.pdiMappings.forEach(m => {
        const label = PDI_LABELS[m.macroId] || `Macroproyecto ${m.macroId}`;
        doc.text(`- ${label}`, margin + 5, y);
        y += 5;
      });
    }

    y += 10;

    // --- BLOQUE 3: EVIDENCIAS RADICADAS ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("3. EVIDENCIAS Y RESULTADOS", margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 15;

    fn.evidenceSchema?.forEach((field, idx) => {
      const val = fn.evidenceData?.[field.id];
      
      // Control de salto de página
      if (y > 250) { doc.addPage(); y = 20; }

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. ${field.label}`, margin, y);
      y += 8;

      if (field.type === 'text') {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const text = typeof val === 'string' ? val : "No reportado.";
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, margin + 5, y);
        y += (lines.length * 5) + 10;
      } else {
        // Manejo de Archivos/Fotos/Enlaces
        if (val && typeof val === 'object' && (val as any).data) {
          const fileData = val as any;
          if (fileData.type.includes('image')) {
            try {
              // Embeber fotografía directamente
              doc.addImage(fileData.data, 'JPEG', margin + 5, y, 60, 45);
              y += 55;
            } catch (e) {
              doc.text("[Error al embeber imagen]", margin + 5, y);
              y += 10;
            }
          } else {
            doc.setTextColor(0, 102, 204);
            doc.text(`Enlace de acceso: ${fileData.name}`, margin + 5, y);
            doc.setTextColor(0, 0, 0);
            y += 10;
          }
        } else if (typeof val === 'string' && val.startsWith('http')) {
          // Si el texto es un enlace de grabación
          doc.setTextColor(0, 102, 204);
          doc.text(`Enlace de grabación: ${val}`, margin + 5, y);
          doc.setTextColor(0, 0, 0);
          y += 10;
        } else {
          doc.setFont("helvetica", "italic");
          doc.text("Evidencia adjunta en plataforma.", margin + 5, y);
          y += 10;
        }
      }
    });

    // Pie de página final
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Documento generado electrónicamente por ${foundTeacher.name} el ${new Date().toLocaleDateString()}`, margin, 285);

    doc.save(`INFORME_GESTION_${fn.name.replace(/\s+/g, '_')}.pdf`);
  };

  const finalizeReport = (fn: AssignedFunction) => {
    if (!foundTeacher.profileCompleted) {
      alert("⚠️ Error: Perfil incompleto. Certifique su información académica antes de radicar informes.");
      setActiveSubTab('profile');
      return;
    }
    generateInstitutionalPDF(fn);
    setAssignedFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, status: 'Entregado' } : f));
    setShowEvidenceForm(null);
  };

  const moocProgress = (localMOOC.certificationDate && localMOOC.evidence) ? 100 : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-white p-10 rounded-[60px] shadow-sm border border-slate-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
         <div className="flex items-center gap-8 relative z-10">
            <div className="relative">
              <img src={foundTeacher.imageUrl} className="w-32 h-32 rounded-[40px] object-cover shadow-2xl ring-8 ring-slate-50" />
              <div className="absolute -bottom-2 -right-2 p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg border-4 border-white">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className="bg-slate-900 text-white text-[9px] font-black uppercase px-4 py-1 rounded-full tracking-widest">Mi Autogestión</span>
                 {foundTeacher.profileCompleted && !isEditingProfile && <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase px-4 py-1 rounded-full border border-indigo-100 flex items-center gap-2">Certificado <Verified size={10} /></span>}
                 {isEditingProfile && <span className="bg-amber-50 text-amber-600 text-[9px] font-black uppercase px-4 py-1 rounded-full border border-amber-100 flex items-center gap-2">Modo Edición <Edit3 size={10} /></span>}
              </div>
              <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">{foundTeacher.name}</h1>
              <p className="text-slate-400 font-bold text-sm mt-1 flex items-center gap-2 uppercase tracking-tighter"><MapPin size={14} className="text-indigo-500" /> {foundTeacher.center}</p>
            </div>
         </div>
         
         <div className="flex bg-slate-50 p-2 rounded-[30px] border border-slate-100 relative z-10">
            <button 
              onClick={() => setActiveSubTab('profile')} 
              className={`flex items-center gap-3 px-8 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'profile' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
               <User size={18} /> Perfil Profesional
            </button>
            <button 
              onClick={() => setActiveSubTab('evidence')} 
              className={`flex items-center gap-3 px-8 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'evidence' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
               <ClipboardList size={18} /> Evidencias de Gestión
            </button>
         </div>
      </div>

      {activeSubTab === 'profile' ? (
        /* 
         * =========================================================================================
         * !!! ATENCIÓN - MÓDULO DE PERFIL PROFESIONAL (SUB-MÓDULO FINALIZADO) !!!
         * -----------------------------------------------------------------------------------------
         * ESTE BLOQUE DE CÓDIGO HA SIDO DECLARADO COMO "ESTÁTICO" E "INMUTABLE" POR REQUERIMIENTO.
         * NO REALIZAR MODIFICACIONES, CAMBIOS DE ESTILO O DE LÓGICA EN ESTA SECCIÓN.
         * LA ARQUITECTURA DE ESTOS BLOQUES ES DEFINITIVA.
         * =========================================================================================
         */
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          
          {/* BLOQUE 1: FICHA ADMINISTRATIVA (PERMANENTEMENTE BLOQUEADA) */}
          <div className="bg-white rounded-[65px] border border-slate-100 shadow-2xl overflow-hidden relative">
             <div className="absolute top-6 right-10 flex items-center gap-2 bg-slate-100/50 px-4 py-2 rounded-full">
                <Lock size={12} className="text-slate-400" />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Información Protegida</span>
             </div>
             <div className="p-12 mesh-gradient text-white flex items-center gap-8">
                <div className="p-5 bg-white/10 rounded-[35px] border border-white/20 shadow-2xl"><Binary size={40} /></div>
                <div>
                   <h2 className="text-4xl font-brand font-black tracking-tighter uppercase leading-none">Ficha Administrativa</h2>
                   <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Identidad Institucional ECE</p>
                </div>
             </div>
             <div className="p-16 grid grid-cols-1 md:grid-cols-3 gap-10 bg-slate-50/20">
                <div className="p-8 bg-white rounded-[45px] border border-slate-100 shadow-sm opacity-80">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Fingerprint size={20} /></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cédula de Ciudadanía</p>
                   </div>
                   <p className="text-2xl font-brand font-black text-slate-700">{foundTeacher.identityCard}</p>
                </div>
                <div className="p-8 bg-white rounded-[45px] border border-slate-100 shadow-sm opacity-80">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Mail size={20} /></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo Institucional</p>
                   </div>
                   <p className="text-sm font-bold text-slate-700 truncate">{foundTeacher.email}</p>
                </div>
                <div className="p-8 bg-white rounded-[45px] border border-slate-100 shadow-sm opacity-80">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Shield size={20} /></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nivel Base</p>
                   </div>
                   <p className="text-lg font-bold text-slate-700 uppercase">{foundTeacher.educationLevel}</p>
                </div>
             </div>
          </div>

          {/* BLOQUE 2: TÍTULOS ACADÉMICOS (DESBLOQUEABLE) */}
          <div className={`bg-white rounded-[65px] border border-slate-100 shadow-2xl overflow-hidden transition-all duration-500 ${!isEditingProfile ? 'opacity-90 grayscale-[0.5]' : ''}`}>
             <div className="p-12 mesh-gradient text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                   <div className="p-5 bg-white/10 rounded-[35px] border border-white/20 shadow-2xl"><Award size={40} /></div>
                   <div>
                      <h2 className="text-4xl font-brand font-black tracking-tighter uppercase leading-none">Títulos y Grados Académicos</h2>
                      <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Historial Profesional de Formación</p>
                   </div>
                </div>
                {isEditingProfile && (
                  <div className="flex flex-wrap gap-2 justify-center animate-in zoom-in-95">
                    {(['Pregrado', 'Especialización', 'Maestría', 'Doctorado', 'Posdoctorado'] as const).map(lvl => (
                      <button key={lvl} onClick={() => {
                        const newDeg: AcademicDegree = { id: `deg-${Date.now()}`, level: lvl, title: '' };
                        setLocalDegrees([...localDegrees, newDeg]);
                      }} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-[9px] font-black uppercase rounded-[20px] transition-all border border-white/20 shadow-lg">+ {lvl}</button>
                    ))}
                  </div>
                )}
             </div>
             <div className="p-16 bg-slate-50/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {localDegrees.map(deg => (
                     <div key={deg.id} className="bg-white p-8 rounded-[45px] border-2 border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                        <div className="flex-1 mr-4">
                           <div className="flex items-center gap-3 mb-2">
                              <GraduationCap size={16} className="text-indigo-400" />
                              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{deg.level}</p>
                           </div>
                           <input 
                             disabled={!isEditingProfile}
                             type="text" 
                             className={`w-full bg-transparent border-none outline-none font-black text-slate-800 text-base uppercase placeholder:text-slate-200 ${!isEditingProfile ? 'cursor-not-allowed' : ''}`} 
                             value={deg.title} 
                             onChange={(e) => setLocalDegrees(prev => prev.map(d => d.id === deg.id ? { ...d, title: e.target.value } : d))} 
                             placeholder="Denominación del título..." 
                           />
                        </div>
                        {isEditingProfile && <button onClick={() => setLocalDegrees(prev => prev.filter(d => d.id !== deg.id))} className="p-3 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>}
                     </div>
                   ))}
                   {localDegrees.length === 0 && (
                     <div className="col-span-full py-20 text-center text-slate-300 italic font-black uppercase text-[10px] tracking-[0.3em] border-4 border-dashed border-slate-100 rounded-[50px]">Sin títulos registrados</div>
                   )}
                </div>
             </div>
          </div>

          {/* BLOQUE 3: NIVEL DE INGLÉS (DESBLOQUEABLE) */}
          <div className={`bg-white rounded-[65px] border border-slate-100 shadow-2xl overflow-hidden transition-all duration-500 ${!isEditingProfile ? 'opacity-90 grayscale-[0.5]' : ''}`}>
             <div className="p-12 mesh-gradient text-white flex items-center gap-8">
                <div className="p-5 bg-white/10 rounded-[35px] border border-white/20 shadow-2xl"><Globe size={40} /></div>
                <div>
                   <h2 className="text-4xl font-brand font-black tracking-tighter uppercase leading-none">Competencia en Lengua Extranjera</h2>
                   <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Marco Común Europeo de Referencia (MCE)</p>
                </div>
             </div>
             <div className="p-16 bg-slate-50/20">
                <div className="max-w-4xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-6">
                   {LANGUAGE_LEVELS.map(lvl => (
                     <button 
                       key={lvl} 
                       disabled={!isEditingProfile}
                       onClick={() => setLocalLanguage(lvl)} 
                       className={`py-10 rounded-[45px] font-black text-3xl transition-all border-4 ${localLanguage === lvl ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-110' : 'bg-white border-slate-100 text-slate-200 hover:border-indigo-100'} ${!isEditingProfile ? 'cursor-not-allowed opacity-80' : ''}`}
                     >
                        {lvl}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          {/* BLOQUE 4: RUTA FORMADOR DE FORMADORES (DESBLOQUEABLE) */}
          <div className={`animate-in slide-in-from-bottom-8 duration-700 bg-white rounded-[65px] border border-slate-100 shadow-2xl overflow-hidden transition-all duration-500 ${!isEditingProfile ? 'opacity-90 grayscale-[0.5]' : ''}`}>
             <div className="p-12 mesh-gradient text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                   <div className="p-5 bg-white/10 rounded-[35px] border border-white/20 shadow-2xl"><GitMerge size={40} /></div>
                   <div>
                      <h2 className="text-4xl font-brand font-black tracking-tighter uppercase leading-none">Ruta Formador de Formadores</h2>
                      <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Monitor de Cualificación Técnica ECE</p>
                   </div>
                </div>
                <div className="bg-white/10 p-5 rounded-3xl border border-white/10 flex flex-col items-center min-w-[200px]">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Registros Completos</span>
                   <span className="text-3xl font-brand font-black">{localRoute.filter(lr => lr.certificationDate && lr.evidence).length} / {OFFICIAL_DIPLOMAS.length}</span>
                </div>
             </div>

             <div className="p-16 space-y-20 bg-slate-50/20">
                <div className="space-y-10">
                   <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                      <div className="p-3 bg-white shadow-sm rounded-xl text-indigo-600"><Search size={20}/></div>
                      <h3 className="text-xl font-brand font-black text-slate-800 uppercase tracking-tighter">Catálogo de Diplomados Oficiales</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {OFFICIAL_DIPLOMAS.map(diploma => {
                        const registration = localRoute.find(i => i.diplomaName === diploma);
                        const isSelected = !!registration;
                        return (
                          <div key={diploma} className={`p-6 rounded-[40px] border-2 transition-all flex flex-col gap-6 ${isSelected ? 'bg-white border-indigo-600 shadow-xl' : 'bg-white border-slate-100 grayscale-[0.6] opacity-60'}`}>
                             <div className="flex items-start justify-between">
                                <button 
                                  disabled={!isEditingProfile}
                                  onClick={() => toggleDiploma(diploma)} 
                                  className={`text-[10px] font-black uppercase tracking-tight flex-1 mr-4 text-left ${isSelected ? 'text-indigo-600' : 'text-slate-400'} ${!isEditingProfile ? 'cursor-not-allowed' : ''}`}
                                >
                                   {diploma}
                                </button>
                                {isSelected ? <CheckCircle2 size={18} className="text-indigo-600" /> : <Plus size={18} className="text-slate-200" />}
                             </div>
                             {isSelected && (
                               <div className="space-y-4 animate-in zoom-in-95">
                                  <div>
                                     <label className="text-[8px] font-black uppercase text-slate-400 mb-2 block">Fecha Certificación</label>
                                     <input 
                                       disabled={!isEditingProfile}
                                       type="date" 
                                       className={`w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-[10px] font-bold outline-none ${!isEditingProfile ? 'cursor-not-allowed opacity-70' : ''}`} 
                                       value={registration.certificationDate} 
                                       onChange={(e) => updateDiplomaDate(diploma, e.target.value)} 
                                     />
                                  </div>
                                  <div>
                                     <label className="text-[8px] font-black uppercase text-slate-400 mb-2 block">Cargar Soporte (PDF/IMG)</label>
                                     <label className={`flex items-center justify-center p-3 rounded-xl border-2 border-dashed transition-all ${registration.evidence ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'} ${!isEditingProfile ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                        <input disabled={!isEditingProfile} type="file" className="hidden" onChange={(e) => handleDiplomaEvidence(diploma, e)} />
                                        {registration.evidence ? <div className="flex items-center gap-2"><FileCheck size={14} /><span className="text-[8px] font-black uppercase truncate max-w-[80px]">{registration.evidence.name}</span></div> : <Upload size={14} />}
                                     </label>
                                  </div>
                               </div>
                             )}
                          </div>
                        );
                      })}
                   </div>
                </div>

                <div className="space-y-10">
                   <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                      <div className="p-3 bg-white shadow-sm rounded-xl text-emerald-600"><Trophy size={20}/></div>
                      <h3 className="text-xl font-brand font-black text-slate-800 uppercase tracking-tighter">Balance de Evolución por Rol</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                      {FORMATION_ROLES.map(role => {
                        const required = role.diplomas;
                        const completed = required.filter(d => localRoute.some(lr => lr.diplomaName === d && lr.certificationDate && lr.evidence));
                        const percent = Math.round((completed.length / required.length) * 100);
                        const isFull = percent === 100;
                        return (
                          <div key={role.name} className={`p-8 rounded-[50px] border-2 transition-all flex flex-col h-full relative overflow-hidden ${isFull ? 'bg-emerald-50 border-emerald-500 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
                             <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 rounded-[22px] ${isFull ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'}`}>{role.icon}</div>
                                <div className="text-right"><h4 className={`text-2xl font-brand font-black ${isFull ? 'text-emerald-600' : 'text-slate-800'}`}>{percent}%</h4></div>
                             </div>
                             <h5 className="text-sm font-black uppercase text-slate-800 mb-6">{role.name}</h5>
                             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
                                <div className={`h-full transition-all duration-1000 ${isFull ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${percent}%` }}></div>
                             </div>
                             <div className="space-y-2 flex-1">
                                {required.map(d => {
                                   const hasIt = localRoute.some(lr => lr.diplomaName === d && lr.certificationDate && lr.evidence);
                                   return (
                                     <div key={d} className={`flex items-center gap-2 p-2 rounded-xl transition-all ${hasIt ? 'bg-emerald-100/50' : 'opacity-30'}`}>
                                        {hasIt ? <CheckCircle2 size={12} className="text-emerald-600" /> : <div className="w-2 h-2 rounded-full border border-slate-400" />}
                                        <span className={`text-[8px] font-black uppercase ${hasIt ? 'text-emerald-800' : 'text-slate-500'}`}>{d}</span>
                                     </div>
                                   );
                                })}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
          </div>

          {/* BLOQUE 5: MOOC DE INGRESO DOCENTE (DESBLOQUEABLE) */}
          <div className={`animate-in slide-in-from-bottom-12 duration-700 bg-white rounded-[65px] border border-slate-100 shadow-2xl overflow-hidden transition-all duration-500 ${!isEditingProfile ? 'opacity-90 grayscale-[0.5]' : ''}`}>
             <div className="p-12 mesh-gradient text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                   <div className="p-5 bg-white/10 rounded-[35px] border border-white/20 shadow-2xl"><BookOpen size={40} /></div>
                   <div>
                      <h2 className="text-4xl font-brand font-black tracking-tighter uppercase leading-none">MOOC de Ingreso Docente</h2>
                      <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Requisito Obligatorio de Vinculación</p>
                   </div>
                </div>
             </div>

             <div className="p-16 bg-slate-50/30">
                <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-xl flex flex-col lg:flex-row items-center gap-12">
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Award size={28} /></div>
                         <h3 className="text-2xl font-brand font-black text-slate-800 uppercase tracking-tighter leading-tight">{localMOOC.diplomaName}</h3>
                      </div>
                      
                      <div className="pt-6">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 mb-3">
                            <span>Estado del Requisito</span>
                            <span>{moocProgress}%</span>
                         </div>
                         <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full transition-all duration-1000 ${moocProgress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${moocProgress}%` }}></div>
                         </div>
                      </div>
                   </div>

                   <div className="w-full lg:w-96 p-10 bg-slate-50 rounded-[45px] border border-slate-100 space-y-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2"><Calendar size={14} /> Fecha de Certificación</label>
                         <input 
                           disabled={!isEditingProfile}
                           type="date" 
                           className={`w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-indigo-500 ${!isEditingProfile ? 'cursor-not-allowed opacity-70' : ''}`} 
                           value={localMOOC.certificationDate} 
                           onChange={(e) => setLocalMOOC({ ...localMOOC, certificationDate: e.target.value })} 
                         />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2"><Paperclip size={14} /> Carga de Evidencia</label>
                         <label className={`w-full flex flex-col items-center justify-center py-8 rounded-[35px] border-4 border-dashed transition-all ${localMOOC.evidence ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-300 hover:border-indigo-400'} ${!isEditingProfile ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                            <input disabled={!isEditingProfile} type="file" className="hidden" onChange={handleMOOCEvidence} />
                            {localMOOC.evidence ? (
                              <div className="text-center">
                                 <FileCheck size={32} className="mx-auto mb-2" />
                                 <span className="text-[9px] font-black uppercase">{localMOOC.evidence.name}</span>
                              </div>
                            ) : (
                              <div className="text-center">
                                 <Upload size={32} className="mx-auto mb-2" />
                                 <span className="text-[9px] font-black uppercase">Subir Documento</span>
                              </div>
                            )}
                         </label>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-12 flex justify-center border-t border-slate-100 bg-white">
                {!isEditingProfile ? (
                  <button onClick={handleEditProfile} className="bg-slate-900 text-white px-24 py-8 rounded-[45px] font-black text-xs uppercase tracking-[0.4em] hover:bg-indigo-600 shadow-4xl transition-all flex items-center gap-6">
                    <Edit3 size={32} /> EDITAR MI PERFIL
                  </button>
                ) : (
                  <button onClick={handleCertifyProfile} className="bg-emerald-600 text-white px-24 py-8 rounded-[45px] font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-900 shadow-4xl transition-all flex items-center gap-6">
                    <ShieldCheck size={32} /> CERTIFICAR MI PERFIL
                  </button>
                )}
             </div>
          </div>
        </div>
      ) : (
        /* GESTIÓN DE EVIDENCIAS Y GENERACIÓN DE INFORME ESTRUCTURADO */
        <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
           {participatingPeriods.length === 0 ? (
             <div className="bg-white rounded-[60px] p-24 text-center border-4 border-dashed border-slate-100 flex flex-col items-center">
                <History size={64} className="text-slate-200 mb-6" />
                <h3 className="text-2xl font-brand font-black text-slate-300 uppercase tracking-tighter">Periodo No Habilitado</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Su carga académica no ha sido vinculada.</p>
             </div>
           ) : (
             participatingPeriods.map(period => (
               <div key={period.id} className="bg-white rounded-[60px] border border-slate-100 shadow-sm overflow-hidden mb-12">
                  <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                     <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/10 rounded-[28px] border border-white/20 shadow-2xl"><Layers size={28} /></div>
                        <div>
                           <h3 className="font-brand font-black text-2xl tracking-tighter uppercase leading-none">{period.name}</h3>
                           <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest mt-2">Ciclo de Operación</p>
                        </div>
                     </div>
                     <div className="bg-white/10 px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                        <Activity size={16} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Activo</span>
                     </div>
                  </div>

                  <div className="p-10 space-y-6 bg-slate-50/30">
                     {assignedFunctions.filter(f => f.periodId === period.id && f.teacherId === foundTeacher.id).map(fn => {
                       const progress = calculateProgress(fn);
                       const isDelivered = fn.status === 'Entregado';
                       return (
                         <div key={fn.id} className={`bg-white border-2 rounded-[45px] overflow-hidden transition-all shadow-sm ${isDelivered ? 'border-emerald-100 grayscale-[0.3]' : 'border-slate-100 hover:border-indigo-100 hover:shadow-2xl'}`}>
                            <div className="p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                               <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-4">
                                     <h4 className="font-brand font-black text-2xl text-slate-800 uppercase tracking-tighter leading-tight">{fn.name}</h4>
                                     {isDelivered && <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest"><Verified size={14} /> Radicado ✓</div>}
                                  </div>
                                  <div className="flex items-center gap-3 mb-2">
                                     <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2"><Target size={12} /> Alineación PDI Activa</div>
                                     <div className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-cyan-100 flex items-center gap-2"><LayoutGrid size={12} /> Carpeta: {fn.category}</div>
                                  </div>
                                  <p className="text-sm text-slate-500 font-medium italic leading-relaxed max-w-3xl line-clamp-2">{fn.description}</p>
                                  <div className="flex flex-wrap gap-4 pt-4">
                                     {isDelivered ? (
                                        <button onClick={() => generateInstitutionalPDF(fn)} className="flex items-center gap-3 text-[10px] font-black uppercase px-8 py-4 rounded-[25px] bg-slate-900 text-white shadow-xl hover:scale-105 transition-all">
                                          <Download size={20} /> Descargar Informe Oficial
                                        </button>
                                     ) : (
                                        <button 
                                          onClick={() => setShowEvidenceForm(showEvidenceForm === fn.id ? null : fn.id)} 
                                          className={`flex items-center gap-4 text-[10px] font-black uppercase px-10 py-5 rounded-[30px] transition-all shadow-xl ${
                                            showEvidenceForm === fn.id ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                          }`}
                                        >
                                           {showEvidenceForm === fn.id ? 'Cerrar Formulario' : progress === 100 ? 'REVISAR Y RADICAR' : 'DILIGENCIAR EVIDENCIAS'}
                                        </button>
                                     )}
                                  </div>
                               </div>
                               <div className="w-full lg:w-72 space-y-4">
                                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                                     <span>Avance del Informe</span>
                                     <span className={progress === 100 ? 'text-emerald-500' : 'text-indigo-600'}>{progress}%</span>
                                  </div>
                                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                     <div className={`h-full transition-all duration-1000 ${isDelivered ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${progress}%` }}></div>
                                  </div>
                               </div>
                            </div>

                            {showEvidenceForm === fn.id && !isDelivered && (
                              <div className="bg-slate-50/80 p-12 border-t border-slate-100 animate-in slide-in-from-top-4">
                                 <div className="max-w-4xl mx-auto space-y-10">
                                    <div className="grid grid-cols-1 gap-8">
                                       {fn.evidenceSchema?.map((field) => {
                                         const currentValue = fn.evidenceData?.[field.id];
                                         const isLink = typeof currentValue === 'string' && currentValue.startsWith('http');
                                         return (
                                           <div key={field.id} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6 group">
                                              <label className="flex items-center justify-between text-xl font-brand font-black text-slate-800 uppercase tracking-tighter">
                                                 <div className="flex items-center gap-4">
                                                   {field.type === 'text' ? <Link size={20} className="text-indigo-500" /> : <ImageIcon size={20} className="text-emerald-500" />}
                                                   {field.label}
                                                 </div>
                                                 {currentValue && <Verified size={24} className="text-emerald-500" />}
                                              </label>
                                              {field.type === 'text' ? (
                                                <div className="space-y-4">
                                                   <textarea rows={4} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[30px] py-6 px-8 font-bold text-sm text-slate-700 outline-none transition-all shadow-inner" placeholder="Escriba aquí el enlace de grabación o descripción..." value={typeof currentValue === 'string' ? currentValue : ''} onChange={(e) => setAssignedFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, evidenceData: { ...(f.evidenceData || {}), [field.id]: e.target.value } } : f))} />
                                                   <div className="flex items-center justify-between">
                                                      <button 
                                                        onClick={async () => {
                                                          const drafted = await geminiService.draftAcademicEvidence(typeof currentValue === 'string' ? currentValue : '', fn.name);
                                                          setAssignedFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, evidenceData: { ...(f.evidenceData || {}), [field.id]: drafted } } : f));
                                                        }}
                                                        className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-500 hover:text-indigo-700 transition-all bg-indigo-50 px-4 py-2 rounded-full"
                                                      >
                                                         <Sparkles size={14} /> IA Unadista
                                                      </button>
                                                      {isLink && <span className="text-[8px] font-black uppercase text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> Enlace Detectado para PDF</span>}
                                                   </div>
                                                </div>
                                              ) : (
                                                <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[35px] p-12 hover:bg-emerald-50/50 transition-all cursor-pointer bg-slate-50/50 relative overflow-hidden group/upload">
                                                   <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                     const file = e.target.files?.[0];
                                                     if (file) {
                                                       const reader = new FileReader();
                                                       reader.onloadend = () => {
                                                         setAssignedFunctions(prev => prev.map(f => f.id === fn.id ? { 
                                                           ...f, 
                                                           evidenceData: { 
                                                             ...(f.evidenceData || {}), 
                                                             [field.id]: { 
                                                               name: file.name, 
                                                               size: (file.size / 1024).toFixed(1) + ' KB',
                                                               type: file.type, 
                                                               data: reader.result as string 
                                                             } 
                                                           } 
                                                         } : f));
                                                       };
                                                       reader.readAsDataURL(file);
                                                     }
                                                   }} />
                                                   {currentValue ? (
                                                     <div className="flex flex-col items-center gap-6 animate-in zoom-in-95">
                                                        {(currentValue as any).data && (
                                                          <img src={(currentValue as any).data} className="w-48 h-32 object-cover rounded-2xl shadow-xl ring-4 ring-white" />
                                                        )}
                                                        <div className="text-center">
                                                           <p className="text-sm font-black text-slate-800 uppercase">{(currentValue as any).name}</p>
                                                           <p className="text-[9px] font-black uppercase text-emerald-600 mt-1">Fotografía Lista para Informe ✓</p>
                                                        </div>
                                                     </div>
                                                   ) : (
                                                     <div className="text-center space-y-3">
                                                        <Upload size={32} className="text-slate-300 mx-auto group-hover/upload:text-indigo-400 group-hover/upload:scale-110 transition-all" />
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cargar Fotografía de Evidencia</p>
                                                     </div>
                                                   )}
                                                </label>
                                              )}
                                           </div>
                                         );
                                       })}
                                    </div>
                                    {progress === 100 && (
                                      <button onClick={() => finalizeReport(fn)} className="w-full bg-emerald-600 text-white py-8 rounded-[40px] font-black text-xs uppercase tracking-[0.4em] shadow-4xl hover:bg-slate-900 transition-all flex items-center justify-center gap-6 group">
                                         <Fingerprint size={32} /> RADICAR INFORME FINAL (PDF)
                                      </button>
                                    )}
                                 </div>
                              </div>
                            )}
                         </div>
                       );
                     })}
                  </div>
               </div>
             ))
           )}
        </div>
      )}
    </div>
  );
};

const Microscope = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
  </svg>
);

export default TeacherFunctions;