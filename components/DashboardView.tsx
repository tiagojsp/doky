import React from 'react';
import { Appointment, Service } from '../types';
import { Wallet, Users, CalendarCheck, TrendingUp, AlertCircle, Clock, Star } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  services: Service[];
}

export const DashboardView: React.FC<Props> = ({ appointments, services }) => {
  // Logic to calculate KPIs
  // In a real app, this would filter by "Today" or "Current Month". 
  // For demo purposes with 2026 data, we analyze the whole dataset.
  
  const totalRevenue = appointments.reduce((acc, app) => {
    const service = services.find(s => s.id === app.serviceId);
    return acc + (service ? service.price : 0);
  }, 0);

  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const totalAppts = appointments.length;
  
  const averageTicket = totalAppts > 0 ? Math.round(totalRevenue / totalAppts) : 0;
  
  // Find top service
  const serviceCounts: Record<string, number> = {};
  appointments.forEach(app => {
    serviceCounts[app.serviceId] = (serviceCounts[app.serviceId] || 0) + 1;
  });
  const topServiceId = Object.keys(serviceCounts).reduce((a, b) => serviceCounts[a] > serviceCounts[b] ? a : b, services[0].id);
  const topService = services.find(s => s.id === topServiceId);

  return (
    <div className="h-full overflow-auto p-4 md:p-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">Visão Geral</h2>
          <p className="text-slate-500 font-medium">Bem-vindo ao cockpit da sua operação.</p>
        </div>
        <div className="bg-white/50 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-white/50">
          Dados de: <span className="text-cyan-600">Janeiro 2026</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Revenue Card */}
        <div className="glass-card p-5 rounded-3xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Wallet size={64} className="text-emerald-600" />
          </div>
          <div className="relative z-10">
             <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
               <TrendingUp size={20} />
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Faturação Prevista</p>
             <h3 className="text-2xl font-black text-slate-800 mt-1">{totalRevenue}€</h3>
             <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
               <TrendingUp size={12} /> +12% vs mês passado
             </p>
          </div>
        </div>

        {/* Occupancy Card */}
        <div className="glass-card p-5 rounded-3xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <CalendarCheck size={64} className="text-blue-600" />
          </div>
          <div className="relative z-10">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
               <Clock size={20} />
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ocupação Agenda</p>
             <h3 className="text-2xl font-black text-slate-800 mt-1">{totalAppts} <span className="text-sm font-normal text-slate-400">marcações</span></h3>
             <p className="text-xs text-slate-500 font-medium mt-2">
               {pendingCount} pendentes de aprovação
             </p>
          </div>
        </div>

        {/* Ticket Average */}
        <div className="glass-card p-5 rounded-3xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Users size={64} className="text-purple-600" />
          </div>
          <div className="relative z-10">
             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
               <Star size={20} />
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ticket Médio</p>
             <h3 className="text-2xl font-black text-slate-800 mt-1">{averageTicket}€</h3>
             <p className="text-xs text-slate-500 font-medium mt-2">
               Por cliente
             </p>
          </div>
        </div>

        {/* Top Service */}
        <div className="glass-card p-5 rounded-3xl relative overflow-hidden group bg-gradient-to-br from-cyan-500 to-blue-600 border-none text-white">
          <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
             <Star size={64} className="text-white" />
          </div>
          <div className="relative z-10">
             <p className="text-cyan-100 text-xs font-bold uppercase tracking-wider">Serviço Top</p>
             <h3 className="text-xl font-black mt-1 leading-tight line-clamp-2">{topService?.name}</h3>
             <p className="text-xs text-cyan-100 font-medium mt-2 bg-white/20 inline-block px-2 py-1 rounded-lg">
               Responsável por 40% da receita
             </p>
          </div>
        </div>
      </div>

      {/* Operation Control Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts / To-Do */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
             <AlertCircle size={20} className="text-red-400" />
             Atenção Operacional
           </h3>
           <div className="space-y-3">
             <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-500"></div>
                   <div>
                      <p className="font-bold text-slate-700 text-sm">3 Confirmações Pendentes</p>
                      <p className="text-xs text-slate-500">Agendamentos online a aguardar validação.</p>
                   </div>
                </div>
                <button className="px-4 py-2 bg-white text-red-500 text-xs font-bold rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-colors">
                  Resolver
                </button>
             </div>

             <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                   <div>
                      <p className="font-bold text-slate-700 text-sm">Stock Baixo: Óleo de Massagem</p>
                      <p className="text-xs text-slate-500">Restam apenas 2 unidades em inventário.</p>
                   </div>
                </div>
                <button className="px-4 py-2 bg-white text-amber-600 text-xs font-bold rounded-xl shadow-sm hover:bg-amber-500 hover:text-white transition-colors">
                  Encomendar
                </button>
             </div>

             <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <div>
                      <p className="font-bold text-slate-700 text-sm">Aniversariantes do Dia</p>
                      <p className="text-xs text-slate-500">Adriana Costa faz anos hoje.</p>
                   </div>
                </div>
                <button className="px-4 py-2 bg-white text-blue-600 text-xs font-bold rounded-xl shadow-sm hover:bg-blue-500 hover:text-white transition-colors">
                  Enviar SMS
                </button>
             </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
           <div>
              <h3 className="font-bold text-slate-800 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button className="p-4 bg-white/50 hover:bg-white rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-cyan-600 transition-all border border-white/50">
                    <Users size={24} />
                    <span className="text-xs font-bold">Novo Cliente</span>
                 </button>
                 <button className="p-4 bg-white/50 hover:bg-white rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-cyan-600 transition-all border border-white/50">
                    <Clock size={24} />
                    <span className="text-xs font-bold">Bloquear Horário</span>
                 </button>
              </div>
           </div>
           
           <div className="mt-6 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Meta Mensal</p>
                <div className="flex items-end gap-2">
                   <span className="text-2xl font-bold">4.500€</span>
                   <span className="text-xs text-slate-400 mb-1">/ 10.000€</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
                   <div className="h-full bg-cyan-400 w-[45%] rounded-full"></div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};