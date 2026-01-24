import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings, Printer, Save, Sun, Moon, Type, 
  Palette, Volume2, 
  CheckCircle2, Sparkles, Loader2, Torus, Receipt, Zap,
  Layout, FileText, Check, QrCode, AlignLeft, Scissors, Fingerprint, ShieldCheck, Key, ArrowRight, Trash2, Smartphone
} from 'lucide-react';
import { Language, getTranslation } from '../constants/translations';
import { api } from '../utils/api';
import authClient from '../services/frontend/auth-client.frontend';
import { SystemConfig } from '../types';
import { getThemeClass } from '../utils/theme';

interface SystemSettingsProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onUpdateConfig: (config: SystemConfig) => Promise<void>;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ lang, onChangeLang, onUpdateConfig }) => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'display' | 'themes' | 'infrastructure' | 'security'>('display');

  const t = useCallback((key: string) => getTranslation(lang, key), [lang]);

  useEffect(() => {
    api.config.get().then(setConfig);
  }, []);

  const handleSave = async () => {
    if (!config || isSaving) return;
    setIsSaving(true);
    try {
      await onUpdateConfig(config); 
      window.dispatchEvent(new CustomEvent('jx_config_sync', { detail: config }));
    } finally {
      setIsSaving(false);
    }
  };

  // 处理主题切换
  const handleThemeChange = async (themeName: string) => {
    if (!config) return;
    
    const updatedConfig = {
      ...config,
      activeTheme: themeName
    };
    
    setConfig(updatedConfig);
    
    // 立即调用API更新数据库
    try {
      await api.config.update(updatedConfig);
      // 更新全局状态
      onUpdateConfig(updatedConfig);
    } catch (error) {
      console.error('Failed to update theme:', error);
      // 如果更新失败，恢复原始配置
      setConfig(config);
    }
  };

  if (!config) return <div className="h-96 flex items-center justify-center text-slate-400 font-black uppercase text-[10px] tracking-widest animate-pulse"><Loader2 className="animate-spin mr-3" size={18} /> ACCESSING GLOBAL CONFIG...</div>;

  return (
    <div className="space-y-10 animate-fade-up pb-32">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full" />
        <div className="flex items-center space-x-6 relative z-10">
           <div className="w-16 h-16 bg-slate-900 text-blue-500 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white"><Settings size={32} /></div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{t('sys_console')}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Enterprise Cloud Orchestrator</p>
           </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200 relative z-10">
          <button onClick={() => setActiveTab('display')} className={`px-8 py-3.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'display' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>{t('visual_tab')}</button>
          <button onClick={() => setActiveTab('themes')} className={`px-8 py-3.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'themes' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>主题选择</button>
          <button onClick={() => setActiveTab('infrastructure')} className={`px-8 py-3.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'infrastructure' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>{t('infra_tab')}</button>
          <button onClick={() => setActiveTab('security')} className={`px-8 py-3.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>准入安全</button>
        </div>
        <button onClick={handleSave} disabled={isSaving} className={`px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl active-scale-95 relative z-10 ${isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-slate-950'}`}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{isSaving ? (lang === 'zh' ? '正在部署...' : 'Deploying...') : t('apply_settings')}</span>
        </button>
      </div>

      {activeTab === 'display' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <section className="bg-white p-10 lg:p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center space-x-4 text-slate-900"><Palette size={28} className="text-blue-600" /><h3 className="text-xl font-black uppercase tracking-widest">{t('visual_theme')}</h3></div>
            <div className="grid grid-cols-2 gap-6">
              <button onClick={() => setConfig({...config!, theme: 'light'})} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${(config?.theme ?? '') === 'light' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50 opacity-60'}`}><Sun size={32} className={(config?.theme ?? '') === 'light' ? 'text-blue-600' : 'text-slate-400'} /><span className="font-black text-xs uppercase tracking-widest">{t('themeLight')}</span></button>
              <button onClick={() => setConfig({...config!, theme: 'dark'})} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${(config?.theme ?? '') === 'dark' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}><Moon size={32} className={(config?.theme ?? '') === 'dark' ? 'text-white' : 'text-slate-400'} /><span className="font-black text-xs uppercase tracking-widest">{t('themeDark')}</span></button>
            </div>
          </section>
          <section className="bg-white p-10 lg:p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center space-x-4 text-blue-600"><Type size={28} /><h3 className="text-xl font-black uppercase tracking-widest">{t('font_typography')}</h3></div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">{lang === 'zh' ? '全局字体族' : 'Global Font Family'}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['Plus Jakarta Sans', 'Inter', 'Noto Sans SC'].map(f => (
                  <button key={f} onClick={() => setConfig({...config!, fontFamily: f})} className={`py-4 rounded-2xl border-2 font-bold text-[10px] transition-all ${(config?.fontFamily ?? '') === f ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 text-slate-500'}`}>{f}</button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'themes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="bg-white p-10 lg:p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center space-x-4 text-slate-900">
              <Palette size={28} className="text-blue-600" />
              <h3 className="text-xl font-black uppercase tracking-widest">主题样式</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 弥散毛玻璃主题卡片 */}
              <div 
                onClick={() => handleThemeChange('glass')}
                className={`${getThemeClass({...config, activeTheme: 'glass'}, 'Card')} cursor-pointer border-2 ${config?.activeTheme === 'glass' ? 'border-blue-500' : 'border-transparent'} rounded-xl transition-all hover:scale-[1.02]`}
              >
                <div className={`${getThemeClass({...config, activeTheme: 'glass'}, 'Container')} p-6 h-full`}>
                  <h4 className={`${getThemeClass({...config, activeTheme: 'glass'}, 'Text')} font-bold mb-2`}>弥散毛玻璃</h4>
                  <p className={`${getThemeClass({...config, activeTheme: 'glass'}, 'Text')} text-sm opacity-80`}>透明质感，柔和光影效果</p>
                  <button className={`${getThemeClass({...config, activeTheme: 'glass'}, 'Button')} mt-4`}>
                    预览
                  </button>
                </div>
              </div>
              
              {/* 柔性粘土主题卡片 */}
              <div 
                onClick={() => handleThemeChange('clay')}
                className={`${getThemeClass({...config, activeTheme: 'clay'}, 'Card')} cursor-pointer border-2 ${config?.activeTheme === 'clay' ? 'border-blue-500' : 'border-transparent'} rounded-xl transition-all hover:scale-[1.02]`}
              >
                <div className={`${getThemeClass({...config, activeTheme: 'clay'}, 'Container')} p-6 h-full`}>
                  <h4 className={`${getThemeClass({...config, activeTheme: 'clay'}, 'Text')} font-bold mb-2`}>柔性粘土</h4>
                  <p className={`${getThemeClass({...config, activeTheme: 'clay'}, 'Text')} text-sm opacity-80`}>圆润造型，泥土质感</p>
                  <button className={`${getThemeClass({...config, activeTheme: 'clay'}, 'Button')} mt-4`}>
                    预览
                  </button>
                </div>
              </div>
              
              {/* 空间Bento主题卡片 */}
              <div 
                onClick={() => handleThemeChange('bento')}
                className={`${getThemeClass({...config, activeTheme: 'bento'}, 'Card')} cursor-pointer border-2 ${config?.activeTheme === 'bento' ? 'border-blue-500' : 'border-transparent'} rounded-xl transition-all hover:scale-[1.02]`}
              >
                <div className={`${getThemeClass({...config, activeTheme: 'bento'}, 'Container')} p-6 h-full`}>
                  <h4 className={`${getThemeClass({...config, activeTheme: 'bento'}, 'Text')} font-bold mb-2`}>空间Bento</h4>
                  <p className={`${getThemeClass({...config, activeTheme: 'bento'}, 'Text')} text-sm opacity-80`}>网格布局，空间分割</p>
                  <button className={`${getThemeClass({...config, activeTheme: 'bento'}, 'Button')} mt-4`}>
                    预览
                  </button>
                </div>
              </div>
              
              {/* 粗犷极简主题卡片 */}
              <div 
                onClick={() => handleThemeChange('brutal')}
                className={`${getThemeClass({...config, activeTheme: 'brutal'}, 'Card')} cursor-pointer border-2 ${config?.activeTheme === 'brutal' ? 'border-blue-500' : 'border-transparent'} rounded-xl transition-all hover:scale-[1.02]`}
              >
                <div className={`${getThemeClass({...config, activeTheme: 'brutal'}, 'Container')} p-6 h-full`}>
                  <h4 className={`${getThemeClass({...config, activeTheme: 'brutal'}, 'Text')} font-bold mb-2`}>粗犷极简</h4>
                  <p className={`${getThemeClass({...config, activeTheme: 'brutal'}, 'Text')} text-sm opacity-80`}>直角边框，极简风格</p>
                  <button className={`${getThemeClass({...config, activeTheme: 'brutal'}, 'Button')} mt-4`}>
                    预览
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-white p-10 lg:p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center space-x-4 text-blue-600">
              <Palette size={28} />
              <h3 className="text-xl font-black uppercase tracking-widest">当前主题预览</h3>
            </div>
            
            <div className="space-y-6">
              <div className={`${getThemeClass(config, 'Container')} p-6`}>
                <h4 className={`${getThemeClass(config, 'Text')} font-bold mb-2`}>容器(Container)</h4>
                <p className={`${getThemeClass(config, 'Text')} text-sm`}>这是容器区域的预览</p>
              </div>
              
              <div className={`${getThemeClass(config, 'Card')} p-6`}>
                <h4 className={`${getThemeClass(config, 'Text')} font-bold mb-2`}>卡片(Card)</h4>
                <p className={`${getThemeClass(config, 'Text')} text-sm`}>这是卡片区域的预览</p>
              </div>
              
              <div className="flex gap-4">
                <button className={`${getThemeClass(config, 'Button')}`}>
                  按钮(Button)
                </button>
                <span className={`${getThemeClass(config, 'Text')}`}>
                  文字(Text)
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'infrastructure' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center space-x-4 text-amber-600"><Printer size={28} /><h3 className="text-xl font-black uppercase tracking-widest">{t('hardware_link')}</h3></div>
            <div className="space-y-8">
               <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Zap size={24} /></div>
                        <div>
                           <p className="text-sm font-black text-slate-900 uppercase">{t('autoPrint')}</p>
                           <p className="text-[10px] text-slate-400 font-medium">Auto-trigger on order commit</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={!!config?.autoPrintOrder} onChange={(e) => setConfig({...config!, autoPrintOrder: e.target.checked})} className="sr-only peer" />
                        <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                     </label>
                  </div>
               </div>
            </div>
          </section>
          
          <section className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
             <div className="flex items-center space-x-4 text-emerald-400 relative z-10"><Torus size={28} /><h3 className="text-xl font-black uppercase tracking-widest">服务可用性监测</h3></div>
             <div className="grid grid-cols-1 gap-6 relative z-10">
                {[
                  { label: '核心数据库', status: 'Active' },
                  { label: '云端存储 S3', status: 'Online' },
                  { label: '打印网关', status: 'Ready' }
                ].map(s => (
                  <div key={s.label} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-400">{s.label}</span>
                     <span className="text-[10px] font-black text-emerald-400 uppercase flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> {s.status}</span>
                  </div>
                ))}
             </div>
          </section>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-10">
          <section className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
            <div className="flex items-center space-x-4 text-blue-600">
              <ShieldCheck size={28} />
              <h3 className="text-xl font-black uppercase tracking-widest">安全与认证</h3>
            </div>

            <div className="grid grid-cols-1 gap-10">
              <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-8 relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-all" />
                 <div className="relative z-10">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                       <Key size={28} />
                    </div>
                    <h4 className="text-xl font-black tracking-tight">安全认证设置</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      系统使用 Magic Link 认证方式，通过邮件链接安全登录。无需记住密码，只需点击邮件中的链接即可快速进入系统。
                    </p>
                    <div className="mt-8 px-8 py-4 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                      <Key size={16} />
                      <span>已启用安全认证</span>
                    </div>
                 </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;