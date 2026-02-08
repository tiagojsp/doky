import React, { useState, useEffect } from 'react';
import { X, Save, Search, Check } from 'lucide-react';
import { Service, Staff } from '../../types';
import { api } from '../../services/api';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    service: Service;
    onSave: (updatedService: Service) => void;
}

export const ServiceCollaboratorsModal: React.FC<Props> = ({ isOpen, onClose, service, onSave }) => {
    const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, service]);

    const loadData = async () => {
        setLoading(true);
        try {
            const staff = await api.fetchStaff();
            setStaffMembers(staff);
            setSelectedIds(service.collaborators || []);
        } catch (error) {
            console.error("Failed to load staff", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStaff = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(mid => mid !== id)
                : [...prev, id]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updatedService = { ...service, collaborators: selectedIds };
            await api.updateService(updatedService);
            onSave(updatedService);
            onClose();
        } catch (error) {
            console.error("Failed to save service collaborators", error);
            alert("Erro ao guardar colaboradores.");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const filteredStaff = staffMembers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">

                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-700">Atribuir Colaboradores</h2>
                        <p className="text-xs text-slate-500 mt-1">Quem realiza o serviço <span className="font-bold text-slate-700">{service.name}</span>?</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm hover:shadow transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-100 bg-white">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar colaborador..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400 text-sm">A carregar...</div>
                    ) : (
                        <div className="space-y-1">
                            {filteredStaff.map(staff => {
                                const isSelected = selectedIds.includes(staff.id);
                                return (
                                    <div
                                        key={staff.id}
                                        onClick={() => toggleStaff(staff.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-cyan-50 border-cyan-200' : 'bg-white border-transparent hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'bg-white border-slate-300'}`}>
                                            {isSelected && <Check size={12} className="text-white" />}
                                        </div>

                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm`} style={{ backgroundColor: staff.color || '#94a3b8' }}>
                                            {staff.imageUrl ? (
                                                <img src={staff.imageUrl} alt={staff.name} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                staff.name.charAt(0)
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <p className={`text-sm font-bold ${isSelected ? 'text-cyan-900' : 'text-slate-700'}`}>{staff.name}</p>
                                            <p className="text-xs text-slate-400">{staff.role}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredStaff.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-xs">Nenhum colaborador encontrado.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                        <span className="font-bold text-slate-700">{selectedIds.length}</span> selecionados
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg text-sm font-bold transition-all">
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {saving ? 'A Guardar...' : 'Guardar'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
