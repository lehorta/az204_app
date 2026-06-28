import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrarSangriaSchema,
  RegistrarSangriaDTO,
  MOTIVOS_SANGRIA,
} from "@/schemas/caixa.schemas";
import { useRegistrarSangria } from "@/api/caixa.api";
import { AlertCircle, Droplet, Loader2, X, Check } from "lucide-react";

interface SangriaModalProps {
  sessaoId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SangriaModal = ({
  sessaoId,
  isOpen,
  onClose,
  onSuccess,
}: SangriaModalProps) => {
  const { mutate: registrarSangria, isPending } = useRegistrarSangria(sessaoId);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegistrarSangriaDTO>({
    resolver: zodResolver(registrarSangriaSchema),
    defaultValues: {
      valor: 0,
      motivo: "TrocaOperador",
      descricaoComplementar: "",
    },
  });

  const motivoSelecionado = watch("motivo");
  const requerDescricao = motivoSelecionado === "Outro";

  const onSubmit = (data: RegistrarSangriaDTO) => {
    registrarSangria(data, {
      onSuccess: () => {
        setShowSuccess(true);
        reset();

        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          onSuccess?.();
        }, 2000);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sangria-title"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Droplet className="w-6 h-6 text-orange-600" />
              </div>
              <h2 id="sangria-title" className="text-xl font-bold text-slate-900">
                Registrar Sangria
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Sangria registrada com sucesso!
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Valor */}
              <div>
                <label
                  htmlFor="valor"
                  className="block text-sm font-medium text-slate-900 mb-2"
                >
                  Valor da Sangria
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                    R$
                  </span>
                  <input
                    {...register("valor", {
                      valueAsNumber: true,
                    })}
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors font-semibold ${
                      errors.valor
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500"
                        : "border-slate-300 focus:ring-2 focus:ring-orange-500"
                    }`}
                    aria-describedby={errors.valor ? "valor-error" : undefined}
                  />
                </div>
                {errors.valor && (
                  <p
                    id="valor-error"
                    className="mt-1 text-xs text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.valor.message}
                  </p>
                )}
              </div>

              {/* Motivo */}
              <div>
                <label
                  htmlFor="motivo"
                  className="block text-sm font-medium text-slate-900 mb-2"
                >
                  Motivo da Sangria
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register("motivo")}
                  id="motivo"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors ${
                    errors.motivo
                      ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500"
                      : "border-slate-300 focus:ring-2 focus:ring-orange-500"
                  }`}
                  aria-describedby={errors.motivo ? "motivo-error" : undefined}
                >
                  {MOTIVOS_SANGRIA.map((motivo) => (
                    <option key={motivo.value} value={motivo.value}>
                      {motivo.label}
                    </option>
                  ))}
                </select>
                {errors.motivo && (
                  <p
                    id="motivo-error"
                    className="mt-1 text-xs text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.motivo.message}
                  </p>
                )}
              </div>

              {/* Descrição Complementar - Condicional */}
              {requerDescricao && (
                <div>
                  <label
                    htmlFor="descricaoComplementar"
                    className="block text-sm font-medium text-slate-900 mb-2"
                  >
                    Descrição Complementar
                    <span className="text-red-500 ml-1">*</span>
                    <span className="text-slate-400 font-normal ml-1">
                      (Obrigatória para "Outro")
                    </span>
                  </label>
                  <textarea
                    {...register("descricaoComplementar")}
                    id="descricaoComplementar"
                    placeholder="Descreva o motivo da sangria..."
                    rows={3}
                    maxLength={500}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors resize-none ${
                      errors.descricaoComplementar
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500"
                        : "border-slate-300 focus:ring-2 focus:ring-orange-500"
                    }`}
                    aria-describedby={
                      errors.descricaoComplementar
                        ? "descricao-error"
                        : undefined
                    }
                  />
                  {errors.descricaoComplementar && (
                    <p
                      id="descricao-error"
                      className="mt-1 text-xs text-red-600 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.descricaoComplementar.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    Máximo 500 caracteres
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-medium text-blue-900 mb-1">
                  ℹ️ Informação Importante
                </p>
                <p className="text-xs text-blue-700">
                  Toda sangria deve ser classificada com um motivo específico.
                  Isso ajuda a manter um histórico completo e auditável de todas
                  as retiradas em caixa.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending || showSuccess}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending || showSuccess}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    isPending || showSuccess
                      ? "bg-slate-200 text-slate-600 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700 active:scale-95"
                  }`}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Droplet className="w-4 h-4" />
                      Registrar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
