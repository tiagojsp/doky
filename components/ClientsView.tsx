import React, { useState } from 'react';
import { Client, Appointment } from '../types';
import { api } from '../services/api';
import { Search, Trash2, UserPlus, Phone } from 'lucide-react';
import { ClientFormModal } from './ClientFormModal';

interface Props {
  clients: Client[];
  appointments?: Appointment[];
  initialSelectedClientId?: string | null;
  onClearSelection?: () => void;
  onClientChange: () => void;
}

export const ClientsView: React.FC<Props> = ({ clients, appointments, initialSelectedClientId, onClearSelection, onClientChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Set initial edit if provided
  React.useEffect(() => {
    if (initialSelectedClientId) {
      const client = clients.find(c => c.id === initialSelectedClientId);
      if (client) {
        setEditingClient(client);
      }
    }
  }, [initialSelectedClientId, clients]);

  const handleCloseModal = () => {
    setEditingClient(null);
    if (onClearSelection) onClearSelection();
  };

  const handleSave = async (clientToSave: Client) => {
    const success = await api.updateClient(clientToSave);
    if (success) {
      onClientChange();
      handleCloseModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem a certeza que deseja eliminar este cliente?')) {
      const success = await api.deleteClient(id);
      if (success) {
        onClientChange();
        // If we deleted the currently editing client, close modal (handled by onDelete callback in modal?)
        // If called from the list item trash icon:
        if (editingClient?.id === id) {
          handleCloseModal();
        }
      }
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="p-4 md:p-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Base de Clientes</h2>
            <p className="text-slate-500 text-sm">Gerencie seus pacientes e históricos</p>
          </div>
          <button
            onClick={() => {
              const newClient: Client = {
                id: crypto.randomUUID(),
                name: '',
                email: '',
                mobile: '',
                gender: 'F',
                age: 0,
                lastVisit: 0,
                segment: 'Potential',
                consent: { marketing: false, sms: false, email: false, photos: false }
              };
              setEditingClient(newClient);
            }}
            className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all">
            <UserPlus size={18} />
            Novo Cliente
          </button>
        </div>

        <div className="glass-card p-2 rounded-2xl flex items-center gap-2">
          <Search className="text-slate-400 ml-3 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou telemóvel..."
            className="bg-transparent border-none outline-none w-full p-2 text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto px-4 md:px-8 pb-8 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div key={client.id} onClick={() => setEditingClient(client)} className="group bg-white/40 hover:bg-white/80 border border-white/50 backdrop-blur-sm p-5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${client.segment === 'Active' ? 'bg-green-400' : client.segment === 'Lost' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>

              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl ${client.avatarColor || 'bg-slate-200'} flex items-center justify-center text-slate-700 font-bold text-xl shadow-inner`}>
                  {client.name.charAt(0)}
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              <h3 className="font-bold text-slate-800 text-lg truncate">{client.name}</h3>
              <p className="text-sm text-slate-500 truncate mb-4">{client.email || 'Sem email'}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 p-2 rounded-lg">
                  <Phone size={14} className="text-cyan-500" />
                  <span>{client.mobile}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-500 px-1">
                  <span>Última visita: {client.lastVisit > 0 ? `${client.lastVisit} dias atrás` : 'Nunca'}</span>
                  <span className={`${client.segment === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>{client.segment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingClient && (
        <ClientFormModal
          client={editingClient}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}
          appointments={appointments}
        />
      )}
    </div >
  );
};