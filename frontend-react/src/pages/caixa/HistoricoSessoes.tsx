import { useState, useMemo } from "react";
import { useHistoricoSessoes } from "@/api/caixa.api";
import {
  FiltroHistoricoSessionDTO,
  STATUS_SESSAO,
  STATUS_DIVERGENCIA,
} from "@/schemas/caixa.schemas";
import { formatCurrency, formatDateTime } from "@/utils/format";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  TrendingDown,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const HistoricoSessoes = () => {
  const [filtro, setFiltro] = useState<FiltroHistoricoSessionDTO>({
    dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dataFim: new Date(),
    pagina: 1,
    tamanhoPagina: 10,
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const { data, isLoading, error } = useHistoricoSessoes(filtro);

  const statusStyle = (status: string) => {
    switch (status) {
      case "Aberta":
        return "bg-blue-100 text-blue-800";
      case "Fechada":
        return "bg-green-100 text-green-800";
      case "Erro":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const divergenciaStyle = (valor: number) => {
    if (valor === 0) return "text-green-600";
    if (Math.abs(valor) < 100) return "text-yellow-600";
    return "text-red-600";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-6xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900">
            Erro ao carregar histórico
          </h2>
          <p className="text-red-700 mt-2">
            {error instanceof Error ? error.message : "Tente novamente"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Histórico de Sessões
          </h1>
          <p className="text-slate-600 mt-1">
            Consulte o histórico de todas as sessões de caixa
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 text-slate-900 font-medium hover:bg-slate-50 px-3 py-2 rounded transition-colors"
          >
            <Filter className="w-4 h-4" />
            {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>

          {mostrarFiltros && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={filtro.dataInicio.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFiltro({
                      ...filtro,
                      dataInicio: new Date(e.target.value),
                      pagina: 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  value={filtro.dataFim.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFiltro({
                      ...filtro,
                      dataFim: new Date(e.target.value),
                      pagina: 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={filtro.status || ""}
                  onChange={(e) =>
                    setFiltro({
                      ...filtro,
                      status: e.target.value || undefined,
                      pagina: 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="">Todos</option>
                  <option value="Aberta">Aberta</option>
                  <option value="Fechada">Fechada</option>
                  <option value="Erro">Erro</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    setFiltro({
                      dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      dataFim: new Date(),
                      pagina: 1,
                      tamanhoPagina: 10,
                    })
                  }
                  className="w-full bg-slate-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-600">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full" />
              </div>
              <p className="mt-2">Carregando histórico...</p>
            </div>
          ) : data && data.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Data/Hora
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Operador
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-900">
                        Saldo Inicial
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-900">
                        Saldo Final
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-900">
                        Divergência
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-900">
                        Sangrias
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-900">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.data.map((sessao) => (
                      <tr
                        key={sessao.publicId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-900">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="font-medium">
                                {formatDateTime(sessao.abertoEm)}
                              </p>
                              {sessao.fechadoEm && (
                                <p className="text-xs text-slate-500">
                                  Fechado: {formatDateTime(sessao.fechadoEm)}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-slate-900">
                            <User className="w-4 h-4 text-slate-400" />
                            {sessao.operadorAberturaName}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 ${statusStyle(
                              sessao.status
                            )}`}
                          >
                            {sessao.status === "Fechada" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <AlertTriangle className="w-3 h-3" />
                            )}
                            {sessao.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900">
                          {formatCurrency(sessao.saldoInicial)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900">
                          {sessao.saldoFinalInformado
                            ? formatCurrency(sessao.saldoFinalInformado)
                            : "-"}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-medium ${divergenciaStyle(
                            sessao.divergenciaValor
                          )}`}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <TrendingDown className="w-4 h-4" />
                            {formatCurrency(sessao.divergenciaValor)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900">
                          {sessao.totalSangrias}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {data.totalPaginas > 1 && (
                <div className="px-4 py-4 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-600">
                    Mostrando {(filtro.pagina - 1) * filtro.tamanhoPagina + 1}{" "}
                    até{" "}
                    {Math.min(
                      filtro.pagina * filtro.tamanhoPagina,
                      data.total
                    )}{" "}
                    de {data.total}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFiltro({
                          ...filtro,
                          pagina: Math.max(1, filtro.pagina - 1),
                        })
                      }
                      disabled={filtro.pagina === 1}
                      className="p-2 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: data.totalPaginas }).map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setFiltro({ ...filtro, pagina: i + 1 })}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            filtro.pagina === i + 1
                              ? "bg-blue-600 text-white"
                              : "hover:bg-slate-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setFiltro({
                          ...filtro,
                          pagina: Math.min(
                            data.totalPaginas,
                            filtro.pagina + 1
                          ),
                        })
                      }
                      disabled={filtro.pagina === data.totalPaginas}
                      className="p-2 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-600">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>Nenhuma sessão encontrada para os filtros selecionados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
