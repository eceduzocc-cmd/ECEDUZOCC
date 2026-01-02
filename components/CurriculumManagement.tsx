
import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Search, 
  Plus, 
  Layers, 
  GraduationCap, 
  Zap, 
  FileText,
  AlertCircle,
  BrainCircuit,
  Globe,
  Award
} from 'lucide-react';
import { Program, Course } from '../types';
import { geminiService } from '../services/geminiService';

const MOCK_PROGRAMS: Program[] = [
  {
    id: 'p1',
    name: 'Licenciatura en Pedagogía Infantil',
    level: 'Grado',
    modality: 'Virtual',
    totalCredits: 156,
    snies: '102345',
    description: 'Formación de líderes pedagógicos para la primera infancia con enfoque inclusivo.',
    courses: [
      { id: 'c1', name: 'Fundamentos de Pedagogía', credits: 3, type: 'Teórico', semester: 1 },
      { id: 'c2', name: 'Cátedra Unadista', credits: 2, type: 'Metodológico', semester: 1 },
      { id: 'c3', name: 'Psicología del Desarrollo', credits: 3, type: 'Teórico', semester: 2 },
      { id: 'c4', name: 'Práctica Formativa I', credits: 4, type: 'Práctico', semester: 5 }
    ]
  },
  {
    id: 'p2',
    name: 'Maestría en Educación con TIC',
    level: 'Posgrado',
    modality: 'Virtual',
    totalCredits: 48,
    snies: '54890',
    description: 'Especialización en la integración de tecnologías emergentes en procesos educativos.',
    courses: [
      { id: 'm1', name: 'Ambientes Virtuales de Aprendizaje', credits: 4, type: 'Metodológico', semester: 1 },
      { id: 'm2', name: 'Seminario de Investigación I', credits: 6, type: 'Práctico', semester: 2 }
    ]
  }
];

const CurriculumManagement: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleAIInsight = async (program: Program) => {
    setAiLoading(true);
    setAiInsight(null);
    try {
      const prompt = `Analiza el programa académico "${program.name}" (${program.level}). 
      Contiene cursos como: ${program.courses.map(c => c.name).join(', ')}.
      Sugerencias de actualización curricular basadas en tendencias educativas 2025 (IA, neuroeducación, gamificación). 
      Responde con 3 puntos clave y un párrafo de recomendación estratégica.`;
      const result = await geminiService.askEducationalAssistant(prompt);
      setAiInsight(result);
    } catch (e) {
      setAiInsight("Error al generar insight curricular.");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredPrograms = MOCK_PROGRAMS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase">Curriculum <span className="text-indigo-600">Hub</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Gestión estratégica de programas y actualización pedagógica con IA.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar programa..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
            <Plus size={20} /> Nuevo Programa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          {filteredPrograms.map(program => (
            <button 
              key={program.id}
              onClick={() => { setSelectedProgram(program); setAiInsight(null); }}
              className={`w-full text-left p-8 rounded-[40px] border-2 transition-all duration-500 group relative overflow-hidden ${
                selectedProgram?.id === program.id 
                ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' 
                : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'
              }`}
            >
              <div className="relative z-10">
                <div className={`p-4 rounded-2xl w-fit mb-6 shadow-lg ${
                  selectedProgram?.id === program.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-brand font-black tracking-tighter uppercase leading-tight mb-2">
                  {program.name}
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                   <span>SNIES: {program.snies}</span>
                   <span>•</span>
                   <span>{program.totalCredits} Créditos</span>
                </div>
              </div>
              <ChevronRight size={24} className={`absolute right-8 top-1/2 -translate-y-1/2 transition-all ${
                selectedProgram?.id === program.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          {selectedProgram ? (
            <div className="bg-white rounded-[50px] border border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-right-10">
               <div className="mesh-gradient p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h2 className="text-3xl font-brand font-black tracking-tighter uppercase">{selectedProgram.name}</h2>
                    <p className="text-indigo-100 mt-2 font-medium max-w-lg">{selectedProgram.description}</p>
                  </div>
                  <button 
                    onClick={() => handleAIInsight(selectedProgram)}
                    disabled={aiLoading}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all disabled:opacity-50"
                  >
                    {aiLoading ? <Zap className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                    Gemini Insights
                  </button>
               </div>

               <div className="p-12 space-y-10">
                  {aiInsight && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-[40px] p-10 animate-in zoom-in-95">
                       <div className="flex items-center gap-4 mb-6">
                          <Sparkles className="text-indigo-600" size={28} />
                          <h4 className="font-brand font-black text-xl text-indigo-900 uppercase tracking-tighter">Recomendación Estratégica AI</h4>
                       </div>
                       <div className="prose prose-indigo max-w-none text-indigo-800 font-medium">
                          {aiInsight.split('\n').map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                       <h3 className="font-brand font-black text-xl text-slate-800 uppercase tracking-tighter">Malla Curricular <span className="text-slate-400 font-medium">(Muestra)</span></h3>
                       <div className="flex gap-2">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase">Activo</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {selectedProgram.courses.map(course => (
                         <div key={course.id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-indigo-300 transition-all group">
                            <div className="flex items-center gap-5">
                               <div className={`p-3 rounded-2xl ${
                                 course.type === 'Teórico' ? 'bg-blue-50 text-blue-600' : 
                                 course.type === 'Práctico' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                               }`}>
                                  <BookOpen size={20} />
                               </div>
                               <div>
                                  <p className="font-black text-slate-800 text-sm uppercase leading-tight group-hover:text-indigo-600 transition-colors">{course.name}</p>
                                  <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                                     <span>{course.credits} Créditos</span>
                                     <span>•</span>
                                     <span>Semestre {course.semester}</span>
                                  </div>
                               </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase bg-white px-3 py-1 rounded-lg border border-slate-100">{course.type}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all">
                        <FileText size={16} /> Descargar Malla PDF
                     </button>
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all">
                        <Award size={16} /> Ver Registro Calificado
                     </button>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-4 border-dashed border-slate-100 rounded-[50px] flex flex-col items-center justify-center p-20 text-center">
               <Layers size={64} className="text-slate-200 mb-6" />
               <p className="text-slate-400 font-brand font-black text-sm uppercase tracking-[0.3em]">Seleccione un programa académico para visualizar la arquitectura curricular</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumManagement;
