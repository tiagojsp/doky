const STABLE_MODELS = [
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-flash-1.5-8b:free",
    "google/gemini-flash-1.5:free",
    "google/gemma-2-9b-it:free",
    "mistralai/mistral-7b-instruct:free",
    "openrouter/auto"
];

const CLAUDE_MODELS = [
    "anthropic/claude-3.5-sonnet",
    "anthropic/claude-3-haiku:free",
    "anthropic/claude-3-haiku",
    "openrouter/auto"
];

export const aiService = {
    async generateResponse(question: string, context: any, apiKey: string) {
        // Favoring OpenRouter key for Claude access
        const envKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
        const finalKey = (apiKey || envKey || "").trim();

        if (!finalKey || finalKey.includes("PLACEHOLDER") || finalKey.length < 10) {
            return "Por favor configure a sua Chave de API OpenRouter nas Definições > IA e Automação para aceder ao Claude.";
        }

        const systemPrompt = `
      Tu és o assistente virtual da app de gestão 'DOKY'.
      Tens acesso a um CONTEXTO RICO de dados do negócio em JSON abaixo.
      
      INSTRUÇÕES:
      1. Se o utilizador perguntar por um cliente específico (ex: "quem é a Maria"), procura nos dados 'foundClients' ou 'foundAppointments' e dá detalhes completos (última visita, notas, telemóvel).
      2. Se perguntar "o que tenho hoje", descreve a 'todaysSchedule'.
      3. Se perguntar estatísticas, usa os dados de 'summary'.
      4. Responde de forma curta, profissional e útil. Usa emojis.
      
      DADOS DO NEGÓCIO (CONTEXTO):
      ${JSON.stringify(context, null, 2)}
    `;

        let lastError = "";

        for (const model of CLAUDE_MODELS) {
            try {

                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${finalKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://doky.app",
                        "X-Title": "DOKY Assistant"
                    },
                    body: JSON.stringify({
                        "model": model,
                        "messages": [
                            { "role": "system", "content": systemPrompt },
                            { "role": "user", "content": question }
                        ]
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error(`AI Service: ${model} failed`, data);
                    lastError = data.error?.message || `HTTP ${response.status}`;
                    continue;
                }

                const content = data.choices?.[0]?.message?.content;
                if (content) {
                    return content;
                }

                lastError = "Resposta vazia.";
            } catch (error: any) {
                console.error(`AI Service: Exception with ${model}`, error);
                lastError = error.message;
            }
        }

        return `Erro: ${lastError}. Não foi possível contactar o Claude. Verifique se a sua chave OpenRouter tem saldo ou se o modelo está disponível.`
    }
};
