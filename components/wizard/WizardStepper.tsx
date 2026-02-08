import React from 'react';
import { Check } from 'lucide-react';

interface Props {
    currentStep: number;
    steps: string[];
}

export const WizardStepper: React.FC<Props> = ({ currentStep, steps }) => {
    return (
        <div className="w-full max-w-4xl mx-auto mb-16 px-4">
            <div className="relative flex items-center justify-between">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 backdrop-blur rounded-full -z-10 shadow-inner"></div>

                {/* Active Progress Bar Gradient */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-doky-action-cyan to-doky-bright-cyan rounded-full -z-10 transition-all duration-700 ease-in-out glow-primary shadow-[0_0_20px_rgba(0,194,224,0.4)]"
                    style={{ width: `${steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center group relative">
                            {/* Step Indicator */}
                            <div
                                className={`
                                    relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10
                                    ${isActive
                                        ? 'bg-white border-white text-doky-blue shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-110'
                                        : isCompleted
                                            ? 'bg-doky-action-cyan border-doky-action-cyan text-white shadow-lg shadow-cyan-500/20'
                                            : 'bg-white/5 backdrop-blur-md border-white/20 text-white/40'
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <Check size={20} strokeWidth={3} className="animate-in zoom-in duration-300" />
                                ) : (
                                    <span className={`text-sm md:text-base font-black font-heading ${isActive ? 'text-doky-blue' : ''}`}>
                                        {index + 1}
                                    </span>
                                )}

                                {/* Under-circle glow for active */}
                                {isActive && (
                                    <div className="absolute inset-0 rounded-full bg-white blur-xl opacity-30 -z-10 animate-pulse"></div>
                                )}
                            </div>

                            {/* Label */}
                            <div className="absolute top-14 md:top-16 flex flex-col items-center">
                                <span
                                    className={`
                                        text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap
                                        ${isActive
                                            ? 'text-white opacity-100 translate-y-0'
                                            : isCompleted
                                                ? 'text-white/90 translate-y-0'
                                                : 'text-white/60 translate-y-1'
                                        }
                                    `}
                                >
                                    {step}
                                </span>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-doky-action-cyan mt-1 shadow-[0_0_8px_rgba(0,194,224,0.6)] animate-bounce"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
