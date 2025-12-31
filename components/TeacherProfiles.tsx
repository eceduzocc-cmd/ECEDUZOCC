
import React, { useState, useRef } from 'react';
import { 
  Award, 
  Search, 
  Plus, 
  ShieldAlert, 
  Building2, 
  IdCard, 
  Edit3, 
  Power, 
  MoreVertical,
  Mail,
  User,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Camera,
  Upload,
  Image as ImageIcon,
  Info
} from 'lucide-react';
import { Teacher } from '../types';

interface TeacherProfilesProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherProfiles: React.FC<TeacherProfilesProps> = ({ teachers, setTeachers }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const centers = [
    "CEAD MEDELLÍN",
    "CEAD LA DORADA",
    "CIP DOS QUEBRADAS",
    "CIP TURBO",
    "CIP SANTA FE DE ANTIOQUIA",
    "CCAV QUIBDÓ",
    "UDR LA TEBAIDA"
  ];

  // Estado para el nuevo docente
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '',
    identityCard: '',
    center: '',
    specialty: 'Docente de Planta',
    email: '',
    isActive: true,
    status: 'Disponible',
    hoursPerWeek: 0,
    rating: 5.0,
    courses: [],
    imageUrl: '' // Inicialmente vacío para obligar o permitir carga
  });

  const toggleStatus = (id: string) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTeacher({ ...newTeacher, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!newTeacher.name || !newTeacher.identityCard || !newTeacher.center || !newTeacher.email) {
      alert("Por favor complete los campos obligatorios: Nombre, Identidad, Centro y Correo.");
      return;
    }

    const finalImageUrl = newTeacher.imageUrl || `https://picsum.photos/seed/${Math.random()}/500`;

    const teacherToAdd: Teacher = {
      ...newTeacher as Teacher,
      imageUrl: finalImageUrl,
      id: (teachers.length + 1).toString(),
      department: 'Pedagogía', 
    };

    setTeachers([...teachers, teacherToAdd]);
    setIsCreating(false);
    setNewTeacher({
      name: '',
      identityCard: '',
      center: '',
      specialty: 'Docente de Planta',
      email: '',
      isActive: true,
      status: 'Disponible',
      hoursPerWeek: 0,
      rating: 5.0,
      courses: [],
      imageUrl: ''
    });
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.identityCard.includes(searchTerm)
  );

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
        <button 
          onClick={() => setIsCreating(false)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Volver al Directorio
        </button>

        <div className="bg-white rounded-[50px] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="mesh-gradient p-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-full bg-white/10 skew-x-12 transform translate-x-20"></div>
            <h2 className="text-4xl font-brand font-black tracking-tighter uppercase mb-2">Crear Perfil Docente</h2>
            <p className="text-indigo-100 font-medium opacity-80 uppercase text-[10px] tracking-[0.3em]">Registro Oficial de Identidad Académica</p>
          </div>

          <div className="p-12 space-y-12">
            {/* Sección de Imagen del Docente */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Camera size={20} />
                </div>
                <h3 className="font-brand font-black text-xl text-slate-800 tracking-tight uppercase">Fotografía de Perfil</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-48 h-48 rounded-[40px] border-4 border-dashed cursor-pointer overflow-hidden group transition-all flex flex-col items-center justify-center text-center p-4 ${
                    newTeacher.imageUrl 
                    ? 'border-indigo-200 bg-slate-50' 
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-400'
                  }`}
                >
                  {newTeacher.imageUrl ? (
                    <>
                      <img src={newTeacher.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white" size={32} />
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="text-slate-300 group-hover:text-indigo-400 mb-2 transition-colors" size={40} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Click para subir foto</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex gap-4 items-start">
                    <Info className="text-indigo-500 shrink-0 mt-1" size={20} />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-indigo-900">Instrucciones de Imagen:</p>
                      <ul className="text-xs text-indigo-700/80 font-medium space-y-1 list-disc pl-4">
                        <li>Dimensiones recomendadas: <span className="font-black">500 x 500 píxeles</span>.</li>
                        <li>Relación de aspecto ideal: <span className="font-black">1:1 (Cuadrada)</span>.</li>
                        <li>Formatos permitidos: JPG, PNG o WEBP.</li>
                        <li>Asegúrese de que el rostro esté centrado para evitar recortes.</li>
                      </ul>
                    </div>
                  </div>
                  {newTeacher.imageUrl && (
                    <button 
                      onClick={() => setNewTeacher({...newTeacher, imageUrl: ''})}
                      className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline px-2"
                    >
                      Remover imagen actual
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de Datos de Identidad */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="font-brand font-black text-xl text-slate-800 tracking-tight uppercase">Datos de Identidad</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <User size={14} className="text-indigo-400" /> Nombre Completo
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. Dr. Roberto Valenzuela"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-3xl py-4 px-6 text-slate-700 font-bold shadow-sm transition-all outline-none"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <IdCard size={14} className="text-indigo-400" /> Documento de Identidad
                  </label>
                  <input 
                    type="text" 
                    placeholder="Número de Cédula o ID"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-3xl py-4 px-6 text-slate-700 font-bold shadow-sm transition-all outline-none"
                    value={newTeacher.identityCard}
                    onChange={(e) => setNewTeacher({...newTeacher, identityCard: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    <Building2 size={14} className="text-indigo-400" /> Centro de Labores
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {centers.map((center) => (
                      <button
                        key={center}
                        type="button"
                        onClick={() => setNewTeacher({...newTeacher, center})}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold text-left text-xs ${
                          newTeacher.center === center
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-500/10'
                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-white'
                        }`}
                      >
                        <MapPin size={14} className={newTeacher.center === center ? 'text-white' : 'text-indigo-400'} />
                        {center}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Mail size={20} />
                </div>
                <h3 className="font-brand font-black text-xl text-slate-800 tracking-tight uppercase">Información de Contacto</h3>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Institucional</label>
                <input 
                  type="email" 
                  placeholder="docente@edu.co"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-3xl py-4 px-6 text-slate-700 font-bold shadow-sm transition-all outline-none"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-8 flex items-center justify-end gap-4">
               <button onClick={() => setIsCreating(false)} className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Cancelar</button>
               <button onClick={handleCreate} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl flex items-center gap-3">
                 <CheckCircle2 size={18} /> Finalizar Registro
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-brand font-black text-slate-900 tracking-tighter uppercase">Gestión de Perfiles Docentes</h1>
          <p className="text-slate-500 mt-1 font-medium">Administración central de identidad y estado laboral.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Nombre o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="mesh-gradient text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-indigo-500/20"
          >
            <Plus size={18} /> Crear Nuevo Perfil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className={`group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 ${teacher.isActive ? 'border-slate-100' : 'border-red-100 grayscale-[0.5]'} flex flex-col relative`}>
            <div className="absolute top-6 left-6 z-10">
              <button onClick={() => toggleStatus(teacher.id)} className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${teacher.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600' : 'bg-slate-200 text-slate-500 hover:bg-red-500 hover:text-white'}`}>
                <Power size={14} />
                {teacher.isActive ? 'Activo' : 'Inactivo'}
              </button>
            </div>
            <div className="relative h-64 overflow-hidden">
              <img src={teacher.imageUrl} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-6 left-8 right-8">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Building2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest line-clamp-1">{teacher.center}</span>
                </div>
                <h3 className="text-2xl font-brand font-black text-white tracking-tighter leading-none mb-2">{teacher.name}</h3>
                <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-1.5"><IdCard size={12} /> ID: {teacher.identityCard}</div>
                </div>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600"><Building2 size={18} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Centro de Labores</p>
                      <p className="text-sm font-bold text-slate-700">{teacher.center}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600"><Mail size={18} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Contacto</p>
                      <p className="text-sm font-bold text-slate-700">{teacher.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              {!teacher.isActive && (
                <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 animate-pulse">
                   <ShieldAlert size={18} className="text-red-500" />
                   <p className="text-[10px] font-black text-red-600 uppercase leading-tight">Acceso Bloqueado</p>
                </div>
              )}
              <div className="flex gap-3 mt-auto">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">Hoja de Vida</button>
                <button className="p-4 bg-slate-100 text-slate-500 rounded-[24px] hover:bg-slate-200 transition-all"><MoreVertical size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherProfiles;
