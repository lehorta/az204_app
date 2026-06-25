import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { Funcionario, TipoFuncionario, StatusFuncionario } from '../../types/funcionario';
import { Search, Edit2, Trash2, Plus, Mail, Phone, Award } from 'lucide-react';

interface Props {
  funcionarios: Funcionario[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  onSearch: (q: string) => void;
  onNew: () => void;
  onEdit: (f: Funcionario) => void;
  onDelete: (id: number) => void;
}

const TIPO_LABEL: Record<TipoFuncionario, string> = {
  Professor: 'Professor',
  Recepcionista: 'Recepcionista',
  Limpeza: 'Limpeza',
  Administrativo: 'Administrativo',
  Outro: 'Outro',
};

const STATUS_CLASS: Record<StatusFuncionario, string> = {
  Ativo: 'bg-green-100 text-green-800',
  Inativo: 'bg-gray-100 text-gray-600',
  Afastado: 'bg-yellow-100 text-yellow-800',
};

export const FuncionariosView = ({
  funcionarios,
  searchQuery,
  isLoading,
  error,
  onSearch,
  onNew,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <AdminLayout userName="Funcionários">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Funcionários</h1>
            <p className="text-text-secondary">Gestão de equipe e professores</p>
          </div>
          <Button onClick={onNew} size="md">
            <Plus className="w-5 h-5 mr-2" />
            Novo Funcionário
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="text-center text-text-secondary py-12">Carregando...</div>
        ) : funcionarios.length === 0 ? (
          <div className="text-center text-text-secondary py-12">
            Nenhum funcionário encontrado.
          </div>
        ) : (
          <div className="grid gap-4">
            {funcionarios.map((f) => (
              <div
                key={f.id ?? f.cpf}
                className="bg-bg-secondary border border-border rounded-xl p-5 flex items-center justify-between hover:border-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  {f.foto ? (
                    <img
                      src={f.foto}
                      alt={f.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                      {f.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-text-primary">{f.nome}</p>
                    <p className="text-sm text-text-secondary">{TIPO_LABEL[f.tipo]}</p>
                    <div className="flex gap-3 mt-1 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {f.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {f.telefone}
                      </span>
                      {f.cref && (
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" /> CREF: {f.cref}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CLASS[f.status]}`}>
                    {f.status}
                  </span>
                  <button
                    onClick={() => onEdit(f)}
                    className="p-2 text-text-secondary hover:text-accent transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => f.id && onDelete(f.id)}
                    className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
