
import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  ShieldCheck, 
  User, 
  Cloud, 
  Save, 
  CheckCircle2,
  Database,
  ExternalLink,
  AlertCircle,
  Link2,
  Key,
  RefreshCw,
  Activity,
  Server,
  ChevronRight,
  Zap,
  BrainCircuit,
  TestTube2,
  ShieldAlert,
  Download,
  Upload,
  Globe,
  Github,
  Rocket
} from 'lucide-react';
import { gasService } from '../services/gasService';
import { geminiService } from '../services/geminiService';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'cloud' | 'deploy'>('profile');
  const [saved, setSaved] = useState(false);
  const [gasUrl, setGasUrl] = useState(localStorage.getItem('edupro_gas_url') || '');
  
  const [testCloud, setTestCloud] = useState<{status: 'idle'|'loading'|'success'|'error', msg: string, latency?: number}>({status: 'idle', msg: ''});
  const [testAI, setTestAI] = useState<{status: 'idle'|'loading'|'success'|'error', msg: string}>({status: 'idle', msg: ''});

  const handleSave = () => {
    localStorage.setItem('edupro_gas_url', gasUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const runCloudTest = async () => {
    setTestCloud({ status: 'loading', msg: 'Enviando paquete de prueba a Google...' });
    const result = await gasService.syncToCloud({ test_ping: true, device: 'Diagnostic_Panel' });
    if (result.success) {
      setTestCloud({ status: 'success', msg: '¡Conexión verificada!', latency: result.latency });
    } else {
      setTestCloud({ status: 'error', msg: 'Error de respuesta. Verifique URL y Permisos.' });
    }
  };

  const runAITest = async () => {
    setTestAI({ status: 'loading', msg: 'Despertando neuronas de Gemini...' });
    try {
      const response = await geminiService.askEducationalAssistant("Hola, ¿estás lista para trabajar en la ECE?");
      setTestAI({ status: 'success', msg: response });
    } catch (e) {
      setTestAI({ status: 'error', msg: 'Fallo en la API de Inteligencia Artificial.' });
    }
  };

  const exportConfig = () => {
    const config = { gasUrl: localStorage.getItem('edupro_gas_url') };
    const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edupro-cloud-config.json';
    a.click();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-brand font-black text-slate-900 tracking-tighter uppercase leading-tight">Panel de <span className="text-indigo-600">Control</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Administración de infraestructura y despliegue del sistema.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={exportConfig}
             className="px-6 py-4 bg-white border border-slate-200 rounded-[25px] font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
           >
             <Download size={16} /> Exportar Config
           </button>
           <button 
             onClick={handleSave}
             className={`px-8 py-4 rounded-[25px] font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all ${
               saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'
             }`}
           >
             {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
             {saved ? 'URL Guardada' : 'Guardar Cambios'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: 'profile', label: 'Mi Perfil', icon: User },
            { id: 'cloud', label: 'Cloud & Pruebas', icon: Cloud },
            { id: 'deploy', label: 'Publicar App', icon: Globe },
          ].map((item) => (
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

        <main className="lg:col-span-9 bg-white rounded-[50px] border border-slate-100 shadow-sm p-12 min-h-[600px]">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center gap-8">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=UNAD" className="w-24 h-24 rounded-[30px] ring-8 ring-slate-50" />
                  <div>
                    <h3 className="text-2xl font-brand font-black text-slate-900 uppercase tracking-tighter">Dr. Roberto Valenzuela</h3>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Admin Principal • ECE Cloud</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Link2 size={14} className="text-indigo-500" /> Endpoint de Google Apps Script
                  </label>
                  <input 
                    type="text" 
                    value={gasUrl}
                    onChange={(e) => setGasUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-[25px] py-5 px-8 font-mono text-[10px] text-slate-600 outline-none transition-all"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`p-8 rounded-[40px] border-2 transition-all flex flex-col justify-between ${
                    testCloud.status === 'success' ? 'bg-emerald-50 border-emerald-200' : 
                    testCloud.status === 'error' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
                  }`}>
                     <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 rounded-2xl ${testCloud.status === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                           <Cloud size={24} />
                        </div>
                        {testCloud.latency && <span className="text-[10px] font-black text-emerald-600">{testCloud.latency}ms</span>}
                     </div>
                     <h4 className="font-brand font-black text-sm uppercase tracking-widest mb-2">Test de Latencia Nube</h4>
                     <p className="text-[10px] font-bold text-slate-500 mb-6">{testCloud.msg || 'Mide la velocidad de tu conexión con Google.'}</p>
                     <button 
                        onClick={runCloudTest}
                        disabled={testCloud.status === 'loading'}
                        className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                     >
                        {testCloud.status === 'loading' ? 'Probando...' : 'Ejecutar Test'}
                     </button>
                  </div>

                  <div className={`p-8 rounded-[40px] border-2 transition-all flex flex-col justify-between ${
                    testAI.status === 'success' ? 'bg-indigo-50 border-indigo-200' : 
                    testAI.status === 'error' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
                  }`}>
                     <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 rounded-2xl ${testAI.status === 'success' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
                           <BrainCircuit size={24} />
                        </div>
                        {testAI.status === 'success' && <Zap size={16} className="text-amber-500 animate-pulse" />}
                     </div>
                     <h4 className="font-brand font-black text-sm uppercase tracking-widest mb-2">Ping Inteligente</h4>
                     <p className="text-[10px] font-bold text-slate-500 mb-6 line-clamp-2">{testAI.msg || 'Verifica que la IA esté activa.'}</p>
                     <button 
                        onClick={runAITest}
                        disabled={testAI.status === 'loading'}
                        className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                     >
                        {testAI.status === 'loading' ? 'Invocando...' : 'Test IA'}
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="bg-indigo-600 p-10 rounded-[50px] text-white relative overflow-hidden">
                  <Rocket className="absolute -right-10 -bottom-10 text-white/10" size={200} />
                  <div className="relative z-10">
                     <h3 className="text-3xl font-brand font-black tracking-tighter uppercase leading-none mb-4">Manual de Publicación</h3>
                     <p className="text-indigo-100 text-sm font-medium max-w-xl">
                        Sigue estos pasos para convertir este código en una URL pública profesional y gratuita.
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">1</div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest">Crear Repo</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed">
                        Sube este código a un repositorio en <strong>GitHub</strong>. Es el estándar de oro para ingenieros.
                     </p>
                     <Github size={20} className="text-slate-300" />
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">2</div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest">Conectar Vercel</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed">
                        Crea una cuenta en <strong>Vercel.com</strong> y vincula tu repositorio. Se publicará en segundos.
                     </p>
                     <ExternalLink size={20} className="text-slate-300" />
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">3</div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest">Configurar API</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed">
                        En Vercel, añade tu <strong>API_KEY</strong> de Gemini en la sección "Environment Variables".
                     </p>
                     <ShieldCheck size={20} className="text-slate-300" />
                  </div>
               </div>

               <div className="bg-amber-50 border border-amber-200 p-8 rounded-[40px] flex items-start gap-6">
                  <AlertCircle className="text-amber-500 mt-1" size={24} />
                  <div>
                    <h5 className="font-brand font-black text-xs uppercase tracking-widest text-amber-800">Prueba Local vs Pública</h5>
                    <p className="text-[11px] text-amber-700 leading-relaxed mt-2">
                      Recuerda que al publicar la app en una URL diferente, tendrás que volver a pegar tu URL de Google en esta configuración, a menos que uses el botón <strong>"Exportar Config"</strong> para mover tus ajustes.
                    </p>
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
