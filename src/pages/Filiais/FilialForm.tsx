import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../components/Button';
import { Filial, TipoUnidadeFilial } from '../../types/filial';
import { authService } from '../../services/auth';
import { getCurrentAcademyId } from '../../hooks/useAcademies';

interface Props {
  filial?: Filial;
  filiais: Filial[];
  onSave: (data: Filial) => void;
  onClose: () => void;
}

const TIPOS: TipoUnidadeFilial[] = ['Matriz', 'Filial'];

const empty = (academiaId?: number): Omit<Filial, 'id' | 'publicId'> => ({
  academiaId,
  nome: '',
  codigo: '',
  fusoHorario: 'America/Sao_Paulo',
  tipoUnidade: 'Filial',
  matrizId: undefined,
  matrizPublicId: undefined,
  ativa: true,
});

export const FilialForm = ({ filial, filiais, onSave, onClose }: Props) => {
  const defaultAcademiaId = useMemo(() => {
    const selectedAcademyId = getCurrentAcademyId();
    if (selectedAcademyId) return selectedAcademyId;

    const userAcademyId = authService.getUser()?.academyId;
    const parsed = Number(userAcademyId);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, []);

  const [form, setForm] = useState<Filial>({ ...empty(defaultAcademiaId), ...(filial ?? {}) });

  useEffect(() => {
    setForm({ ...empty(defaultAcademiaId), ...(filial ?? {}) });
  }, [filial, defaultAcademiaId]);

  const matrizes = useMemo(
    () => filiais.filter((item) => item.tipoUnidade === 'Matriz' && item.id !== form.id),
    [filiais, form.id]
  );

  const set = <K extends keyof Filial>(field: K, value: Filial[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTipoChange = (tipo: TipoUnidadeFilial) => {
    setForm((prev) => ({
      ...prev,
      tipoUnidade: tipo,
      matrizId: tipo === 'Matriz' ? undefined : prev.matrizId,
      matrizPublicId: tipo === 'Matriz' ? undefined : prev.matrizPublicId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-secondary border border-border-primary rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <h2 className="text-xl font-bold text-text-primary">
            {form.id ? 'Editar Filial' : 'Nova Filial'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Nome *</label>
              <input
                required
                value={form.nome}
                onChange={(e) => set('nome', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Código *</label>
              <input
                required
                value={form.codigo}
                onChange={(e) => set('codigo', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Tipo de Unidade *</label>
              <select
                value={form.tipoUnidade}
                onChange={(e) => handleTipoChange(e.target.value as TipoUnidadeFilial)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              >
                {TIPOS.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Fuso Horário *</label>
              <input
                required
                value={form.fusoHorario}
                onChange={(e) => set('fusoHorario', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {form.tipoUnidade === 'Filial' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Matriz vinculada</label>
              <select
                value={form.matrizId ?? ''}
                onChange={(e) => set('matrizId', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="">Selecione uma matriz</option>
                {matrizes.map((matriz) => (
                  <option key={matriz.id ?? matriz.publicId} value={matriz.id}>
                    {matriz.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Academia Id (contexto atual)</label>
              <input
                type="number"
                value={form.academiaId ?? ''}
                readOnly
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 text-text-primary">
                <input
                  type="checkbox"
                  checked={form.ativa}
                  onChange={(e) => set('ativa', e.target.checked)}
                  className="rounded border-border-primary"
                />
                Unidade ativa
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Se o endpoint de filiais ainda não estiver disponível no backend, os dados serão mantidos localmente no navegador para permitir a navegação e testes da tela.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-background-tertiary hover:bg-background-primary border border-border-primary text-text-primary rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <Button type="submit" size="md">
              {form.id ? 'Salvar Alterações' : 'Cadastrar Filial'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};