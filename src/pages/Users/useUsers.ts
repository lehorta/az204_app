import { useState, useEffect } from 'react';
import { User, UserRole, UserStats } from '../../types';
import { getApiUrl } from '../../config/api';
import { authService } from '../../services/auth';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<UserStats[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // Calcula estatísticas
  const calculateStats = (userList: User[]) => {
    const roles: UserRole[] = ['Administrador', 'Gerente', 'Financeiro', 'Recepcionista', 'Professor'];
    const colors: Record<UserRole, string> = {
      Administrador: 'bg-purple-500',
      Gerente: 'bg-blue-500',
      Financeiro: 'bg-green-500',
      Recepcionista: 'bg-yellow-500',
      Professor: 'bg-orange-500',
    };
    setStats(roles.map((role) => ({
      role,
      count: userList.filter((u) => u.role === role).length,
      color: colors[role],
    })));
  };

  // Carrega usuários da API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = authService.getToken();
        const response = await fetch(`${getApiUrl()}/Users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // A API retorna array de usuários; adaptar campos para o tipo User do frontend
        const data = await response.json();
        const mapped: User[] = (Array.isArray(data) ? data : data.dados ?? []).map((u: any) => ({
          id: String(u.id ?? u.publicId ?? ''),
          name: u.nome ?? u.name ?? '',
          email: u.email ?? '',
          telefone: u.ramal ?? u.telefone ?? '',
          role: u.roles?.[0] ?? u.role ?? 'Recepcionista',
          status: u.isDeleted ? 'inativo' : 'ativo',
          lastAccess: u.lastAccess ?? '',
        }));
        setUsers(mapped);
        setFilteredUsers(mapped);
        calculateStats(mapped);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Busca usuários
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredUsers(users.filter((u) =>
      u.name.toLowerCase().includes(lower) ||
      u.email.toLowerCase().includes(lower) ||
      u.role.toLowerCase().includes(lower)
    ));
  };

  // Editar usuário
  const handleEdit = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsFormOpen(true);
    }
  };

  // Deletar usuário
  const handleDelete = (userId: string) => {
    if (confirm('Deseja realmente excluir este usuário?')) {
      const updated = users.filter((u) => u.id !== userId);
      setUsers(updated);
      setFilteredUsers(updated.filter((u) => {
        const lower = searchQuery.toLowerCase();
        return !lower || u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower);
      }));
      calculateStats(updated);
    }
  };

  // Novo usuário
  const handleNewUser = () => {
    setSelectedUser(undefined);
    setIsFormOpen(true);
  };

  // Salvar usuário (local — persistência via API pode ser adicionada depois)
  const handleSaveUser = (user: User) => {
    const updatedUsers = selectedUser
      ? users.map((u) => (u.id === user.id ? user : u))
      : [...users, user];
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    calculateStats(updatedUsers);
  };

  return {
    users: filteredUsers,
    stats,
    searchQuery,
    isLoading,
    handleSearch,
    handleEdit,
    handleDelete,
    handleNewUser,
    isFormOpen,
    setIsFormOpen,
    selectedUser,
    handleSaveUser,
  };
};
