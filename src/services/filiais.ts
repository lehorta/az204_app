import { getApiUrl } from '../config/api';
import { authService } from './auth';
import { Filial } from '../types/filial';
import { getCurrentAcademyId } from '../hooks/useAcademies';

const baseUrl = () => `${getApiUrl()}/Filiais`;
const storageKey = 'sisburpee_filiais_mock';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${authService.getToken()}`,
});

const normalizeTipoUnidade = (value: unknown): 'Matriz' | 'Filial' => {
  if (value === 1 || value === '1' || value === 'Matriz' || value === 'matriz') {
    return 'Matriz';
  }

  return 'Filial';
};

const mapFilialApiToUi = (raw: any): Filial => ({
  id: raw?.id ?? raw?.Id,
  publicId: raw?.publicId ?? raw?.PublicId,
  academiaId: raw?.academiaId ?? raw?.AcademiaId,
  nome: raw?.nome ?? raw?.Nome ?? '',
  codigo: raw?.codigo ?? raw?.Codigo ?? '',
  fusoHorario: raw?.fusoHorario ?? raw?.FusoHorario ?? 'America/Sao_Paulo',
  tipoUnidade: normalizeTipoUnidade(raw?.tipoUnidade ?? raw?.TipoUnidade),
  matrizId: raw?.matrizId ?? raw?.MatrizId,
  matrizPublicId: raw?.matrizPublicId ?? raw?.MatrizPublicId,
  ativa: raw?.ativa ?? raw?.Ativa ?? true,
  createdAt: raw?.createdAt ?? raw?.CreatedAt,
  updatedAt: raw?.updatedAt ?? raw?.UpdatedAt,
});

const loadMock = (): Filial[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveMock = (items: Filial[]) => {
  localStorage.setItem(storageKey, JSON.stringify(items));
};

const nextMockId = (items: Filial[]) => items.reduce((max, item) => Math.max(max, item.id ?? 0), 0) + 1;

const isApiUnavailable = (status?: number) => status === 404 || status === 405 || status === 501;

const resolveAcademiaId = () => {
  const selectedAcademyId = getCurrentAcademyId();
  if (selectedAcademyId) return selectedAcademyId;

  const userAcademyId = Number(authService.getUser()?.academyId);
  return Number.isFinite(userAcademyId) ? userAcademyId : undefined;
};

export const filiaisService = {
  async getAll(): Promise<Filial[]> {
    try {
      const response = await fetch(baseUrl(), { headers: headers() });
      if (!response.ok) {
        if (isApiUnavailable(response.status)) {
          return loadMock();
        }

        throw new Error(`Erro ao listar filiais: ${response.status}`);
      }

      const data = await response.json();
      const mapped = Array.isArray(data) ? data.map(mapFilialApiToUi) : [];
      const academiaId = resolveAcademiaId();
      return academiaId ? mapped.filter((item) => item.academiaId === academiaId) : mapped;
    } catch {
      const academiaId = resolveAcademiaId();
      const localItems = loadMock();
      return academiaId ? localItems.filter((item) => item.academiaId === academiaId) : localItems;
    }
  },

  async create(data: Omit<Filial, 'id' | 'publicId' | 'createdAt' | 'updatedAt'>): Promise<Filial> {
    try {
      const response = await fetch(baseUrl(), {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (!isApiUnavailable(response.status)) {
          throw new Error(`Erro ao criar filial: ${response.status}`);
        }

        throw new Error('API unavailable');
      }

      const created = await response.json();
      return mapFilialApiToUi(created);
    } catch {
      const current = loadMock();
      const academiaId = data.academiaId ?? resolveAcademiaId();
      const created: Filial = {
        ...data,
        academiaId,
        id: nextMockId(current),
        publicId: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...current, created];
      saveMock(updated);
      return created;
    }
  },

  async update(id: number, data: Filial): Promise<void> {
    try {
      const response = await fetch(`${baseUrl()}/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ ...data, id, Id: id }),
      });

      if (!response.ok) {
        if (!isApiUnavailable(response.status)) {
          throw new Error(`Erro ao atualizar filial: ${response.status}`);
        }

        throw new Error('API unavailable');
      }
      return;
    } catch {
      const current = loadMock();
      const updated = current.map((item) =>
        item.id === id
          ? { ...item, ...data, id, updatedAt: new Date().toISOString() }
          : item
      );
      saveMock(updated);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${baseUrl()}/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });

      if (!response.ok) {
        if (!isApiUnavailable(response.status)) {
          throw new Error(`Erro ao excluir filial: ${response.status}`);
        }

        throw new Error('API unavailable');
      }
      return;
    } catch {
      const current = loadMock();
      saveMock(current.filter((item) => item.id !== id));
    }
  },
};