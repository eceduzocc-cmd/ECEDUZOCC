
import React from 'react';
import { UserPlus, Star, Award, BookOpen, ChevronRight } from 'lucide-react';
import { Teacher } from '../types';

const mockTeachers: Teacher[] = [
  // Fix: Added missing properties identityCard, center, email, and isActive to satisfy the Teacher interface
  { 
    id: '1', 
    name: 'Dr. Fernando Ruiz', 
    identityCard: '10928374',
    center: 'Centro de Innovación Educativa',
    specialty: 'Neuroeducación', 
    department: 'Ciencias Básicas', 
    email: 'fruiz@edu.co',
    courses: ['Psicobiología', 'Desarrollo Cognitivo'], 
    imageUrl: 'https://picsum.photos/seed/fernando/200', 
    rating: 4.9, 
    hoursPerWeek: 32, 
    status: 'Carga Completa',
    isActive: true
  },
  // Fix: Added missing properties identityCard, center, email, and isActive to satisfy the Teacher interface
  { 
    id: '2', 
    name: 'Msc. Elena Torres', 
    identityCard: '22837465',
    center: 'Facultad de Artes',
    specialty: 'Educación Inclusiva', 
    department: 'Pedagogía', 
    email: 'etorres@edu.co',
    courses: ['Diseño Universal', 'Inclusión'], 
    imageUrl: 'https://picsum.photos/seed/elena/200', 
    rating: 4.8, 
    hoursPerWeek: 20, 
    status: 'Disponible',
    isActive: true
  },
  // Fix: Added missing properties identityCard, center, email, and isActive to satisfy the Teacher interface
  { 
    id: '3', 
    name: 'Lic. Roberto Diaz', 
    identityCard: '33948576',
    center: 'Centro de Tecnología',
    specialty: 'Tics en Educación', 
    department: 'Tecnología', 
    email: 'rdiaz@edu.co',
    courses: ['Alfabetización Digital', 'Software Educativo'], 
    imageUrl: 'https://picsum.photos/seed/roberto/200', 
    rating: 4.7, 
    hoursPerWeek: 15, 
    status: 'Disponible',
    isActive: false
  },
  // Fix: Added missing properties identityCard, center, email, and isActive to satisfy the Teacher interface
  { 
    id: '4', 
    name: 'Dra. Isabel Luna', 
    identityCard: '44059687',
    center: 'Facultad de Pedagogía',
    specialty: 'Didáctica de la Ciencia', 
    department: 'Pedagogía', 
    email: 'iluna@edu.co',
    courses: ['Laboratorio Pedagógico'], 
    imageUrl: 'https://picsum.photos/seed/isabel/200', 
    rating: 5.0, 
    hoursPerWeek: 40, 
    status: 'Carga Completa',
    isActive: true
  },
];

const Teachers: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-brand font-bold text-slate-900">Directorio Docente</h1>
          <p className="text-slate-500">Expertos liderando el futuro de la educación.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
          <UserPlus size={20} />
          Vincular Docente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img src={teacher.imageUrl} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-emerald-600 flex items-center gap-1 shadow-sm">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-bold">{teacher.rating}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{teacher.department}</p>
                <h3 className="text-lg font-bold text-white">{teacher.name}</h3>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Award size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600 font-medium">{teacher.specialty}</span>
              </div>
              
              <div className="space-y-3 mb-6 flex-1">
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase">
                  <BookOpen size={14} /> Cursos actuales
                </p>
                <div className="flex flex-wrap gap-2">
                  {teacher.courses.map(course => (
                    <span key={course} className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full group/btn flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-colors">
                Ver Hoja de Vida
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
