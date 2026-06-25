import { useState, useEffect } from 'react';
import { Funcionario } from '../../types/funcionario';
import { funcionariosService } from '../../services/funcionarios';

export const useFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filtered, setFiltered] = useState<Funcionario[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await funcionariosService.getAll();
      const list = Array.isArray(data) ? data : [];
      setFuncionarios(list);
      setFiltered(list);
    } catch (err) {
      setError('Erro ao carregar funcionários.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const q = query.toLowerCase();
    setFiltered(
      funcionarios.filter(
        (f) =>
          f.nome.toLowerCase().includes(q) ||
          f.email.toLowerCase().includes(q) ||
          f.cpf.includes(q)
      )
    );
  };

  const handleNew = () => {
    setSelectedFuncionario(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (f: Funcionario) => {
    setSelectedFuncionario(f);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Confirma exclusão do funcionário?')) return;
    try {
      await funcionariosService.delete(id);
      await load();
    } catch {
      alert('Erro ao excluir funcionário.');
    }
  };

  const handleSave = async (data: Funcionario) => {
    try {
      const idToUpdate = data.id ?? selectedFuncionario?.id;

      if (idToUpdate) {
        await funcionariosService.update(idToUpdate, { ...data, id: idToUpdate });
      } else {
        await funcionariosService.create(data);
      }
      setIsFormOpen(false);
      await load();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar funcionário.');
    }
  };

  const closeForm = () => setIsFormOpen(false);

  return {
    funcionarios: filtered,
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
  };
};
