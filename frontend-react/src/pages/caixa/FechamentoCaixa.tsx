import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/Card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fecharSessaoCaixaSchema,
  FecharSessaoCaixaDTO,
  MOTIVOS_SANGRIA,
} from "@/schemas/caixa.schemas";
import { useSessao, useFecharCaixa, useSangrias } from "@/api/caixa.api";
import { formatCurrency } from "@/utils/format";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Droplet,
  Lock,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export const FechamentoCaixa = () => {
  const { sessaoId } = useParams<{ sessaoId: string }>();
  const navigate = useNavigate();
  const [temSangriaNoFechamento, setTemSangriaNoFechamento] = useState(false);

  const { data: sessao, isLoading: sessaoLoading } = useSessao(sessaoId || "");
  const { data: sangrias } = useSangrias(sessaoId || "");
  const { mutate: fecharCaixa, isPending } = useFecharCaixa(sessaoId || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FecharSessaoCaixaDTO>({
    resolver: zodResolver(fecharSessaoCaixaSchema),
    defaultValues: {
      saldoFinalInformado: 0,
      sangriaNoFechamento: null,
    },
  });

  const saldoFinalInformado = watch("saldoFinalInformado");
  const sangriaNoFechamento = watch("sangriaNoFechamento");
  const motivoSangriaFechamento = sangriaNoFechamento?.motivo;

  // Calcular divergência em tempo real
  const saldoCalculado = sessao
    ? sessao.saldoFinalCalculado -
      (sangriaNoFechamento?.valor || 0)
    : 0;
  const divergencia = saldoFinalInformado - saldoCalculado;
  const statusDivergencia =
    divergencia === 0
      ? "OK"
      : Math.abs(divergencia) < 100
      ? "Alerta"
      : "Crítico";

  if (sessaoLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!sessao) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <h1 className="text-3xl font-bold text-text-primary">Fechamento de Caixa</h1>
          </div>
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-red-900">Sessão não encontrada</h2>
                <p className="text-sm text-red-700 mt-1">A sessão solicitada não existe ou foi removida.</p>
                <button
                  onClick={() => navigate("/caixa")}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Voltar para Caixa
                </button>
              </div>
            </div>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const onSubmit = (data: FecharSessaoCaixaDTO) => {
    fecharCaixa(data, {
      onSuccess: () => {
        setTimeout(() => {
          navigate("/caixa/historico", {
            state: { mensagem: "Caixa fechado com sucesso!" },
          });
        }, 2000);
      },
    });
  };

  const totalSangriasAnteriores =
    sangrias?.reduce((sum, s) => sum + s.valor, 0) || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Fechamento de Caixa
            </h1>
            <p className="text-text-secondary mt-1">
              Sessão: {sessao.publicId?.slice(0, 8)}...
            </p>
          </div>
        </div>

        {/* Resumo da Sessão - Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-brand-primary/10 border-brand-primary/30">
            <div>
              <p className="text-xs text-text-secondary font-medium mb-1">
                Saldo Inicial
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {formatCurrency(sessao.saldoInicial)}
              </p>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200/50">
            <div>
              <p className="text-xs text-green-700 font-medium mb-1">
                Saldo Calculado
              </p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(sessao.saldoFinalCalculado)}
              </p>
            </div>
          </Card>

          <Card className="bg-orange-50 border-orange-200/50">
            <div>
              <p className="text-xs text-orange-700 font-medium mb-1">
                Total de Sangrias
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {formatCurrency(totalSangriasAnteriores)}
              </p>
              <p className="text-xs text-orange-700 mt-1">
                ({sangrias?.length || 0} operações)
              </p>
            </div>
          </Card>

          <Card className="bg-purple-50 border-purple-200/50">
            <div>
              <p className="text-xs text-purple-700 font-medium mb-1">
                Saldo p/ Fechamento
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(
                  sessao.saldoFinalCalculado - totalSangriasAnteriores
                )}
              </p>
            </div>
          </Card>
        </div>

        {/* Divergência Status */}
        <Card className={`border-2 ${
          statusDivergencia === "OK"
            ? "bg-green-50 border-green-300"
            : statusDivergencia === "Alerta"
            ? "bg-yellow-50 border-yellow-300"
            : "bg-red-50 border-red-300"
        }`}>
          <div className="flex items-start gap-3">
            {statusDivergencia === "OK" ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            ) : statusDivergencia === "Alerta" ? (
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <h3 className={`font-bold ${
                statusDivergencia === "OK"
                  ? "text-green-900"
                  : statusDivergencia === "Alerta"
                  ? "text-yellow-900"
                  : "text-red-900"
              }`}>
                Divergência: {formatCurrency(divergencia)}
              </h3>
              <p className={`text-sm ${
                statusDivergencia === "OK"
                  ? "text-green-700"
                  : statusDivergencia === "Alerta"
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}>
                {statusDivergencia === "OK" ? "Saldo OK - Sem divergências" :
                 statusDivergencia === "Alerta" ? "Atenção: Pequena divergência" :
                 "Crítico: Divergência significativa"}
              </p>
            </div>
          </div>
        </Card>

        {/* Form Card */}
        <Card className="bg-background-secondary border-border-primary max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Saldo Final Informado */}
            <div>
              <label
                htmlFor="saldoFinalInformado"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Saldo Final Informado (Contagem Física) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary font-medium">
                  R$
                </span>
                <input
                  {...register("saldoFinalInformado", {
                    valueAsNumber: true,
                  })}
                  id="saldoFinalInformado"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none transition-colors font-semibold ${
                    errors.saldoFinalInformado
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500"
                      : "border-border-primary bg-background-tertiary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  }`}
                />
              </div>
              {errors.saldoFinalInformado && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.saldoFinalInformado.message}
                </p>
              )}
              <p className="mt-2 text-xs text-text-secondary">
                Valor em dinheiro contado fisicamente no caixa
              </p>
            </div>

            {/* Checkbox Sangria no Fechamento */}
            <div className="border-t border-border-primary pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={temSangriaNoFechamento}
                  onChange={(e) => {
                    setTemSangriaNoFechamento(e.target.checked);
                    if (!e.target.checked) {
                      setValue("sangriaNoFechamento", null);
                    }
                  }}
                  className="w-4 h-4 rounded border-border-primary text-brand-primary"
                />
                <span className="font-medium text-text-primary">
                  Há uma sangria neste fechamento?
                </span>
              </label>
              <p className="mt-2 text-xs text-text-secondary ml-7">
                Marque se houver uma retirada de dinheiro sendo realizada
                durante o fechamento
              </p>
            </div>

            {/* Sangria no Fechamento - Condicional */}
            {temSangriaNoFechamento && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-orange-600" />
                  Sangria no Fechamento
                </h3>

                {/* Valor Sangria */}
                <div>
                  <label
                    htmlFor="sangriaValor"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Valor <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                      R$
                    </span>
                    <input
                      {...register("sangriaNoFechamento.valor", {
                        valueAsNumber: true,
                      })}
                      id="sangriaValor"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="w-full pl-10 pr-4 py-2 border border-border-primary bg-background-tertiary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                </div>

                {/* Motivo Sangria */}
                <div>
                  <label
                    htmlFor="sangriaMotivo"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Motivo <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("sangriaNoFechamento.motivo")}
                    id="sangriaMotivo"
                    className="w-full px-4 py-2 border border-border-primary bg-background-tertiary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  >
                    <option value="">Selecione um motivo</option>
                    {MOTIVOS_SANGRIA.map((motivo) => (
                      <option key={motivo.value} value={motivo.value}>
                        {motivo.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrição - Se Outro */}
                {motivoSangriaFechamento === "Outro" && (
                  <div>
                    <label
                      htmlFor="sangriaDescricao"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Descrição <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("sangriaNoFechamento.descricaoComplementar")}
                      id="sangriaDescricao"
                      placeholder="Descreva o motivo..."
                      rows={2}
                      maxLength={500}
                      className="w-full px-4 py-2 border border-border-primary bg-background-tertiary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Info Box */}
            <Card className="bg-blue-50 border-blue-200/50">
              <div className="flex gap-3">
                <div className="text-lg">💡</div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Verifique a Divergência</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Se houver divergência significativa, ela será registrada no
                    histórico para investigação posterior.
                  </p>
                </div>
              </div>
            </Card>

            {/* Buttons */}
            <div className="flex gap-3 border-t border-border-primary pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isPending}
                className="flex-1 px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-background-tertiary transition-colors disabled:opacity-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isPending
                    ? "bg-brand-primary/30 text-text-disabled cursor-not-allowed"
                    : "bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-95"
                }`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fechando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Fechar Caixa
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
};
