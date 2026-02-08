import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Staff } from '../../types';
import { Search, Plus, Trash2, Edit, MoreVertical, Check, X, User, ChevronDown } from 'lucide-react';

interface CollaboratorsListProps {
    onEdit: (staff: Staff) => void;
    onChange?: () => void;
}

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({ onEdit, onChange }) => {
    const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const data = await api.fetchStaff();
            setStaffMembers(data);
        } catch (error) {
            console.error("Failed to load staff", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermission = async (staffId: string, field: keyof NonNullable<Staff['permissions']>) => {
        const updatedMembers = staffMembers.map(staff => {
            if (staff.id === staffId && staff.permissions) {
                return {
                    ...staff,
                    permissions: {
                        ...staff.permissions,
                        [field]: !staff.permissions[field]
                    }
                };
            }
            return staff;
        });
        setStaffMembers(updatedMembers);

        // Save change
        const member = updatedMembers.find(s => s.id === staffId);
        if (member) await api.updateStaff(member);
    };

    const handleOrderChange = async (staffId: string, newOrder: string) => {
        const order = parseInt(newOrder);
        if (isNaN(order)) return;

        const updatedMembers = staffMembers.map(staff =>
            staff.id === staffId ? { ...staff, order } : staff
        );
        setStaffMembers(updatedMembers);
        // Debounce save in real app
        const member = updatedMembers.find(s => s.id === staffId);
        if (member) await api.updateStaff(member);
    };

    const createNew = () => {
        const newStaff: Staff = {
            id: crypto.randomUUID(),
            name: 'Novo Colaborador',
            role: 'Profissional',
            permissions: { hasOwnAgenda: true, visibleInApp: true, onlineBookingEnabled: true },
            commissions: { executing: { value: 0, type: '%' }, responsible: { value: 0, type: '%' } },
            schedule: {
                'mon': { enabled: true, start: '09:00', end: '18:00' },
                'tue': { enabled: true, start: '09:00', end: '18:00' },
                'wed': { enabled: true, start: '09:00', end: '18:00' },
                'thu': { enabled: true, start: '09:00', end: '18:00' },
                'fri': { enabled: true, start: '09:00', end: '18:00' }
            }
        };
        onEdit(newStaff);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">A carregar colaboradores...</div>;

    return (
        <div className="w-full pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lista de Colaboradores</h2>
                    <p className="text-slate-500 text-sm mt-1">Gerir permissões, agendas e acesso dos colaboradores.</p>
                </div>

                <button
                    onClick={createNew}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-cyan-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-blue-500/20"
                >
                    <Plus size={18} />
                    Novo Colaborador
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px] md:text-xs border-b border-slate-200/60">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-400">Colaborador</th>
                                <th className="px-6 py-4 font-bold text-center text-slate-400">Email</th>
                                <th className="px-6 py-4 font-bold text-slate-400">Nível de acesso</th>
                                <th className="px-6 py-4 font-bold text-slate-400">Local</th>
                                <th className="px-4 py-4 font-bold text-center text-slate-400 w-24 leading-tight">Agenda<br />Própria</th>
                                <th className="px-4 py-4 font-bold text-center text-slate-400 w-24 leading-tight">Visível<br />na App</th>
                                <th className="px-4 py-4 font-bold text-center text-slate-400 w-24 leading-tight">Marcações<br />Online</th>
                                <th className="px-4 py-4 font-bold text-center text-slate-400 w-24 leading-tight">Ordem<br />Agenda</th>
                                <th className="px-4 py-4 font-bold text-center text-slate-400">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {staffMembers.map((staff) => (
                                <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {staff.imageUrl ? (
                                                <img src={staff.imageUrl} alt={staff.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm text-sm`} style={{ backgroundColor: staff.color || '#cbd5e1' }}>
                                                    {staff.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700">{staff.name}</span>
                                                <span className="text-xs text-slate-400 font-medium">{staff.role}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-blue-500 group-hover:shadow-sm border border-transparent group-hover:border-slate-100 transition-all cursor-pointer" title={staff.email}>
                                            <span className="text-sm">✉</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <select
                                                value={staff.accessLevel || 'user'}
                                                onChange={async (e) => {
                                                    const updated = { ...staff, accessLevel: e.target.value as any };
                                                    setStaffMembers(prev => prev.map(s => s.id === staff.id ? updated : s));
                                                    await api.updateStaff(updated);
                                                }}
                                                className="bg-transparent text-slate-600 font-medium text-xs w-full cursor-pointer outline-none hover:text-blue-600 appearance-none py-1"
                                            >
                                                <option value="admin">Administrador</option>
                                                <option value="user">P. Serviços</option>
                                            </select>
                                            <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-slate-400 font-medium italic">
                                            Selecione local
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex justify-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={staff.permissions?.hasOwnAgenda}
                                                    onChange={() => handleTogglePermission(staff.id, 'hasOwnAgenda')}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-5 h-5 cursor-pointer"
                                                />
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={staff.permissions?.visibleInApp}
                                                onChange={() => handleTogglePermission(staff.id, 'visibleInApp')}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-5 h-5 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={staff.permissions?.onlineBookingEnabled}
                                                onChange={() => handleTogglePermission(staff.id, 'onlineBookingEnabled')}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 w-5 h-5 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <input
                                            type="number"
                                            value={staff.order || 1}
                                            onChange={(e) => handleOrderChange(staff.id, e.target.value)}
                                            className="w-12 text-center bg-white border border-slate-200 rounded-lg py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                                        />
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex items-center gap-2 justify-center">
                                            <button
                                                onClick={() => onEdit(staff)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Tem a certeza que deseja eliminar este colaborador?')) {
                                                        const success = await api.deleteStaff(staff.id);
                                                        if (success) {
                                                            setStaffMembers(prev => prev.filter(s => s.id !== staff.id));
                                                        } else {
                                                            alert('Erro ao eliminar colaborador.');
                                                        }
                                                    }
                                                }}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
