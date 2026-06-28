import { FuncionariosView } from './FuncionariosView';
import { FuncionarioForm } from './FuncionarioForm';
import { useFuncionarios } from './useFuncionarios';

export const Funcionarios = () => {
  const {
    funcionarios,
    searchQuery,
    isLoading,
    isFormOpen,
    selectedFuncionario,
    error,
    handleSearch,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    closeForm,
  } = useFuncionarios();

  return (
    <>
      <FuncionariosView
        funcionarios={funcionarios}
        searchQuery={searchQuery}
        isLoading={isLoading}
        error={error}
        onSearch={handleSearch}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {isFormOpen && (
        <FuncionarioForm
          funcionario={selectedFuncionario}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </>
  );
};
