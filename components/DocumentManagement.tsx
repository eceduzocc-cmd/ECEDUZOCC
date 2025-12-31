
import React, { useState } from 'react';
import { 
  Folder, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  FileText, 
  Download, 
  Calendar, 
  User, 
  ShieldCheck, 
  History, 
  MoreVertical,
  Filter,
  Layers,
  Sparkles,
  FileCheck,
  Briefcase,
  GraduationCap,
  ClipboardList,
  Zap,
  HardDrive,
  FolderOpen
} from 'lucide-react';
import { AssignedFunction, Teacher, AcademicPeriod } from '../types';

const FOLDERS = [
  { id: 'f1', name: "Informes de eventos institucionales", icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'f2', name: "Informes de balance de gestión", icon: History, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'f3', name: "Programas académicos formales", icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'f4', name: "Actas de modificación de calificaciones", icon: FileCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'f5', name: "Procesos de prácticas formativas a través de medios sincrónicos y asincrónicos", icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'f6', name: "Convenios o alianzas sin erogación presupuestal", icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'f7', name: "Proyectos de investigación", icon: HardDrive, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'f8', name: "Actas de reuniones del Sistema Nacional de Educación Permanente (SINEP)", icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-50' }
];

interface DocumentManagementProps {
  assignedFunctions: AssignedFunction[];
  teachers: Teacher[];
  periods: AcademicPeriod[];
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ 
  assignedFunctions, 
  teachers, 
  periods 
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedFolder = FOLDERS.find(f => f.id === selectedFolderId);

  // Filtrar evidencias por la categoría de la carpeta seleccionada
  const folderDocuments = assignedFunctions.filter(fn => 
    selectedFolder && fn.category === selectedFolder.name && fn.status === 'Entregado'
  );

  const filteredDocs = folderDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teachers.find(t => t.id === doc.teacherId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">Sistema Nacional de Archivo</span>
            <Folder className="text-indigo-500" size={18} />
          </div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">Gestión <span className="text-indigo-600">Documental</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Bóveda centralizada de evidencias y registros institucionales.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative w-64 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar documento o autor..." 
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
              <Filter size={20} />
           </button>
        </div>
      </div>

      {!selectedFolderId ? (
        /* VISTA DE CARPETAS (8 CATEGORÍAS) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FOLDERS.map((folder, idx) => (
            <button 
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              style={{ animationDelay: `${idx * 50}ms` }}
              className="group bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 text-left flex flex-col justify-between h-80 relative overflow-hidden animate-in zoom-in-95"
            >
              <div className={`absolute -right-4 -top-4 w-32 h-32 ${folder.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="relative z-10">
                <div className={`p-5 rounded-[28px] ${folder.bg} ${folder.color} w-fit mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <folder.icon size={32} />
                </div>
                <h3 className="text-xl font-brand font-black text-slate-800 leading-tight uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
                  {folder.name}
                </h3>
              </div>
              
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-50">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Evidencias</span>
                    <span className="text-lg font-brand font-black text-slate-900 leading-none">
                       {assignedFunctions.filter(fn => fn.category === folder.name && fn.status === 'Entregado').length}
                    </span>
                 </div>
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl transition-all">
                    <ChevronRight size={24} />
                 </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* VISTA DE DOCUMENTOS DENTRO DE UNA CARPETA */
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedFolderId(null)}
              className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group"
            >
              <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:-translate-x-1 transition-transform">
                 <ArrowLeft size={18} />
              </div>
              Regresar al Repositorio
            </button>
            <div className={`px-8 py-3 rounded-2xl ${selectedFolder?.bg} ${selectedFolder?.color} text-[10px] font-black uppercase tracking-widest shadow-sm`}>
               Categoría: {selectedFolder?.name}
            </div>
          </div>

          <div className="bg-white rounded-[55px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-10 mesh-gradient text-white flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="p-5 bg-white/20 rounded-3xl border border-white/30 shadow-2xl">
                      {selectedFolder && <selectedFolder.icon size={32} />}
                   </div>
                   <div>
                      <h2 className="text-3xl font-brand font-black tracking-tighter uppercase leading-none">{selectedFolder?.name}</h2>
                      <p className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em] mt-2">Documentos Verificados por el Metasistema</p>
                   </div>
                </div>
             </div>

             <div className="p-6">
                <div className="overflow-hidden">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-50">
                            <th className="px-8 py-6">Nombre del Documento</th>
                            <th className="px-8 py-6">Autor (Docente)</th>
                            <th className="px-8 py-6">Ciclo Académico</th>
                            <th className="px-8 py-6">Fecha Reporte</th>
                            <th className="px-8 py-6 text-right">Acciones</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {filteredDocs.map(doc => {
                           const teacher = teachers.find(t => t.id === doc.teacherId);
                           const period = periods.find(p => p.id === doc.periodId);
                           return (
                             <tr key={doc.id} className="group hover:bg-slate-50/50 transition-all">
                                <td className="px-8 py-8">
                                   <div className="flex items-center gap-4">
                                      <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl shadow-sm">
                                         <FileText size={20} />
                                      </div>
                                      <div>
                                         <p className="font-brand font-black text-slate-800 text-sm tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{doc.name}</p>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{doc.masterFunctionId}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-8">
                                   <div className="flex items-center gap-3">
                                      <img src={teacher?.imageUrl} className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-white" />
                                      <span className="text-sm font-bold text-slate-600">{teacher?.name}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-8">
                                   <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">{period?.name}</span>
                                </td>
                                <td className="px-8 py-8">
                                   <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                      <Calendar size={14} /> 12 OCT 2024
                                   </div>
                                </td>
                                <td className="px-8 py-8 text-right">
                                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl shadow-sm transition-all" title="Descargar Evidencia">
                                         <Download size={18} />
                                      </button>
                                      <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl shadow-sm transition-all">
                                         <MoreVertical size={18} />
                                      </button>
                                   </div>
                                </td>
                             </tr>
                           );
                         })}
                         {filteredDocs.length === 0 && (
                           <tr>
                              <td colSpan={5} className="py-24 text-center">
                                 <div className="flex flex-col items-center gap-4 grayscale opacity-30">
                                    <FolderOpen size={64} className="text-slate-200" />
                                    <p className="font-brand font-black uppercase text-xs tracking-[0.3em] text-slate-400">Sin documentos en esta categoría</p>
                                 </div>
                              </td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
