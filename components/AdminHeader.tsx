import React, { useState } from 'react';
import { ViewState } from '../types';
import {
  Calendar, Users, Megaphone, BarChart3, Settings,
  LogOut, Sparkles, PlusCircle, LayoutDashboard,
  ChevronLeft, ChevronRight, AlertCircle, Globe, Monitor
} from 'lucide-react';

interface Props {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onOpenBooking: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  establishmentName?: string;
  clientAppUrl?: string; // New prop
  onLogout: () => void;
}

export const AdminHeader: React.FC<Props> = ({ currentView, setView, onOpenBooking, isCollapsed, setIsCollapsed, establishmentName, clientAppUrl, onLogout }) => {
  const navItems = [
    { label: 'Dashboard', value: ViewState.REPORTS, icon: LayoutDashboard },
    { label: 'Agenda', value: ViewState.AGENDA, icon: Calendar },
    { label: 'Clientes', value: ViewState.CLIENTS, icon: Users },
    { label: 'Campanhas', value: ViewState.CAMPAIGNS, icon: Megaphone },
    { label: 'Definições', value: ViewState.SETTINGS, icon: Settings },
    { label: 'Kiosk', value: ViewState.KIOSK, icon: Monitor },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`
        hidden md:flex
        fixed top-6 left-4 h-[calc(100vh-3rem)] transition-all duration-500 ease-out z-50 
        ${!isCollapsed ? 'w-56' : 'w-20'} 
        glass-sidebar shadow-2xl rounded-[32px] border border-white/20
        flex-col justify-between overflow-visible
      `}
      >
        {/* Logo Area */}
        <div className={`flex flex-col justify-center transition-all duration-500 ${!isCollapsed ? 'p-6 items-center' : 'p-4 items-center'}`}>
          <div className="relative group cursor-pointer text-center">
            {!isCollapsed ? (
              <div className="flex flex-col items-center">
                <h1 className="font-heading font-black text-4xl tracking-tight text-white leading-none">
                  DOKY
                </h1>
                <span className="text-[10px] font-bold tracking-[0.2em] text-doky-action-cyan uppercase mt-1 pl-1">
                  Marca e Pronto
                </span>

                {/* Company Subtitle */}
                <div onClick={() => setView(ViewState.SETTINGS)} className="mt-4 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-doky-success-green shadow-[0_0_10px_rgba(0,230,118,0.5)] animate-pulse" />
                  <span className="text-xs font-medium text-white/90">{establishmentName || 'Clínica Central'}</span>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-doky-action-cyan to-doky-blue flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
                D
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-4 mt-8 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.value;
            return (
              <button
                key={item.value}
                onClick={() => {
                  if (item.value === ViewState.KIOSK) {
                    window.open('/?mode=kiosk', '_blank');
                  } else {
                    setView(item.value);
                  }
                }}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center rounded-2xl text-base font-semibold transition-all duration-300 group ${isActive
                  ? 'bg-white shadow-xl shadow-cyan-900/10 text-doky-blue scale-[1.02]'
                  : 'text-white hover:bg-white/10 hover:translate-x-1'
                  } ${isCollapsed ? 'justify-center p-3 aspect-square' : 'gap-3 px-5 py-4'}`}
              >
                <Icon size={isCollapsed ? 24 : 22} className={`min-w-[22px] transition-colors ${isActive ? 'text-doky-cyan' : 'text-white group-hover:text-white'}`} strokeWidth={2.5} />
                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden tracking-wide">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 px-4 py-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar min-h-0">
          {/* Widgets moved to FloatingAssistant */}
        </div>


        {/* Toggle Button on Edge - Pill Shape with Text */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute -right-5 top-24 z-50
            w-8 py-4 bg-white text-doky-blue rounded-full 
            flex flex-col items-center justify-center gap-3
            shadow-lg shadow-cyan-900/20 border-2 border-slate-50
            transform transition-all duration-300 hover:scale-105 hover:text-doky-action-cyan
            active:scale-95
            group
          `}
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          {isCollapsed ?
            <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" /> :
            <ChevronLeft size={14} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform" />
          }
          <span
            className="text-[9px] font-black uppercase tracking-widest rotate-180 opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ writingMode: 'vertical-rl' }}
          >
            {isCollapsed ? 'Expandir' : 'Recolher'}
          </span>
        </button>

        {/* User Profile */}
        <div className={`mt-auto bg-black/20 backdrop-blur-md rounded-b-[32px] ${!isCollapsed ? 'p-4' : 'p-3 pb-6 flex justify-center'}`}>
          <div className={`
                flex items-center gap-3 p-2 rounded-2xl transition-all duration-300
                ${!isCollapsed ? 'bg-doky-dark-glass hover:bg-black/30 cursor-pointer shadow-lg shadow-black/10' : 'justify-center bg-transparent'}
            `}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-doky-action-cyan to-doky-blue p-[2px] shadow-lg shadow-cyan-500/20">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User"
                  className="w-full h-full rounded-full object-cover border-2 border-doky-blue"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-doky-success-green border-2 border-doky-blue rounded-full"></div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Dr. Ricardo Silva</p>
                <p className="text-[10px] items-center flex gap-1 text-cyan-200/70 truncate uppercase tracking-wider font-semibold">
                  Administrador
                </p>
              </div>
            )}

            {!isCollapsed && (
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Sair">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
        {/* Decorative Glow Connection - Removed for smoother transition */}
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden px-4 py-3 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="DOKY" className="h-8 w-auto object-contain" />
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white">
          <img src="https://picsum.photos/id/64/100/100" alt="User" />
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200/50 flex justify-around items-center p-2 z-50 pb-safe">
        {
          navItems.slice(0, 4).map((item) => { // Show first 4 items on mobile
            const Icon = item.icon;
            const isActive = currentView === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setView(item.value)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-cyan-600' : 'text-slate-400'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })
        }
        {/* Mobile "More" or Settings */}
        <button
          onClick={() => setView(ViewState.SETTINGS)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === ViewState.SETTINGS ? 'text-cyan-600' : 'text-slate-400'}`}
        >
          <Settings size={24} strokeWidth={currentView === ViewState.SETTINGS ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Mais</span>
        </button>
      </nav>
    </>
  );
};