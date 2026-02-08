import { Service, Staff, Client, Appointment } from './types';

export const SERVICES: Service[] = [
  { id: 's1', name: 'Consulta de Hypnobirthing', category: 'Em Destaque', duration: 60, price: 60, featured: true },
  { id: 's2', name: 'Sessão de Fisioterapia', category: 'Fisioterapia', duration: 60, price: 30 },
  { id: 's3', name: 'Consulta de Fisioterapia', category: 'Fisioterapia', duration: 60, price: 30 },
  { id: 's4', name: 'Sessão Fisioterapia Saúde na Mulher', category: 'Fisioterapia', duration: 60, price: 50 },
  { id: 's5', name: 'Consulta de Cinesiterapia Respiratória', category: 'Fisioterapia', duration: 60, price: 20 },
  { id: 's6', name: 'Consulta de Psicologia (Primeira Consulta)', category: 'Psicologia', duration: 60, price: 65 },
  { id: 's7', name: 'Consulta de Psicologia (Acompanhamento)', category: 'Psicologia', duration: 60, price: 60 },
];

export const STAFF: Staff[] = [
  { id: 'st1', name: 'Joana Gomes', role: 'Hipnobirthing', imageUrl: 'https://picsum.photos/200' },
  { id: 'st2', name: 'Guilherme Oliveira', role: 'Fisioterapeuta', imageUrl: 'https://picsum.photos/201' },
  { id: 'st3', name: 'Daniel Sousa', role: 'Fisioterapeuta', imageUrl: 'https://picsum.photos/202' },
  { id: 'st4', name: 'Marta Rodrigues', role: 'Psicóloga', imageUrl: 'https://picsum.photos/203' },
];

export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Academy For Soul-based Coaching', email: 'contact@soulbased.com', mobile: '', age: 0, lastVisit: 0, segment: 'Potential', avatarColor: 'bg-gray-200' },
  { id: 'c2', name: 'Adrian Marinho', email: 'adrian.m@example.com', mobile: '+351910909547', age: 23, lastVisit: 136, segment: 'Active', avatarColor: 'bg-blue-200' },
  { id: 'c3', name: 'Adriana Costa', email: 'adriana.c@example.com', mobile: '+351969540040', age: 32, lastVisit: 284, segment: 'Active', avatarColor: 'bg-pink-200' },
  { id: 'c4', name: 'Adriana Silva', email: '', mobile: '+351967752063', age: 0, lastVisit: 109, segment: 'Active', avatarColor: 'bg-green-200' },
  { id: 'c5', name: 'Agnes Simplicio', email: 'agnes@example.com', mobile: '+351919376596', age: 38, lastVisit: 455, segment: 'Lost', avatarColor: 'bg-yellow-200' },
  { id: 'c6', name: 'Agostinho Lemos Martins', email: 'agostinho@example.com', mobile: '+351912210263', age: 73, lastVisit: 66, segment: 'Active', avatarColor: 'bg-purple-200' },
];

export const APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientId: 'c2', staffId: 'st3', serviceId: 's2', date: '2026-01-12', startTime: '09:00', status: 'confirmed', color: 'bg-sky-400', notes: 'Paciente queixa-se de dores lombares.' },
  { id: 'a2', clientId: 'c3', staffId: 'st1', serviceId: 's1', date: '2026-01-12', startTime: '10:00', status: 'confirmed', color: 'bg-teal-400' },
  { id: 'a3', clientId: 'c5', staffId: 'st2', serviceId: 's4', date: '2026-01-13', startTime: '11:00', status: 'confirmed', color: 'bg-indigo-400', notes: 'Trazer exames anteriores.' },
  { id: 'a4', clientId: 'c6', staffId: 'st3', serviceId: 's2', date: '2026-01-13', startTime: '09:00', status: 'confirmed', color: 'bg-sky-400' },
  { id: 'a5', clientId: 'c4', staffId: 'st4', serviceId: 's6', date: '2026-01-14', startTime: '14:00', status: 'confirmed', color: 'bg-rose-400' },
  { id: 'a6', clientId: 'c1', staffId: 'st2', serviceId: 's3', date: '2026-01-15', startTime: '10:00', status: 'confirmed', color: 'bg-blue-500', notes: 'Primeira vez na clínica.' },
  { id: 'a7', clientId: 'c2', staffId: 'st2', serviceId: 's3', date: '2026-01-16', startTime: '12:00', status: 'confirmed', color: 'bg-cyan-500' },
  { id: 'a8', clientId: 'c2', staffId: 'st2', serviceId: 's3', date: '2026-01-17', startTime: '10:00', status: 'confirmed', color: 'bg-orange-300' },
];