import { useState } from "react";
import { useResumoDia } from "@/api/caixa.api";
import { formatCurrency, formatDateTime } from "@/utils/format";
import {
  AlertCircle,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  TrendingDown,
  User,
  Calendar,
} from "lucide-react";

export const ResumoDia = () => {
  const [data, setData] = useState<Date>(new Date());
  const [selectedFiliaal] = useState<number | undefined>();

  const {
    data: resumo,
    isLoading,
    error,
    refetch,
  } = useResumoDia(data, selectedFiliaal);

  const statusAlert = (status: string) => {
    switch (status) {
      case "OK":
        return "bg-green-100 text-green-800 border-green-300";
      case "Alerta":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Crítico":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const alertIcon = (tipo: string) => {
    switch (tipo) {
      case "Divergência":
        return <TrendingDown className="w-5 h-5" />;
      case "SaldoBaixo":
        return <AlertTriangle className="w-5 h-5" />;
      case "SemFechamento":
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Resumo do Dia</h1>
          <p className="text-slate-600 mt-1">
            Dashboard com informações consolidadas de caixas
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6 flex items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={data.toISOString().split("T")[0]}
              onChange={(e) => setData(new Date(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Atualizar"
          >
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-red-900">
              Erro ao carregar resumo
            </h2>
            <p className="text-red-700 mt-2">
              {error instanceof Error ? error.message : "Tente novamente"}
            </p>
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="mt-2 text-slate-600">Carregando resumo...</p>
          </div>
        ) : resumo ? (
          <>
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 border-l-4 border-l-blue-500">
                <p className="text-xs text-slate-600 font-medium mb-2">
                  Entrada Total
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(resumo.metricas.entradaTotal)}
                </p>
                <p className="text-xs text-blue-600 mt-2">💰 Receitas</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 border-l-4 border-l-orange-500">
                <p className="text-xs text-slate-600 font-medium mb-2">
                  Saída Total
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(resumo.metricas.saidaTotal)}
                </p>
                <p className="text-xs text-orange-600 mt-2">📤 Despesas</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 border-l-4 border-l-red-500">
                <p className="text-xs text-slate-600 font-medium mb-2">
                  Sangria Total
                </p>
                <p className="text-2xl font-bold text-red-900">
                  {formatCurrency(resumo.metricas.sangriaTotal)}
                </p>
                <p className="text-xs text-red-600 mt-2">🩸 Retiradas</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6 border-l-4 border-l-green-500">
                <p className="text-xs text-slate-600 font-medium mb-2">
                  Saldo Líquido
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(resumo.metricas.saldoLiquido)}
                </p>
                <p className="text-xs text-green-600 mt-2">✅ Final</p>
              </div>
            </div>

            {/* Caixas Abertos */}
            {resumo.caixasAbertos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Caixas Abertos ({resumo.caixasAbertos.length})
                  </h2>
                </div>

                <div className="divide-y divide-slate-200">
                  {resumo.caixasAbertos.map((caixa) => (
                    <div
                      key={caixa.sessaoPublicId}
                      className="p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {caixa.terminalCodigo}
                          </p>
                          <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            {caixa.operadorNome}
                          </p>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${statusAlert(
                            caixa.statusDivergencia
                          )}`}
                        >
                          {caixa.statusDivergencia === "OK" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : caixa.statusDivergencia === "Alerta" ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          {caixa.statusDivergencia}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-xs text-slate-600 mb-1">
                            Saldo Atual
                          </p>
                          <p className="font-semibold text-slate-900 text-sm">
                            {formatCurrency(caixa.saldoAtual)}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-xs text-slate-600 mb-1">
                            Sangrias
                          </p>
                          <p className="font-semibold text-slate-900 text-sm">
                            {caixa.totalSangrias}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-xs text-slate-600 mb-1">
                            Divergência
                          </p>
                          <p className="font-semibold text-slate-900 text-sm">
                            {formatCurrency(caixa.divergenciaValor)}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-xs text-slate-600 mb-1">
                            Aberto em
                          </p>
                          <p className="font-semibold text-slate-900 text-xs">
                            {new Date(caixa.abertoEm).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Caixas Fechados */}
            {resumo.caixasFechados.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Caixas Fechados ({resumo.caixasFechados.length})
                  </h2>
                </div>

                <div className="divide-y divide-slate-200">
                  {resumo.caixasFechados.map((caixa) => (
                    <div
                      key={caixa.sessaoPublicId}
                      className="p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {caixa.terminalCodigo}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            Fechado:{" "}
                            {formatDateTime(new Date(caixa.fechadoEm))}
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                          ✓ Concluído
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alertas */}
            {resumo.alertas.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Alertas ({resumo.alertas.length})
                  </h2>
                </div>

                <div className="divide-y divide-slate-200">
                  {resumo.alertas.map((alerta, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border-l-4 ${
                        alerta.severidade === "Crítico"
                          ? "border-l-red-500 bg-red-50"
                          : alerta.severidade === "Alerta"
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 ${
                            alerta.severidade === "Crítico"
                              ? "text-red-600"
                              : alerta.severidade === "Alerta"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {alertIcon(alerta.tipo)}
                        </div>

                        <div className="flex-1">
                          <p
                            className={`font-semibold ${
                              alerta.severidade === "Crítico"
                                ? "text-red-900"
                                : alerta.severidade === "Alerta"
                                ? "text-yellow-900"
                                : "text-blue-900"
                            }`}
                          >
                            {alerta.tipo}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              alerta.severidade === "Crítico"
                                ? "text-red-700"
                                : alerta.severidade === "Alerta"
                                ? "text-yellow-700"
                                : "text-blue-700"
                            }`}
                          >
                            {alerta.mensagem}
                          </p>
                          {alerta.acaoRecomendada && (
                            <p
                              className={`text-xs mt-2 font-medium ${
                                alerta.severidade === "Crítico"
                                  ? "text-red-700"
                                  : alerta.severidade === "Alerta"
                                  ? "text-yellow-700"
                                  : "text-blue-700"
                              }`}
                            >
                              ✓ {alerta.acaoRecomendada}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {resumo.caixasAbertos.length === 0 &&
              resumo.caixasFechados.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">
                    Nenhuma atividade de caixa registrada neste dia
                  </p>
                </div>
              )}
          </>
        ) : null}
      </div>
    </div>
  );
};
