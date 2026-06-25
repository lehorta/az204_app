import { useState, useEffect } from 'react';
import { Academy } from '../types';
import { academyService } from '../services/academy';

const SELECTED_ACADEMY_STORAGE_KEY = 'gym_selected_academy';

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

  const persistSelectedAcademy = (academy: Academy | null) => {
    if (!academy) {
      localStorage.removeItem(SELECTED_ACADEMY_STORAGE_KEY);
      return;
    }

    localStorage.setItem(SELECTED_ACADEMY_STORAGE_KEY, JSON.stringify(academy));
  };

  const loadSelectedAcademy = (): Academy | null => {
    try {
      const raw = localStorage.getItem(SELECTED_ACADEMY_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Academy;
    } catch {
      return null;
    }
  };

  const fetchAcademies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await academyService.getMyAcademies();
      setAcademies(data);
      
      const persistedAcademy = loadSelectedAcademy();

      if (persistedAcademy) {
        const sameAcademy = data.find((academy) => academy.academyId === persistedAcademy.academyId);
        if (sameAcademy) {
          setSelectedAcademy(sameAcademy);
          return;
        }
      }

      // Define a primeira academia como selecionada por padrão
      if (data.length > 0) {
        setSelectedAcademy(data[0]);
        persistSelectedAcademy(data[0]);
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

  const setSelectedAcademyAndPersist = (academy: Academy) => {
    setSelectedAcademy(academy);
    persistSelectedAcademy(academy);
  };

  return {
    academies,
    isLoading,
    error,
    selectedAcademy,
    setSelectedAcademy: setSelectedAcademyAndPersist,
    refetch: fetchAcademies,
  };
};

export const getCurrentAcademyId = (): number | undefined => {
  try {
    const raw = localStorage.getItem(SELECTED_ACADEMY_STORAGE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as Academy;
    const academyId = Number(parsed.academyId);
    return Number.isFinite(academyId) ? academyId : undefined;
  } catch {
    return undefined;
  }
};
