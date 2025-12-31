
import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Search, 
  Sparkles, 
  XCircle, 
  UserCheck, 
  Target, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Layout,
  Layers,
  Info,
  // Fix: Added missing FolderOpen import
  FolderOpen
} from 'lucide-react';
import { AcademicPeriod, Teacher, MasterFunction, AssignedFunction } from '../types';

interface AssignmentsProps {
  periods: AcademicPeriod[];
  teachers: Teacher[];
  masterFunctionsBank: MasterFunction[];
  assignedFunctions: AssignedFunction[];
  setAssignedFunctions: React.Dispatch<React.SetStateAction<AssignedFunction[]>>;
}

const Assignments: React.FC<AssignmentsProps> = ({ 
  periods, 
  teachers, 
  masterFunctionsBank, 
  assignedFunctions, 
  setAssignedFunctions 
}) => {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(periods[0]?.id || null);
  const [isAssigning, setIsAssigning] = useState(false);
  
  const [newAssignment, setNewAssignment] = useState<Partial<AssignedFunction>>({
    teacherId: '',
    masterFunctionId: '',
    description: ''
  });

  const handleAssign = () => {
    if (!newAssignment.teacherId || !newAssignment.masterFunctionId || !selectedPeriodId) {
      alert("Complete los datos de asignación.");
      return;
    }
    const masterFn = masterFunctionsBank.find(mf => mf.id === newAssignment.masterFunctionId);
    const assignment: AssignedFunction = {
      id: `f-${Date.now()}`,
      periodId: selectedPeriodId,
      teacherId: newAssignment.teacherId!,
      masterFunctionId: newAssignment.masterFunctionId!,
      name: masterFn?.name || 'Función Institucional',
      description: newAssignment.description || masterFn?.description || '',
      category: masterFn?.category, // Herencia del destino documental
      status: 'Pendiente',
      pdiMappings: masterFn?.pdiMappings,
      substantiveFunctions: masterFn?.substantiveFunctions,
      contractualGeneral: masterFn?.contractualGeneral,
      contractualDirector: masterFn?.contractualDirector,
      contractualLeader: masterFn?.contractualLeader,
      evidenceSchema: masterFn?.evidenceSchema
    };

    setAssignedFunctions([...assignedFunctions, assignment]);
    setIsAssigning(false);
    setNewAssignment({ teacherId: '', masterFunctionId: '', description: '' });
  };

  const selectedPeriod = periods.find(p => p.id === selectedPeriodId);
  const currentAssignedFunctions = assignedFunctions.filter(f => f.periodId === selectedPeriodId);
  const eligibleTeachers = teachers.filter(t => selectedPeriod?.participatingTeacherIds.includes(t.id));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Operativa Académica</span>
            <Sparkles size={16} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-none">Asignaciones por <span className="text-emerald-600">Ciclo</span></h1>
          <p className="text-slate-500 font-medium mt-2">Vincule el banco de funciones a la nómina activa de cada periodo.</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:border-emerald-500 transition-all shadow-sm"
            value={selectedPeriodId || ''}
            onChange={(e) => setSelectedPeriodId(e.target.value)}
          >
            {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button 
            onClick={() => setIsAssigning(true)}
            className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all"
          >
            <Plus size={20} /> Vincular Función
          </button>
        </div>
      </div>

      {isAssigning && (
        <div className="bg-white rounded-[40px] border-2 border-emerald-500 p-10 shadow-2xl animate-in zoom-in-95">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">Asignar del Banco Maestro</h2>
              <button onClick={() => setIsAssigning(false)}><XCircle className="text-slate-400" size={24} /></button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">1. Docente Activado en Periodo</label>
                 <select className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-4 px-5 text-sm font-bold outline-none" value={newAssignment.teacherId} onChange={(e) => setNewAssignment({...newAssignment, teacherId: e.target.value})}>
                    <option value="">Seleccione Docente...</option>
                    {eligibleTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">2. Función Estratégica</label>
                 <select className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-4 px-5 text-sm font-bold outline-none" value={newAssignment.masterFunctionId} onChange={(e) => setNewAssignment({...newAssignment, masterFunctionId: e.target.value})}>
                    <option value="">Seleccione del Banco...</option>
                    {masterFunctionsBank.map(mf => <option key={mf.id} value={mf.id}>{mf.name}</option>)}
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">3. Notas de Asignación</label>
                 <textarea placeholder="Observaciones para el docente..." className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-3 px-5 text-xs font-bold outline-none resize-none" rows={2} value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})} />
              </div>
           </div>
           <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end gap-4">
              <button onClick={handleAssign} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl">Confirmar Vínculo</button>
           </div>
        </div>
      )}

      {selectedPeriod ? (
        <div className="bg-white rounded-[50px] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-10 mesh-gradient text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[28px] bg-white/20 flex items-center justify-center text-white border border-white/30 shadow-xl">
                    <Layers size={32} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-brand font-black tracking-tighter uppercase">{selectedPeriod.name}</h3>
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Bloque de Gestión Académica</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
                 <Info size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">{currentAssignedFunctions.length} Funciones en Proceso</span>
              </div>
           </div>

           <div className="p-10 space-y-6">
              {currentAssignedFunctions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {currentAssignedFunctions.map(fn => {
                    const teacher = teachers.find(t => t.id === fn.teacherId);
                    return (
                      <div key={fn.id} className="p-8 bg-slate-50/50 rounded-[35px] border border-slate-100 hover:border-emerald-200 transition-all flex flex-col md:flex-row items-center justify-between gap-8 group">
                         <div className="flex items-center gap-6 flex-1">
                            <img src={teacher?.imageUrl} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
                            <div className="space-y-1">
                               <div className="flex flex-wrap items-center gap-3">
                                  <h4 className="font-brand font-black text-lg text-slate-800 tracking-tighter uppercase">{fn.name}</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {fn.substantiveFunctions?.map(f => (
                                      <span key={f} className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{f}</span>
                                    ))}
                                  </div>
                               </div>
                               <p className="text-sm font-bold text-slate-500">Docente: <span className="text-slate-800">{teacher?.name}</span></p>
                               {fn.category && (
                                 <div className="flex items-center gap-2 text-[9px] text-cyan-600 font-black uppercase tracking-widest mt-2 px-3 py-1 bg-cyan-50 rounded-lg w-fit">
                                    <FolderOpen size={12} /> Destino: {fn.category}
                                 </div>
                               )}
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${fn.status === 'Entregado' ? 'bg-emerald-500 text-white' : 'bg-white text-orange-500 border border-orange-100'}`}>
                               {fn.status === 'Entregado' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                               {fn.status}
                            </div>
                            <button className="p-4 bg-white text-slate-400 rounded-2xl border border-slate-200 hover:text-red-500 transition-all"><MoreVertical size={20} /></button>
                         </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-300 italic font-black text-xs uppercase tracking-widest">Sin asignaciones en este bloque</div>
              )}
           </div>
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center text-slate-300 font-black uppercase border-4 border-dashed rounded-[50px]">Cree periodos en el Módulo Maestro</div>
      )}
    </div>
  );
};

export default Assignments;
