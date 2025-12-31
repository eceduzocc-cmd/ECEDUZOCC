
import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight,
  Zap,
  Star,
  Layers,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', value: 420 },
  { name: 'Feb', value: 580 },
  { name: 'Mar', value: 950 },
  { name: 'Abr', value: 720 },
  { name: 'May', value: 890 },
  { name: 'Jun', value: 1100 },
];

const stats = [
  { label: 'Matrícula Total', value: '1,284', grow: '+12.5%', icon: Users, gradient: 'from-blue-500 to-indigo-600' },
  { label: 'Docentes Expertos', value: '86', grow: '+2.1%', icon: Star, gradient: 'from-purple-500 to-fuchsia-600' },
  { label: 'Programas Activos', value: '42', grow: 'New', icon: Layers, gradient: 'from-emerald-500 to-teal-600' },
  { label: 'Presupuesto Ejec.', value: '94%', grow: '+5.4%', icon: Zap, gradient: 'from-orange-500 to-amber-600' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Dashboard Administrativo</span>
            <div className="h-1 flex-1 bg-indigo-100 rounded-full min-w-[50px]"></div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-brand font-black text-slate-900 tracking-tighter leading-tight">
            Gestión Educativa <span className="text-indigo-600">Inteligente</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Monitoreo en tiempo real de la Escuela de Ciencias de la Educación. Centraliza, analiza y evoluciona.
          </p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white px-6 py-4 rounded-3xl font-bold text-sm text-slate-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 flex items-center gap-2">
              <Calendar size={18} /> Historial
           </button>
           <button className="mesh-gradient px-8 py-4 rounded-3xl font-bold text-sm text-white shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center gap-2">
              <TrendingUp size={18} /> Reporte Global
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={stat.label} 
            style={{ animationDelay: `${idx * 150}ms` }}
            className="group relative bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 overflow-hidden animate-in zoom-in-95"
          >
            {/* Background Decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 rounded-full blur-2xl transition-all`}></div>
            
            <div className="flex items-center justify-between mb-8">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${stat.grow.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {stat.grow}
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">Vs mes anterior</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-brand font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <ArrowUpRight size={16} className="text-emerald-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-10 rounded-[50px] border border-white shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-brand font-black text-2xl text-slate-900 tracking-tighter">Matrícula Semestral</h3>
              <p className="text-sm text-slate-400 font-medium">Crecimiento orgánico institucional</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
               <button className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold text-slate-800">Mensual</button>
               <button className="px-4 py-2 text-xs font-bold text-slate-500">Anual</button>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontWeight: 'bold'}}
                  cursor={{stroke: '#6366f1', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#chartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[50px] p-10 text-white relative overflow-hidden flex flex-col shadow-2xl">
          {/* Accent decoration */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-brand font-black text-xl tracking-tighter uppercase">Tareas de Hoy</h3>
              <div className="bg-white/10 p-2 rounded-xl text-indigo-400">
                <Zap size={20} />
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {[
                { title: 'Reunión con Decanatura', time: '10:00 AM', status: 'Inicia en 15m' },
                { title: 'Firma de Títulos', time: '02:30 PM', status: 'Pendiente' },
                { title: 'Cierre de Admisiones', time: '05:00 PM', status: 'Crítico' },
              ].map((task, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{task.title}</p>
                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{task.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Calendar size={12} /> {task.time}
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                    <div className="h-full w-1/3 bg-indigo-500 rounded-full group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-white text-slate-900 rounded-3xl font-black text-sm hover:bg-indigo-400 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2">
              Ver Agenda Completa <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
