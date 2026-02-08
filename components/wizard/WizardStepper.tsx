import React from 'react';
import { Check, User, Calendar, FileText, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
    currentStep: number;
    steps: string[];
}

export const WizardStepper: React.FC<Props> = ({ currentStep, steps }) => {
    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4">
            <div className="relative flex items-center justify-between">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full -z-10"></div>

                {/* Active Progress Bar */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] rounded-full -z-10 transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center group relative">
                            <div
                                className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                  ${isActive
                                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-110'
                                        : isCompleted
                                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                                            : 'bg-white/80 border-slate-300 text-slate-500'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <Check size={16} strokeWidth={3} />
                                ) : (
                                    <span className="text-xs md:text-sm font-bold">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={`
                  absolute top-10 md:top-12 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap hidden md:block
                  ${isActive ? 'text-[var(--color-primary)] translate-y-0 opacity-100' : 'text-slate-600 translate-y-1 opacity-0 md:opacity-100'}
                `}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
