import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export interface Insight {
  titulo: string;
  descricao: string;
}

interface InsightsState {
  data: Insight[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

export const useInsights = () => {
  const [state, setState] = useState<InsightsState>({
    data: [],
    loading: false,
    error: null,
    fetched: false,
  });

  const { get } = useApi();

  const fetchInsights = useCallback(
    async (forceRefresh = false) => {
      if (state.data.length > 0 && !forceRefresh && !state.error) {
        return state.data;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await get<any>("/gemini/insight");

        let insightsArray: Insight[] = [];

        if (Array.isArray(response)) {
          insightsArray = response;
        } else if (response && Array.isArray(response.insights)) {
          insightsArray = response.insights;
        } else if (response && response.data && Array.isArray(response.data)) {
          insightsArray = response.data;
        }

        const validInsights = insightsArray.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            item.titulo &&
            typeof item.titulo === "string" &&
            item.descricao &&
            typeof item.descricao === "string"
        );

        const newState = {
          data: validInsights,
          loading: false,
          error: null,
          fetched: true,
        };

        setState(newState);
        return validInsights;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar insights";

        const errorState = {
          data: [],
          loading: false,
          error: errorMessage,
          fetched: true,
        };

        setState(errorState);

        if (process.env.NODE_ENV === "development") {
          console.log("Usando mock de insights");
          const mockInsights: Insight[] = [
            {
              titulo: "Tendência de Aquecimento e Umidade Noturna",
              descricao:
                "Ao longo do período analisado, há uma leve elevação na temperatura média noturna e na umidade relativa do ar.",
            },
            {
              titulo: "Variação Notável na Probabilidade de Chuva",
              descricao:
                "A probabilidade de precipitação demonstrou variação significativa entre os dias analisados.",
            },
            {
              titulo: "Padrão Climático Quente e Úmido",
              descricao:
                "O clima apresenta padrão consistentemente quente e com umidade muito elevada nos períodos observados.",
            },
          ];

          const mockState = {
            data: mockInsights,
            loading: false,
            error: null,
            fetched: true,
          };

          setState(mockState);
          return mockInsights;
        }

        return [];
      }
    },
    [get, state.data, state.error]
  );

  const clearInsights = useCallback(() => {
    setState({
      data: [],
      loading: false,
      error: null,
      fetched: false,
    });
  }, []);

  const refreshInsights = useCallback(async () => {
    return await fetchInsights(true);
  }, [fetchInsights]);

  return {
    insights: state.data,
    loading: state.loading,
    error: state.error,
    fetched: state.fetched,
    fetchInsights,
    clearInsights,
    refreshInsights,
    hasInsights: state.data.length > 0,
  };
};
