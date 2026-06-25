import { useState, useEffect } from 'react';
import { Funcionario, TipoFuncionario, TipoContrato, StatusFuncionario } from '../../types/funcionario';
import { X } from 'lucide-react';
import { Button } from '../../components/Button';

interface Props {
  funcionario?: Funcionario;
  onSave: (data: Funcionario) => void;
  onClose: () => void;
}

const TIPOS: TipoFuncionario[] = ['Professor', 'Recepcionista', 'Limpeza', 'Administrativo', 'Outro'];
const CONTRATOS: TipoContrato[] = ['CLT', 'PJ', 'Estagio', 'Voluntario'];
const STATUS_LIST: StatusFuncionario[] = ['Ativo', 'Inativo', 'Afastado'];

const empty: Omit<Funcionario, 'id' | 'publicId'> = {
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  dataNascimento: '',
  tipo: 'Outro',
  tipoContrato: 'CLT',
  dataAdmissao: new Date().toISOString().split('T')[0],
  status: 'Ativo',
};

export const FuncionarioForm = ({ funcionario, onSave, onClose }: Props) => {
  const [form, setForm] = useState<Funcionario>({ ...empty, ...(funcionario ?? {}) });

  useEffect(() => {
    setForm({ ...empty, ...(funcionario ?? {}) });
  }, [funcionario]);

  const set = (field: keyof Funcionario, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-secondary border border-border-primary rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <h2 className="text-xl font-bold text-text-primary">
            {form.id ? 'Editar Funcionário' : 'Novo Funcionário'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Nome + Email */}
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
              <label className="block text-sm font-medium text-text-secondary mb-1">E-mail *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* CPF + Telefone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">CPF *</label>
              <input
                required
                value={form.cpf}
                onChange={(e) => set('cpf', e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Telefone</label>
              <input
                value={form.telefone}
                onChange={(e) => set('telefone', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Data nascimento + Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Data de Nascimento *</label>
              <input
                required
                type="date"
                value={form.dataNascimento?.split('T')[0] ?? ''}
                onChange={(e) => set('dataNascimento', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Tipo *</label>
              <select
                value={form.tipo}
                onChange={(e) => set('tipo', e.target.value as TipoFuncionario)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              >
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Especialidade + CREF (apenas para Professor) */}
          {form.tipo === 'Professor' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Especialidade</label>
                <input
                  value={form.especialidade ?? ''}
                  onChange={(e) => set('especialidade', e.target.value)}
                  placeholder="Musculação, Pilates..."
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">CREF</label>
                <input
                  value={form.cref ?? ''}
                  onChange={(e) => set('cref', e.target.value)}
                  className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          )}

          {/* Admissão + Contrato */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Data de Admissão *</label>
              <input
                required
                type="date"
                value={form.dataAdmissao?.split('T')[0] ?? ''}
                onChange={(e) => set('dataAdmissao', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Tipo de Contrato</label>
              <select
                value={form.tipoContrato}
                onChange={(e) => set('tipoContrato', e.target.value as TipoContrato)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              >
                {CONTRATOS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Salário + Carga horária */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Salário Base (R$)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.salarioBase ?? ''}
                onChange={(e) => set('salarioBase', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Carga Horária Semanal (h)</label>
              <input
                type="number"
                min={0}
                value={form.cargaHorariaSemanal ?? ''}
                onChange={(e) => set('cargaHorariaSemanal', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as StatusFuncionario)}
                className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
              >
                {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-background-tertiary hover:bg-background-primary border border-border-primary text-text-primary rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <Button type="submit" size="md">
              {form.id ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
