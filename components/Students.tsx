
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  GraduationCap, 
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  UserCheck,
  Zap,
  ShieldCheck,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Student } from '../types';

const mockStudents: Student[] = [
  { id: '1', name: 'Julian Alvarez', email: 'jalvarez@unad.edu.co', career: 'Pedagogía Infantil', semester: 5, status: 'Activo', gpa: 4.5, lastAccess: 'Hace 2 horas', alerts: 0 },
  { id: '2', name: 'Sofia Vergara', email: 'svergara@unad.edu.co', career: 'Lic. en Matemáticas', semester: 2, status: 'Pendiente', gpa: 3.8, lastAccess: 'Hace 5 días', alerts: 1 },
  { id: '3', name: 'Carlos Sanchez', email: 'csanchez@unad.edu.co', career: 'Psicopedagogía', semester: 8, status: 'Activo', gpa: 4.2, lastAccess: 'Hace 1 hora', alerts: 0 },
  { id: '4', name: 'Laura Martinez', email: 'lmartinez@unad.edu.co', career: 'Pedagogía Infantil', semester: 4, status: 'Inactivo', gpa: 2.9, lastAccess: 'Hace 2 semanas', alerts: 3 },
  { id: '5', name: 'Mateo Lopez', email: 'mlopez@unad.edu.co', career: 'Lic. en Lenguas', semester: 1, status: 'Activo', gpa: 4.8, lastAccess: 'En línea', alerts: 0 },
];

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">Gestión <span className="text-indigo-600">Estudiantil</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Seguimiento 360° y alertas tempranas de permanencia académica.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white px-8 py-4 rounded-3xl font-bold text-xs text-slate-600 shadow-sm border border-slate-100 flex items-center gap-3 hover:shadow-xl transition-all">
              <Calendar size={18} /> Reporte Mensual
           </button>
           <button className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-indigo-600 transition-all">
              <Plus size={20} /> Matricular Nuevo
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[40px] flex items-center justify-between group hover:shadow-lg transition-all">
           <div>
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Retención Semestral</p>
              <h3 className="text-3xl font-brand font-black text-slate-900 tracking-tighter">94.2%</h3>
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mt-2">
                 <TrendingUp size={16} /> +1.2% Vs anterior
              </div>
           </div>
           <div className="p-4 bg-white rounded-3xl text-emerald-500 shadow-sm"><UserCheck size={32} /></div>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-8 rounded-[40px] flex items-center justify-between group hover:shadow-lg transition-all">
           <div>
              <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest mb-1">Alertas Críticas</p>
              <h3 className="text-3xl font-brand font-black text-slate-900 tracking-tighter">12 Est.</h3>
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mt-2">
                 <TrendingDown size={16} /> Riesgo alto deserción
              </div>
           </div>
           <div className="p-4 bg-white rounded-3xl text-rose-500 shadow-sm"><AlertCircle size={32} /></div>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[40px] flex items-center justify-between group hover:shadow-lg transition-all">
           <div>
              <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1">Participación App</p>
              <h3 className="text-3xl font-brand font-black text-slate-900 tracking-tighter">86%</h3>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mt-2">
                 <Zap size={16} /> Campus Virtual 5.0
              </div>
           </div>
           <div className="p-4 bg-white rounded-3xl text-indigo-500 shadow-sm"><ShieldCheck size={32} /></div>
        </div>
      </div>

      <div className="bg-white rounded-[50px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap gap-6 items-center justify-between bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Nombre, ID o programa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50">
              <Filter size={18} /> Filtros
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50">
              <ArrowUpDown size={18} /> Ordenar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="px-10 py-6">Estudiante</th>
                <th className="px-10 py-6">Programa</th>
                <th className="px-10 py-6">GPA</th>
                <th className="px-10 py-6">Estatus Alerta</th>
                <th className="px-10 py-6">Último Acceso</th>
                <th className="px-10 py-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-brand font-black text-lg shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{student.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                       {student.career} • Sem {student.semester}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full transition-all duration-1000 ${student.gpa > 4 ? 'bg-emerald-500' : student.gpa > 3.5 ? 'bg-indigo-500' : 'bg-rose-500'}`} style={{ width: `${(student.gpa/5)*100}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-slate-800">{student.gpa.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    {student.alerts > 0 ? (
                       <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 w-fit animate-pulse">
                          <AlertCircle size={14} /> {student.alerts} Alertas
                       </div>
                    ) : (
                       <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 w-fit">
                          <ShieldCheck size={14} /> Sin Riesgos
                       </div>
                    )}
                  </td>
                  <td className="px-10 py-6">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.lastAccess}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                      <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all" title="Enviar Mensaje">
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 shadow-sm transition-all" title="Ver Expediente">
                        <GraduationCap size={18} />
                      </button>
                      <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span>{filteredStudents.length} Estudiantes Registrados</span>
          <div className="flex gap-3">
            <button className="px-6 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50">Anterior</button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30">1</button>
            <button className="px-6 py-2 border border-slate-200 rounded-xl hover:bg-slate-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
