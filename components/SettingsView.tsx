import React, { useState } from 'react';
import { Store, CreditCard, Bell, Heart, Globe, FileText, ChevronRight, User, Shield, Server, Palette } from 'lucide-react';
import { EstablishmentForm } from './settings/EstablishmentForm';
import { CollaboratorsList } from './settings/CollaboratorsList';
import { CollaboratorForm } from './settings/CollaboratorForm';
import { ResourcesList } from './settings/ResourcesList';
import { ServicesList } from './settings/ServicesList';
import { ProductsList } from './settings/ProductsList';
import { VouchersList } from './settings/VouchersList';
import { NotificationSettings } from './settings/NotificationSettings';
import { AlertSettings } from './settings/AlertSettings';
import { ClientAppSettings } from './settings/ClientAppSettings';
import { FormConfiguration } from './settings/business/FormConfiguration';
import { BusinessProfileForm } from './settings/business/BusinessProfileForm';
import { TerminologyForm } from './settings/business/TerminologyForm';
import { Staff } from '../types';

interface Props {
  onSettingsChange?: () => void;
  onDataChange?: () => void;
}

export const SettingsView: React.FC<Props> = ({ onSettingsChange, onDataChange }) => {
  const [activeSection, setActiveSection] = useState('Geral');
  const [activeSubSection, setActiveSubSection] = useState('Dados do Estabelecimento');

  // Sub-view state for specialized sections like Collaborators
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [aiKey, setAiKey] = useState(localStorage.getItem('doky_ai_key') || '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');

  const handleAiKeyChange = (val: string) => {
    setAiKey(val);
    localStorage.setItem('doky_ai_key', val);
  };

  const menu = [
    {
      title: 'Geral',
      icon: Store,
      color: 'bg-blue-100 text-blue-600',
      items: ['Dados do Estabelecimento', 'Colaboradores', 'Equipamentos', 'IA e Automação']
    },
    {
      title: 'Personalização',
      icon: Palette,
      color: 'bg-indigo-100 text-indigo-600',
      items: ['Perfil de Negócio', 'Terminologia', 'Ecrãs & Layout']
    },
    {
      title: 'Preçário',
      icon: CreditCard,
      color: 'bg-violet-100 text-violet-600',
      items: ['Serviços', 'Produtos', 'Vouchers', 'Importar Dados']
    },
    {
      title: 'Notificações',
      icon: Bell,
      color: 'bg-amber-100 text-amber-600',
      items: ['Lembretes SMS/Email', 'Configuração de Alertas', 'RGPD']
    },
    {
      title: 'Fidelização',
      icon: Heart,
      color: 'bg-rose-100 text-rose-600',
      items: ['Campanhas Marketing', 'Aniversários', 'Cartão Cliente']
    },
    {
      title: 'Online',
      icon: Globe,
      color: 'bg-cyan-100 text-cyan-600',
      items: ['App Cliente', 'Widget de Marcações']
    },
    {
      title: 'Faturação',
      icon: FileText,
      color: 'bg-slate-100 text-slate-600',
      items: ['Dados Fiscais', 'Exportar SAF-T']
    }
  ];

  const renderContent = () => {
    switch (activeSubSection) {
      case 'Dados do Estabelecimento':
        return <EstablishmentForm onSave={onSettingsChange} />;
      case 'Perfil de Negócio':
        return <BusinessProfileForm onSave={onSettingsChange} />;
      case 'Terminologia':
        return <TerminologyForm onSave={onSettingsChange} />;
      case 'Ecrãs & Layout':
        return <FormConfiguration onSave={onSettingsChange} />;
      case 'Colaboradores':
        if (viewMode === 'edit' && selectedStaff) {
          return (
            <CollaboratorForm
              staff={selectedStaff}
              onSave={() => {
                setViewMode('list');
                setSelectedStaff(null);
                if (onDataChange) onDataChange();
              }}
              onCancel={() => { setViewMode('list'); setSelectedStaff(null); }}
            />
          );
        }
        return (
          <CollaboratorsList
            onEdit={(staff) => { setSelectedStaff(staff); setViewMode('edit'); }}
            onChange={onDataChange}
          />
        );
      case 'Equipamentos':
        return <ResourcesList onChange={onDataChange} />;
      case 'Serviços':
        return <ServicesList onChange={onDataChange} />;
      case 'Produtos':
        return <ProductsList onChange={onDataChange} />;
      case 'Vouchers':
        return <VouchersList onChange={onDataChange} />;
      case 'Lembretes SMS/Email':
        return <NotificationSettings />;
      case 'Configuração de Alertas':
        return <AlertSettings />;
      case 'App Cliente':
        return <ClientAppSettings />;
      case 'IA e Automação':
        return (
          <div className="space-y-6">
            <div className="md:w-2/3 glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Configuração da Inteligência Artificial</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">
                Configure a sua chave de API para permitir que o Assistente DOKY analise os seus dados e responda a perguntas.
                Recomendamos o uso do <a href="https://openrouter.ai/keys" target="_blank" className="text-cyan-600 underline">OpenRouter</a> para aceder a modelos gratuitos e rápidos (Mistral, etc).
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Chave de API (OpenRouter)</label>
                  <input
                    type="password"
                    placeholder="sk-or-v1-..."
                    className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 transition-all font-mono"
                    value={aiKey}
                    onChange={(e) => handleAiKeyChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-20">
            <div className="p-8 glass-card rounded-2xl flex flex-col items-center text-center">
              <Server size={48} className="mb-4 opacity-30 text-doky-action-cyan" />
              <h2 className="text-xl font-semibold text-slate-600">Em Desenvolvimento</h2>
              <p className="mt-2 text-sm text-slate-400">A secção "{activeSubSection}" estará disponível brevemente.</p>
            </div>
          </div>
        );
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  // Helper to handle navigation on mobile
  const handleSectionClick = (sectionTitle: string) => {
    setActiveSection(sectionTitle);
    // On mobile, keep menu open to select subsection
  };

  const handleSubSectionClick = (item: string) => {
    setActiveSubSection(item);
    setIsMobileMenuOpen(false); // Close menu on mobile after selection
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 md:pl-12">
      {/* Glass Container for Content */}
      <div className="glass-panel flex-1 rounded-3xl overflow-hidden shadow-2xl animate-fade-in flex flex-col relative">

        {/* Mobile Back Button (Only visible when showing content on mobile) */}
        {!isMobileMenuOpen && (
          <div className="md:hidden p-4 border-b border-slate-100 flex items-center gap-2 bg-white/50 backdrop-blur-sm">
            <button onClick={() => setIsMobileMenuOpen(true)} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-doky-action-cyan">
              <ChevronRight className="rotate-180" size={16} /> Voltar ao Menu
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-semibold text-slate-700">{activeSubSection}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar flex relative">

          {/* Settings Sidebar */}
          <div className={`
                w-full md:w-56 bg-slate-50/50 border-r border-slate-100 p-4 flex flex-col gap-1 backdrop-blur-sm
                absolute md:relative z-20 h-full transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
            <h3 className="font-heading font-bold text-slate-800 text-lg mb-6 px-2">Configurações</h3>
            <div className="space-y-6 pb-20 md:pb-0">
              {menu.map((section, idx) => {
                const Icon = section.icon;
                const isActiveSection = activeSection === section.title;

                return (
                  <div key={idx}>
                    <div
                      className={`flex items-center gap-3 mb-3 px-2 py-1 rounded-lg cursor-pointer ${isActiveSection ? 'text-doky-blue' : 'text-slate-500 hover:text-slate-700'}`}
                      onClick={() => handleSectionClick(section.title)}
                    >
                      <div className={`p-2 rounded-xl transition-colors ${isActiveSection ? section.color : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                        <Icon size={18} />
                      </div>
                      <h3 className="font-bold text-sm tracking-wide">{section.title}</h3>
                    </div>

                    {isActiveSection && (
                      <div className="ml-4 pl-4 border-l-2 border-slate-200 mt-2 space-y-1">
                        {section.items.map((item, iIdx) => (
                          <button
                            key={iIdx}
                            onClick={() => handleSubSectionClick(item)}
                            className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all ${activeSubSection === item
                              ? 'bg-doky-action-cyan/10 text-doky-action-cyan font-semibold'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                              }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-slate-50/50 w-full">
            <div className="p-4 md:p-8 pb-24 md:pb-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};