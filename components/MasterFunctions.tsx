
import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Plus, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  Briefcase, 
  Target, 
  FileText, 
  GraduationCap, 
  Save, 
  XCircle,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Info,
  ArrowRight,
  Microscope,
  Users,
  Globe,
  Accessibility,
  Lightbulb,
  Layers,
  BookOpen,
  UserCheck,
  Award,
  ClipboardCheck,
  ShieldCheck,
  Type,
  Paperclip,
  Trash2,
  Layout,
  FilePlus,
  ShieldCheck as ShieldIcon,
  FolderOpen,
  History,
  FileCheck,
  Zap,
  HardDrive,
  ClipboardList,
  CheckCircle2,
  Lock,
  Verified,
  AlertTriangle,
  ShieldAlert,
  Fingerprint,
  Timer,
  Shield
} from 'lucide-react';
import { AcademicPeriod, Teacher, MasterFunction, PDIMapping, EvidenceField } from '../types';

/* 
 * =========================================================================================
 * ARCHITECTURE GUARD: DATA IMMUTABILITY ZONE
 * =========================================================================================
 */

const PDI_DATA = [
  {
    id: 1,
    title: "Macroproyecto 1: Gestión holística para la educación con equidad y calidad",
    description: "Busca potenciar las capacidades institucionales, el aprendizaje organizacional y el desarrollo de la plataforma humana para afrontar los retos de la UNAD 5.0, garantizando educación inclusiva, equitativa y de calidad, con líderes unadistas que impacten la transformación social en distintos contextos.",
    micros: [
      { id: 1, title: "Proyecto 1. Centro Organizacional de Altos Estudios y Cualificación del Talento Humano", desc: "Consolidar la cultura organizacional mediante pensamiento divergente, innovación prolífica y liderazgo transformacional, fortaleciendo la plataforma humana para asegurar la sostenibilidad y evolución del metasistema UNAD." },
      { id: 2, title: "Proyecto 2. Infraestructura física integral para la inclusión, la equidad y el bienestar", desc: "Orientado a adecuar y ampliar la infraestructura física de la UNAD para que responda al Modelo Pedagógico Unadista y a las necesidades de inclusión, accesibilidad, equidad y bienestar de la comunidad universitaria." },
      { id: 3, title: "Proyecto 3. Modelo de gestión organizacional con proyección glocal", desc: "Fortalece el modelo de gestión institucional para que sea coherente, sostenible y alineado con estándares de calidad, permitiendo que la UNAD actúe como organización moderna con proyección internacional." },
      { id: 4, title: "Proyecto 4. Gestión integral, armónica y coherente al reconocimiento del impacto transformador de la UNAD", desc: "Persigue el mejoramiento integral de la calidad de vida, satisfacción y felicidad de la comunidad unadista, fomentando líderes disruptivos y transformadores." }
    ]
  },
  {
    id: 2,
    title: "Macroproyecto 2: Ampliación, consolidación e innovación de las fronteras de conocimiento",
    description: "Su objetivo es retar permanentemente el modelo educativo para liderar la vanguardia formativa e investigativa, garantizando educación incluyente y equitativa mediante la innovación en la oferta académica, con altos estándares de calidad.",
    micros: [
      { id: 5, title: "Proyecto 5. Modernización de la oferta unadista con calidad académica y pertinencia en el entorno glocal", desc: "Dinamiza la oferta educativa en todos los sistemas, construyendo rutas formativas flexibles, pertinentes y de alta calidad que respondan a las demandas glocales." },
      { id: 6, title: "Proyecto 6. Acompañamiento integral y de calidad en el ciclo de vida del estudiante", desc: "Propone un ecosistema de acompañamiento académico, administrativo, psicosocial y de bienestar durante todas las etapas (aspirante–estudiante–egresado) para mejorar permanencia y éxito académico." },
      { id: 7, title: "Proyecto 7. Gestión tecnocientífica intersistémica para el impacto glocal", desc: "Busca consolidar el ecosistema de Ciencia, Tecnología e Innovación (CTeI) de la UNAD, articulando investigación e innovación para aumentar la productividad." }
    ]
  },
  {
    id: 3,
    title: "Macroproyecto 3: Liderazgo transformacional con impacto microterritorial, territorial e internacional",
    description: "Orienta a la UNAD a ejercer liderazgo transformacional en microterritorios, territorios y a nivel internacional, a través de emprendimientos disruptivos, proyectos de transformación social y cooperación internacional.",
    micros: [
      { id: 8, title: "Proyecto 8. Emprendimientos disruptivos fortalecidos desde lo regional con visión e impacto glocal", desc: "Identifica, acompaña y fortalece el emprendimiento disruptivo en las regiones, promoviendo la creación de empresas sostenibles." },
      { id: 9, title: "Proyecto 9. Transformación social sostenible mediante la gestión colectiva con las fuerzas vivas glocales", desc: "Impulsar proyectos de transformación social construidos con actores comunitarios para avanzar en inclusión, equidad y sostenibilidad." },
      { id: 10, title: "Proyecto 10. Gestión internacional e intersistémica que dinamiza el liderazgo transformacional", desc: "Busca posicionar a la UNAD 5.0 a nivel nacional e internacional, articulando de forma sinérgica las unidades del metasistema." },
      { id: 11, title: "Proyecto 11. Gestión efectiva para la mejora del impacto en la inclusión, el desarrollo regional y la proyección comunitaria", desc: "Se centra en gestionar, medir y potenciar el impacto de los proyectos de inclusión y desarrollo regional en los territorios." }
    ]
  },
  {
    id: 4,
    title: "Macroproyecto 4: Plataformas escalares hacia modelos eficientes y flexibles con visión evolutiva e incluyente",
    description: "Apunta a escalar y modernizar las plataformas tecnológicas, informacionales y físicas de la UNAD, de forma que soporten modelos de gestión y de aprendizaje más eficientes, flexibles e interoperables.",
    micros: [
      { id: 12, title: "Proyecto 12. Fortalecimiento de las capacidades tecnopedagógicas y físicas que permitan la gestión efectiva", desc: "Pretende escalar y potenciar la arquitectura del Metasistema UNAD 5.0 para optimizar interoperabilidad, calidad y transparencia." },
      { id: 13, title: "Proyecto 13. Tecnologías exponenciales, emergentes y disruptivas al servicio de la gestión e innovación educativa", desc: "Impulsar la incorporación estratégica de tecnologías emergentes (IA, analítica avanzada, automatización) para innovar en los procesos académicos." },
      { id: 14, title: "Proyecto 14. Calidad, flexibilidad y efectividad interoperativa y estratégica del Metasistema UNAD 5.0", desc: "Busca consolidar el Metasistema UNAD 5.0 como un entorno interoperable y eficiente, integrando sistemas de información y procesos." },
      { id: 15, title: "Proyecto 15. Apropiación de TIC para la gestión institucional de vanguardia", desc: "Pretende lograr que la UNAD incorpore y renueve de forma sistemática sus herramientas TIC para la gestión académica y administrativa." }
    ]
  }
];

const CONTRACTUAL_OPTIONS = {
  general: [
    "1. Proponer contenidos y recursos académicos a la red del curso, en coherencia con los lineamientos institucionales.",
    "2. Participar en la red de curso y los procesos pertinentes en la red curricular que corresponda.",
    "3. Desarrollar los reportes que le sean solicitados de acuerdo con las responsabilidades de su rol.",
    "4. Atender, en primera instancia, las solicitudes, peticiones, quejas y reclamos relacionados con el proceso formativo.",
    "5. Responder por el cumplimiento de las metas sobre los indicadores clave (Cursos críticos: % de aprobación, % ceros).",
    "6. Realizar el seguimiento y gestión de las alertas tempranas de cada uno de sus estudiantes a través del SII 4.0.",
    "7. Ejecutar estrategias pedagógicas, didácticas y motivacionales que favorezcan la retención y permanencia.",
    "8. Desarrollar los escenarios académicos sincrónicos (b-learning, CIPAS, web conference) y analizar resultados.",
    "9. Aplicar estrategias focalizadas que permitan mejorar los resultados de aprendizaje establecidos en el curso.",
    "10. Evaluación del curso de conformidad con los tiempos establecidos en la agenda del curso.",
    "11. Propender por la satisfacción de la población estudiantil en los procesos de acompañamiento docente.",
    "12. Realizar el acompañamiento sincrónico y asincrónico, efectivo, afectivo, oportuno y permanente.",
    "13. Efectuar el seguimiento permanente, oportuno y pertinente del proceso formativo.",
    "14. Entregar las notas de los estudiantes oportunamente de acuerdo a los tiempos establecidos.",
    "15. Participar en los eventos de formación y desarrollo docente programados en la institución.",
    "16. Certificarse en el curso de Inducción General: Conociendo mi UNAD.",
    "17. Participar en las actividades de reinducción docente programadas en la institución.",
    "18. Desarrollar las estrategias relacionadas con la vida académica universitaria.",
    "19. Desarrollar los trabajos de grado o jurados de grado que le sean asignados.",
    "20. Tramitar los estudios de homologación que le sean asignados."
  ],
  director: [
    "1. Ejecutar los procesos de alistamiento para certificación o acreditación académica del curso asignado.",
    "2. Actualizar los contenidos y recursos académicos del curso en coherencia con los lineamientos institucionales.",
    "3. Gestionar la red de curso y los procesos pertinentes en la red curricular que corresponda.",
    "4. Diseñar e implementar estrategias pedagógicas y didácticas que favorezcan la retención y permanencia.",
    "5. Diseñar y dinamizar escenarios sincrónicos (b-learning, CIPAS, web conference) a nivel pedagógico.",
    "6. Dinamizar en el curso estrategias que promuevan las responsabilidades sustantivas de la UNAD.",
    "7. Diseñar y evaluar estrategias para mejorar los resultados de aprendizaje en articulación con la red de curso.",
    "8. Diseñar los procesos de evaluación del aprendizaje del curso coherentes con su tipología.",
    "9. Gestionar la trazabilidad del acompañamiento docente y la centralización de notas de la red de curso.",
    "10. Responder por el cumplimiento de las metas sobre los indicadores clave del curso definidas por la Escuela.",
    "11. Realizar el seguimiento y gestión de las alertas tempranas en cada momento de evaluación vía SII 4.0.",
    "12. Planificar, desarrolla y monitorear los procesos de acompañamiento docente pertinentes.",
    "13. Desarrollar los reportes que le sean solicitados de acuerdo con las responsabilidades de su rol.",
    "14. Atender, en segunda instancia, las solicitudes, peticiones, quejas y reclamos del proceso formativo."
  ],
  leader: [
    "1. Dinamizar la acción zonal a través de la generación del plan de acción con la escuela para metas POV.",
    "2. Garantizar el ejercicio de fractalidad y reticularidad en la zona según el plan de desarrollo de la escuela.",
    "3. Garantizar la ejecución de los procedimientos asociados al proceso ciclo de vida del estudiante.",
    "4. Dinamizar la red académica en zona para el desarrollo y fortalecimiento de la vida académica del estudiante.",
    "5. Realizar seguimiento de las alertas tempranas haciendo uso del SII 4.0 para estudiantes de la zona.",
    "6. Acompañar a los actores académicos en acciones que promuevan la vida académica y proyectos especiales.",
    "7. Dinamizar estrategias conjuntas con Directivos en zona and Consejería para promover la retención.",
    "8. Desarrollar estrategias para afianzar comprensiones del modelo pedagógico en docentes y estudiantes.",
    "9. Desarrollar estudios zonales para la oferta/demanda de programas y necesidad de nuevas ofertas.",
    "10. Implementar mecanismos para orientar la gestión académica de los docentes de la Escuela en sus Centros.",
    "11. Coadyuvar en el proceso de atracción y vinculación de docentes nuevos en coordinación con decanatura.",
    "12. Acompañar a los actores académicos en acciones que fortalezcan la vida académica en el territorio.",
    "13. Garantizar la promoción de los estudiantes de la zona.",
    "14. Garantizar la permanencia de los estudiantes de la zona.",
    "15. Garantizar la retención de los estudiantes de la zona."
  ]
};

const DOCUMENT_CATEGORIES = [
  { id: 'c1', name: "Informes de eventos institucionales", icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'c2', name: "Informes de balance de gestión", icon: History, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'c3', name: "Programas académicos formales", icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'c4', name: "Actas de modificación de calificaciones", icon: FileCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'c5', name: "Procesos de prácticas formativas a través de medios sincrónicos y asincrónicos", icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'c6', name: "Convenios o alianzas sin erogación presupuestal", icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'c7', name: "Proyectos de investigación", icon: HardDrive, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'c8', name: "Actas de reuniones del Sistema Nacional de Educación Permanente (SINEP)", icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-50' }
];

const SUBSTANTIVE_FUNCTIONS = [
  { id: 'Formación', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Investigación', icon: Microscope, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'Proyección social', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'Internacionalización', icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'Inclusión', icon: Accessibility, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'Innovación', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' }
];

/* ========================================================================================= */

interface MasterFunctionsProps {
  periods: AcademicPeriod[];
  setPeriods: React.Dispatch<React.SetStateAction<AcademicPeriod[]>>;
  teachers: Teacher[];
  masterFunctionsBank: MasterFunction[];
  setMasterFunctionsBank: React.Dispatch<React.SetStateAction<MasterFunction[]>>;
}

const MasterFunctions: React.FC<MasterFunctionsProps> = ({ 
  periods, 
  setPeriods, 
  teachers, 
  masterFunctionsBank, 
  setMasterFunctionsBank 
}) => {
  const [activeTab, setActiveTab] = useState<'periods' | 'functions'>('periods');
  const [newPeriodName, setNewPeriodName] = useState('');
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(periods[0]?.id || null);
  const [teacherSearch, setTeacherSearch] = useState('');

  const [isCreatingFunction, setIsCreatingFunction] = useState(false);
  const [expandedMacros, setExpandedMacros] = useState<number[]>([]);
  const [activeContractualCard, setActiveContractualCard] = useState<'general' | 'director' | 'leader' | null>(null);

  const [newMF, setNewMF] = useState<Partial<MasterFunction>>({
    name: '',
    description: '',
    category: '', 
    pdiMappings: [],
    substantiveFunctions: [],
    contractualGeneral: [],
    contractualDirector: [],
    contractualLeader: [],
    contractualResponsibility: '',
    suggestedEvidence: '',
    evidenceSchema: []
  });

  // SISTEMA DE MONITOR DE INTEGRIDAD (Los 5 Pilares)
  const pillarsStatus = useMemo(() => ({
    pdi: (newMF.pdiMappings?.length || 0) > 0,
    substantive: (newMF.substantiveFunctions?.length || 0) > 0,
    contractual: (
      (newMF.contractualGeneral?.length || 0) > 0 || 
      (newMF.contractualDirector?.length || 0) > 0 || 
      (newMF.contractualLeader?.length || 0) > 0
    ),
    evidence: (newMF.evidenceSchema?.length || 0) > 0,
    category: (newMF.category?.length || 0) > 0,
    name: (newMF.name?.trim()?.length || 0) >= 5
  }), [newMF]);

  const isArchitectShielded = Object.values(pillarsStatus).every(status => status === true);

  const toggleMacro = (id: number) => {
    setExpandedMacros(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
  };

  const toggleMicro = (macroId: number, microId: number) => {
    setNewMF(prev => {
      const currentMappings = prev.pdiMappings || [];
      const mappingIdx = currentMappings.findIndex(m => m.macroId === macroId);
      
      let newMappings = [...currentMappings];
      if (mappingIdx === -1) {
        newMappings.push({ macroId, microIds: [microId] });
      } else {
        const isSelected = newMappings[mappingIdx].microIds.includes(microId);
        if (isSelected) {
          newMappings[mappingIdx].microIds = newMappings[mappingIdx].microIds.filter(id => id !== microId);
          if (newMappings[mappingIdx].microIds.length === 0) {
            newMappings = newMappings.filter(m => m.macroId !== macroId);
          }
        } else {
          newMappings[mappingIdx].microIds.push(microId);
        }
      }
      return { ...prev, pdiMappings: newMappings };
    });
  };

  const toggleSubstantive = (id: string) => {
    setNewMF(prev => {
      const current = prev.substantiveFunctions || [];
      const isSelected = current.includes(id);
      return {
        ...prev,
        substantiveFunctions: isSelected ? current.filter(f => f !== id) : [...current, id]
      };
    });
  };

  const toggleContractualItem = (category: 'general' | 'director' | 'leader', item: string) => {
    setNewMF(prev => {
      const field = category === 'general' ? 'contractualGeneral' : category === 'director' ? 'contractualDirector' : 'contractualLeader';
      const current = prev[field] as string[] || [];
      const isSelected = current.includes(item);
      return {
        ...prev,
        [field]: isSelected ? current.filter(i => i !== item) : [...current, item]
      };
    });
  };

  const addEvidenceField = (type: 'text' | 'file') => {
    const newField: EvidenceField = {
      id: `ev-${Date.now()}`,
      type,
      label: type === 'text' ? 'Describa el resultado aquí...' : 'Suba el documento soporte...',
      placeholder: type === 'text' ? 'Instrucciones específicas para el docente...' : undefined,
      required: true
    };
    setNewMF(prev => ({
      ...prev,
      evidenceSchema: [...(prev.evidenceSchema || []), newField]
    }));
  };

  const updateEvidenceField = (id: string, updates: Partial<EvidenceField>) => {
    setNewMF(prev => ({
      ...prev,
      evidenceSchema: prev.evidenceSchema?.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const removeEvidenceField = (id: string) => {
    setNewMF(prev => ({
      ...prev,
      evidenceSchema: prev.evidenceSchema?.filter(f => f.id !== id)
    }));
  };

  const handleCreateMasterFunction = () => {
    if (!isArchitectShielded) {
      alert("⚠️ Protocolo de Seguridad: No puede sellar la función hasta completar los 5 pilares estratégicos.");
      return;
    }
    const functionToAdd: MasterFunction = {
      ...newMF as MasterFunction,
      id: `mf-${Date.now()}`
    };
    setMasterFunctionsBank([...masterFunctionsBank, functionToAdd]);
    setIsCreatingFunction(false);
    setNewMF({ 
      name: '', description: '', category: '', pdiMappings: [], substantiveFunctions: [], contractualGeneral: [],
      contractualDirector: [], contractualLeader: [], contractualResponsibility: '', suggestedEvidence: '',
      evidenceSchema: []
    });
  };

  const handleAddPeriod = () => {
    if (!newPeriodName.trim()) return;
    const newPeriod: AcademicPeriod = {
      id: `p-${Date.now()}`,
      name: newPeriodName,
      status: 'Abierto',
      participatingTeacherIds: [],
      teacherWorkloads: {}
    };
    setPeriods([newPeriod, ...periods]);
    setNewPeriodName('');
    setShowAddPeriod(false);
    setSelectedPeriodId(newPeriod.id);
  };

  const toggleTeacherParticipation = (periodId: string, teacherId: string) => {
    setPeriods(prev => prev.map(p => {
      if (p.id !== periodId) return p;
      const isParticipating = p.participatingTeacherIds.includes(teacherId);
      const newIds = isParticipating 
        ? p.participatingTeacherIds.filter(id => id !== teacherId)
        : [...p.participatingTeacherIds, teacherId];
      
      // Limpiar carga horaria si se desactiva
      const newWorkloads = { ...(p.teacherWorkloads || {}) };
      if (isParticipating) {
        delete newWorkloads[teacherId];
      }
      
      return { ...p, participatingTeacherIds: newIds, teacherWorkloads: newWorkloads };
    }));
  };

  const setTeacherWorkload = (periodId: string, teacherId: string, type: 'TC' | 'MT' | 'HC' | 'A') => {
    setPeriods(prev => prev.map(p => {
      if (p.id !== periodId) return p;
      
      // Asegurar que el docente esté activado al seleccionar carga
      let newIds = [...p.participatingTeacherIds];
      if (!newIds.includes(teacherId)) {
        newIds.push(teacherId);
      }
      
      const newWorkloads = { 
        ...(p.teacherWorkloads || {}), 
        [teacherId]: type 
      };
      
      return { ...p, participatingTeacherIds: newIds, teacherWorkloads: newWorkloads };
    }));
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || 
    t.identityCard.includes(teacherSearch)
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      
      {/* MONITOR DE INTEGRIDAD FLOTANTE (ARQUITECTO CREADOR) */}
      {isCreatingFunction && (
        <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-right-20">
           <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-3xl w-72 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                 <ShieldIcon className={isArchitectShielded ? "text-emerald-400" : "text-indigo-400"} size={24} />
                 <div>
                    <h4 className="text-white text-[11px] font-black uppercase tracking-widest">Monitor de Integridad</h4>
                    <p className="text-slate-400 text-[9px] font-bold uppercase">{isArchitectShielded ? 'Arquitectura Blindada' : 'Validando Estructura...'}</p>
                 </div>
              </div>
              <div className="space-y-3">
                 {[
                   { id: 'name', label: 'Denominación', status: pillarsStatus.name },
                   { id: 'pdi', label: 'Alineación PDI', status: pillarsStatus.pdi },
                   { id: 'substantive', label: 'Func. Sustantivas', status: pillarsStatus.substantive },
                   { id: 'contractual', label: 'Func. Contractual', status: pillarsStatus.contractual },
                   { id: 'evidence', label: 'Plan de Evidencia', status: pillarsStatus.evidence },
                   { id: 'category', label: 'Destino Documental', status: pillarsStatus.category },
                 ].map(p => (
                   <div key={p.id} className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${p.status ? 'text-emerald-400' : 'text-slate-500'}`}>{p.label}</span>
                      {p.status ? <Verified size={14} className="text-emerald-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>}
                   </div>
                 ))}
              </div>
              {isArchitectShielded && (
                <div className="pt-4 animate-bounce">
                   <div className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-2xl flex items-center gap-2">
                      <Fingerprint size={16} className="text-emerald-400" />
                      <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Sello de Calidad Listo</span>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* HEADER DE SECCIÓN */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">Arquitectura Institucional</span>
            <Sparkles size={16} className="text-indigo-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">Configuración <span className="text-indigo-600">Estratégica</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Gestión de ciclos y diseño de funciones maestras alineadas al PDI.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-[24px] shadow-sm border border-slate-100 self-start">
           <button onClick={() => setActiveTab('periods')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'periods' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Periodos Académicos</button>
           <button onClick={() => setActiveTab('functions')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'functions' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Banco de Funciones</button>
        </div>
      </div>

      {activeTab === 'periods' ? (
        /* VISTA DE PERIODOS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Calendar size={20} /></div>
                   <h3 className="font-brand font-black text-xl tracking-tighter uppercase text-slate-800">Ciclos de Gestión</h3>
                 </div>
                 <button onClick={() => setShowAddPeriod(true)} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"><Plus size={20} /></button>
              </div>

              {showAddPeriod && (
                <div className="mb-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 animate-in zoom-in-95">
                  <input type="text" placeholder="Ej: 16-01 2025" className="w-full bg-white border border-indigo-100 rounded-2xl py-4 px-5 text-sm font-bold mb-4 outline-none" value={newPeriodName} onChange={(e) => setNewPeriodName(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={handleAddPeriod} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Crear</button>
                    <button onClick={() => setShowAddPeriod(false)} className="flex-1 py-3 bg-white text-slate-400 rounded-xl text-[10px] font-black uppercase border border-slate-200">Cancelar</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {periods.map(period => (
                  <button key={period.id} onClick={() => setSelectedPeriodId(period.id)} className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-300 ${selectedPeriodId === period.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-slate-50 border-transparent text-slate-700'}`}>
                    <div className="text-left"><p className="text-sm font-black">{period.name}</p></div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase ${period.status === 'Abierto' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{period.status}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedPeriodId ? (
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
                 <div className="p-10 mesh-gradient text-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="font-brand font-black text-2xl tracking-tighter uppercase mb-1">Activación por Periodo</h3>
                      <p className="text-indigo-100 text-sm font-medium">Habilite los docentes para la asignación de funciones en este ciclo.</p>
                    </div>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                      <input type="text" placeholder="Filtrar por nombre..." className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white outline-none placeholder:text-white/50" value={teacherSearch} onChange={(e) => setTeacherSearch(e.target.value)} />
                    </div>
                 </div>
                 <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/30">
                    {filteredTeachers.map(teacher => {
                      const currentPeriod = periods.find(p => p.id === selectedPeriodId);
                      const isActive = currentPeriod?.participatingTeacherIds.includes(teacher.id);
                      const currentWorkload = currentPeriod?.teacherWorkloads?.[teacher.id];
                      
                      const workloads: { id: 'TC' | 'MT' | 'HC' | 'A', label: string, color: string, bg: string }[] = [
                        { id: 'TC', label: 'TC', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { id: 'MT', label: 'MT', color: 'text-purple-600', bg: 'bg-purple-50' },
                        { id: 'HC', label: 'HC', color: 'text-amber-600', bg: 'bg-amber-50' },
                        { id: 'A', label: 'A', color: 'text-slate-600', bg: 'bg-slate-100' }
                      ];

                      return (
                        <div key={teacher.id} className={`p-8 rounded-[35px] border-2 transition-all flex flex-col gap-6 bg-white ${isActive ? 'border-indigo-200 shadow-xl scale-[1.02]' : 'border-transparent opacity-70 grayscale-[0.5]'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                              <div className="relative">
                                <img src={teacher.imageUrl} className={`w-16 h-16 rounded-[22px] object-cover ${isActive ? 'ring-4 ring-indigo-50 shadow-lg' : ''}`} />
                                {isActive && (
                                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white shadow-md">
                                    <CheckCircle2 size={12} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-black text-sm text-slate-900 leading-tight mb-1 uppercase tracking-tight">{teacher.name}</p>
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{teacher.center}</p>
                              </div>
                            </div>
                            <button onClick={() => toggleTeacherParticipation(selectedPeriodId!, teacher.id)} className={`p-3 rounded-[20px] transition-all shadow-sm ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300 hover:text-slate-400'}`}>
                              {isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                            </button>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-slate-50">
                             <div className="flex items-center gap-2 mb-2">
                                <Timer size={14} className="text-slate-300" />
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Tipo de Vinculación</span>
                             </div>
                             <div className="grid grid-cols-4 gap-2">
                                {workloads.map(wl => (
                                  <button
                                    key={wl.id}
                                    onClick={() => setTeacherWorkload(selectedPeriodId!, teacher.id, wl.id)}
                                    className={`py-2.5 rounded-xl text-[10px] font-black transition-all border-2 ${
                                      currentWorkload === wl.id 
                                        ? `bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.05]` 
                                        : `bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200`
                                    }`}
                                  >
                                    {wl.label}
                                  </button>
                                ))}
                             </div>
                          </div>
                        </div>
                      );
                    })}
                 </div>
              </div>
            ) : (
              <div className="h-full bg-white rounded-[40px] border border-dashed border-slate-200 flex items-center justify-center p-20 text-slate-300 font-black uppercase text-xs">Seleccione un periodo para configurar acceso</div>
            )}
          </div>
        </div>
      ) : (
        /* VISTA: DISEÑO DE FUNCIONES MAESTRAS (ARQUITECTO BLINDADO) */
        <div className="space-y-10">
          {isCreatingFunction ? (
            <div className="bg-white rounded-[50px] border border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 relative">
              
              {/* HEADER DEL ARQUITECTO */}
              <div className="p-10 border-b border-slate-100 flex items-center justify-between mesh-gradient text-white relative">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-white/20 rounded-2xl border border-white/30 shadow-xl"><FilePlus size={28} /></div>
                   <div>
                     <h2 className="text-3xl font-brand font-black uppercase tracking-tighter">Arquitecto de Funciones</h2>
                     <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Sello Institucional de Calidad Académica</p>
                   </div>
                </div>
                <button onClick={() => setIsCreatingFunction(false)} className="hover:rotate-90 transition-transform"><XCircle size={40} /></button>
              </div>

              <div className="p-12 space-y-20">
                
                {/* PILAR 0: DENOMINACIÓN (IDENTIDAD) */}
                <div className="space-y-6 bg-slate-900 p-12 rounded-[50px] shadow-3xl relative overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20">
                           <Fingerprint size={24} />
                        </div>
                        <h3 className="text-2xl font-brand font-black text-white uppercase tracking-tighter">Denominación del Rol</h3>
                     </div>
                     {pillarsStatus.name && <Verified className="text-emerald-400" size={28} />}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">Nombre Técnico de la Función Maestra</label>
                    <input 
                      type="text" 
                      value={newMF.name} 
                      onChange={(e) => setNewMF({...newMF, name: e.target.value})} 
                      className={`w-full bg-white/5 border-2 ${pillarsStatus.name ? 'border-emerald-500/30' : 'border-white/10'} focus:border-indigo-500 focus:bg-white focus:text-slate-900 rounded-[35px] py-8 px-12 text-2xl font-brand font-black text-white outline-none shadow-sm transition-all`} 
                      placeholder="Ej. Liderazgo de Cursos Críticos..." 
                    />
                  </div>
                </div>

                {/* PILAR 1: ALINEACIÓN PDI (ESTRATEGIA) */}
                <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Target size={28} /></div>
                      <div>
                         <h3 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">1. Alineación con el PDI</h3>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Coherencia UNAD 5.0</p>
                      </div>
                    </div>
                    {pillarsStatus.pdi ? <Verified className="text-emerald-500" size={28} /> : <div className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full border border-amber-100 animate-pulse">Requerido</div>}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {PDI_DATA.map(macro => (
                      <div key={macro.id} className={`rounded-[40px] border-2 transition-all p-8 ${newMF.pdiMappings?.some(m => m.macroId === macro.id) ? 'border-indigo-400 bg-indigo-50/30 shadow-xl' : 'border-slate-100 bg-slate-50/50'}`}>
                        <button onClick={() => toggleMacro(macro.id)} className="w-full flex items-center justify-between text-left mb-6 group">
                           <div className="flex-1 pr-10">
                              <h4 className="font-brand font-black text-xl text-slate-800 uppercase tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">{macro.title}</h4>
                           </div>
                           <div className={`p-3 rounded-full transition-all ${expandedMacros.includes(macro.id) ? 'bg-indigo-600 text-white rotate-180' : 'bg-white text-slate-300 shadow-sm'}`}>
                              <ChevronDown size={24} />
                           </div>
                        </button>
                        {expandedMacros.includes(macro.id) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                            {macro.micros.map(micro => {
                              const isSelected = newMF.pdiMappings?.find(m => m.macroId === macro.id)?.microIds.includes(micro.id);
                              return (
                                <button key={micro.id} onClick={() => toggleMicro(macro.id, micro.id)} className={`p-6 rounded-[32px] border-2 text-left transition-all flex items-start gap-4 ${isSelected ? 'bg-white border-indigo-600 shadow-xl ring-4 ring-indigo-500/5' : 'bg-white border-transparent hover:border-indigo-100 shadow-sm'}`}>
                                  <div className={`mt-1 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-200'}`}>
                                    {isSelected ? <CheckSquare size={22} /> : <Square size={22} />}
                                  </div>
                                  <div>
                                     <h5 className={`text-xs font-black uppercase mb-1.5 leading-tight ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>{micro.title}</h5>
                                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{micro.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PILAR 2: FUNCIONES SUSTANTIVAS (MISIONAL) */}
                <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm"><Layers size={28} /></div>
                      <div>
                         <h3 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">2. Funciones Sustantivas</h3>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dimensiones Misionales</p>
                      </div>
                    </div>
                    {pillarsStatus.substantive ? <Verified className="text-emerald-500" size={28} /> : <div className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full border border-amber-100 animate-pulse">Seleccionar Al Menos Una</div>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {SUBSTANTIVE_FUNCTIONS.map(func => {
                      const isSelected = newMF.substantiveFunctions?.includes(func.id);
                      return (
                        <button key={func.id} onClick={() => toggleSubstantive(func.id)} className={`flex flex-col items-center gap-4 p-8 rounded-[40px] border-2 transition-all group ${isSelected ? `${func.bg} border-indigo-500 shadow-2xl scale-105` : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'}`}>
                           <div className={`p-5 rounded-[28px] transition-all ${isSelected ? 'bg-white text-indigo-600 shadow-lg' : `bg-slate-50 ${func.color} group-hover:scale-110`}`}>
                              <func.icon size={32} />
                           </div>
                           <span className={`text-[10px] font-black uppercase text-center leading-tight tracking-tighter ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>{func.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PILAR 3: FUNCIONES CONTRACTUALES (LEGAL) */}
                <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm"><UserCheck size={28} /></div>
                      <div>
                         <h3 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">3. Funciones Contractuales</h3>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Blindaje Legal</p>
                      </div>
                    </div>
                    {pillarsStatus.contractual ? <Verified className="text-emerald-500" size={28} /> : <div className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full border border-amber-100 animate-pulse">Pendiente Vínculo</div>}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {(['general', 'director', 'leader'] as const).map(cat => (
                      <div key={cat} className={`rounded-[45px] border-2 transition-all overflow-hidden flex flex-col ${activeContractualCard === cat ? 'border-indigo-500 bg-indigo-50/10 shadow-2xl' : 'border-slate-100 bg-white shadow-sm hover:border-slate-200'}`}>
                        <button onClick={() => setActiveContractualCard(activeContractualCard === cat ? null : cat)} className="w-full p-10 flex flex-col items-center gap-4 group">
                           <div className={`p-5 rounded-3xl transition-all ${activeContractualCard === cat ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-50 text-slate-400'}`}>
                              {cat === 'general' ? <Briefcase size={32} /> : cat === 'director' ? <ClipboardCheck size={32} /> : <ShieldIcon size={32} />}
                           </div>
                           <h4 className="font-brand font-black text-sm uppercase tracking-widest text-slate-800">{cat === 'general' ? 'Responsabilidades' : cat === 'director' ? 'Director de Curso' : 'Liderazgo Zonal'}</h4>
                           <ChevronDown size={20} className={`text-slate-300 transition-transform ${activeContractualCard === cat ? 'rotate-180 text-indigo-500' : ''}`} />
                        </button>
                        {activeContractualCard === cat && (
                          <div className="p-6 pt-0 space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-4 pb-10">
                            {CONTRACTUAL_OPTIONS[cat].map(item => {
                              const list = (newMF[cat === 'general' ? 'contractualGeneral' : cat === 'director' ? 'contractualDirector' : 'contractualLeader'] as string[]) || [];
                              const isSelected = list.includes(item);
                              return (
                                <button key={item} onClick={() => toggleContractualItem(cat, item)} className={`w-full text-left p-5 rounded-[28px] text-[11px] font-bold border-2 transition-all flex items-start gap-4 ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-600 hover:border-indigo-100'}`}>
                                  <div className="mt-0.5 shrink-0">{ isSelected ? <CheckSquare size={16}/> : <Square size={16}/> }</div>
                                  <span className="leading-relaxed">{item}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PILAR 4: FORMULARIO DE EVIDENCIAS (OPERACIÓN) */}
                <div className="space-y-10 p-12 bg-slate-900 rounded-[60px] shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-10 gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-white/10 text-white rounded-[28px] border border-white/20 shadow-2xl"><Layout size={32} /></div>
                      <h3 className="text-3xl font-brand font-black text-white uppercase tracking-tighter">4. Plan de Evidencias</h3>
                    </div>
                    <div className="flex items-center gap-6">
                       {pillarsStatus.evidence && <Verified className="text-emerald-400" size={32} />}
                       <div className="flex gap-4">
                         <button onClick={() => addEvidenceField('text')} className="flex items-center gap-3 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                           <Type size={18} /> + Texto
                         </button>
                         <button onClick={() => addEvidenceField('file')} className="flex items-center gap-3 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                           <Paperclip size={18} /> + Archivo
                         </button>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    {newMF.evidenceSchema?.length === 0 ? (
                      <div className="py-24 text-center text-white/20 italic font-black uppercase text-sm tracking-[0.3em] border-4 border-dashed border-white/10 rounded-[50px] flex flex-col items-center gap-4">
                        <AlertTriangle size={60} className="text-amber-500/40" />
                        Obligatorio configurar al menos un campo de reporte
                      </div>
                    ) : (
                      newMF.evidenceSchema?.map((field, index) => (
                        <div key={field.id} className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex items-center gap-10 group animate-in slide-in-from-left-6">
                          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-white font-brand font-black text-xl">0{index + 1}</div>
                          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                            <div className="lg:col-span-5 space-y-3">
                              <label className="text-[10px] font-black uppercase text-indigo-300 tracking-widest ml-1">Requerimiento</label>
                              <input 
                                type="text" 
                                value={field.label} 
                                onChange={(e) => updateEvidenceField(field.id, { label: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-[28px] py-5 px-7 text-white text-sm font-bold outline-none focus:bg-white/10 transition-all"
                                placeholder="Ej: Justificación de actividades..."
                              />
                            </div>
                            <div className="lg:col-span-4 space-y-3">
                               <div className="flex items-center gap-4">
                                  {field.type === 'text' ? (
                                    <div className="flex items-center gap-3 text-[11px] font-black text-indigo-100 uppercase px-6 py-5 bg-white/5 rounded-[28px] border border-white/10 w-full">
                                       <Type size={18} className="text-indigo-400" /> Campo de Texto Libre
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3 text-[11px] font-black text-emerald-100 uppercase px-6 py-5 bg-white/5 rounded-[28px] border border-white/10 w-full">
                                      <FilePlus size={18} className="text-emerald-400" /> Carga de Documento
                                    </div>
                                  )}
                               </div>
                            </div>
                            <div className="lg:col-span-2">
                               <button 
                                onClick={() => updateEvidenceField(field.id, { required: !field.required })}
                                className={`w-full flex items-center justify-center gap-3 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all ${field.required ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/40'}`}
                              >
                                {field.required ? <CheckSquare size={18} /> : <Square size={18} />}
                                Obligatorio
                              </button>
                            </div>
                            <div className="lg:col-span-1 flex justify-end">
                              <button onClick={() => removeEvidenceField(field.id)} className="p-5 text-white/20 hover:text-red-400 transition-all">
                                <Trash2 size={24} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* PILAR 5: DESTINO DE EVIDENCIAS (ORGANIZACIÓN) */}
                <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl shadow-sm"><FolderOpen size={28} /></div>
                      <div>
                         <h3 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">5. Destino de Evidencias</h3>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Organización en el S.N.A.</p>
                      </div>
                    </div>
                    {pillarsStatus.category ? <Verified className="text-emerald-500" size={28} /> : <div className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full border border-amber-100 animate-pulse">Pendiente Selección</div>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {DOCUMENT_CATEGORIES.map((category) => (
                      <button 
                        key={category.id}
                        onClick={() => setNewMF({...newMF, category: category.name})}
                        className={`p-8 rounded-[40px] border-2 transition-all flex flex-col items-center text-center gap-4 relative overflow-hidden group ${
                          newMF.category === category.name 
                            ? `${category.bg} border-indigo-500 shadow-xl scale-105` 
                            : 'bg-white border-slate-100 hover:border-cyan-100 shadow-sm'
                        }`}
                      >
                        <div className={`p-4 rounded-2xl ${category.bg} ${category.color} transition-transform group-hover:scale-110`}>
                           <category.icon size={28} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tight leading-tight ${
                          newMF.category === category.name ? 'text-indigo-700' : 'text-slate-500'
                        }`}>
                          {category.name}
                        </span>
                        {newMF.category === category.name && (
                          <div className="absolute top-4 right-4 text-indigo-500 bg-white rounded-full shadow-lg">
                             <CheckCircle2 size={24} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CIERRE DE JORNADA: SELLADO DE ARQUITECTURA */}
                <div className="flex flex-col md:flex-row items-center justify-end gap-10 pt-16 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-slate-400">
                     <ShieldCheck size={24} className={isArchitectShielded ? 'text-emerald-500' : 'text-slate-200'} />
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-xs leading-relaxed">
                        {isArchitectShielded 
                          ? 'Arquitectura validada. Sello de calidad institucional activo.' 
                          : 'Integridad en curso: Complete los 5 pilares estratégicos para sellar.'}
                     </p>
                  </div>
                  <div className="flex gap-6">
                    <button onClick={() => setIsCreatingFunction(false)} className="px-10 py-6 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-red-500 transition-all">Descartar</button>
                    <button 
                      onClick={handleCreateMasterFunction} 
                      disabled={!isArchitectShielded}
                      className={`px-16 py-8 rounded-[40px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-3xl flex items-center gap-4 ${
                        isArchitectShielded 
                        ? 'bg-slate-900 text-white hover:bg-indigo-600 hover:scale-105' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {isArchitectShielded ? <Lock size={22} /> : <ShieldAlert size={22} />}
                      {isArchitectShielded ? 'Sellar Función Maestra' : 'Bloqueado: Pilares Incompletos'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* LISTADO DEL BANCO (VISTA RESUMEN) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 h-full">
                <div className="bg-slate-900 rounded-[60px] p-12 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-between min-h-[500px]">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                   <div className="relative z-10">
                     <div className="bg-white/10 p-5 rounded-3xl w-fit mb-8 border border-white/20 shadow-2xl">
                        <Sparkles size={32} className="text-indigo-400 animate-pulse" />
                     </div>
                     <h3 className="text-4xl font-brand font-black tracking-tighter uppercase mb-8 leading-tight">Gestión Maestra de Arquitectura</h3>
                     <p className="text-slate-400 text-base font-medium leading-relaxed mb-10">Centralice el catálogo institucional de funciones alineadas al PDI. Cada función diseñada incluye su propio ecosistema de reporte dinámico y blindado.</p>
                   </div>
                   <button onClick={() => setIsCreatingFunction(true)} className="relative z-10 w-full py-8 bg-indigo-600 text-white rounded-[40px] font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-4 shadow-3xl hover:scale-105 active:scale-95">
                      <Plus size={24} /> Diseñar Función Maestra
                   </button>
                </div>
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 {masterFunctionsBank.map(mf => (
                   <div key={mf.id} className="bg-white p-12 rounded-[55px] border border-slate-100 shadow-sm hover:shadow-3xl transition-all group flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl group-hover:bg-indigo-100/50 transition-all"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-8">
                           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl shadow-sm group-hover:scale-110 transition-transform"><ShieldCheck size={24} /></div>
                           <h4 className="font-brand font-black text-2xl text-slate-800 tracking-tighter uppercase leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{mf.name}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-10">
                           {mf.substantiveFunctions.map(f => <span key={f} className="text-[9px] font-black uppercase bg-slate-50 text-slate-400 border border-slate-100 px-4 py-1.5 rounded-full tracking-wider">{f}</span>)}
                           {mf.category && <span className="text-[9px] font-black uppercase bg-cyan-50 text-cyan-600 border border-cyan-100 px-4 py-1.5 rounded-full tracking-wider line-clamp-1 max-w-[150px]">{mf.category}</span>}
                        </div>
                      </div>
                      <div className="pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Ecosistema Blindado</span>
                            <div className="flex items-center gap-2 text-xs font-black text-indigo-500 uppercase">
                               <Verified size={14} /> Estructura Verificada
                            </div>
                         </div>
                         <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl transition-all"><ArrowRight size={22}/></button>
                      </div>
                   </div>
                 ))}
                 {masterFunctionsBank.length === 0 && (
                   <div className="col-span-2 py-32 text-center text-slate-300 italic font-black uppercase text-xs tracking-widest border-4 border-dashed border-slate-100 rounded-[60px]">Banco de funciones vacío</div>
                 )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MasterFunctions;
