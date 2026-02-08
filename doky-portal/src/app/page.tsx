
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 text-center relative overflow-hidden">

        {/* Logo/Brand Area */}
        <div className="mb-8">
          <h1 className="text-3xl font-black font-heading text-[var(--color-doky-blue)] tracking-tight">
            CLÍNICA <span className="text-[var(--color-doky-action-cyan)]">CENTRAL</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">Mark e Pronto</p>
        </div>

        {/* Hero Illustration Placeholder */}
        <div className="w-24 h-24 bg-gradient-to-tr from-[var(--color-doky-blue)] to-[var(--color-doky-bright)] rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg shadow-cyan-200">
          <Calendar className="text-white w-10 h-10" />
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Agende a sua consulta</h2>
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            Selecione o serviço, escolha o profissional e marque o seu horário em menos de 1 minuto.
          </p>

          <Link
            href="/booking"
            className="btn-primary w-full mt-6 group"
          >
            Começar Agora
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
          <div className="flex justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-[var(--color-doky-success)]" />
              <span>Sem registo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-[var(--color-doky-success)]" />
              <span>Confirmado</span>
            </div>
          </div>
          <Link
            href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3000"}
            target="_blank"
            className="text-[10px] text-slate-300 hover:text-slate-500 uppercase tracking-widest transition-colors"
          >
            Acesso Backoffice
          </Link>
        </div>

      </div>
    </main>
  );
}
