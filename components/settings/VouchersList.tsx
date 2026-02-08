import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit2, ChevronDown, MoreVertical, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Voucher } from '../../types';

interface VouchersListProps {
    onChange?: () => void;
}

export const VouchersList: React.FC<VouchersListProps> = ({ onChange }) => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Toggles
    const [showDetails, setShowDetails] = useState(false);
    const [showVat, setShowVat] = useState(false);
    const [showCommissions, setShowCommissions] = useState(false);

    useEffect(() => {
        loadVouchers();
    }, []);

    const loadVouchers = async () => {
        try {
            const data = await api.fetchVouchers();
            setVouchers(data.map(v => ({
                ...v,
                vat: v.vat ?? 23,
                commissions: v.commissions || { executing: { value: 0, type: '%' }, responsible: { value: 0, type: '%' } }
            })));
        } catch (error) {
            console.error('Failed to load vouchers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, field: keyof Voucher, value: any) => {
        const updatedVouchers = vouchers.map(v =>
            v.id === id ? { ...v, [field]: value } : v
        );
        setVouchers(updatedVouchers);

        const voucherToUpdate = updatedVouchers.find(v => v.id === id);
        if (voucherToUpdate) {
            await api.updateVoucher(voucherToUpdate);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este voucher?')) {
            const originalVouchers = [...vouchers];
            setVouchers(vouchers.filter(v => v.id !== id));
            const success = await api.deleteVoucher(id);
            if (!success) {
                setVouchers(originalVouchers);
                alert("Erro ao eliminar voucher");
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        await loadVouchers();
        setSaving(false);
    };

    const handleCreate = async () => {
        const newVoucher: Voucher = {
            id: crypto.randomUUID(),
            name: 'Novo Voucher',
            price: 0,
            discountPercent: 0,
            validityDays: 365,
            category: 'Geral',
            items: [],
            commissions: { executing: { value: 0, type: '%' }, responsible: { value: 0, type: '%' } },
            vat: 23
        };
        setVouchers([newVoucher, ...vouchers]);
        await api.createVoucher(newVoucher);
    };

    if (loading) return <div className="p-8 text-center text-slate-400">A carregar vouchers...</div>;

    return (
        <div className="max-w-screen-xl mx-auto pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Packs de sessões & Vouchers</h2>
                    <p className="text-slate-500 text-sm mt-1">Crie e gira vouchers e packs de serviços. Pode definir descontos, validades e conteúdos específicos.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-white text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                        IMPRIMIR
                    </button>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-bold rounded-lg hover:shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wide"
                    >
                        <Plus size={18} />
                        ADICIONAR
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-bold rounded-lg hover:shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wide disabled:opacity-70 disabled:grayscale"
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

            {/* Config & Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-sm">
                        <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Mostrar:</span>

                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" checked={showDetails} onChange={(e) => setShowDetails(e.target.checked)} className="peer sr-only" />
                                <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-doky-action-cyan peer-checked:border-doky-action-cyan transition-all"></div>
                                <svg className="absolute w-3 h-3 text-white hidden peer-checked:block top-0.5 left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-slate-600 font-medium group-hover:text-doky-blue transition-colors">Detalhes</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" checked={showVat} onChange={(e) => setShowVat(e.target.checked)} className="peer sr-only" />
                                <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-doky-action-cyan peer-checked:border-doky-action-cyan transition-all"></div>
                                <svg className="absolute w-3 h-3 text-white hidden peer-checked:block top-0.5 left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-slate-600 font-medium group-hover:text-doky-blue transition-colors">IVA</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" checked={showCommissions} onChange={(e) => setShowCommissions(e.target.checked)} className="peer sr-only" />
                                <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-doky-action-cyan peer-checked:border-doky-action-cyan transition-all"></div>
                                <svg className="absolute w-3 h-3 text-white hidden peer-checked:block top-0.5 left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-slate-600 font-medium group-hover:text-doky-blue transition-colors">Comissões</span>
                        </label>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-b border-slate-200/60">
                            <tr>
                                <th className="py-3 px-4 min-w-[250px]">Nome</th>
                                <th className="py-3 px-4 w-24">Ref.</th>
                                <th className="py-3 px-4 w-32 text-right">Preço</th>
                                <th className="py-3 px-4 w-24 text-center">Desc. %</th>
                                <th className="py-3 px-4 w-40 text-right">Preço atual dos itens</th>
                                <th className="py-3 px-4 w-32 text-center">Validade (dias)</th>
                                {showVat && <th className="py-3 px-4 w-24 text-center">IVA</th>}
                                <th className="py-3 px-4 w-48">Categoria</th>
                                <th className="py-3 px-4 w-40 text-center">Editar conteúdo</th>
                                <th className="py-3 px-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vouchers.map((voucher) => {
                                // Calculate "Value of Items" - simplified logic for demo
                                const discountPct = voucher.discountPercent || 0;
                                const itemsValue = discountPct >= 100 ? '0.00' : (voucher.price / (1 - discountPct / 100)).toFixed(2);

                                return (
                                    <tr key={voucher.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="p-2 pl-4">
                                            <input
                                                type="text"
                                                value={voucher.name}
                                                onChange={(e) => handleUpdate(voucher.id, 'name', e.target.value)}
                                                className="w-full bg-transparent font-medium text-slate-700 py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all placeholder-slate-400"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={voucher.ref || ''}
                                                onChange={(e) => handleUpdate(voucher.id, 'ref', e.target.value)}
                                                className="w-full bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all placeholder-slate-300"
                                            />
                                        </td>
                                        <td className="p-2 text-right">
                                            <input
                                                type="number"
                                                value={voucher.price}
                                                onChange={(e) => handleUpdate(voucher.id, 'price', parseFloat(e.target.value))}
                                                className="w-full bg-transparent font-bold text-slate-700 py-1.5 px-2 rounded text-right hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                                step="0.01"
                                            />
                                        </td>
                                        <td className="p-2 text-center">
                                            <input
                                                type="number"
                                                value={voucher.discountPercent || 0}
                                                onChange={(e) => handleUpdate(voucher.id, 'discountPercent', parseFloat(e.target.value))}
                                                className="w-full bg-transparent text-slate-600 text-sm text-center py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                            />
                                        </td>
                                        <td className="p-2 text-right">
                                            <span className="text-slate-400 text-sm font-medium px-2">{itemsValue} €</span>
                                        </td>
                                        <td className="p-2 text-center">
                                            <input
                                                type="number"
                                                value={voucher.validityDays || 365}
                                                onChange={(e) => handleUpdate(voucher.id, 'validityDays', parseInt(e.target.value))}
                                                className="w-full bg-transparent text-slate-600 text-sm text-center py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                            />
                                        </td>
                                        {showVat && (
                                            <td className="p-2 text-center">
                                                <select
                                                    value={voucher.vat || 23}
                                                    onChange={(e) => handleUpdate(voucher.id, 'vat', parseFloat(e.target.value))}
                                                    className="bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all appearance-none cursor-pointer text-center"
                                                >
                                                    <option value={23}>23%</option>
                                                    <option value={13}>13%</option>
                                                    <option value={6}>6%</option>
                                                    <option value={0}>0%</option>
                                                </select>
                                            </td>
                                        )}
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={voucher.category}
                                                onChange={(e) => handleUpdate(voucher.id, 'category', e.target.value)}
                                                className="w-full bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                            />
                                        </td>
                                        <td className="p-2 text-center">
                                            <button className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-doky-action-cyan transition-colors">
                                                <Edit2 size={14} />
                                                {voucher.items?.length || 0} Item(s)
                                            </button>
                                        </td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => handleDelete(voucher.id)}
                                                className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Actions - Repeated for convenience as requested by screenshot implication */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 justify-end flex gap-3">
                    <button className="px-5 py-2 bg-white text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                        IMPRIMIR
                    </button>
                    <button
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-medium rounded-lg hover:shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wide"
                    >
                        <Plus size={16} />
                        ADICIONAR
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-doky-action-cyan to-doky-blue text-white text-sm font-medium rounded-lg hover:shadow-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-cyan-500/20 uppercase tracking-wide disabled:opacity-70 disabled:grayscale"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        ) : <Save size={16} />}
                        {saving ? 'A GRAVAR...' : 'GUARDAR'}
                    </button>
                </div>
            </div>
        </div>
    );
};
