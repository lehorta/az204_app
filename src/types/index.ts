export interface AccessRequest {
  credential: string;
  type?: 'rfid' | 'facial' | 'manual';
}

export interface AccessResponse {
  success: boolean;
  allowAccess: boolean;
  memberName?: string;
  memberId?: string;
  photo?: string;
  message: string;
  plan?: string;
  expiresAt?: string;
}

export interface SystemStatus {
  online: boolean;
  cloudConnected: boolean;
  devices: {
    gate: string;
    faceId: string;
    rfid: string;
  };
  timestamp: string;
}

// Admin Types
export type UserRole = 'Administrador' | 'Gerente' | 'Financeiro' | 'Recepcionista' | 'Professor';

export interface User {
  id: string;
  name: string;
  email: string;
  telefone: string;
  role: UserRole;
  status: 'ativo' | 'inativo';
  lastAccess: string;
  avatar?: string;
}

export interface UserStats {
  role: UserRole;
  count: number;
  color: string;
}

// Academy Types
export interface Academy {
  academyId: string;
  academyName: string;
  status: 'Active' | 'Inactive';
  email?: string;
  telefone?: string;
  address?: string;
  city?: string;
  state?: string;
}

// Student Types
export interface Endereco {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface DadosPagamento {
  metodo: 'cartao' | 'pix' | 'boleto' | 'dinheiro';
  titular?: string;
  numeroCartao?: string;
  validadeCartao?: string;
  cvvCartao?: string;}

export interface AlunoPlano {
  id: string;
  nome: string;
  preco: number;
  duracao: number; // em meses
  tipo: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  dataInicio: string;
  dataFim: string;
  status: 'ativo' | 'expirado' | 'cancelado';
}

export interface HistoricoAluno {
  id: string;
  data: string;
  acao: string;
  descricao: string;
  tipo: 'acesso' | 'pagamento' | 'alteracao' | 'aviso';
  dataOcorrencia?: string; // Data da ocorrência
  usuarioId?: string; // ID do usuário que registrou
  usuarioNome?: string; // Nome do usuário que registrou
}

export interface AnexoAluno {
  id: string;
  nomeArquivo: string;
  tipoArquivo: 'imagem' | 'pdf';
  dadosArquivo: string; // base64
  descricao: string;
  dataUpload: string;
}

export interface SaudeAluno {
  peso?: string;
  altura?: string;
  tipoSanguineo?: string;
  condicoesMedicas?: string;
  alergias?: string;
  objetivo?: string;
}

export interface ContatoEmergencia {
  nome?: string;
  telefone?: string;
  relacionamento?: string;
}

export interface ResponsavelAluno {
  nome?: string;
  relacionamento?: string;
  cpf?: string;
  identidade?: string;
  telefone?: string;
  celular?: string;
  
}

// Tipos legados em ingles para compatibilidade com a UI atual
export interface StudentHealth {
  weight?: string;
  height?: string;
  bloodType?: string;
  medicalConditions?: string;
  allergies?: string;
  goal?: string;
}

export interface StudentEmergencyContact {
  name?: string;
  telefone?: string;
  relationship?: string;
}

export interface StudentResponsible {
  name?: string;
  relationship?: string;
  cpf?: string;
  identity?: string;
  telefone?: string;
  phoneCellular?: string;
}

export interface StudentAddress {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface StudentPayment {
  method?: 'cartao' | 'pix' | 'boleto' | 'dinheiro' | string;
  cardHolder?: string;
  lastFourDigits?: string; // apenas últimos 4 dígitos (nunca número completo)
}

export interface StudentSubscription {
  id?: string;
  name?: string;
  price?: number;
  duration?: number;
  type?: 'mensal' | 'trimestral' | 'semestral' | 'anual' | string;
  startDate?: string;
  endDate?: string;
  status?: 'ativo' | 'expirado' | 'cancelado' | 'inativo' | string;
}

export interface StudentHistory {
  id: string;
  date: string;
  action: string;
  description: string;
  type: 'acesso' | 'pagamento' | 'alteracao' | 'aviso';
  occurredAt?: string;
  userId?: string;
  userName?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: 'image' | 'pdf';
  fileData: string;
  description: string;
  uploadDate: string;
}

export interface Student {
  id: string;
  publicId?: string;
  matricula?: string;
  name: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  photo?: string;
  gender?: string;
  identity?: string;
  telefoneEmergencia?: string;
  phoneCellular?: string;
  cellPhone?: string;
  health?: StudentHealth;
  emergencyContact?: StudentEmergencyContact;
  responsible?: StudentResponsible;
  address: StudentAddress;
  payment?: StudentPayment;
  subscription?: StudentSubscription;
  history?: StudentHistory[];
  attachments?: Attachment[];
  status: 'ativo' | 'inativo';
  joinDate: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  foto?: string;
  genero?: string;
  identidade?: string;
  telefoneEmergencia?: string;
  celular?: string;
  saude?: SaudeAluno;
  contatoEmergencia?: ContatoEmergencia;
  responsavel?: ResponsavelAluno;
  endereco: Endereco;
  pagamento?: DadosPagamento;
  assinatura?: AlunoPlano;
  historico?: HistoricoAluno[];
  anexos?: AnexoAluno[];
  status: 'ativo' | 'inativo';
  dataCadastro: string;
}

export interface StudentStats {
  label: string;
  value: number;
  color: string;
}

// API DTOs (contrato backend)
export interface CreateAlunoSaudeDTO {
  peso?: number | null;
  altura?: number | null;
  tipoSanguineo?: string | null;
  condicoesMedicas?: string | null;
  alergias?: string | null;
  objetivo?: string | null;
}

export interface CreateAlunoContatoEmergenciaDTO {
  nome?: string | null;
  telefone?: string | null;
  parentesco?: string | null;
}

export interface CreateAlunoResponsavelDTO {
  nome?: string | null;
  parentesco?: string | null;
  cpf?: string | null;
  identidade?: string | null;
  telefone?: string | null;
  celular?: string | null;
}

export interface CreateAlunoEnderecoDTO {
  cep?: string | null;
  logradouro?: string | null;
  tipoLogradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

export interface CreateAlunoDadosPagamentoDTO {
  metodo?: string | null;
  dataUltimoPagamento?: string | null;
  proximaDataVencimento?: string | null;
}

export interface CreateAlunoDTO {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  genero?: string | null;
  foto?: string | null;
  saudeAluno?: CreateAlunoSaudeDTO;
  contatoEmergencia?: CreateAlunoContatoEmergenciaDTO;
  responsavelAluno?: CreateAlunoResponsavelDTO;
  enderecoAluno?: CreateAlunoEnderecoDTO;
  dadosPagamento?: CreateAlunoDadosPagamentoDTO;
  status?: string;
  dataCadastro?: string;
}

export type AlunoApiDTO = Omit<CreateAlunoDTO, 'status'> & {
  id?: number;
  publicId?: string;
  matricula?: string;
  academiaId?: number;
  status?: string | number | null;
  dataCadastro?: string;
  alunoPlanos?: Array<{
    planoId: number;
    dataIniVigencia: string;
    dataFimVigencia: string;
    plano?: {
      idAssinatura: string;
      nome: string;
      preco: number;
      duracao: number;
      tipo: string;
      dataInicio: string;
      dataFim: string;
      status: string;
    };
  }>;
};

export interface ApiEnvelope<T> {
  sucesso: boolean;
  mensagem: string;
  dados?: T;
}

export type AlunoCreateResponseDTO = AlunoApiDTO | ApiEnvelope<AlunoApiDTO>;
export type AlunoUpdateResponseDTO = AlunoApiDTO | ApiEnvelope<AlunoApiDTO>;
export type AlunoListResponseDTO = AlunoApiDTO[] | ApiEnvelope<AlunoApiDTO[]>;
