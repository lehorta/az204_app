import { Building2, Edit2, GitBranch, Globe2, Plus, Search, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { Button } from '../../components/Button';
import { Filial } from '../../types/filial';

interface Props {
  filiais: Filial[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  onSearch: (query: string) => void;
  onNew: () => void;
  onEdit: (filial: Filial) => void;
  onDelete: (id: number) => void;
}

const STATUS_CLASS = {
  true: 'bg-green-100 text-green-800',
  false: 'bg-gray-100 text-gray-600',
};

export const FiliaisView = ({
  filiais,
  searchQuery,
  isLoading,
  error,
  onSearch,
  onNew,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <AdminLayout userName="Filiais">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Filiais</h1>
            <p className="text-text-secondary">Cadastro e gestão das unidades da academia</p>
          </div>
          <Button onClick={onNew} size="md">
            <Plus className="w-5 h-5 mr-2" />
            Nova Filial
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar por nome, código ou fuso horário..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
          />
        </div>

        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {isLoading ? (
          <div className="text-center text-text-secondary py-12">Carregando...</div>
        ) : filiais.length === 0 ? (
          <div className="text-center text-text-secondary py-12">Nenhuma filial cadastrada.</div>
        ) : (
          <div className="grid gap-4">
            {filiais.map((filial) => (
              <div
                key={filial.id ?? filial.publicId ?? filial.codigo}
                className="bg-bg-secondary border border-border rounded-xl p-5 flex items-center justify-between hover:border-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text-primary">{filial.nome}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CLASS[String(filial.ativa) as 'true' | 'false']}`}>
                        {filial.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-text-secondary flex-wrap">
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" /> {filial.tipoUnidade}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Código: {filial.codigo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe2 className="w-3 h-3" /> {filial.fusoHorario}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(filial)}
                    className="p-2 text-text-secondary hover:text-accent transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => filial.id && onDelete(filial.id)}
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