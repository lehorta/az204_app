import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSessao, useSangrias } from "@/api/caixa.api";
import { useNavigate } from "react-router-dom";
import { SangriaModal } from "@/components/caixa/SangriaModal";
import {
  ArrowDown,
  AlertTriangle,
  Clock,
  DollarSign,
  Droplet,
  TrendingDown,
  RefreshCw,
  Activity,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { StatusDivergencia } from "@/types/caixa.types";

export const CaixaOperacao = () => {
  const { sessaoId } = useParams<{ sessaoId: string }>();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showSangriaModal, setShowSangriaModal] = useState(false);
  const navigate = useNavigate();

  const {
    data: sessao,
    isLoading: sessaoLoading,
    error: sessaoError,
    refetch: refetchSessao,
  } = useSessao(sessaoId || "");

  const {
    data: sangrias,
    isLoading: sangriasLoading,
    error: sangriasError,
    refetch: refetchSangrias,
  } = useSangrias(sessaoId || "");

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh || !sessaoId) return;

    const interval = setInterval(() => {
      refetchSessao();
      refetchSangrias();
      setLastUpdate(new Date());
    }, 30_000);

    return () => clearInterval(interval);
  }, [autoRefresh, sessaoId, refetchSessao, refetchSangrias]);

  if (sessaoLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <p className="mt-2 text-slate-600">Carregando operacional...</p>
        </div>
      </div>
    );
  }

  if (sessaoError || !sessao) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-red-900 mb-2">
              Erro ao carregar sessão
            </h2>
            <p className="text-red-700 mb-4">
              {sessaoError instanceof Error
                ? sessaoError.message
                : "Sessão não encontrada"}
            </p>
            <button
              onClick={() => refetchSessao()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusDivergencia = sessao.divergenciaValor === 0 ? "OK" : 
                           Math.abs(sessao.divergenciaValor) < 100 ? "Alerta" : 
                           "Crítico";

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header com Auto-refresh */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Operacional de Caixa
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Sessão: {sessao.publicId?.slice(0, 8)}...
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-600">Última atualização</p>
              <p className="text-sm font-medium text-slate-900">
                {lastUpdate.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>

            <button
              onClick={() => {
                refetchSessao();
                refetchSangrias();
                setLastUpdate(new Date());
              }}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              aria-label="Atualizar"
            >
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </button>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-xs text-slate-600">Auto-atualizar</span>
            </label>
          </div>
        </div>

        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Saldo Inicial */}
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">
                Saldo Inicial
              </p>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(sessao.saldoInicial)}
            </p>
          </div>

          {/* Saldo Calculado */}
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">
                Saldo Calculado
              </p>
              <Activity className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(sessao.saldoFinalCalculado)}
            </p>
          </div>

          {/* Total de Sangrias */}
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">
                Total de Sangrias
              </p>
              <Droplet className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {sangrias ? formatCurrency(sangrias.reduce((sum, s) => sum + s.valor, 0)) : "R$ 0,00"}
            </p>
          </div>

          {/* Status Divergência */}
          <div className={`rounded-lg shadow-sm p-4 border-l-4 ${
            statusDivergencia === "OK"
              ? "bg-green-50 border-green-500"
              : statusDivergencia === "Alerta"
              ? "bg-yellow-50 border-yellow-500"
              : "bg-red-50 border-red-500"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">
                Divergência
              </p>
              <TrendingDown className={`w-4 h-4 ${
                statusDivergencia === "OK"
                  ? "text-green-500"
                  : statusDivergencia === "Alerta"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              statusDivergencia === "OK"
                ? "text-green-900"
                : statusDivergencia === "Alerta"
                ? "text-yellow-900"
                : "text-red-900"
            }`}>
              {formatCurrency(sessao.divergenciaValor)}
            </p>
            <p className="text-xs mt-1 font-medium">
              Status: <span className="font-bold">{statusDivergencia}</span>
            </p>
          </div>
        </div>

        {/* Sangrias Registradas */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-orange-500" />
                Sangrias Registradas
              </h2>
              <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
                {sangrias?.length || 0}
              </span>
            </div>
          </div>

          {sangriasLoading ? (
            <div className="p-6 text-center text-slate-600">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
              Carregando sangrias...
            </div>
          ) : sangrias && sangrias.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {sangrias.map((sangria) => (
                <div
                  key={sangria.publicId}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-900">
                          {formatCurrency(sangria.valor)}
                        </p>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          {sangria.motivo || "Sem motivo"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {sangria.operadorNome}
                      </p>
                      {sangria.descricaoComplementar && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          {sangria.descricaoComplementar}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 text-right">
                      {formatDateTime(sangria.criadoEm)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-600">
              <Droplet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Nenhuma sangria registrada ainda</p>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="mt-6 flex gap-3 justify-end">
          <button 
            onClick={() => setShowSangriaModal(true)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-50 transition-colors">
            Registrar Sangria
          </button>
          <button 
            onClick={() => navigate(`/caixa/fechamento/${sessaoId}`)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Fechar Caixa
          </button>
        </div>
      </div>
    </div>

      {/* Modal de Sangria */}
      <SangriaModal
        sessaoId={sessaoId || ""}
        isOpen={showSangriaModal}
        onClose={() => setShowSangriaModal(false)}
        onSuccess={() => {
          // Refresh sangrias após registro bem-sucedido
          refetchSangrias();
        }}
      />
    </>
  );
};
