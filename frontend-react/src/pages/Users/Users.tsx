import { UsersView } from './UsersView';
import { useUsers } from './useUsers';

export const Users = () => {
  const {
    users,
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
  } = useUsers();

  return (
    <UsersView
      users={users}
      stats={stats}
      searchQuery={searchQuery}
      isLoading={isLoading}
      onSearch={handleSearch}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNewUser={handleNewUser}
      isFormOpen={isFormOpen}
      onCloseForm={() => setIsFormOpen(false)}
      selectedUser={selectedUser}
      onSaveUser={handleSaveUser}
    />
  );
};
