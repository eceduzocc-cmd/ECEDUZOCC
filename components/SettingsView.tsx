
import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  ShieldCheck, 
  User, 
  Bell, 
  Cloud, 
  Save, 
  CheckCircle2,
  Image as ImageIcon,
  Key,
  Fingerprint
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'security' | 'cloud'>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const menuItems = [
    { id: 'profile', label: 'Perfil Administrativo', icon: User },
    { id: 'appearance', label: 'Marca Institucional', icon: Palette },
    { id: 'security', label: 'Seguridad y Firmas', icon: ShieldCheck },
    { id: 'cloud', label: 'Sincronización Cloud', icon: Cloud },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">Configuración del <span className="text-indigo-600">Sistema</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Personalice su entorno de gestión y protocolos de seguridad.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-8 py-4 rounded-[25px] font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all ${
            saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'
          }`}
        >
          {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saved ? 'Cambios Guardados' : 'Guardar Configuración'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-5 rounded-[28px] transition-all group ${
                activeTab === item.id 
                ? 'bg-white text-indigo-600 shadow-lg border-2 border-indigo-50' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-400'} />
              <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-9 bg-white rounded-[50px] border border-slate-100 shadow-sm p-12">
          {activeTab === 'profile' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center gap-8">
                  <div className="relative group">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=UNAD" className="w-32 h-32 rounded-[40px] object-cover ring-8 ring-slate-50" />
                    <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-100 rounded-2xl shadow-xl text-slate-400 hover:text-indigo-600 transition-all">
                       <ImageIcon size={18} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">Dr. Roberto Valenzuela</h3>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Administrador de Escuela • ECE</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Correo Institucional</label>
                    <input type="text" defaultValue="rvalenzuela@unad.edu.co" className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Teléfono</label>
                    <input type="text" defaultValue="+57 300 123 4567" className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none transition-all" />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600"><Palette size={24} /></div>
                    <div>
                      <h4 className="font-brand font-black text-indigo-900 uppercase tracking-tighter">Modo Visual</h4>
                      <p className="text-indigo-700/60 text-[10px] font-bold uppercase tracking-widest">Preferencia de Interfaz</p>
                    </div>
                  </div>
                  <div className="flex bg-white/50 p-1 rounded-2xl">
                     <button className="px-6 py-2 bg-white rounded-xl shadow-sm text-[10px] font-black uppercase">Claro</button>
                     <button className="px-6 py-2 text-slate-400 text-[10px] font-black uppercase">Oscuro</button>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="font-brand font-black text-slate-800 uppercase tracking-tighter">Colores de Marca ECE</h4>
                  <div className="grid grid-cols-4 gap-4">
                     {['#004170', '#ffb100', '#6366f1', '#10b981'].map(color => (
                       <button key={color} className="h-16 rounded-2xl border-4 border-white shadow-sm hover:scale-105 transition-all" style={{ backgroundColor: color }}></button>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-slate-900 text-white rounded-3xl"><Key size={28} /></div>
                  <div>
                    <h4 className="text-xl font-brand font-black text-slate-900 uppercase tracking-tighter">Protocolos de Firma</h4>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Gestión de Criptografía Institucional</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="p-6 border-2 border-slate-50 rounded-[35px] flex items-center justify-between group hover:border-indigo-100 transition-all">
                     <div className="flex items-center gap-4">
                        <Fingerprint className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={32} />
                        <div>
                           <p className="text-sm font-black text-slate-800">Doble Factor de Autenticación</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requerido para reportes finales</p>
                        </div>
                     </div>
                     <div className="w-14 h-8 bg-emerald-500 rounded-full p-1 flex justify-end items-center px-1.5 cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsView;
