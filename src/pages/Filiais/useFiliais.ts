import { useEffect, useState } from 'react';
import { Filial } from '../../types/filial';
import { filiaisService } from '../../services/filiais';
import { getCurrentAcademyId } from '../../hooks/useAcademies';

export const useFiliais = () => {
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [filtered, setFiltered] = useState<Filial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFilial, setSelectedFilial] = useState<Filial | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await filiaisService.getAll();
      setFiliais(data);
      setFiltered(data);
    } catch {
      setError('Erro ao carregar filiais.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const normalized = query.toLowerCase();
    setFiltered(
      filiais.filter((filial) =>
        filial.nome.toLowerCase().includes(normalized) ||
        filial.codigo.toLowerCase().includes(normalized) ||
        filial.fusoHorario.toLowerCase().includes(normalized)
      )
    );
  };

  const handleNew = () => {
    setSelectedFilial(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (filial: Filial) => {
    setSelectedFilial(filial);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Confirma exclusão da filial?')) return;

    try {
      await filiaisService.delete(id);
      await load();
    } catch {
      alert('Erro ao excluir filial.');
    }
  };

  const handleSave = async (data: Filial) => {
    try {
      const idToUpdate = data.id ?? selectedFilial?.id;
      if (idToUpdate) {
        await filiaisService.update(idToUpdate, { ...data, id: idToUpdate });
      } else {
        const selectedAcademyId = getCurrentAcademyId();
        await filiaisService.create({
          academiaId: selectedAcademyId ?? data.academiaId,
          nome: data.nome,
          codigo: data.codigo,
          fusoHorario: data.fusoHorario,
          tipoUnidade: data.tipoUnidade,
          matrizId: data.matrizId,
          matrizPublicId: data.matrizPublicId,
          ativa: data.ativa,
        });
      }

      setIsFormOpen(false);
      await load();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar filial.');
    }
  };

  return {
    filiais: filtered,
    allFiliais: filiais,
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
    closeForm: () => setIsFormOpen(false),
  };
};