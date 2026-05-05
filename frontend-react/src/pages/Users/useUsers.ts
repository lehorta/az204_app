import { useState, useEffect } from 'react';
import { User, UserRole, UserStats } from '../../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<UserStats[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  // Dados mockados
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Carlos Silva',
      email: 'carlos.silva@academia.com',
      telefone: '(11) 98765-4321',
      role: 'Administrador',
      status: 'ativo',
      lastAccess: '2026-02-08',
    },
    {
      id: '2',
      name: 'Ana Santos',
      email: 'ana.santos@academia.com',
      telefone: '(11) 97654-3210',
      role: 'Recepcionista',
      status: 'ativo',
      lastAccess: '2026-02-07',
    },
    {
      id: '3',
      name: 'Roberto Costa',
      email: 'roberto.costa@academia.com',
      telefone: '(11) 96543-2109',
      role: 'Professor',
      status: 'ativo',
      lastAccess: '2026-02-08',
    },
  ];

  // Carrega usuários
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      calculateStats(mockUsers);
      setIsLoading(false);
    }, 500);
  }, []);

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

    const newStats: UserStats[] = roles.map((role) => ({
      role,
      count: userList.filter((u) => u.role === role).length,
      color: colors[role],
    }));

    setStats(newStats);
  };

  // Busca usuários
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      const searchLower = query.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
      );
    });

    setFilteredUsers(filtered);
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
      setUsers(users.filter((u) => u.id !== userId));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== userId));
      console.log('Usuário deletado:', userId);
    }
  };

  // Novo usuário
  const handleNewUser = () => {
    setSelectedUser(undefined);
    setIsFormOpen(true);
  };

  // Salvar usuário
  const handleSaveUser = (user: User) => {
    if (selectedUser) {
      // Atualizar usuário existente
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      console.log('Usuário atualizado:', user);
    } else {
      // Criar novo usuário
      const newUsers = [...users, user];
      setUsers(newUsers);
      setFilteredUsers(newUsers);
      calculateStats(newUsers);
      console.log('Usuário criado:', user);
    }
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
