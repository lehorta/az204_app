import { useState, useEffect } from 'react';
import { Student, StudentStats } from '../../types';
import { mapRespostaListaAlunosParaStudents, studentsService } from '../../services/students';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<StudentStats[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);

  // Carrega alunos
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const response = await studentsService.getAll();
        const mappedStudents = mapRespostaListaAlunosParaStudents(response);

        setStudents(mappedStudents);
        setFilteredStudents(mappedStudents);
        calculateStats(mappedStudents);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Calcula estatísticas
  const calculateStats = (studentList: Student[]) => {
    const stats: StudentStats[] = [
      {
        label: 'Total de Alunos',
        value: studentList.length,
        color: 'bg-blue-500',
      },
      {
        label: 'Ativos',
        value: studentList.filter((s) => s.status === 'ativo').length,
        color: 'bg-green-500',
      },
      {
        label: 'Inativos',
        value: studentList.filter((s) => s.status === 'inativo').length,
        color: 'bg-red-500',
      },
    ];

    setStats(stats);
  };

  // Busca alunos
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredStudents(students);
      return;
    }

    const normalizeCpf = (value?: string) => (value ?? '').replace(/\D/g, '');
    const normalizedQuery = query.toLowerCase();
    const normalizedCpfQuery = normalizeCpf(query);
    const filtered = students.filter((student) => {
      const nameMatch = student.name?.toLowerCase().includes(normalizedQuery) || false;
      const emailMatch = student.email?.toLowerCase().includes(normalizedQuery) || false;
      const cpfMatch = normalizedCpfQuery
        ? normalizeCpf(student.cpf).includes(normalizedCpfQuery)
        : false;
      const phoneMatch = student.telefone?.includes(normalizedQuery) || false;

      return nameMatch || emailMatch || cpfMatch || phoneMatch;
    });

    setFilteredStudents(filtered);
  };

  // Editar aluno
  const handleEdit = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  // Deletar aluno
  const handleDelete = (studentId: string) => {
    if (confirm('Deseja realmente excluir este aluno?')) {
      setStudents(students.filter((s) => s.id !== studentId));
      setFilteredStudents(filteredStudents.filter((s) => s.id !== studentId));
      console.log('Aluno deletado:', studentId);
    }
  };

  // Novo aluno
  const handleNewStudent = () => {
    setSelectedStudent(undefined);
    setIsFormOpen(true);
  };

  // Salvar aluno
  const handleSaveStudent = (student: Student) => {
    if (selectedStudent) {
      // Editar - atualizar estudante existente
      const updatedStudents = students.map((s) => (s.id === student.id ? student : s));
      setStudents(updatedStudents);
      // Reaplicar filtro ao atualizar
      if (searchQuery.trim()) {
        const filtered = updatedStudents.filter((s) => {
          const normalizeCpf = (value?: string) => (value ?? '').replace(/\D/g, '');
          const searchLower = searchQuery.toLowerCase();
          const normalizedCpfQuery = normalizeCpf(searchQuery);
          return (
            s.name?.toLowerCase().includes(searchLower) ||
            s.email?.toLowerCase().includes(searchLower) ||
            (normalizedCpfQuery ? normalizeCpf(s.cpf).includes(normalizedCpfQuery) : false) ||
            s.telefone?.includes(searchLower)
          );
        });
        setFilteredStudents(filtered);
      } else {
        setFilteredStudents(updatedStudents);
      }
      calculateStats(updatedStudents);
    } else {
      // Criar novo - apenas adicionar se não existe com mesmo ID
      const studentExists = students.some((s) => s.id === student.id);
      
      let updatedStudents;
      if (!studentExists) {
        updatedStudents = [...students, student];
      } else {
        updatedStudents = students.map((s) => (s.id === student.id ? student : s));
      }
      
      setStudents(updatedStudents);
      // Reaplicar filtro ao criar
      if (searchQuery.trim()) {
        const normalizeCpf = (value?: string) => (value ?? '').replace(/\D/g, '');
        const searchLower = searchQuery.toLowerCase();
        const normalizedCpfQuery = normalizeCpf(searchQuery);
        const filtered = updatedStudents.filter((s) => {
          return (
            s.name?.toLowerCase().includes(searchLower) ||
            s.email?.toLowerCase().includes(searchLower) ||
            (normalizedCpfQuery ? normalizeCpf(s.cpf).includes(normalizedCpfQuery) : false) ||
            s.telefone?.includes(searchLower)
          );
        });
        setFilteredStudents(filtered);
      } else {
        setFilteredStudents(updatedStudents);
      }
      calculateStats(updatedStudents);
    }
    console.log('Aluno salvo:', student);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedStudent(undefined);
  };

  return {
    students: filteredStudents,
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
  };
};
