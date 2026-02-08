import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, HelpCircle, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { Resource } from '../../types';

interface ResourcesListProps {
    onChange?: () => void;
}

export const ResourcesList: React.FC<ResourcesListProps> = ({ onChange }) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            const data = await api.fetchResources();
            setResources(data);
        } catch (error) {
            console.error('Failed to load resources', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        const newResource: Resource = {
            id: crypto.randomUUID(),
            type: 'room',
            name: `Recurso ${resources.length + 1}`,
            capacity: 1,
            isActive: true,
            isVisible: true
        };
        setResources([...resources, newResource]);

        await api.createResource(newResource);
        if (onChange) onChange();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este recurso?')) {
            const originalResources = [...resources];
            setResources(resources.filter(r => r.id !== id));
            const success = await api.deleteResource(id);
            if (!success) {
                setResources(originalResources);
                alert("Erro ao eliminar recurso");
            } else {
                if (onChange) onChange();
            }
        }
    };

    const updateResource = (id: string, field: keyof Resource, value: any) => {
        setResources(resources.map(r =>
            r.id === id ? { ...r, [field]: value } : r
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.saveResources(resources);
            // Optional: Show success toast
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">A carregar...</div>;


    return (
        <div className="w-full pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="py-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Salas ou Equipamentos</h2>
                <div className="mt-2 text-slate-500 text-sm leading-relaxed max-w-4xl bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <p className="flex gap-2">
                        <HelpCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>
                            Esta funcionalidade é opcional. Utilize-a para gerir a ocupação de salas e equipamentos partilhados, impedindo sobreposição de agendamentos nos mesmos recursos.
                        </span>
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px] md:text-xs border-b border-slate-200/60">
                            <tr>
                                <th className="py-4 px-6 font-bold text-slate-400 w-64">Tipo de Recurso *</th>
                                <th className="py-4 px-6 font-bold text-slate-400">Nome da sala ou equipamento</th>
                                <th className="py-4 px-6 font-bold text-center text-slate-400 w-48">Lotação / Qtd.</th>
                                <th className="py-4 px-6 font-bold text-center text-slate-400 w-24">Ativo</th>
                                <th className="py-4 px-6 font-bold text-center text-slate-400 w-32">Visível na agenda</th>
                                <th className="py-4 px-6 font-bold text-center text-slate-400 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {resources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <select
                                                value={resource.type}
                                                onChange={(e) => updateResource(resource.id, 'type', e.target.value)}
                                                className="w-full bg-transparent font-medium text-slate-700 outline-none appearance-none cursor-pointer py-1 pr-6"
                                            >
                                                <option value="room">Sala ou Gabinete</option>
                                                <option value="equipment">Equipamento</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="text"
                                            value={resource.name}
                                            onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                                            className="w-full bg-transparent font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:text-blue-600 transition-colors"
                                            placeholder="Ex: Sala 1"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-20 mx-auto">
                                            <input
                                                type="number"
                                                value={resource.capacity}
                                                onChange={(e) => updateResource(resource.id, 'capacity', parseInt(e.target.value) || 0)}
                                                className="w-full text-center bg-white border border-slate-200 rounded-lg py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                                                min="1"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={resource.isActive}
                                                onChange={(e) => updateResource(resource.id, 'isActive', e.target.checked)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-5 h-5 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={resource.isVisible}
                                                onChange={(e) => updateResource(resource.id, 'isVisible', e.target.checked)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-5 h-5 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(resource.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remover"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {resources.length === 0 && (
                    <div className="py-16 text-center text-slate-400 bg-slate-50/30">
                        <p className="mb-4">Nenhuma sala ou equipamento criado.</p>
                        <button
                            onClick={handleAdd}
                            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={18} />
                            Criar primeiro registo
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:border-slate-300 hover:text-slate-900 hover:shadow-sm transition-all uppercase tracking-wide"
                >
                    <Plus size={16} />
                    ADICIONAR NOVO
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-bold rounded-lg hover:shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wide disabled:opacity-70 disabled:grayscale"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                            A GRAVAR...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            GUARDAR
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
