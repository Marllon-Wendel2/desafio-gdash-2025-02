import { X, AlertCircle, Lightbulb, Brain, RefreshCw } from 'lucide-react';
import { Insight } from '../hooks/useInsights';
import { useEffect } from 'react';

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: Insight[];
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
  fetched: boolean;
}

const insightIcons = [
  <Brain key="brain" className="h-5 w-5" />,
  <Lightbulb key="lightbulb" className="h-5 w-5" />,
  <Brain key="brain2" className="h-5 w-5" />,
  <Lightbulb key="lightbulb2" className="h-5 w-5" />,
  <Brain key="brain3" className="h-5 w-5" />,
];

export function InsightsModal({ 
  isOpen, 
  onClose, 
  insights, 
  loading, 
  error,
  onRefresh,
  fetched
}: InsightsModalProps) {
  // Fecha modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Previne scroll do body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Função para fechar ao clicar fora
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-3xl bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-2xl max-h-[85vh] overflow-hidden animate-slideUp">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--primary))]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))]/80 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                Análises Climáticas Inteligentes
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                Insights gerados por IA com base nos dados coletados
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onRefresh && fetched && !loading && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                title="Atualizar análises"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors"
              title="Fechar"
            >
              <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Estado de Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                {/* Spinner principal */}
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))]"></div>
                
                {/* Spinner interno */}
                <div className="absolute inset-4 h-12 w-12 animate-spin rounded-full border-2 border-[hsl(var(--accent))]/30 border-t-[hsl(var(--accent))]"></div>
                
                {/* Ícone central */}
                <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Brain className="h-8 w-8 text-[hsl(var(--primary))] animate-pulse" />
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                  Analisando dados climáticos
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-md">
                  Nossa IA está processando os dados para gerar insights relevantes sobre padrões e tendências.
                </p>
                
                {/* Loading steps */}
                <div className="flex justify-center gap-2">
                  {['Coletando dados', 'Processando padrões', 'Gerando insights'].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        index === 0 ? 'bg-[hsl(var(--primary))] animate-pulse' :
                        index === 1 ? 'bg-[hsl(var(--primary))] opacity-60 animate-pulse delay-150' :
                        'bg-[hsl(var(--primary))] opacity-30 animate-pulse delay-300'
                      }`}></div>
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Estado de Erro */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Erro ao carregar análises
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-md">
                {error}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={onRefresh}
                  className="px-5 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar novamente
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] rounded-lg font-medium hover:bg-[hsl(var(--secondary))]/80 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Estado Vazio (sem dados) */}
          {!loading && !error && insights.length === 0 && fetched && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-20 w-20 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-6">
                <Brain className="h-10 w-10 text-[hsl(var(--primary))]" />
              </div>
              
              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Nenhuma análise disponível
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-md">
                Não foram encontrados dados suficientes para gerar insights climáticos.
              </p>
              
              <button
                onClick={onRefresh}
                className="px-5 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Buscar dados atualizados
              </button>
            </div>
          )}

          {/* Lista de Insights */}
          {!loading && !error && insights.length > 0 && (
            <div className="space-y-4">
              <div className="mb-6">
                <p className="text-[hsl(var(--muted-foreground))] text-sm">
                  {insights.length} {insights.length === 1 ? 'insight gerado' : 'insights gerados'} com base nos dados mais recentes
                </p>
              </div>
              
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="group p-5 rounded-xl border border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--secondary))]/30 to-transparent hover:from-[hsl(var(--secondary))]/50 hover:border-[hsl(var(--primary))]/30 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    {/* Ícone com número */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border-2 border-[hsl(var(--card))] flex items-center justify-center">
                          {insightIcons[index % insightIcons.length]}
                        </div>
                      </div>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors leading-tight">
                          {insight.titulo}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-medium">
                          {getCategoryFromTitle(insight.titulo)}
                        </span>
                      </div>
                      
                      <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                        {insight.descricao}
                      </p>
                      
                      {/* Tags baseadas no conteúdo */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {extractKeywords(insight.descricao).map((keyword, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 rounded bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/10">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              {insights.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Análises atualizadas</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-[hsl(var(--secondary))] transition text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Atualizar
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]/80 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('tendência') || lowerTitle.includes('aumento') || lowerTitle.includes('diminuição')) {
    return 'Tendência';
  }
  if (lowerTitle.includes('chuva') || lowerTitle.includes('precipitação') || lowerTitle.includes('umidade')) {
    return 'Hidrometria';
  }
  if (lowerTitle.includes('temperatura') || lowerTitle.includes('calor') || lowerTitle.includes('frio')) {
    return 'Temperatura';
  }
  if (lowerTitle.includes('vento') || lowerTitle.includes('velocidade')) {
    return 'Ventos';
  }
  return 'Análise';
}

function extractKeywords(text: string): string[] {
  const keywords = ['temperatura', 'umidade', 'chuva', 'vento', 'clima', 'tendência', 'padrão', 'anomalia'];
  const found = keywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  );
  return found.slice(0, 3);
}