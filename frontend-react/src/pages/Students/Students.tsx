import { StudentsView } from './StudentsView';
import { useStudents } from './useStudents';
import { StudentForm } from './StudentForm';

export const Students = () => {
  const {
    students,
    stats,
    searchQuery,
    isLoading,
    isFormOpen,
    selectedStudent,
    handleSearch,
    handleEdit,
    handleDelete,
    handleNewStudent,
    handleSaveStudent,
    closeForm,
  } = useStudents();

  return (
    <>
      <StudentsView
        students={students}
        stats={stats}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNewStudent={handleNewStudent}
      />
      <StudentForm
        student={selectedStudent}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleSaveStudent}
      />
    </>
  );
};
