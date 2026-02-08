import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Filter, Search, ChevronDown, MoreVertical } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';

interface Props {
    onChange?: () => void;
}

export const ProductsList: React.FC<Props> = ({ onChange }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas categorias');
    const [selectedBrand, setSelectedBrand] = useState<string>('Todas sub-categorias/marcas');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await api.fetchProducts();
            // Enrich with defaults if needed
            const enriched = data.map(p => ({
                ...p,
                price: p.price ?? 0,
                vat: p.vat ?? 23,
                category: p.category || 'Geral',
                brand: p.brand || 'Genérico',
                commissions: p.commissions || { executing: { value: 0, type: '%' }, responsible: { value: 0, type: '%' } }
            }));
            setProducts(enriched);
        } catch (error) {
            console.error('Failed to load products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, field: keyof Product, value: any) => {
        const updatedProducts = products.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        );
        setProducts(updatedProducts);

        const productToUpdate = updatedProducts.find(p => p.id === id);
        if (productToUpdate) {
            await api.updateProduct(productToUpdate);
            if (onChange) onChange();
        }
    };

    const handleCommissionUpdate = async (id: string, type: 'executing' | 'responsible', field: 'value' | 'type', value: any) => {
        const updatedProducts = products.map(p => {
            if (p.id !== id) return p;
            const commissions = p.commissions || { executing: { value: 0, type: '%' }, responsible: { value: 0, type: '%' } };
            return {
                ...p,
                commissions: {
                    ...commissions,
                    [type]: {
                        ...commissions[type],
                        [field]: value
                    }
                }
            };
        });
        setProducts(updatedProducts);

        const productToUpdate = updatedProducts.find(p => p.id === id);
        if (productToUpdate) {
            await api.updateProduct(productToUpdate);
            if (onChange) onChange();
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem a certeza que deseja eliminar este produto?')) {
            const originalProducts = [...products];
            setProducts(products.filter(p => p.id !== id));
            const success = await api.deleteProduct(id);
            if (!success) {
                setProducts(originalProducts);
                alert("Erro ao eliminar produto");
            } else {
                if (onChange) onChange();
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        await loadProducts();
        if (onChange) onChange();
        setSaving(false);
    };

    const handleCreate = async () => {
        const newProduct: Product = {
            id: crypto.randomUUID(),
            name: 'Novo Produto',
            description: '',
            invoiceNotes: '',
            ref: '',
            barcode: '',
            price: 0,
            vat: 23,
            vatExemption: '',
            commissions: { executing: { value: 0, type: '%' }, responsible: { value: 0, type: '%' } },
            category: 'Geral',
            brand: 'Genérico'
        };
        setProducts([newProduct, ...products]);
        await api.createProduct(newProduct);
        if (onChange) onChange();
    };

    // Filter Logic
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.ref?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas categorias' || p.category === selectedCategory;
        const matchesBrand = selectedBrand === 'Todas sub-categorias/marcas' || p.brand === selectedBrand;
        return matchesSearch && matchesCategory && matchesBrand;
    });

    // Unique options for dropdowns
    const categories = ['Todas categorias', ...Array.from(new Set(products.map(p => p.category)))];
    const brands = ['Todas sub-categorias/marcas', ...Array.from(new Set(products.map(p => p.brand || 'Genérico')))];

    if (loading) return <div className="p-8 text-center text-slate-400">A carregar produtos...</div>;

    // Group filtered products by category
    const groupedProducts = filteredProducts.reduce((acc, product) => {
        const cat = product.category || 'Sem Categoria';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <div className="max-w-screen-xl mx-auto pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lista de Produtos</h2>
                    <p className="text-slate-500 text-sm mt-1">Gerencie o seu catálogo de produtos, stocks e preços.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-white text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                        Exportar
                    </button>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-cyan-600 focus:ring-4 focus:ring-cyan-100 transition-all shadow-md shadow-blue-500/20">
                        <Plus size={18} />
                        Novo Produto
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
                                placeholder="Pesquisar produto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64 transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-48 transition-all appearance-none cursor-pointer text-slate-600"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            {/* Add more toggles if needed, for now placeholders to match visual weight if desired */}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-b border-slate-200/60">
                            <tr>
                                <th className="w-10 py-3 pl-4"></th>
                                <th className="py-3 px-4 min-w-[200px]">Nome</th>
                                <th className="py-3 px-4 w-24">Ref.</th>
                                <th className="py-3 px-4 w-32 text-right">Preço</th>
                                <th className="py-3 px-4 w-24 text-right">IVA %</th>
                                <th className="py-3 px-4 w-48">Marca</th>
                                <th className="py-3 px-4 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {Object.entries(groupedProducts).map(([category, catProducts]) => (
                                <React.Fragment key={category}>
                                    {category !== 'Todas' && selectedCategory === 'Todas' && (
                                        <tr className="bg-slate-50/30">
                                            <td colSpan={8} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100/50 border-t border-b border-slate-100">
                                                {category}
                                            </td>
                                        </tr>
                                    )}
                                    {(catProducts as Product[]).map((product) => (
                                        <tr key={product.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="py-3 pl-4 text-center">
                                                <MoreVertical size={14} className="text-slate-300 cursor-grab hover:text-slate-500 active:cursor-grabbing" />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={product.name}
                                                    onChange={(e) => handleUpdate(product.id, 'name', e.target.value)}
                                                    className="w-full bg-transparent font-medium text-slate-700 py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all placeholder-slate-400"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={product.ref || ''}
                                                    onChange={(e) => handleUpdate(product.id, 'ref', e.target.value)}
                                                    className="w-full bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all placeholder-slate-300"
                                                />
                                            </td>
                                            <td className="p-2 text-right">
                                                <input
                                                    type="number"
                                                    value={product.price}
                                                    onChange={(e) => handleUpdate(product.id, 'price', parseFloat(e.target.value))}
                                                    className="w-full bg-transparent font-bold text-slate-700 py-1.5 px-2 rounded text-right hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="p-2 text-right">
                                                <div className="relative">
                                                    <select
                                                        value={product.vat || 23}
                                                        onChange={(e) => handleUpdate(product.id, 'vat', parseFloat(e.target.value))}
                                                        className="w-full bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded text-right hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value={23}>23%</option>
                                                        <option value={13}>13%</option>
                                                        <option value={6}>6%</option>
                                                        <option value={0}>0%</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={product.brand || ''}
                                                    onChange={(e) => handleUpdate(product.id, 'brand', e.target.value)}
                                                    className="w-full bg-transparent text-slate-500 text-xs py-1.5 px-2 rounded hover:bg-white hover:shadow-sm focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                                                    placeholder="Marca"
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={() => handleDelete(product.id)}
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
                <div className="p-4 border-t border-slate-100 bg-slate-50 justify-end flex">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        ) : <Save size={16} />}
                        {saving ? 'A Guardar...' : 'Guardar Alterações'}
                    </button>
                </div>
            </div>
        </div>
    );
};
