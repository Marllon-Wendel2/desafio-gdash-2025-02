import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY, // Certifique-se de ter a API key
});

export async function generateInsights(prompt: string) {
  try {
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

        Formato de resposta OBRIGATÓRIO (apenas JSON, sem texto extra):
        {
          "insights": [
            { "titulo": "Insight 1", "descricao": "Descrição do insight 1" },
            { "titulo": "Insight 2", "descricao": "Descrição do insight 2" }
          ]
        }

        Dados para análise:
        ${prompt}
      `,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      throw new Error("Nenhuma resposta foi gerada pelo Gemini.");
    }

    // Extrai apenas o JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      // Se não encontrar JSON, cria um fallback
      console.warn(
        "Resposta não está em formato JSON válido:",
        text.substring(0, 200)
      );
      return {
        insights: [
          {
            titulo: "Análise gerada",
            descricao:
              "Os dados foram processados com sucesso, mas o formato da resposta precisa ser ajustado.",
          },
        ],
      };
    }

    const jsonString = jsonMatch[0];

    try {
      const result = JSON.parse(jsonString);

      // Valida a estrutura
      if (!result.insights || !Array.isArray(result.insights)) {
        throw new Error("Estrutura do JSON inválida");
      }

      return result;
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", parseError);
      console.error("Texto recebido:", jsonString);

      // Fallback seguro
      return {
        insights: [
          {
            titulo: "Erro na análise",
            descricao:
              "Não foi possível processar a análise dos dados climáticos.",
          },
        ],
      };
    }
  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);

    // Fallback para erro de API
    return {
      insights: [
        {
          titulo: "Serviço temporariamente indisponível",
          descricao:
            "A análise de insights está temporariamente indisponível. Tente novamente mais tarde.",
        },
      ],
    };
  }
}
