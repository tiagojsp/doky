# DOKY - Sistema de Agendamento Inteligente

**Sistema completo de gestão de agendamentos para clínicas, salões de beleza e consultórios**

---

## 📋 Visão Geral

DOKY é uma solução moderna e completa para gestão de agendamentos, desenvolvida com as mais recentes tecnologias web. O sistema oferece duas aplicações integradas:

- **🖥️ Painel Administrativo** - Interface completa de gestão (React + Vite)
- **🌐 Portal Público** - Agendamento online para clientes (Next.js)

### Por que DOKY?

✅ **Moderno** - React 19, Next.js 16, TypeScript 5.8  
✅ **Rápido** - Vite para dev, otimizações SSR no portal  
✅ **Escalável** - Supabase PostgreSQL com RLS  
✅ **Inteligente** - Assistente IA integrado (Claude)  
✅ **Flexível** - Terminologia customizável, multi-idioma  
✅ **Completo** - Kiosk, portal, admin em um único sistema

---

## ✨ Características

### Painel Administrativo

- 📅 **Agenda Visual** - Calendário interativo com visualizações mensais/semanais
- 👥 **Gestão de Clientes** - CRUD completo com histórico e segmentação
- 💼 **Gestão de Serviços** - Categorias, preços, VAT, colaboradores
- 🏥 **Gestão de Staff** - Horários, disponibilidade, comissões
- 📊 **Dashboard & Relatórios** - KPIs e métricas de negócio
- 🎨 **Modo Kiosk** - Agendamento em quiosque com screensaver
- 🤖 **Assistente IA** - Chat inteligente com contexto de dados
- 🔔 **Notificações** - Sistema de toasts para feedback

### Portal Público

- 🎯 **Booking Wizard** - Processo guiado em 4 passos
- 📱 **Responsivo** - Design mobile-first
- ⚡ **Rápido** - SSR com Next.js para SEO otimizado
- 🎨 **Customizável** - Cores, logo, terminologia por negócio

---

## 🚀 Instalação Rápida

### 1. Instalar dependências

```bash
# Aplicação Principal
npm install

# Portal Público
cd doky-portal && npm install && cd ..
```

### 2. Configurar Supabase

1. Crie projeto em [supabase.com](https://supabase.com)
2. Execute o SQL em `supabase_setup.sql` no SQL Editor
3. Copie URL e anon key do projeto

### 3. Configurar variáveis de ambiente

**`.env.local` (raiz)**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_OPENROUTER_API_KEY=sua-key-opcional
```

**`doky-portal/.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
NEXT_PUBLIC_ADMIN_URL=http://localhost:3000
```

### 4. Iniciar aplicações

```bash
# Terminal 1 - Admin (porta 3000)
npm run dev

# Terminal 2 - Portal (porta 3001)
cd doky-portal && npm run dev
```

Acesse:
- **Admin**: http://localhost:3000
- **Portal**: http://localhost:3001

---

## 📁 Estrutura

```
DOKY/
├── components/          # Componentes React (Admin, Agenda, Booking, etc)
├── hooks/              # Custom hooks (useAppointments, useClients, etc)
├── contexts/           # Context API (ToastContext)
├── services/           # API layer (api.ts, ai.ts)
├── lib/                # Utilitários (supabase.ts)
├── doky-portal/        # Portal Next.js
│   ├── src/app/        # Pages Next.js
│   ├── src/components/ # Componentes do portal
│   ├── src/contexts/   # ToastContext
│   └── src/lib/        # Supabase client
├── supabase_setup.sql  # Schema completo Supabase
└── README.md           # Este arquivo
```

---

## 🏗️ Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|---------|
| **Frontend Admin** | React | 19.2.3 |
| **Frontend Portal** | Next.js | 16.1.6 |
| **Linguagem** | TypeScript | 5.8 |
| **Build Tool** | Vite | 6.2.0 |
| **Estilo** | Tailwind CSS | 3.4.17 |
| **Backend** | Supabase | 2.90.1 |
| **Database** | PostgreSQL | Cloud |
| **IA** | OpenRouter | Claude 3.5 |

---

## 💻 Scripts Disponíveis

### Main App
```bash
npm run dev      # Servidor desenvolvimento (porta 3000)
npm run build    # Build para produção
npm run lint     # Type checking TypeScript
npm run preview  # Preview do build
```

### Portal
```bash
cd doky-portal
npm run dev      # Servidor desenvolvimento (porta 3001)
npm run build    # Build para produção
npm start        # Servidor produção
npm run lint     # Linting
```

---

## 🗄️ Supabase Setup

O arquivo `supabase_setup.sql` inclui:

✅ **8 tabelas principais** (services, staff, clients, appointments, etc)  
✅ **Índices** para performance  
✅ **RLS policies** para segurança  
✅ **Triggers** para updated_at  
✅ **Seed data** inicial  

**Como aplicar:**
1. Abra SQL Editor no Supabase
2. Cole conteúdo de `supabase_setup.sql`
3. Execute
4. Verifique criação de tabelas

---

## 🔧 Troubleshooting

### "Failed to fetch services"
**Solução:** Verifique `.env.local` e execute `supabase_setup.sql`

### Portal sem toasts
**Solução:** ToastProvider já configurado em `layout.tsx`

### Erros TypeScript
**Solução:** `npm install --save-dev @types/react @types/react-dom`

---

## 🚢 Deploy

### Vercel (Recomendado)

**Main App:**
```bash
npm run build
# Deploy pasta dist/
```

**Portal:**
```bash
cd doky-portal
npm run build
# Deploy automático com Vercel CLI
```

**Variáveis de ambiente necessárias:**
- Main: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Portal: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_URL`

---

## 📚 Documentação

### Hooks Principais

```typescript
// Appointments
const { appointments, loading, addAppointment } = useAppointments();

// Clients
const { clients, refreshClients } = useClients();

// Toast
const toast = useToast();
toast.success("Sucesso!");
```

### API

```typescript
import { api } from './services/api';

await api.fetchServices();
await api.createAppointment(data);
await api.updateClient(client);
```

---

## 🤝 Contribuir

1. Fork o projeto
2. Crie branch (`git checkout -b feature/Nova`)
3. Commit (`git commit -m 'feat: Nova funcionalidade'`)
4. Push (`git push origin feature/Nova`)
5. Pull Request

---

## 📄 Licença

MIT License - Veja LICENSE para detalhes

---

## 👥 Créditos

Desenvolvido com ❤️ usando:
- React, Next.js, TypeScript
- Supabase, Tailwind CSS
- Lucide Icons, OpenRouter

---

**DOKY** - Agendamento Inteligente 💙
