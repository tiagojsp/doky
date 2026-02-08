import { EstablishmentSettings, Terminology } from '../types';

const DEFAULT_TERMS: Terminology = {
    service_label: 'Serviço',
    service_subtitle: 'Selecione o serviço pretendido',
    professional_label: 'Profissional',
    professional_plural: 'Profissionais',
    appointment_label: 'Marcação',
    booking_action: 'Agendar',
    client_label: 'Cliente',
    date_title: 'Data e Hora',
    date_subtitle: 'Escolha o melhor horário',
    data_title: 'Os Seus Dados',
    data_subtitle: 'Preencha o formulário',
    nif_field: 'NIF',
    review_title: 'Revisão'
};

export const useTerminology = (settings?: EstablishmentSettings | null) => {
    const terms = settings?.terminology || DEFAULT_TERMS;

    const t = (key: keyof Terminology) => {
        return terms[key] || DEFAULT_TERMS[key] || key;
    };

    return { t, terms };
};
