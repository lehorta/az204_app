import { FiliaisView } from './FiliaisView';
import { FilialForm } from './FilialForm';
import { useFiliais } from './useFiliais';

export const Filiais = () => {
  const {
    filiais,
    allFiliais,
    searchQuery,
    isLoading,
    isFormOpen,
    selectedFilial,
    error,
    handleSearch,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    closeForm,
  } = useFiliais();

  return (
    <>
      <FiliaisView
        filiais={filiais}
        searchQuery={searchQuery}
        isLoading={isLoading}
        error={error}
        onSearch={handleSearch}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {isFormOpen && (
        <FilialForm
          filial={selectedFilial}
          filiais={allFiliais}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </>
  );
};