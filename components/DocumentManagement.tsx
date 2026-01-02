
import React, { useState, useEffect } from 'react';
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
  FolderOpen,
  LayoutTemplate,
  PenTool,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Save,
  Eye,
  Type,
  Maximize2,
  MapPin,
  Tag,
  Palette,
  Target,
  Award
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
  const [activeMode, setActiveMode] = useState<'vault' | 'format_assistant'>('vault');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formatConfig, setFormatConfig] = useState({
    reportTitle: localStorage.getItem('ece_pdf_reportTitle') || 'INFORME DE EVIDENCIAS Y GESTIÓN ACADÉMICA',
    universityName: localStorage.getItem('ece_pdf_universityName') || 'Universidad Nacional Abierta y a Distancia UNAD',
    schoolName: localStorage.getItem('ece_pdf_schoolName') || 'Escuela de Ciencias de la Educación',
    zoneName: localStorage.getItem('ece_pdf_zoneName') || 'Zona Occidente',
    headerLogo: localStorage.getItem('unad_header_logo') || '',
    footerLogos: localStorage.getItem('unad_footer_logos') || '',
  });

  const handleUpdateFormat = (key: string, value: string) => {
    setFormatConfig(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`ece_pdf_${key}`, value);
    if (key === 'headerLogo') localStorage.setItem('unad_header_logo', value);
    if (key === 'footerLogos') localStorage.setItem('unad_footer_logos', value);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'headerLogo' | 'footerLogos') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateFormat(type, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedFolder = FOLDERS.find(f => f.id === selectedFolderId);
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
            <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">Gestión de Activos</span>
            <Folder className="text-indigo-500" size={18} />
          </div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">
            {activeMode === 'vault' ? 'Bóveda' : 'Arquitecto de'} <span className="text-indigo-600">{activeMode === 'vault' ? 'Documental' : 'Informes'}</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {activeMode === 'vault' 
              ? 'Repositorio central de evidencias y registros institucionales.' 
              : 'Diseñe la papelería oficial para reportes de alta calidad académica.'}
          </p>
        </div>
        
        <div className="flex items-center bg-white p-1.5 rounded-[25px] border border-slate-100 shadow-sm">
           <button 
             onClick={() => setActiveMode('vault')}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'vault' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Bóveda
           </button>
           <button 
             onClick={() => setActiveMode('format_assistant')}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'format_assistant' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Asistente de Formatos
           </button>
        </div>
      </div>

      {activeMode === 'vault' ? (
        <>
          {!selectedFolderId ? (
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
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Registros</span>
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
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedFolderId(null)}
                  className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group"
                >
                  <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:-translate-x-1 transition-transform">
                     <ArrowLeft size={18} />
                  </div>
                  Volver al Directorio
                </button>
                <div className="relative w-full max-w-md group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
                   <input 
                     type="text" 
                     placeholder="Buscar en esta categoría..." 
                     className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
              </div>

              <div className="bg-white rounded-[55px] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className={`p-5 rounded-3xl ${selectedFolder?.bg} ${selectedFolder?.color} shadow-lg`}>
                          {selectedFolder && <selectedFolder.icon size={32} />}
                       </div>
                       <div>
                          <h2 className="text-3xl font-brand font-black tracking-tighter uppercase leading-none">{selectedFolder?.name}</h2>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Documentos Auditados</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-50">
                             <th className="px-8 py-6">Evidencia</th>
                             <th className="px-8 py-6">Autor</th>
                             <th className="px-8 py-6">Periodo</th>
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
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Informe Radicado</p>
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
                                 <td className="px-8 py-8 text-right">
                                    <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl shadow-sm transition-all" title="Descargar PDF">
                                       <Download size={18} />
                                    </button>
                                 </td>
                              </tr>
                            );
                          })}
                          {filteredDocs.length === 0 && (
                            <tr>
                               <td colSpan={4} className="py-24 text-center">
                                  <div className="flex flex-col items-center gap-4 grayscale opacity-30">
                                     <FolderOpen size={64} className="text-slate-200" />
                                     <p className="font-brand font-black uppercase text-xs tracking-[0.3em] text-slate-400">Carpeta vacía</p>
                                  </div>
                               </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ASISTENTE DE DISEÑO DE FORMATOS INSTITUCIONALES MEJORADO */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in-95 duration-700">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl space-y-10">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Palette size={24} /></div>
                 <div>
                    <h3 className="text-xl font-brand font-black text-slate-900 uppercase tracking-tighter">Papelería Maestra</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ajustes de Identidad Visual</p>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <Tag size={14} className="text-amber-500" /> Nombre del Informe
                  </label>
                  <input 
                    type="text" 
                    value={formatConfig.reportTitle}
                    onChange={(e) => handleUpdateFormat('reportTitle', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
                    placeholder="Ej. INFORME DE RADICACIÓN ECE"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <Type size={14} className="text-indigo-400" /> Entidad Principal
                  </label>
                  <input 
                    type="text" 
                    value={formatConfig.universityName}
                    onChange={(e) => handleUpdateFormat('universityName', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <Layers size={14} className="text-indigo-400" /> Escuela / Facultad
                  </label>
                  <input 
                    type="text" 
                    value={formatConfig.schoolName}
                    onChange={(e) => handleUpdateFormat('schoolName', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-400" /> Zona / Dependencia
                  </label>
                  <input 
                    type="text" 
                    value={formatConfig.zoneName}
                    onChange={(e) => handleUpdateFormat('zoneName', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                      <ImageIcon size={14} className="text-indigo-400" /> Encabezado
                    </label>
                    <div 
                      onClick={() => document.getElementById('header-upload')?.click()}
                      className={`border-2 border-dashed rounded-[30px] p-6 text-center cursor-pointer transition-all group h-32 flex flex-col items-center justify-center ${formatConfig.headerLogo ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}
                    >
                      <input type="file" id="header-upload" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'headerLogo')} />
                      {formatConfig.headerLogo ? (
                        <div className="flex flex-col items-center">
                           <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
                           <span className="text-[8px] font-black uppercase text-emerald-600">Actualizar</span>
                        </div>
                      ) : (
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest group-hover:text-indigo-600">Subir Logo</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                      <Briefcase size={14} className="text-indigo-400" /> Pie de Página
                    </label>
                    <div 
                      onClick={() => document.getElementById('footer-upload')?.click()}
                      className={`border-2 border-dashed rounded-[30px] p-6 text-center cursor-pointer transition-all group h-32 flex flex-col items-center justify-center ${formatConfig.footerLogos ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}
                    >
                      <input type="file" id="footer-upload" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'footerLogos')} />
                      {formatConfig.footerLogos ? (
                        <div className="flex flex-col items-center">
                           <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
                           <span className="text-[8px] font-black uppercase text-emerald-600">Actualizar</span>
                        </div>
                      ) : (
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest group-hover:text-indigo-600">Subir Sellos</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert("¡Identidad Visual Sincronizada! Todos los reportes PDF reflejarán este nuevo diseño.")}
                className="w-full bg-slate-900 text-white py-6 rounded-[30px] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
              >
                <Save size={18} /> Aplicar Identidad
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                 <Eye size={18} className="text-indigo-400" /> Mockup del Informe Estructurado
               </h3>
               <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
               </div>
            </div>

            <div className="bg-white w-full aspect-[1/1.41] shadow-4xl rounded-[10px] border border-slate-200 overflow-hidden flex flex-col p-[7%] relative">
               <div className="absolute inset-4 border border-slate-50 pointer-events-none"></div>
               
               <div className="mb-10 flex items-center">
                  <div className="flex flex-col gap-1 w-full">
                    {formatConfig.headerLogo ? (
                      <img src={formatConfig.headerLogo} className="h-14 object-contain self-start" />
                    ) : (
                      <div className="h-12 w-28 bg-slate-100 rounded-lg flex items-center justify-center text-[6px] font-black text-slate-300 uppercase tracking-widest">Logo Header</div>
                    )}
                  </div>
               </div>

               <div className="mb-10 text-center bg-[#004170]/5 p-6 rounded-[25px] border-l-[6px] border-[#ffb100]">
                  <h4 className="text-[14px] font-black text-[#004170] uppercase tracking-tighter">{formatConfig.reportTitle}</h4>
               </div>

               <div className="flex-1 space-y-8">
                  <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm">
                     <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#004170] border border-slate-100">
                        <User size={24} />
                     </div>
                     <div className="grid grid-cols-2 gap-x-12 flex-1">
                        <div>
                           <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Docente Titular (PIN)</p>
                           <p className="text-[10px] font-black text-slate-800">DR. ROBERTO VALENZUELA</p>
                        </div>
                        <div>
                           <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Identificación</p>
                           <p className="text-[10px] font-black text-slate-800">1.092.837.456</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Alineación Estratégica</p>
                     <div className="flex flex-wrap gap-2">
                        <div className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                           <Target size={10} /> Alineado PDI ✓
                        </div>
                        <div className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                           <Award size={10} /> Formación ✓
                        </div>
                        <div className="px-4 py-2 bg-purple-500 text-white rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                           <Sparkles size={10} /> Investigación ✓
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6 pt-6">
                     <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={12}/></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Evidencias Radicadas</p>
                     </div>
                     <div className="space-y-4">
                        {[1, 2].map(i => (
                          <div key={i} className="space-y-3 p-5 bg-white border border-slate-50 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
                             <div className="flex items-center justify-between">
                                <div className="h-2.5 w-40 bg-slate-100 rounded-full"></div>
                                <div className="h-2.5 w-10 bg-emerald-100 rounded-full"></div>
                             </div>
                             <div className="space-y-1.5">
                                <div className="h-2 w-full bg-slate-50 rounded"></div>
                                <div className="h-2 w-[85%] bg-slate-50 rounded"></div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="mt-auto pt-8 border-t border-slate-100 flex items-end justify-between gap-6">
                  <div className="flex-1 space-y-2">
                     <div className="text-left space-y-1 mb-4">
                        <p className="text-[8px] font-black text-[#004170] leading-none uppercase">{formatConfig.universityName}</p>
                        <p className="text-[7px] font-bold text-slate-700 leading-none">{formatConfig.schoolName}</p>
                        <p className="text-[6px] font-medium text-slate-400 leading-none">{formatConfig.zoneName}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <p className="text-[6px] text-slate-400 font-bold uppercase tracking-widest">Validación Criptográfica v5.0 Cloud Active</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {formatConfig.footerLogos ? (
                        <img src={formatConfig.footerLogos} className="h-12 object-contain" />
                      ) : (
                        <div className="h-12 w-32 bg-slate-50 rounded-xl flex items-center justify-center text-[7px] font-black text-slate-200 uppercase tracking-widest">Sellos de Calidad</div>
                      )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
