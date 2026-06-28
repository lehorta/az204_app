import { useState } from "react";
import { useAuditoriaSangria, useResumoAuditoriaSangria } from "@/api/caixa.api";
import {
  FiltroAuditoriaSangriaDTO,
  MOTIVOS_SANGRIA,
} from "@/schemas/caixa.schemas";
import { formatCurrency, formatDateTime, formatPercent } from "@/utils/format";
import {
  Download,
  Filter,
  Droplet,
  TrendingUp,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
} from "lucide-react";

export const AuditoriaSangrias = () => {
  const [filtro, setFiltro] = useState<FiltroAuditoriaSangriaDTO>({
    dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dataFim: new Date(),
    pagina: 1,
    tamanhoPagina: 10,
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const { data: sangrias, isLoading: sangriaLoading } =
    useAuditoriaSangria(filtro);
  const { data: resumo } = useResumoAuditoriaSangria(
    filtro.dataInicio,
    filtro.dataFim
  );

  const getMotivoLabel = (motivo: string) => {
    return (
      MOTIVOS_SANGRIA.find((m) => m.value === motivo)?.label || motivo
    );
  };

  const motivoColor = (motivo: string) => {
    const cores: Record<string, string> = {
      TrocaOperador: "bg-blue-100 text-blue-800",
      DepositoBancario: "bg-green-100 text-green-800",
      PageamentoDespesa: "bg-purple-100 text-purple-800",
      SangriaSeguranca: "bg-red-100 text-red-800",
      AjusteContabil: "bg-yellow-100 text-yellow-800",
      RequisicaoGerencial: "bg-indigo-100 text-indigo-800",
      Outro: "bg-slate-100 text-slate-800",
    };
    return cores[motivo] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Auditoria de Sangrias
          </h1>
          <p className="text-slate-600 mt-1">
            Histórico completo de todas as retiradas em caixa
          </p>
        </div>

        {/* Cards de Resumo */}
        {resumo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-600">
                  Total de Sangrias
                </p>
                <Droplet className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {resumo.totalSangrias}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {resumo.totalSangrias === 1 ? "retirada" : "retiradas"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-600">
                  Valor Total
                </p>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(resumo.valorTotal)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {resumo.totalSangrias > 0
                  ? `Média: ${formatCurrency(
                      resumo.valorTotal / resumo.totalSangrias
                    )}`
                  : ""}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-600">
                  Motivo Mais Comum
                </p>
                <PieChart className="w-4 h-4 text-blue-600" />
              </div>
              {Object.entries(resumo.porMotivo).length > 0 ? (
                <>
                  <p className="text-lg font-bold text-slate-900">
                    {getMotivoLabel(
                      Object.entries(resumo.porMotivo).sort(
                        ([, a], [, b]) => b.quantidade - a.quantidade
                      )[0][0]
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {
                      Object.entries(resumo.porMotivo).sort(
                        ([, a], [, b]) => b.quantidade - a.quantidade
                      )[0][1].quantidade
                    }{" "}
                    vezes
                  </p>
                </>
              ) : (
                <p className="text-slate-500 text-xs">Sem dados</p>
              )}
            </div>
          </div>
        )}

        {/* Gráfico de Motivos */}
        {resumo && Object.entries(resumo.porMotivo).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Distribuição por Motivo
            </h2>

            <div className="space-y-3">
              {Object.entries(resumo.porMotivo)
                .sort(([, a], [, b]) => b.valor - a.valor)
                .map(([motivo, dados]) => (
                  <div key={motivo}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {getMotivoLabel(motivo)}
                      </span>
                      <span className="text-xs text-slate-600">
                        {dados.quantidade} ({formatPercent(dados.percentual)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${dados.percentual}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(dados.valor)} de{" "}
                      {formatCurrency(resumo.valorTotal)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

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
                  Motivo
                </label>
                <select
                  value={filtro.motivo || ""}
                  onChange={(e) =>
                    setFiltro({
                      ...filtro,
                      motivo: e.target.value || undefined,
                      pagina: 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="">Todos</option>
                  {MOTIVOS_SANGRIA.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    setFiltro({
                      dataInicio: new Date(
                        Date.now() - 30 * 24 * 60 * 60 * 1000
                      ),
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

        {/* Tabela de Sangrias */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {sangriaLoading ? (
            <div className="p-8 text-center text-slate-600">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-orange-600 rounded-full" />
              </div>
              <p className="mt-2">Carregando auditoria...</p>
            </div>
          ) : sangrias && sangrias.data.length > 0 ? (
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
                        Motivo
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-900">
                        Valor
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Descrição
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sangrias.data.map((sangria) => (
                      <tr
                        key={sangria.publicId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-slate-900">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {formatDateTime(sangria.dataHora)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-slate-900">
                            <User className="w-4 h-4 text-slate-400" />
                            {sangria.operadorNome}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${motivoColor(
                              sangria.motivo
                            )}`}
                          >
                            {getMotivoLabel(sangria.motivo)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {formatCurrency(sangria.valor)}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {sangria.descricaoComplementar ? (
                            <p className="italic">
                              "{sangria.descricaoComplementar}"
                            </p>
                          ) : (
                            <p className="text-slate-400">Sem descrição</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {sangrias.totalPaginas > 1 && (
                <div className="px-4 py-4 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-xs text-slate-600">
                    Mostrando {(filtro.pagina - 1) * filtro.tamanhoPagina + 1}{" "}
                    até{" "}
                    {Math.min(
                      filtro.pagina * filtro.tamanhoPagina,
                      sangrias.total
                    )}{" "}
                    de {sangrias.total}
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
                      className="p-2 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: sangrias.totalPaginas }).map(
                        (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() =>
                              setFiltro({ ...filtro, pagina: i + 1 })
                            }
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              filtro.pagina === i + 1
                                ? "bg-orange-600 text-white"
                                : "hover:bg-slate-100"
                            }`}
                          >
                            {i + 1}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setFiltro({
                          ...filtro,
                          pagina: Math.min(
                            sangrias.totalPaginas,
                            filtro.pagina + 1
                          ),
                        })
                      }
                      disabled={filtro.pagina === sangrias.totalPaginas}
                      className="p-2 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Export Button */}
              <div className="px-4 py-4 border-t border-slate-200 flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-600">
              <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>Nenhuma sangria registrada para o período selecionado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
