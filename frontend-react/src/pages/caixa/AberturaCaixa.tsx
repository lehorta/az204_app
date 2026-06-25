import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/Card";
import { abrirSessaoCaixaSchema, AbrirSessaoCaixaDTO } from "@/schemas/caixa.schemas";
import { useAbrirCaixa } from "@/api/caixa.api";
import {
  AlertCircle,
  DollarSign,
  FileText,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export const AberturaCaixa = () => {
  const navigate = useNavigate();
  const { mutate: abrirCaixa, isPending, error } = useAbrirCaixa();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AbrirSessaoCaixaDTO>({
    resolver: zodResolver(abrirSessaoCaixaSchema),
    defaultValues: {
      saldoInicial: 0,
      observacoes: "",
    },
  });

  const onSubmit = async (data: AbrirSessaoCaixaDTO) => {
    abrirCaixa(data, {
      onSuccess: (response) => {
        setShowSuccess(true);
        reset();

        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate(`/caixa/operacao/${response.publicId}`, {
            state: { sessao: response },
          });
        }, 2000);
      },
    });
  };

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
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-brand-primary" />
              </div>
              Abertura de Caixa
            </h1>
            <p className="text-text-secondary mt-1">Registre o saldo inicial para iniciar o operacional</p>
          </div>
        </div>

        {/* Alerts */}
        {showSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">Sessão aberta com sucesso!</p>
              <p className="text-xs text-green-700 mt-1">Redirecionando para operacional...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">Erro ao abrir caixa</p>
              <p className="text-xs text-red-700 mt-1">
                {error instanceof Error ? error.message : "Tente novamente em alguns segundos"}
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <Card className="bg-background-secondary border-border-primary max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Saldo Inicial */}
            <div>
              <label htmlFor="saldoInicial" className="block text-sm font-medium text-text-primary mb-2">
                Saldo Inicial <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                  R$
                </span>
                <input
                  {...register("saldoInicial", { valueAsNumber: true })}
                  id="saldoInicial"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
                    errors.saldoInicial
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500"
                      : "border-border-primary bg-background-tertiary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  }`}
                />
              </div>
              {errors.saldoInicial && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.saldoInicial.message}
                </p>
              )}
              <p className="mt-1 text-xs text-text-secondary">
                Valor em dinheiro disponível no caixa
              </p>
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-text-primary mb-2">
                Observações <span className="text-xs text-text-secondary">(Opcional)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
                <textarea
                  {...register("observacoes")}
                  id="observacoes"
                  placeholder="Ex: Caixa checado. Sem problemas na contagem anterior."
                  rows={4}
                  maxLength={500}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none transition-colors resize-none ${
                    errors.observacoes
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500"
                      : "border-border-primary bg-background-tertiary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  }`}
                />
              </div>
              {errors.observacoes && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.observacoes.message}
                </p>
              )}
              <p className="mt-1 text-xs text-text-secondary">Máximo 500 caracteres</p>
            </div>

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
                disabled={isPending || showSuccess}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isPending || showSuccess
                    ? "bg-brand-primary/30 text-text-disabled cursor-not-allowed"
                    : "bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-95"
                }`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Abrindo...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Abrir Caixa
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>

        {/* Help Info */}
        <Card className="bg-blue-50 border-blue-200/50">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-blue-900">
              💡
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Dica: Conte o dinheiro em caixa antes de começar</p>
              <p className="text-xs text-blue-700 mt-1">
                Sempre confira o saldo físico antes de informar o valor inicial. Isso evita divergências no fechamento.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
