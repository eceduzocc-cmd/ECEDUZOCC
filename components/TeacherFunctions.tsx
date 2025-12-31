
import React, { useState, useEffect } from 'react';
import { 
  IdCard,
  CheckCircle2,
  Clock,
  Award,
  Plus,
  Briefcase,
  UserCheck,
  Upload,
  Target,
  Layers,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Layout,
  Type,
  Paperclip,
  CheckCircle,
  FileCheck,
  AlertCircle,
  FileText,
  Zap,
  ShieldCheck,
  ArrowRight,
  Download,
  Printer,
  FileSpreadsheet,
  XCircle,
  ShieldAlert,
  Fingerprint,
  Verified,
  QrCode,
  Stamp,
  Settings,
  Image as ImageIcon,
  Send,
  Flag,
  Trophy,
  Mail
} from 'lucide-react';
import { Teacher, AcademicPeriod, AssignedFunction, EvidenceField } from '../types';
import { jsPDF } from 'jspdf';

const MACRO_TITLES: Record<number, string> = {
  1: "Gestión Holística",
  2: "Innovación Conocimiento",
  3: "Liderazgo Glocal",
  4: "Modelos Eficientes"
};

interface TeacherFunctionsProps {
  teachers: Teacher[];
  periods: AcademicPeriod[];
  setPeriods: React.Dispatch<React.SetStateAction<AcademicPeriod[]>>;
  assignedFunctions: AssignedFunction[];
  setAssignedFunctions: React.Dispatch<React.SetStateAction<AssignedFunction[]>>;
}

const TeacherFunctions: React.FC<TeacherFunctionsProps> = ({ 
  teachers, 
  periods, 
  setPeriods, 
  assignedFunctions, 
  setAssignedFunctions 
}) => {
  const [searchId, setSearchId] = useState('');
  const [foundTeacher, setFoundTeacher] = useState<Teacher | null>(teachers[0] || null);
  const [error, setError] = useState('');
  const [expandedFn, setExpandedFn] = useState<string | null>(null);
  const [showEvidenceForm, setShowEvidenceForm] = useState<string | null>(null);
  const [isPreviewingPDF, setIsPreviewingPDF] = useState<string | null>(null);
  const [showStationeryConfig, setShowStationeryConfig] = useState(false);

  // Logos persistidos en el navegador
  const [headerLogo, setHeaderLogo] = useState<string>(localStorage.getItem('unad_header_logo') || '');
  const [footerLogos, setFooterLogos] = useState<string>(localStorage.getItem('unad_footer_logos') || '');

  const handleSearch = () => {
    const teacher = teachers.find(t => t.identityCard === searchId);
    if (teacher) {
      if (!teacher.isActive) {
        setError('Acceso restringido: El perfil se encuentra inactivo.');
        setFoundTeacher(null);
        return;
      }
      setFoundTeacher(teacher);
      setError('');
    } else {
      setError('Cédula no encontrada en el metasistema.');
      setFoundTeacher(null);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'footer') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'header') {
          setHeaderLogo(base64);
          localStorage.setItem('unad_header_logo', base64);
        } else {
          setFooterLogos(base64);
          localStorage.setItem('unad_footer_logos', base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateEvidence = (functionId: string, fieldId: string, value: any) => {
    setAssignedFunctions(prev => prev.map(f => {
      if (f.id !== functionId) return f;
      const currentData = f.evidenceData || {};
      const newData = { ...currentData, [fieldId]: value };
      
      const isComplete = f.evidenceSchema?.every(field => {
        if (!field.required) return true;
        const val = newData[field.id];
        return val !== undefined && val !== '' && (typeof val === 'string' ? val.trim() !== '' : true);
      });

      return { 
        ...f, 
        evidenceData: newData,
        status: isComplete ? 'Pendiente' : 'Pendiente' // El estado 'Entregado' solo se asigna al Reportar
      };
    }));
  };

  const calculateProgress = (fn: AssignedFunction) => {
    if (!fn.evidenceSchema?.length) return 0;
    const totalFields = fn.evidenceSchema.length;
    const completedFields = fn.evidenceSchema.filter(f => {
      const val = fn.evidenceData?.[f.id];
      return val !== undefined && val !== '' && (typeof val === 'string' ? val.trim() !== '' : true);
    }).length;
    return Math.round((completedFields / totalFields) * 100);
  };

  /* 
   * =========================================================================================
   * MOTOR DE GENERACIÓN PDF: INFORME DE ACTIVIDADES DOCENTES v11.0
   * =========================================================================================
   */
  const generateInstitutionalPDF = (fn: AssignedFunction) => {
    if (!foundTeacher) return;
    
    const doc = new jsPDF();
    const period = periods.find(p => p.id === fn.periodId);
    const uniqueID = `INF-ECE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const UNAD_BLUE = [0, 65, 112]; 

    // --- 1. ENCABEZADO (LOGO) ---
    if (headerLogo) {
      try {
        doc.addImage(headerLogo, 'PNG', 15, 12, 45, 25);
      } catch (e) { console.error(e); }
    }

    // --- 2. CABECERA DE DATOS ESTRUCTURADA ---
    let y = 55;
    doc.setTextColor(UNAD_BLUE[0], UNAD_BLUE[1], UNAD_BLUE[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INFORME DE ACTIVIDADES DOCENTES", 105, y, { align: 'center' });
    
    y += 12;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`CÓDIGO DE REPORTE: ${uniqueID}`, 195, y, { align: 'right' });

    y += 5;
    doc.setDrawColor(235, 235, 235);
    doc.setFillColor(250, 250, 250);
    doc.rect(15, y, 180, 32, 'F');
    doc.rect(15, y, 180, 32, 'D');

    y += 8;
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "bold");
    doc.text("NOMBRE DEL DOCENTE:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(foundTeacher.name.toUpperCase(), 65, y);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("IDENTIFICACIÓN:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(foundTeacher.identityCard, 65, y);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("PERIODO ACADÉMICO:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(period?.name || 'N/A', 65, y);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("ACTIVIDAD MAESTRA:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(fn.name.toUpperCase(), 65, y);

    // --- 3. INDICADORES DE IMPACTO (Chips en el PDF) ---
    y += 20;
    doc.setTextColor(UNAD_BLUE[0], UNAD_BLUE[1], UNAD_BLUE[2]);
    doc.setFont("helvetica", "bold");
    doc.text("INDICADORES DE IMPACTO ESTRATÉGICO:", 15, y);
    
    y += 8;
    let chipX = 15;
    doc.setFontSize(7);
    
    // Chips de Funciones Sustantivas
    fn.substantiveFunctions?.forEach(sf => {
       const text = `[ ${sf.toUpperCase()} ]`;
       const width = doc.getTextWidth(text) + 6;
       if (chipX + width > 195) { chipX = 15; y += 6; }
       doc.setTextColor(80, 80, 80);
       doc.text(text, chipX, y);
       chipX += width;
    });

    // Chips de Microproyectos PDI
    fn.pdiMappings?.forEach(m => {
       m.microIds.forEach(mid => {
         const text = `[ PROYECTO ${m.macroId}.${mid} ]`;
         const width = doc.getTextWidth(text) + 6;
         if (chipX + width > 195) { chipX = 15; y += 6; }
         doc.setTextColor(0, 130, 70);
         doc.text(text, chipX, y);
         chipX += width;
       });
    });

    // --- 4. RESULTADOS DE EVIDENCIAS ---
    y += 15;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("RESULTADOS Y EVIDENCIAS CONSIGNADAS:", 15, y);
    doc.setDrawColor(UNAD_BLUE[0], UNAD_BLUE[1], UNAD_BLUE[2]);
    doc.line(15, y + 2, 60, y + 2);
    
    y += 12;
    fn.evidenceSchema?.forEach((field, idx) => {
      const val = fn.evidenceData?.[field.id];
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. ${field.label.toUpperCase()}:`, 15, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      
      if (field.type === 'text') {
        const lines = doc.splitTextToSize(val as string || "No registra información técnica.", 175);
        doc.text(lines, 20, y);
        y += (lines.length * 4) + 6;
      } else {
        const name = (val as any)?.name || "Sin adjunto.";
        doc.text(`> Soporte de Evidencia Digital: ${name}`, 20, y);
        y += 8;
      }

      if (y > 260) { doc.addPage(); y = 30; }
    });

    // --- 5. PIE DE PÁGINA INSTITUCIONAL ---
    const footerY = 275;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Universidad Nacional Abierta y a Distancia UNAD", 15, footerY);
    doc.text("Escuela de Ciencias de la Educación", 15, footerY + 4);
    doc.text("Zona Occidente", 15, footerY + 8);

    if (footerLogos) {
      try {
        doc.addImage(footerLogos, 'PNG', 120, footerY - 5, 75, 15);
      } catch (e) { console.error(e); }
    }

    doc.save(`INFORME_DOCENTE_${foundTeacher.identityCard}_${uniqueID}.pdf`);
  };

  /* 
   * PROCESO DE REPORTE FINAL: ARCHIVADO Y NOTIFICACIÓN
   */
  const handleFinalReportAction = (fn: AssignedFunction) => {
    if (!foundTeacher) return;

    // 1. Generar automáticamente el Informe PDF
    generateInstitutionalPDF(fn);

    // 2. Actualizar estado y archivar virtualmente en Gestión Documental
    setAssignedFunctions(prev => prev.map(f => {
      if (f.id === fn.id) {
        return { ...f, status: 'Entregado' };
      }
      return f;
    }));

    // 3. Notificación simulada de éxito y envío de correo
    alert(`¡PROCESO DE REPORTE FINALIZADO!\n\n` +
          `1. El informe ha sido generado y archivado en: ${fn.category || 'Gestión Académica'}.\n` +
          `2. Se ha enviado una copia del informe al correo: ${foundTeacher.email}.\n` +
          `3. La actividad "${fn.name}" ha sido marcada como REPORTADA en el metasistema.`);

    setIsPreviewingPDF(null);
    setShowEvidenceForm(null);
  };

  const participatingPeriods = periods.filter(p => foundTeacher && p.participatingTeacherIds.includes(foundTeacher.id));

  if (!foundTeacher) {
    return (
      <div className="max-w-2xl mx-auto mt-20 animate-in fade-in zoom-in-95 duration-1000">
        <div className="bg-white rounded-[60px] shadow-3xl border border-slate-100 overflow-hidden">
          <div className="mesh-gradient p-16 text-white text-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full"></div>
            <div className="p-6 bg-white/20 rounded-[35px] border border-white/30 shadow-2xl w-fit mx-auto mb-8">
               <IdCard size={64} className="text-white opacity-90" />
            </div>
            <h2 className="text-4xl font-brand font-black tracking-tighter uppercase leading-tight">Terminal de Gestión<br/>Docente</h2>
            <p className="text-indigo-100 font-bold uppercase text-[11px] tracking-[0.4em] mt-6 opacity-80">Identidad Digital • Acceso Institucional</p>
          </div>
          <div className="p-16 space-y-8">
            <div className="space-y-3">
               <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-2">Documento de Identidad</label>
               <input type="text" placeholder="Ingrese su Cédula de Ciudadanía" className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-[30px] py-6 px-10 font-black text-xl text-slate-800 outline-none transition-all shadow-inner placeholder:text-slate-300" value={searchId} onChange={(e) => setSearchId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            </div>
            <button onClick={handleSearch} className="w-full bg-slate-900 text-white py-6 rounded-[35px] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 shadow-3xl transition-all flex items-center justify-center gap-3">
               Ingresar al Metasistema <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-right-10 duration-1000 max-w-[1400px] mx-auto">
      
      {/* MODAL CONFIGURACIÓN PAPELERÍA */}
      {showStationeryConfig && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white w-full max-w-2xl rounded-[50px] overflow-hidden shadow-4xl animate-in zoom-in-95">
              <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Settings size={24} /></div>
                    <h3 className="text-2xl font-brand font-black tracking-tighter uppercase">Configurar Papelería Oficial</h3>
                 </div>
                 <button onClick={() => setShowStationeryConfig(false)}><XCircle size={32} className="text-slate-300 hover:text-red-500 transition-colors" /></button>
              </div>
              <div className="p-12 space-y-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><ImageIcon size={14} /> 1. Logo Superior (Captura de Plantilla)</label>
                    <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[35px] p-8 hover:bg-indigo-50 cursor-pointer bg-slate-50 group">
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'header')} />
                       {headerLogo ? <img src={headerLogo} className="h-20 object-contain" /> : <span className="text-[11px] font-black uppercase text-slate-400">Subir Logo Superior</span>}
                    </label>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Stamp size={14} /> 2. Tira de Sellos Inferior</label>
                    <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[35px] p-8 hover:bg-indigo-50 cursor-pointer bg-slate-50 group">
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'footer')} />
                       {footerLogos ? <img src={footerLogos} className="h-16 object-contain" /> : <span className="text-[11px] font-black uppercase text-slate-400">Subir Tira de Sellos</span>}
                    </label>
                 </div>
                 <button onClick={() => setShowStationeryConfig(false)} className="w-full bg-slate-900 text-white py-6 rounded-[30px] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Guardar Configuración</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: PREVISUALIZACIÓN DE INFORME CON INDICADORES ESTRATÉGICOS */}
      {isPreviewingPDF && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white w-full max-w-4xl rounded-[50px] overflow-hidden shadow-4xl animate-in zoom-in-95 flex flex-col h-[90vh]">
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                 <div className="flex items-center gap-5">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Verified size={24} /></div>
                    <div>
                       <h3 className="text-2xl font-brand font-black tracking-tighter uppercase leading-none">Previsualización de Informe</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Revisión Final de Datos y Aportes</p>
                    </div>
                 </div>
                 <button onClick={() => setIsPreviewingPDF(null)} className="hover:rotate-90 transition-transform text-slate-300"><XCircle size={32} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 bg-slate-100 custom-scrollbar">
                 <div className="bg-white mx-auto shadow-2xl min-h-[1000px] w-full max-w-[800px] relative overflow-hidden p-16 flex flex-col border border-slate-200">
                    <div className="flex justify-start mb-16">
                       {headerLogo ? <img src={headerLogo} className="h-24 object-contain" /> : <div className="w-48 h-24 border-4 border-dashed border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-300">LOGO UNAD</div>}
                    </div>

                    <div className="flex-1 space-y-12">
                       <div className="text-center border-b-2 border-slate-100 pb-6">
                          <h4 className="text-xl font-brand font-black text-slate-900 uppercase">Informe de Actividades Docentes</h4>
                       </div>

                       {/* CABECERA DE DATOS ESTRUCTURADA (SOLICITUD USUARIO) */}
                       <div className="grid grid-cols-1 gap-6 bg-slate-50/50 p-10 rounded-3xl border border-slate-100">
                          <div className="grid grid-cols-2 gap-10">
                             <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Nombre del Docente</p>
                                <p className="text-sm font-black text-slate-900 leading-tight">{foundTeacher.name.toUpperCase()}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Identificación</p>
                                <p className="text-sm font-black text-slate-900">{foundTeacher.identityCard}</p>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-10">
                             <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Periodo Académico</p>
                                <p className="text-sm font-black text-slate-900 uppercase leading-tight">{periods.find(p => p.id === assignedFunctions.find(f => f.id === isPreviewingPDF)?.periodId)?.name}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Actividad Maestra</p>
                                <p className="text-sm font-black text-slate-900 uppercase leading-tight">{assignedFunctions.find(f => f.id === isPreviewingPDF)?.name}</p>
                             </div>
                          </div>
                       </div>

                       {/* INDICADORES DE IMPACTO (Chips en Informe) */}
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest border-b border-slate-50 pb-2">Indicadores de Impacto Estratégico</p>
                          <div className="flex flex-wrap gap-3">
                             {assignedFunctions.find(f => f.id === isPreviewingPDF)?.substantiveFunctions?.map(sf => (
                                <span key={sf} className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-xl border border-indigo-100 flex items-center gap-2"><Trophy size={14}/> {sf}</span>
                             ))}
                             {assignedFunctions.find(f => f.id === isPreviewingPDF)?.pdiMappings?.map(m => (
                                <span key={m.macroId} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-xl border border-emerald-100 flex items-center gap-2"><Flag size={14}/> Proyecto {m.macroId}</span>
                             ))}
                          </div>
                       </div>

                       {/* RESULTADOS DE CAMPOS */}
                       <div className="space-y-8">
                          <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest border-b border-slate-50 pb-2">Resultados de Gestión Consignados</p>
                          <div className="space-y-8">
                             {assignedFunctions.find(f => f.id === isPreviewingPDF)?.evidenceSchema?.map((field, idx) => {
                               const val = assignedFunctions.find(f => f.id === isPreviewingPDF)?.evidenceData?.[field.id];
                               return (
                                 <div key={field.id} className="space-y-2">
                                    <p className="text-[11px] font-black text-slate-800 uppercase leading-none">{idx + 1}. {field.label}</p>
                                    <div className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/50 p-6 rounded-[28px] border border-slate-100">
                                       {field.type === 'text' ? (val as string || 'Pendiente de información...') : (
                                         <div className="flex items-center gap-3 text-emerald-600 font-bold">
                                            <FileCheck size={18} /> Evidencia Digital: {(val as any)?.name}
                                         </div>
                                       )}
                                    </div>
                                 </div>
                               );
                             })}
                          </div>
                       </div>
                    </div>

                    {/* PIE DE PÁGINA (ESTILO CAPTURA) */}
                    <div className="mt-20 flex justify-between items-end border-t border-slate-100 pt-10">
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-900 leading-tight">Universidad Nacional Abierta y a Distancia UNAD</p>
                          <p className="text-[11px] font-bold text-slate-900 leading-tight">Escuela de Ciencias de la Educación</p>
                          <p className="text-[11px] font-bold text-slate-900 leading-tight">Zona Occidente</p>
                       </div>
                       <div className="flex-1 flex justify-end">
                          {footerLogos ? <img src={footerLogos} className="h-12 object-contain" /> : <div className="text-[8px] font-black text-slate-300 uppercase">Sellos Institucionales</div>}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 border-t border-slate-100 flex justify-end gap-6 bg-white shrink-0">
                 <button onClick={() => setIsPreviewingPDF(null)} className="px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600">Cancelar</button>
                 <button 
                  onClick={() => {
                    const fn = assignedFunctions.find(f => f.id === isPreviewingPDF);
                    if (fn) handleFinalReportAction(fn);
                  }}
                  className="bg-[#004170] text-white px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.25em] hover:bg-emerald-600 transition-all shadow-3xl flex items-center gap-4"
                >
                    <Send size={18} /> REPORTAR EVIDENCIAS AL METASISTEMA
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER DE PERFIL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-slate-200 pb-12">
        <div className="flex items-center gap-10">
          <div className="relative group">
             <img src={foundTeacher.imageUrl} className="w-32 h-32 rounded-[45px] object-cover shadow-3xl border-4 border-white ring-12 ring-indigo-50 transition-all" />
             <div className="absolute -bottom-2 -right-2 p-3 bg-emerald-500 text-white rounded-2xl shadow-xl border-4 border-white">
                <ShieldCheck size={20} />
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
               <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.25em] shadow-lg">Perfil Académico Activo</span>
               <button onClick={() => setShowStationeryConfig(true)} className="ml-4 p-2 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2 px-4">
                  <Settings size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Papelería</span>
               </button>
            </div>
            <h1 className="text-5xl font-brand font-black text-slate-900 tracking-tighter uppercase">{foundTeacher.name}</h1>
            <div className="flex items-center gap-3 mt-4 text-slate-400">
               <span className="text-xs font-black uppercase tracking-[0.2em]">{foundTeacher.center}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
               <span className="text-xs font-black uppercase tracking-[0.2em]">Escuela de Ciencias de la Educación</span>
            </div>
          </div>
        </div>
        <button onClick={() => {setFoundTeacher(null); setSearchId('');}} className="px-10 py-5 bg-white text-slate-400 border-2 border-slate-100 rounded-[30px] font-black text-xs uppercase tracking-[0.25em] hover:text-red-500 transition-all">Desconexión Segura</button>
      </div>

      {/* LISTA DE FUNCIONES Y PROGRESO */}
      <div className="space-y-16">
        {participatingPeriods.map(period => (
          <div key={period.id} className={`bg-white rounded-[65px] border-2 transition-all overflow-hidden ${period.status === 'Cerrado' ? 'border-slate-100 grayscale opacity-70' : 'border-indigo-50 shadow-3xl shadow-indigo-500/5'}`}>
             <div className="p-12 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between border-b gap-8">
                <div className="flex items-center gap-6">
                   <div className="p-5 bg-slate-900 text-white rounded-[32px] shadow-2xl"><Layers size={32} /></div>
                   <div>
                      <h3 className="font-brand font-black text-3xl tracking-tighter uppercase text-slate-900 leading-none">{period.name}</h3>
                      <p className="text-xs font-black uppercase text-indigo-500 tracking-[0.3em] mt-2">Bitácora de Informes Estratégicos</p>
                   </div>
                </div>
                <div className="px-8 py-4 rounded-[28px] text-[11px] font-black uppercase tracking-widest flex items-center gap-3 bg-emerald-500 text-white shadow-xl">
                   <Zap size={16} fill="currentColor"/> Ciclo Académico Activo
                </div>
             </div>

             <div className="p-12 space-y-12">
                {assignedFunctions.filter(f => f.periodId === period.id && f.teacherId === foundTeacher.id).map(fn => {
                  const progress = calculateProgress(fn);
                  return (
                    <div key={fn.id} className="bg-white border-2 border-slate-50 rounded-[55px] overflow-hidden hover:shadow-4xl transition-all shadow-md border-l-[12px] border-l-indigo-600">
                       <div className="p-14 flex flex-col lg:flex-row items-start justify-between gap-16">
                          <div className="flex-1 space-y-10">
                             <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-5">
                                   <h4 className="font-brand font-black text-3xl text-slate-900 tracking-tighter uppercase leading-tight">{fn.name}</h4>
                                   <div className="flex gap-2">
                                      {fn.substantiveFunctions?.map(f => (
                                        <span key={f} className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-4 py-1.5 rounded-full border border-indigo-100">{f}</span>
                                      ))}
                                   </div>
                                </div>
                                <p className="text-base text-slate-500 font-medium italic leading-relaxed max-w-4xl">{fn.description}</p>
                             </div>
                             
                             <div className="flex flex-wrap gap-5">
                                <button onClick={() => setShowEvidenceForm(showEvidenceForm === fn.id ? null : fn.id)} className={`flex items-center gap-3 text-[11px] font-black uppercase px-8 py-5 rounded-[28px] transition-all ${showEvidenceForm === fn.id ? 'bg-emerald-600 text-white shadow-3xl scale-105' : 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100 shadow-sm'}`}>
                                   <FileText size={22} /> {progress === 100 ? 'Revisar Informe Completo' : 'Gestionar Informe de Evidencias'}
                                </button>
                             </div>
                          </div>

                          <div className="w-full lg:w-96 p-10 bg-slate-50/70 rounded-[45px] border border-slate-100 space-y-8">
                             <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                   <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Cargue de Informe</span>
                                   <span className={`text-[14px] font-black uppercase ${progress === 100 ? 'text-emerald-500' : 'text-indigo-600'}`}>{progress}%</span>
                                </div>
                                <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner ring-4 ring-white">
                                   <div className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500 shadow-xl' : 'bg-indigo-600 shadow-xl'}`} style={{ width: `${progress}%` }}></div>
                                </div>
                             </div>
                             <div className={`flex items-center gap-5 p-6 rounded-[32px] border-2 transition-all ${fn.status === 'Entregado' ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xl' : 'bg-white border-orange-100 text-orange-500 shadow-sm'}`}>
                                {fn.status === 'Entregado' ? <CheckCircle2 size={32} strokeWidth={3}/> : <Clock size={32} strokeWidth={3}/>}
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 leading-none mb-2">Estado del Proceso</p>
                                   <p className="text-lg font-brand font-black uppercase tracking-widest leading-none">{fn.status === 'Entregado' ? 'REPORTADO' : 'PENDIENTE'}</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       {showEvidenceForm === fn.id && (
                         <div className="bg-emerald-50/40 p-16 border-t border-emerald-100 animate-in slide-in-from-top-4">
                            <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
                               {fn.evidenceSchema?.map(field => {
                                 const currentValue = fn.evidenceData?.[field.id];
                                 return (
                                   <div key={field.id} className="space-y-6 bg-white p-12 rounded-[50px] border border-emerald-100 shadow-xl relative overflow-hidden group">
                                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform"></div>
                                      <label className="flex items-center justify-between text-xl font-brand font-black text-slate-800 tracking-tight relative z-10">
                                         <span className="flex items-center gap-4">
                                           <div className={`p-2.5 rounded-xl ${field.type === 'text' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                              {field.type === 'text' ? <Type size={22}/> : <Paperclip size={22}/>}
                                           </div>
                                           {field.label}
                                         </span>
                                         {field.required && <span className="text-red-500 text-[10px] font-black uppercase bg-red-50 px-5 py-2 rounded-full border border-red-100 tracking-widest shadow-sm">Requerido</span>}
                                      </label>
                                      
                                      {field.type === 'text' ? (
                                        <textarea 
                                          rows={5}
                                          className="w-full bg-slate-50 border-4 border-transparent focus:border-emerald-500 rounded-[35px] py-8 px-10 font-bold text-base text-slate-700 outline-none transition-all shadow-inner relative z-10 placeholder:text-slate-300"
                                          placeholder={field.placeholder}
                                          value={currentValue as string || ''}
                                          onChange={(e) => handleUpdateEvidence(fn.id, field.id, e.target.value)}
                                        />
                                      ) : (
                                        <div className="flex items-center gap-10 relative z-10">
                                           <label className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[45px] p-16 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer bg-slate-50 group/drop relative overflow-hidden">
                                              <input type="file" className="hidden" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleUpdateEvidence(fn.id, field.id, { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' });
                                              }} />
                                              {currentValue ? (
                                                <div className="flex flex-col md:flex-row items-center gap-8 animate-in zoom-in-95">
                                                   <div className="p-8 bg-emerald-600 text-white rounded-[35px] shadow-3xl"><FileCheck size={56} /></div>
                                                   <div className="text-center md:text-left">
                                                      <p className="text-2xl font-brand font-black text-slate-900 leading-none mb-3">{(currentValue as any).name}</p>
                                                      <p className="text-xs font-black uppercase text-emerald-600 tracking-[0.3em]">Archivo Soporte Cargado ({(currentValue as any).size})</p>
                                                   </div>
                                                </div>
                                              ) : (
                                                <>
                                                  <Upload size={72} className="text-slate-200 group-hover/drop:text-emerald-500 mb-6 transition-colors duration-500" />
                                                  <span className="text-[12px] font-black uppercase text-slate-400 tracking-[0.4em] text-center max-w-xs">Arrastre el archivo de evidencia digital</span>
                                                </>
                                              )}
                                           </label>
                                        </div>
                                      )}
                                   </div>
                                 );
                               })}
                            </div>
                            
                            {progress === 100 && fn.status !== 'Entregado' && (
                              <div className="mt-16 bg-slate-900 p-12 rounded-[50px] text-white flex flex-col md:flex-row items-center justify-between shadow-4xl animate-in slide-in-from-bottom-6 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                                 <div className="flex items-center gap-8 relative z-10">
                                    <div className="p-6 bg-emerald-500 text-white rounded-[32px] shadow-2xl animate-bounce">
                                       <Fingerprint size={48} />
                                    </div>
                                    <div>
                                       <h6 className="text-3xl font-brand font-black uppercase tracking-tighter">Informe Listo para Consignar</h6>
                                       <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300 opacity-80 mt-1">El documento será archivado oficialmente al reportar</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-4 relative z-10 mt-8 md:mt-0">
                                    <button onClick={() => setShowEvidenceForm(null)} className="px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Pausar Proceso</button>
                                    <button 
                                      onClick={() => setIsPreviewingPDF(fn.id)}
                                      className="bg-emerald-500 text-white px-12 py-6 rounded-[35px] font-black text-xs uppercase tracking-[0.3em] shadow-3xl hover:bg-emerald-600 hover:scale-105 transition-all flex items-center gap-4 ring-8 ring-emerald-500/10"
                                    >
                                       <Printer size={22} /> Visualizar Informe Previo
                                    </button>
                                 </div>
                              </div>
                            )}
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherFunctions;
