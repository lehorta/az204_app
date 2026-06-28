import { getApiUrl } from '../config/api';
import { Student } from '../types';
import { CreateAlunoDTO } from '../types';
import { AlunoApiDTO, AlunoCreateResponseDTO, AlunoListResponseDTO, AlunoUpdateResponseDTO, ApiEnvelope } from '../types';
import { createApiError } from './apiError';

// Payload da API para cadastro de aluno
export type CadastroAlunoPagamento = CreateAlunoDTO;

export type RespostaAluno = AlunoCreateResponseDTO;
export type RespostaAlunoAtualizacao = AlunoUpdateResponseDTO;
export type RespostaListaAlunos = AlunoListResponseDTO;

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
    saudeAluno: {
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
      parentesco: student.emergencyContact?.relationship || null,
    },
    ...(temDadosResponsavel && {
      responsavelAluno: {
        nome: student.responsible?.name || null,
        parentesco: student.responsible?.relationship || null,
        cpf: student.responsible?.cpf || null,
        identidade: student.responsible?.identity || null,
        telefone: student.responsible?.telefone || null,
        celular: student.responsible?.phoneCellular || null,
      },
    }),
    enderecoAluno: {
      cep: student.address?.zipCode || null,
      logradouro: student.address?.street || null,
      tipoLogradouro: null,
      numero: student.address?.number || null,
      complemento: student.address?.complement || null,
      bairro: student.address?.neighborhood || null,
      cidade: student.address?.city || null,
      estado: student.address?.state || null,
    },
    dadosPagamento: {
      metodo: student.payment?.method || null,
      dataUltimoPagamento: null,
      proximaDataVencimento: null,
    },
  };

  return pagamento;
};

export const isApiEnvelope = <T>(response: unknown): response is ApiEnvelope<T> => {
  return typeof response === 'object' && response !== null && 'sucesso' in response;
};

export const extrairDadosResposta = <T>(response: T | ApiEnvelope<T>): T | undefined => {
  if (isApiEnvelope<T>(response)) {
    return response.dados;
  }

  return response;
};

export const extrairMensagemResposta = <T>(response: T | ApiEnvelope<T>): string | undefined => {
  if (isApiEnvelope<T>(response)) {
    return response.mensagem;
  }

  return undefined;
};

const mapearStatus = (status?: string | number | null): 'ativo' | 'inativo' => {
  if (status === undefined || status === null) return 'inativo';

  if (typeof status === 'number') {
    return status === 8 ? 'ativo' : 'inativo';
  }

  const valor = String(status).trim().toLowerCase();
  if (valor === 'ativo' || valor.includes('active') || valor === '8') {
    return 'ativo';
  }

  return 'inativo';
};

export const mapAlunoApiToStudent = (aluno: AlunoApiDTO, index = 0): Student => {
  const apiId = typeof aluno.publicId === 'string' ? aluno.publicId : '';
  const isZeroGuid = apiId === '00000000-0000-0000-0000-000000000000';
  const fallbackId = aluno.cpf || aluno.email || `${aluno.nome || 'aluno'}-${index}`;
  const safeId = apiId && !isZeroGuid ? apiId : fallbackId;

  type EnderecoLegado = {
    rua?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    cep?: string | null;
    logradouro?: string | null;
    tipoLogradouro?: string | null;
  };

  const alunoComEnderecoLegado = aluno as AlunoApiDTO & { endereco?: EnderecoLegado | null };
  const enderecoFonte = aluno.enderecoAluno ?? alunoComEnderecoLegado.endereco;
  const ruaLegadaRaw = enderecoFonte && 'rua' in enderecoFonte ? enderecoFonte.rua : undefined;
  const ruaLegada = typeof ruaLegadaRaw === 'string' ? ruaLegadaRaw : undefined;

  return {
    id: safeId,
    publicId: apiId && !isZeroGuid ? apiId : undefined,
    name: aluno.nome,
    email: aluno.email,
    telefone: aluno.telefone,
    dataNascimento: aluno.dataNascimento,
    cpf: aluno.cpf,
    photo: aluno.foto || undefined,
    gender: aluno.genero || undefined,
    status: mapearStatus(aluno.status),
    joinDate: aluno.dataCadastro || new Date().toISOString(),
    health: aluno.saudeAluno
      ? {
          weight: aluno.saudeAluno.peso != null ? String(aluno.saudeAluno.peso) : undefined,
          height: aluno.saudeAluno.altura != null ? String(aluno.saudeAluno.altura) : undefined,
          bloodType: aluno.saudeAluno.tipoSanguineo || undefined,
          medicalConditions: aluno.saudeAluno.condicoesMedicas || undefined,
          allergies: aluno.saudeAluno.alergias || undefined,
          goal: aluno.saudeAluno.objetivo || undefined,
        }
      : undefined,
    emergencyContact: aluno.contatoEmergencia
      ? {
          name: aluno.contatoEmergencia.nome || undefined,
          telefone: aluno.contatoEmergencia.telefone || undefined,
          relationship: aluno.contatoEmergencia.parentesco || undefined,
        }
      : undefined,
    responsible: aluno.responsavelAluno
      ? {
          name: aluno.responsavelAluno.nome || undefined,
          relationship: aluno.responsavelAluno.parentesco || undefined,
          cpf: aluno.responsavelAluno.cpf || undefined,
          identity: aluno.responsavelAluno.identidade || undefined,
          telefone: aluno.responsavelAluno.telefone || undefined,
          phoneCellular: aluno.responsavelAluno.celular || undefined,
        }
      : undefined,
    address: enderecoFonte
      ? {
          street: enderecoFonte.logradouro || ruaLegada || undefined,
          number: enderecoFonte.numero || undefined,
          complement: enderecoFonte.complemento || undefined,
          neighborhood: enderecoFonte.bairro || undefined,
          city: enderecoFonte.cidade || undefined,
          state: enderecoFonte.estado || undefined,
          zipCode: enderecoFonte.cep || undefined,
        }
      : {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        },
    payment: aluno.dadosPagamento
      ? {
          method: aluno.dadosPagamento.metodo || undefined,
        }
      : undefined,
    subscription: aluno.alunoPlanos?.length
      ? {
          id: aluno.alunoPlanos[0].plano?.idAssinatura,
          name: aluno.alunoPlanos[0].plano?.nome,
          price: aluno.alunoPlanos[0].plano?.preco,
          duration: aluno.alunoPlanos[0].plano?.duracao,
          type: aluno.alunoPlanos[0].plano?.tipo,
          startDate: aluno.alunoPlanos[0].plano?.dataInicio,
          endDate: aluno.alunoPlanos[0].plano?.dataFim,
          status: aluno.alunoPlanos[0].plano?.status,
        }
      : undefined,
    matricula: aluno.matricula || undefined,
    identity: aluno.responsavelAluno?.identidade || undefined,
    telefoneEmergencia: aluno.contatoEmergencia?.telefone || undefined,
    cellPhone: aluno.responsavelAluno?.celular || undefined,
    phoneCellular: aluno.responsavelAluno?.celular || undefined,
  };
};

export const mapRespostaListaAlunosParaStudents = (response: RespostaListaAlunos): Student[] => {
  const estudantes = extrairDadosResposta<AlunoApiDTO[]>(response) || [];
  return estudantes.map((aluno, index) => mapAlunoApiToStudent(aluno, index));
};

export const mapRespostaAlunoParaStudent = (response: RespostaAluno): Student | undefined => {
  const aluno = extrairDadosResposta<AlunoApiDTO>(response);
  if (!aluno) return undefined;
  return mapAlunoApiToStudent(aluno);
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
  async obterPorId(id: string): Promise<AlunoApiDTO | ApiEnvelope<AlunoApiDTO>> {
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
  async atualizar(id: string, aluno: Student): Promise<RespostaAlunoAtualizacao> {
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
  async deletar(id: string): Promise<AlunoApiDTO | ApiEnvelope<AlunoApiDTO>> {
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
