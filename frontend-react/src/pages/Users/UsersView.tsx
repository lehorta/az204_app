import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, UserStats } from '../../types';
import { Search, Edit2, Trash2, Plus } from 'lucide-react';
import { UserForm } from './UserForm';

interface UsersViewProps {
  users: User[];
  stats: UserStats[];
  searchQuery: string;
  isLoading: boolean;
  onSearch: (query: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  onNewUser: () => void;
  isFormOpen: boolean;
  onCloseForm: () => void;
  selectedUser?: User;
  onSaveUser: (user: User) => void;
}

export const UsersView = ({
  users,
  stats,
  searchQuery,
  isLoading,
  onSearch,
  onEdit,
  onDelete,
  onNewUser,
  isFormOpen,
  onCloseForm,
  selectedUser,
  onSaveUser,
}: UsersViewProps) => {
  // Mapeia cores para badges
  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      Administrador: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Gerente: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Financeiro: 'bg-green-500/20 text-green-400 border-green-500/30',
      Recepcionista: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Professor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[role] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <AdminLayout userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Usuários do Sistema</h1>
            <p className="text-text-secondary">Gerenciamento de usuários e permissões</p>
          </div>
          <Button onClick={onNewUser} size="md">
            <Plus className="w-5 h-5 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Card key={stat.role} className="bg-background-secondary border-border-primary">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div className="flex-1">
                  <p className="text-xs text-text-secondary mb-1">{stat.role}</p>
                  <p className="text-2xl font-bold text-text-primary">{stat.count}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar usuário por nome, email ou perfil..."
            className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Users Table */}
        <Card className="bg-background-secondary border-border-primary overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-text-secondary">
              Carregando usuários...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-primary">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Nome</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Telefone</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Perfil</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Último Acesso</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border-primary hover:bg-background-tertiary transition-colors"
                    >
                      <td className="px-6 py-4 text-text-primary">{user.name}</td>
                      <td className="px-6 py-4 text-text-secondary">{user.email}</td>
                      <td className="px-6 py-4 text-text-secondary">{user.telefone}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'ativo'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{user.lastAccess}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(user.id)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(user.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <UserForm
        user={selectedUser}
        isOpen={isFormOpen}
        onClose={onCloseForm}
        onSave={onSaveUser}
      />
    </AdminLayout>
  );
};
