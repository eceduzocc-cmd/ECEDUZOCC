
import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Sparkles, 
  BrainCircuit, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight,
  ChevronRight,
  FileSearch,
  Zap,
  Award
} from 'lucide-react';
import { QualityFactor } from '../types';
import { geminiService } from '../services/geminiService';

const MOCK_FACTORS: QualityFactor[] = [
  { id: 1, name: "Misión y Proyecto Institucional", progress: 95, status: 'Cumplido', evidenceCount: 14 },
  { id: 2, name: "Estudiantes", progress: 88, status: 'En Proceso', evidenceCount: 22 },
  { id: 3, name: "Profesores", progress: 92, status: 'Cumplido', evidenceCount: 31 },
  { id: 4, name: "Procesos Académicos", progress: 75, status: 'En Proceso', evidenceCount: 18 },
  { id: 5, name: "Investigación e Innovación", progress: 62, status: 'En Proceso', evidenceCount: 9 },
  { id: 6, name: "Impacto Social y Extensión", progress: 45, status: 'Crítico', evidenceCount: 5 },
  { id: 7, name: "Recursos Físicos y Financieros", progress: 85, status: 'Cumplido', evidenceCount: 12 },
];

const QualityManagement: React.FC = () => {
  const [selectedFactor, setSelectedFactor] = useState<QualityFactor | null>(null);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Fix: Implemented generateAIDraft using Gemini to assist with accreditation reporting
  const generateAIDraft = async (factor: QualityFactor) => {
    setLoadingAi(true);
    setAiDraft(null);
    try {
      const prompt = `Actúa como un experto en acreditación universitaria CNA (Colombia). 
      Genera un borrador de informe de autoevaluación para el factor: "${factor.name}". 
      El progreso actual es del ${factor.progress}% con ${factor.evidenceCount} evidencias registradas. 
      Estructura el informe en: 1. Estado de cumplimiento, 2. Fortalezas detectadas, 3. Plan de mejoramiento. 
      Usa un lenguaje formal y académico.`;
      const result = await geminiService.askEducationalAssistant(prompt);
      setAiDraft(result);
    } catch (e) {
      console.error("Quality AI Error:", e);
      setAiDraft("Error al conectar con el motor de IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">Control de <span className="text-indigo-600">Acreditación</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Gestión de factores de alta calidad y reportes SNIES institucionales.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white px-8 py-4 rounded-[25px] font-black text-xs text-slate-600 shadow-sm border border-slate-100 flex items-center gap-3 hover:shadow-xl transition-all">
              <FileSearch size={18} /> Auditoría Interna
           </button>
           <button className="bg-slate-900 text-white px-8 py-4 rounded-[25px] font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-emerald-600 transition-all">
              <Award size={20} /> Certificar Calidad
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
             <div className="relative z-10">
                <h3 className="text-lg font-brand font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                   <BarChart3 size={20} className="text-indigo-500" /> Factores de Calidad
                </h3>
                <div className="space-y-3">
                   {MOCK_FACTORS.map(factor => (
                     <button 
                       key={factor.id}
                       onClick={() => { setSelectedFactor(factor); setAiDraft(null); }}
                       className={`w-full text-left p-5 rounded-[30px] border-2 transition-all group ${
                         selectedFactor?.id === factor.id 
                         ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' 
                         : 'bg-slate-50 border-transparent hover:border-indigo-100'
                       }`}
                     >
                        <div className="flex items-center justify-between mb-3">
                           <span className={`text-[9px] font-black uppercase tracking-widest ${
                             selectedFactor?.id === factor.id ? 'text-indigo-300' : 'text-slate-400'
                           }`}>Factor 0{factor.id}</span>
                           {factor.status === 'Cumplido' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                        </div>
                        <h4 className="font-bold text-sm leading-tight mb-4">{factor.name}</h4>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${
                                  factor.progress > 90 ? 'bg-emerald-500' : factor.progress > 60 ? 'bg-indigo-500' : 'bg-rose-500'
                                }`} 
                                style={{ width: `${factor.progress}%` }}
                              ></div>
                           </div>
                           <span className="text-[10px] font-black">{factor.progress}%</span>
                        </div>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedFactor ? (
            <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
               <div className="bg-white rounded-[50px] border border-slate-100 shadow-xl overflow-hidden">
                  <div className="mesh-gradient p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/10 rounded-[35px] flex items-center justify-center text-white border border-white/20 shadow-2xl backdrop-blur-md">
                           <Layers size={40} />
                        </div>
                        <div>
                           <h2 className="text-3xl font-brand font-black tracking-tighter uppercase leading-none">{selectedFactor.name}</h2>
                           <p className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em] mt-3">Rastreo de Evidencias SNIES</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => generateAIDraft(selectedFactor)}
                       disabled={loadingAi}
                       className="bg-white text-slate-900 px-8 py-5 rounded-[30px] font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                     >
                        {loadingAi ? <Zap className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                        Generar Autoevaluación AI
                     </button>
                  </div>

                  <div className="p-12 space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex flex-col items-center text-center">
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Evidencias Cargadas</p>
                           <h4 className="text-4xl font-brand font-black text-slate-900">{selectedFactor.evidenceCount}</h4>
                           <button className="text-[10px] font-black uppercase text-indigo-600 mt-4 flex items-center gap-2 hover:gap-3 transition-all">Ver Galería <ArrowUpRight size={14} /></button>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex flex-col items-center text-center">
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Estado CNA</p>
                           <div className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${
                             selectedFactor.status === 'Cumplido' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                           }`}>{selectedFactor.status}</div>
                           <p className="text-[11px] font-medium text-slate-500 mt-4">Próxima auditoría: Dic 2024</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex flex-col items-center text-center">
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Score de Riesgo</p>
                           <h4 className={`text-4xl font-brand font-black ${selectedFactor.progress > 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                             {100 - selectedFactor.progress}%
                           </h4>
                           <p className="text-[11px] font-medium text-slate-500 mt-4">Probabilidad de observación baja</p>
                        </div>
                     </div>

                     {aiDraft && (
                       <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[50px] p-12 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                          <div className="absolute -right-10 -top-10 text-indigo-100 opacity-20"><BrainCircuit size={180} /></div>
                          <div className="flex items-center gap-4 mb-8 relative z-10">
                             <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-xl border border-indigo-100"><Sparkles size={24} /></div>
                             <h4 className="text-xl font-brand font-black text-indigo-900 uppercase tracking-tighter">Borrador de Autoevaluación Generado</h4>
                          </div>
                          <div className="prose prose-indigo max-w-none text-indigo-800 font-medium relative z-10 text-sm leading-relaxed">
                             {aiDraft.split('\n').map((line, i) => (
                               <p key={i} className="mb-4">{line}</p>
                             ))}
                          </div>
                          <div className="flex justify-end gap-4 mt-10 relative z-10">
                             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-indigo-200 rounded-2xl text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                                <FileText size={16} /> Exportar a PDF
                             </button>
                             <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all shadow-xl">
                                <ShieldCheck size={16} /> Radicar en SNIES
                             </button>
                          </div>
                       </div>
                     )}

                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="font-brand font-black text-lg text-slate-800 uppercase tracking-tighter">Historial de Evidencias</h3>
                           <button className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-2">
                              Ver Todo <ChevronRight size={14} />
                           </button>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                              <div className="flex items-center gap-4">
                                 <div className="p-2 bg-white rounded-xl shadow-sm"><FileText size={18} /></div>
                                 <div>
                                    <p className="text-xs font-bold text-slate-800">Informe de Autoevaluación 2023</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Aprobado por Consejo Académico</p>
                                 </div>
                              </div>
                              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><ChevronRight size={18} /></button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-4 border-dashed border-slate-100 rounded-[50px] flex flex-col items-center justify-center p-20 text-center">
               <ClipboardCheck size={64} className="text-slate-200 mb-6" />
               <p className="text-slate-400 font-brand font-black text-sm uppercase tracking-[0.3em]">Seleccione un factor de calidad para iniciar el proceso de autoevaluación</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityManagement;
