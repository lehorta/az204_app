import { useState, useEffect } from 'react';
import { Academy } from '../types';
import { academyService } from '../services/academy';

interface UseAcademiesReturn {
  academies: Academy[];
  isLoading: boolean;
  error: string | null;
  selectedAcademy: Academy | null;
  setSelectedAcademy: (academy: Academy) => void;
  refetch: () => Promise<void>;
}

export const useAcademies = (): UseAcademiesReturn => {
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);

  const fetchAcademies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await academyService.getMyAcademies();
      setAcademies(data);
      
      // Define a primeira academia como selecionada por padrão
      if (data.length > 0 && !selectedAcademy) {
        setSelectedAcademy(data[0]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar academias';
      setError(message);
      console.error('Erro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademies();
  }, []);

  return {
    academies,
    isLoading,
    error,
    selectedAcademy,
    setSelectedAcademy,
    refetch: fetchAcademies,
  };
};
