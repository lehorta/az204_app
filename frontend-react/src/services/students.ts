import { getApiUrl } from '../config/api';
import { Student } from '../types';
import { createApiError } from './apiError';

// Payload da API para cadastro de aluno
export interface CadastroAlunoPagamento {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  genero?: string | null;
  foto?: string | null;
  saude?: {
    peso?: number | null;
    altura?: number | null;
    tipoSanguineo?: string | null;
    condicoesMedicas?: string | null;
    alergias?: string | null;
    objetivo?: string | null;
  };
  contatoEmergencia?: {
    nome?: string | null;
    telefone?: string | null;
    relacionamento?: string | null;
  };
  responsavel?: {
    nome?: string | null;
    relacionamento?: string | null;
    cpf?: string | null;
    identidade?: string | null;
    telefone?: string | null;
    celular?: string | null;
  };
  endereco?: {
    rua?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    cep?: string | null;
  };
  pagamento?: {
    metodo?: string | null;
    titularCartao?: string | null;
    numeroCartao?: string | null;
    validadeCartao?: string | null;
    cvvCartao?: string | null;
  };
  assinatura?: {
    id?: string | null;
    nome?: string | null;
    preco?: number | null;
    duracao?: number | null;
    tipo?: string | null;
    dataInicio?: string | null;
    dataFim?: string | null;
    status?: string | null;
  };
  status?: string;
  dataCadastro?: string;
}

export interface RespostaAluno {
  sucesso: boolean;
  mensagem: string;
  dados?: Student;
}

export interface RespostaListaAlunos {
  sucesso: boolean;
  mensagem: string;
  dados?: Student[];
}

/**
 * Obter token de autenticação
 */
const obterTokenAutenticacao = (): string | null => {
  return localStorage.getItem('gym_auth_token');
};

/**
 * Obter headers de autenticação
 */
const obterHeadersAutenticacao = (): HeadersInit => {
  const token = obterTokenAutenticacao();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Converte dados do formulário de Aluno para formato de payload da API
 */
export const converterAlunoParaCadastro = (student: Student): CadastroAlunoPagamento => {
  const temDadosResponsavel = student.responsible && (
    student.responsible.name || 
    student.responsible.relationship || 
    student.responsible.cpf || 
    student.responsible.identity || 
    student.responsible.telefone || 
    student.responsible.phoneCellular
  );

  const pagamento: CadastroAlunoPagamento = {
    nome: student.name,
    email: student.email,
    telefone: student.telefone,
    dataNascimento: student.dataNascimento,
    cpf: student.cpf,
    genero: student.gender || null,
    foto: student.photo || null,
    saude: {
      peso: student.health?.weight ? parseFloat(String(student.health.weight)) : null,
      altura: student.health?.height ? parseFloat(String(student.health.height)) : null,
      tipoSanguineo: student.health?.bloodType || null,
      condicoesMedicas: student.health?.medicalConditions || null,
      alergias: student.health?.allergies || null,
      objetivo: student.health?.goal || null,
    },
    contatoEmergencia: {
      nome: student.emergencyContact?.name || null,
      telefone: student.emergencyContact?.telefone || null,
      relacionamento: student.emergencyContact?.relationship || null,
    },
    ...(temDadosResponsavel && {
      responsavel: {
        nome: student.responsible?.name || null,
        relacionamento: student.responsible?.relationship || null,
        cpf: student.responsible?.cpf || null,
        identidade: student.responsible?.identity || null,
        telefone: student.responsible?.telefone || null,
        celular: student.responsible?.phoneCellular || null,
      },
    }),
    endereco: {
      rua: student.address?.street || null,
      numero: student.address?.number || null,
      complemento: student.address?.complement || null,
      bairro: student.address?.neighborhood || null,
      cidade: student.address?.city || null,
      estado: student.address?.state || null,
      cep: student.address?.zipCode || null,
    },
    pagamento: {
      metodo: student.payment?.method || null,
      titularCartao: student.payment?.cardHolder || null,
      numeroCartao: student.payment?.cardNumber || null,
      validadeCartao: student.payment?.cardExpiry || null,
      cvvCartao: student.payment?.cardCvv || null,
    },
    assinatura: {
      id: student.subscription?.id || null,
      nome: student.subscription?.name || null,
      preco: student.subscription?.price || null,
      duracao: student.subscription?.duration || null,
      tipo: student.subscription?.type || null,
      dataInicio: student.subscription?.startDate || null,
      dataFim: student.subscription?.endDate || null,
      status: student.subscription?.status || null,
    },
  };

  return pagamento;
};

/**
 * Serviço de Alunos
 */
export const servicoAlunos = {
  /**
   * Cria um novo aluno
   * POST /api/Alunos
   */
  async criar(aluno: Student): Promise<RespostaAluno> {
    const pagamento = converterAlunoParaCadastro(aluno);

    const resposta = await fetch(`${getApiUrl()}/Alunos`, {
      method: 'POST',
      headers: obterHeadersAutenticacao(),
      body: JSON.stringify(pagamento),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw createApiError(erro, 'Erro ao cadastrar aluno');
    }

    return await resposta.json();
  },

  /**
   * Busca todos os alunos
   * GET /api/Alunos
   */
  async obterTodos(): Promise<RespostaListaAlunos> {
    const resposta = await fetch(`${getApiUrl()}/Alunos`, {
      method: 'GET',
      headers: obterHeadersAutenticacao(),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw createApiError(erro, 'Erro ao buscar alunos');
    }

    return await resposta.json();
  },

  /**
   * Busca um aluno por ID
   * GET /api/Alunos/{id}
   */
  async obterPorId(id: string): Promise<RespostaAluno> {
    const resposta = await fetch(`${getApiUrl()}/Alunos/${id}`, {
      method: 'GET',
      headers: obterHeadersAutenticacao(),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw createApiError(erro, 'Erro ao buscar aluno');
    }

    return await resposta.json();
  },

  /**
   * Atualiza um aluno existente
   * PUT /api/Alunos/{id}
   */
  async atualizar(id: string, aluno: Student): Promise<RespostaAluno> {
    const pagamento = converterAlunoParaCadastro(aluno);

    const resposta = await fetch(`${getApiUrl()}/Alunos/${id}`, {
      method: 'PUT',
      headers: obterHeadersAutenticacao(),
      body: JSON.stringify(pagamento),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw createApiError(erro, 'Erro ao atualizar aluno');
    }

    return await resposta.json();
  },

  /**
   * Deleta um aluno
   * DELETE /api/Alunos/{id}
   */
  async deletar(id: string): Promise<RespostaAluno> {
    const resposta = await fetch(`${getApiUrl()}/Alunos/${id}`, {
      method: 'DELETE',
      headers: obterHeadersAutenticacao(),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw createApiError(erro, 'Erro ao deletar aluno');
    }

    return await resposta.json();
  },

  /**
   * Busca alunos por status
   * GET /api/Alunos/status/{status}
   */
  async obterPorStatus(status: 'ativo' | 'inativo'): Promise<RespostaListaAlunos> {
    const resposta = await fetch(`${getApiUrl()}/Alunos/status/${status}`, {
      method: 'GET',
      headers: obterHeadersAutenticacao(),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw createApiError(erro, 'Erro ao buscar alunos por status');
    }

    return await resposta.json();
  },

  /**
   * Pesquisa alunos por termo
   * GET /api/Alunos/search?term={term}
   */
  async pesquisar(termo: string): Promise<RespostaListaAlunos> {
    const resposta = await fetch(`${getApiUrl()}/Alunos/search?term=${encodeURIComponent(termo)}`, {
      method: 'GET',
      headers: obterHeadersAutenticacao(),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      throw createApiError(erro, 'Erro ao pesquisar alunos');
    }

    return await resposta.json();
  },
};

export default servicoAlunos;

// Exports para compatibilidade com código anterior
export const studentsService = {
  create: servicoAlunos.criar,
  getAll: servicoAlunos.obterTodos,
  getById: servicoAlunos.obterPorId,
  update: servicoAlunos.atualizar,
  delete: servicoAlunos.deletar,
  getByStatus: servicoAlunos.obterPorStatus,
  search: servicoAlunos.pesquisar,
};

export type StudentPayload = CadastroAlunoPagamento;
export type StudentResponse = RespostaAluno;
export type StudentsListResponse = RespostaListaAlunos;
export const convertStudentToPayload = converterAlunoParaCadastro;
