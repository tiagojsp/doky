import React, { Component, ErrorInfo, ReactNode, PropsWithChildren } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<PropsWithChildren<{}>, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        const { children } = this.props;

        if (this.state.hasError) {
            return (
                <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops! Algo correu mal.</h1>
                        <p className="text-slate-500 mb-6">
                            Não se preocupe, os seus dados estão seguros. Ocorreu um erro inesperado na aplicação.
                        </p>

                        <div className="bg-slate-50 p-4 rounded-xl text-left mb-6 overflow-auto max-h-40 text-xs font-mono text-slate-600 border border-slate-200">
                            {this.state.error?.message || "Unknown Error"}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mx-auto"
                        >
                            <RefreshCw size={18} />
                            Recarregar Aplicação
                        </button>
                    </div>
                </div>
            );
        }

        return children;
    }
}
