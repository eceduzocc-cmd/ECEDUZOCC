
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, GraduationCap, ArrowUpDown } from 'lucide-react';
import { Student } from '../types';

const mockStudents: Student[] = [
  { id: '1', name: 'Julian Alvarez', email: 'jalvarez@edu.co', career: 'Pedagogía Infantil', semester: 5, status: 'Activo', gpa: 4.5 },
  { id: '2', name: 'Sofia Vergara', email: 'svergara@edu.co', career: 'Lic. en Matemáticas', semester: 2, status: 'Pendiente', gpa: 3.8 },
  { id: '3', name: 'Carlos Sanchez', email: 'csanchez@edu.co', career: 'Psicopedagogía', semester: 8, status: 'Activo', gpa: 4.2 },
  { id: '4', name: 'Laura Martinez', email: 'lmartinez@edu.co', career: 'Pedagogía Infantil', semester: 4, status: 'Inactivo', gpa: 2.9 },
  { id: '5', name: 'Mateo Lopez', email: 'mlopez@edu.co', career: 'Lic. en Lenguas', semester: 1, status: 'Activo', gpa: 4.8 },
  { id: '6', name: 'Valeria Gomez', email: 'vgomez@edu.co', career: 'Psicopedagogía', semester: 3, status: 'Activo', gpa: 3.5 },
];

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-brand font-bold text-slate-900">Gestión de Estudiantes</h1>
          <p className="text-slate-500">Administra la información de los alumnos inscritos.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
          <Plus size={20} />
          Nuevo Estudiante
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={18} />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              <ArrowUpDown size={18} />
              Ordenar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">Carrera</th>
                <th className="px-6 py-4">Semestre</th>
                <th className="px-6 py-4">Promedio</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{student.career}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded-lg">{student.semester}°</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${student.gpa > 4 ? 'bg-emerald-500' : student.gpa > 3 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${(student.gpa/5)*100}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{student.gpa.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      student.status === 'Activo' ? 'bg-emerald-50 text-emerald-600' :
                      student.status === 'Pendiente' ? 'bg-orange-50 text-orange-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-colors shadow-sm" title="Contactar">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-colors shadow-sm" title="Ver Perfil">
                        <GraduationCap size={16} />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Mostrando {filteredStudents.length} de {mockStudents.length} estudiantes</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-emerald-600 text-white font-bold">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
