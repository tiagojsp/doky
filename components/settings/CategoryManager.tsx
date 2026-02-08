import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { EstablishmentSettings, KioskConfig } from '../../types';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check, X, Grid, List } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSave: () => void;
}

interface Category {
    id: string;
    name: string;
    order: number;
    icon?: string;
    color?: string;
}

export const CategoryManager: React.FC<Props> = ({ onClose, onSave }) => {
    const [settings, setSettings] = useState<EstablishmentSettings | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await api.fetchEstablishmentSettings();
            setSettings(data);

            // Load types from KioskConfig or init empty
            const loadedCats = data.kioskConfig?.categories || [];
            // Sort by order
            setCategories([...loadedCats].sort((a, b) => a.order - b.order));

        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const updatedConfig: KioskConfig = {
                ...(settings.kioskConfig || { timeoutSeconds: 120, showPromotions: false, showQrCode: true }),
                categories: categories.map((c, idx) => ({ ...c, order: idx }))
            };

            const updatedSettings = {
                ...settings,
                kioskConfig: updatedConfig
            };

            await api.updateEstablishmentSettings(updatedSettings);
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to save categories", error);
            alert("Erro ao guardar categorias");
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = () => {
        const newCat: Category = {
            id: crypto.randomUUID(),
            name: 'Nova Categoria',
            order: categories.length,
            color: '#0f766e'
        };
        setCategories([...categories, newCat]);
        setEditingId(newCat.id);
        setTempName(newCat.name);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem a certeza? Os serviços nesta categoria terão de ser reatribuídos manualmente.')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newCats = [...categories];
        if (direction === 'up' && index > 0) {
            [newCats[index], newCats[index - 1]] = [newCats[index - 1], newCats[index]];
        } else if (direction === 'down' && index < newCats.length - 1) {
            [newCats[index], newCats[index + 1]] = [newCats[index + 1], newCats[index]];
        }
        setCategories(newCats);
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setTempName(cat.name);
    };

    const saveEdit = () => {
        if (!editingId) return;
        setCategories(categories.map(c => c.id === editingId ? { ...c, name: tempName } : c));
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const updateColor = (id: string, color: string) => {
        setCategories(categories.map(c => c.id === id ? { ...c, color } : c));
    };

    if (loading) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Grid size={18} className="text-doky-action-cyan" />
                        Gerir Categorias
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
                    <div className="space-y-2">
                        {categories.map((cat, index) => (
                            <div key={cat.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 group">
                                <div className="flex flex-col gap-1">
                                    <button
                                        disabled={index === 0}
                                        onClick={() => handleMove(index, 'up')}
                                        className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        disabled={index === categories.length - 1}
                                        onClick={() => handleMove(index, 'down')}
                                        className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300"
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    {editingId === cat.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                            />
                                            <button onClick={saveEdit} className="text-green-600 p-1 hover:bg-green-50 rounded"><Check size={16} /></button>
                                            <button onClick={cancelEdit} className="text-red-400 p-1 hover:bg-red-50 rounded"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-700 text-sm">{cat.name}</span>
                                            <button onClick={() => startEdit(cat)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 p-1 transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 cursor-pointer shadow-sm">
                                        <input
                                            type="color"
                                            value={cat.color || '#0f766e'}
                                            onChange={(e) => updateColor(cat.id, e.target.value)}
                                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="text-center py-8 text-slate-400 text-sm italic">
                                Nenhuma categoria definida.
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAdd}
                        className="mt-4 w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Nova Categoria
                    </button>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-bold rounded-lg hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
                    >
                        {saving && <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white" />}
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};
