import { getApiUrl } from '../config/api';
import { authService } from './auth';
import { Funcionario } from '../types/funcionario';

const baseUrl = () => `${getApiUrl()}/Funcionarios`;

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${authService.getToken()}`,
});

const mapFuncionarioApiToUi = (raw: any): Funcionario => ({
  id: raw?.id ?? raw?.Id,
  publicId: raw?.publicId ?? raw?.PublicId,
  nome: raw?.nome ?? raw?.Nome ?? '',
  email: raw?.email ?? raw?.Email ?? '',
  telefone: raw?.telefone ?? raw?.Telefone ?? '',
  cpf: raw?.cpf ?? raw?.CPF ?? '',
  dataNascimento: raw?.dataNascimento ?? raw?.DataNascimento ?? '',
  foto: raw?.foto ?? raw?.Foto,
  tipo: raw?.tipo ?? raw?.Tipo,
  especialidade: raw?.especialidade ?? raw?.Especialidade,
  cref: raw?.cref ?? raw?.CREF,
  dataAdmissao: raw?.dataAdmissao ?? raw?.DataAdmissao ?? '',
  dataDemissao: raw?.dataDemissao ?? raw?.DataDemissao,
  tipoContrato: raw?.tipoContrato ?? raw?.TipoContrato,
  salarioBase: raw?.salarioBase ?? raw?.SalarioBase,
  cargaHorariaSemanal: raw?.cargaHorariaSemanal ?? raw?.CargaHorariaSemanal,
  status: raw?.status ?? raw?.Status,
  academiaId: raw?.academiaId ?? raw?.AcademiaId,
  applicationUserId: raw?.applicationUserId ?? raw?.ApplicationUserId,
});

export const funcionariosService = {
  async getAll(): Promise<Funcionario[]> {
    const response = await fetch(baseUrl(), { headers: headers() });
    if (!response.ok) throw new Error(`Erro ao listar funcionários: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapFuncionarioApiToUi) : [];
  },

  async getById(id: number): Promise<Funcionario> {
    const response = await fetch(`${baseUrl()}/${id}`, { headers: headers() });
    if (!response.ok) throw new Error(`Funcionário não encontrado: ${response.status}`);
    const data = await response.json();
    return mapFuncionarioApiToUi(data);
  },

  async create(data: Omit<Funcionario, 'id' | 'publicId'>): Promise<Funcionario> {
    const response = await fetch(baseUrl(), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Erro ao criar funcionário: ${response.status}`);
    const created = await response.json();
    return mapFuncionarioApiToUi(created);
  },

  async update(id: number, data: Funcionario): Promise<void> {
    const response = await fetch(`${baseUrl()}/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ ...data, id, Id: id }),
    });
    if (!response.ok) throw new Error(`Erro ao atualizar funcionário: ${response.status}`);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${baseUrl()}/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!response.ok) throw new Error(`Erro ao excluir funcionário: ${response.status}`);
  },
};
