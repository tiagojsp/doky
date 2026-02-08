import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Printer, Download, Filter, Search, ChevronDown, MoreVertical, Users, Settings2, Grid } from 'lucide-react';
import { api } from '../../services/api';
import { Service, KioskConfig } from '../../types';
import { ServiceCollaboratorsModal } from './ServiceCollaboratorsModal';
import { CategoryManager } from './CategoryManager';

interface Props {
    onChange?: () => void;
}

export const ServicesList: React.FC<Props> = ({ onChange }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [kioskConfig, setKioskConfig] = useState<KioskConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Modal State
    const [collaboratorModalOpen, setCollaboratorModalOpen] = useState(false);
    const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Column Visibility Toggles
    const [showOnline, setShowOnline] = useState(false);
    const [showVat, setShowVat] = useState(false);
    const [showCommissions, setShowCommissions] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [servicesData, settingsData] = await Promise.all([
                api.fetchServices(),
                api.fetchEstablishmentSettings()
            ]);

            // Ensure data has the new structure if coming from old cache
            const enriched = servicesData.map(s => ({
                ...s,
                ref: s.ref || Math.floor(Math.random() * 1000000).toString(),
                vat: s.vat ?? 23,
                isOnline: s.isOnline ?? true,
                category: s.category || 'Geral'
            }));
            setServices(enriched);
            setKioskConfig(settingsData.kioskConfig || null);

        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, field: keyof Service, value: Service[keyof Service]) => {
        // Optimistic update
        const updatedServices = services.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        );
        setServices(updatedServices);

        // Debounce actual save in real app, or simple save for now
        const serviceToUpdate = updatedServices.find(s => s.id === id);
        if (serviceToUpdate) {
            await api.updateService(serviceToUpdate);
            if (onChange) onChange();
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este serviço?')) {
            const originalServices = [...services];
            setServices(services.filter(s => s.id !== id));

            const success = await api.deleteService(id);
            if (!success) {
                setServices(originalServices);
                alert("Erro ao eliminar serviço");
            } else {
                if (onChange) onChange();
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        await loadData();
        if (onChange) onChange();
        setSaving(false);
    };

    const handleCreate = async () => {
        const newService: Service = {
            id: crypto.randomUUID(),
            name: 'Novo Serviço',
            category: 'Geral',
            duration: 30,
            price: 0,
            description: '',
            featured: false,
            ref: '',
            vat: 23,
            isOnline: true,
            commission: { type: '%', value: 0 },
            collaborators: []
        };

        setServices([newService, ...services]);
        await api.createService(newService);
        if (onChange) onChange();
    };

    const openCollaboratorsModal = (service: Service) => {
        setSelectedService(service);
        setCollaboratorModalOpen(true);
    };

    if (loading) return <div className="p-8 text-center text-slate-400">A carregar serviços...</div>;

    // Group by Category
    const groupedServices = services.reduce((acc, service) => {
        const cat = service.category || 'Sem Categoria';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    // Sort categories based on KioskConfig order
    const categoryOrder = kioskConfig?.categories?.map(c => c.name) || [];
    const sortedCategories = Object.keys(groupedServices).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="max-w-screen-xl mx-auto pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lista de Serviços</h2>
                    <p className="text-slate-500 text-sm mt-1">Gerencie o seu menu de serviços, preços e durações.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setCategoryManagerOpen(true)}
                        className="px-4 py-2.5 bg-white text-slate-600 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"
                    >
                        <Grid size={16} className="text-doky-action-cyan" />
                        <span className="hidden sm:inline uppercase tracking-wide text-xs">Categorias</span>
                    </button>
                    <button className="hidden sm:block px-5 py-2.5 bg-white text-slate-600 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm uppercase tracking-wide">
                        Exportar
                    </button>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-bold rounded-lg hover:shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wide">
                        <Plus size={18} />
                        NOVO SERVIÇO
                    </button>
                </div>
            </div>

            {/* Config & Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar serviço..."
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="font-medium text-xs uppercase tracking-wider text-slate-400">Mostrar:</span>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                                <input type="checkbox" checked={showOnline} onChange={(e) => setShowOnline(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                <span className="text-xs font-bold uppercase tracking-wide">Online</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                                <input type="checkbox" checked={showVat} onChange={(e) => setShowVat(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                <span className="text-xs font-bold uppercase tracking-wide">IVA</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px] md:text-xs border-b border-slate-200/60">
                            <tr>
                                <th className="w-10 py-3 pl-4"></th>
                                <th className="py-3 px-4">Nome do Serviço</th>
                                <th className="py-3 px-4 w-32">Ref.</th>
                                <th className="py-3 px-4 w-40 text-center">Duração</th>
                                <th className="py-3 px-4 w-32 text-right">Preço</th>
                                {showVat && <th className="py-3 px-4 w-24 text-right">IVA %</th>}
                                {showOnline && <th className="py-3 px-4 w-24 text-center">Online</th>}
                                <th className="py-3 px-4 w-48">Categoria</th>
                                <th className="py-3 px-4 w-24 text-center">Colaboradores</th>
                                <th className="py-3 px-4 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedCategories.map((category) => (
                                <React.Fragment key={category}>
                                    <tr className="bg-slate-50/30">
                                        <td colSpan={11} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100/50 border-t border-b border-slate-100 flex items-center gap-2">
                                            {category}
                                            {/* Optional: Show color dot if configured */}
                                            {kioskConfig?.categories?.find(c => c.name === category)?.color && (
                                                <span className="w-2 h-2 rounded-full inline-block ml-2" style={{ backgroundColor: kioskConfig.categories.find(c => c.name === category)?.color }}></span>
                                            )}
                                        </td>
                                    </tr>
                                    {(groupedServices[category] as Service[]).map((service) => (
                                        <tr key={service.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="py-3 pl-4 text-center">
                                                <MoreVertical size={14} className="text-slate-300 cursor-grab hover:text-slate-500 active:cursor-grabbing" />
                                            </td>
                                            <td className="p-2">
                                                <div className="relative group/input">
                                                    <input
                                                        type="text"
                                                        value={service.name}
                                                        onChange={(e) => handleUpdate(service.id, 'name', e.target.value)}
                                                        className="w-full bg-transparent font-medium text-slate-700 py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all placeholder-slate-400"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={service.ref || ''}
                                                    onChange={(e) => handleUpdate(service.id, 'ref', e.target.value)}
                                                    className="w-full bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all placeholder-slate-300"
                                                    placeholder="Ref"
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <select
                                                    value={service.duration}
                                                    onChange={(e) => handleUpdate(service.id, 'duration', parseInt(e.target.value))}
                                                    className="bg-transparent text-slate-600 text-xs py-1.5 px-1 rounded cursor-pointer hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all appearance-none text-center font-medium"
                                                >
                                                    <option value="15">15 min</option>
                                                    <option value="30">30 min</option>
                                                    <option value="45">45 min</option>
                                                    <option value="60">60 min</option>
                                                    <option value="90">90 min</option>
                                                    <option value="120">120 min</option>
                                                </select>
                                            </td>
                                            <td className="p-2 text-right">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={service.price}
                                                        onChange={(e) => handleUpdate(service.id, 'price', parseFloat(e.target.value))}
                                                        className="w-full bg-transparent font-bold text-slate-700 py-1.5 px-2 rounded text-right hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                                        step="0.01"
                                                    />
                                                </div>
                                            </td>

                                            {showVat && (
                                                <td className="p-2 text-right">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={service.vat || 23}
                                                            onChange={(e) => handleUpdate(service.id, 'vat', parseFloat(e.target.value))}
                                                            className="w-full bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded text-right hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                                        />
                                                    </div>
                                                </td>
                                            )}

                                            {showOnline && (
                                                <td className="p-2 text-center">
                                                    <div className="flex justify-center">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" className="sr-only peer" checked={service.isOnline} onChange={(e) => handleUpdate(service.id, 'isOnline', e.target.checked)} />
                                                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:left-[0px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-doky-success-green"></div>
                                                        </label>
                                                    </div>
                                                </td>
                                            )}

                                            <td className="p-2">
                                                {/* Category Selector/Input: Could improve to Select if categories are defined */}
                                                <input
                                                    type="text"
                                                    value={service.category}
                                                    onChange={(e) => handleUpdate(service.id, 'category', e.target.value)}
                                                    className="w-full bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                                    placeholder="Categoria"
                                                    list="category-suggestions"
                                                />
                                                <datalist id="category-suggestions">
                                                    {kioskConfig?.categories?.map(c => (
                                                        <option key={c.id} value={c.name} />
                                                    ))}
                                                </datalist>
                                            </td>

                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={() => openCollaboratorsModal(service)}
                                                    className={`p-1.5 rounded-lg transition-all ${service.collaborators?.length ? 'text-cyan-600 bg-cyan-50' : 'text-slate-300 hover:text-cyan-500 hover:bg-slate-50'}`}
                                                    title={`${service.collaborators?.length || 0} Colaboradores`}
                                                >
                                                    <Users size={16} />
                                                </button>
                                            </td>

                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-bold rounded-lg hover:shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wide disabled:opacity-70 disabled:grayscale"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                                A GRAVAR...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                GUARDAR ALTERAÇÕES
                            </>
                        )}
                    </button>
                </div>
            </div>

            {selectedService && (
                <ServiceCollaboratorsModal
                    isOpen={collaboratorModalOpen}
                    onClose={() => setCollaboratorModalOpen(false)}
                    service={selectedService}
                    onSave={(updated) => {
                        setServices(services.map(s => s.id === updated.id ? updated : s));
                    }}
                />
            )}

            {categoryManagerOpen && (
                <CategoryManager
                    onClose={() => setCategoryManagerOpen(false)}
                    onSave={loadData}
                />
            )}
        </div>


    );
};
