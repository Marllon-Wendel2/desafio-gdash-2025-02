import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function main(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      Você é um especialista em análise climática. 
      Quero que analise o JSON enviado e gere INSIGHTS objetivos e acionáveis.

      Regras:
      - gere no mínimo 3 e no máximo 5 insights
      - cada insight deve ter no máximo 2 frases
      - nada de introdução ou conclusão
      - não repita informações óbvias do JSON
      - identifique padrões, anomalias, tendências e possíveis causas
      - não tente adivinhar dados ausentes
      - seja direto e específico

      Ideias:
       - Cálculo de média de temperatura e umidade em determinados períodos;
       - Detecção de tendência (temperaturas subindo ou caindo);
       - Pontuação de conforto climático (0–100);
       - Classificação do dia: “frio”, “quente”, “agradável”, “chuvoso”;
       - Alertas: “Alta chance de chuva”, “Calor extremo”, “Frio intenso”;
       - Geração de resumos em texto (ex.: “Nos últimos 3 dias, a temperatura média foi de 28°C, com alta umidade e tendência de chuva no fim da tarde.”).

      Formato de resposta (obrigatório):
      {
        "insights": [
          { "titulo": "...", "descricao": "..." }
        ]
      }

      Aqui estão os dados para analisar:
      ${prompt}
    `,
  });

  const text =
    response.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Erro: Nenhuma resposta foi gerada.";

  return text;
}
