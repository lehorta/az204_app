// Frontend Types for Caixa Module
export interface SessaoCaixa {
  publicId: string;
  status: "Planejada" | "Aberta" | "Fechada" | "Erro";
  saldoInicial: number;
  saldoFinalInformado?: number;
  saldoFinalCalculado: number;
  divergenciaValor: number;
  abertoEm: Date;
  fechadoEm?: Date;
  motivoDivergencia?: string;
}

export interface Sangria {
  publicId: string;
  valor: number;
  motivo?: string;
  descricaoComplementar?: string;
  criadoEm: Date;
  operadorNome: string;
}

export interface HistoricoSessao {
  publicId: string;
  dataReferencia: Date;
  operadorAberturaName: string;
  abertoEm: Date;
  fechadoEm?: Date;
  status: string;
  saldoInicial: number;
  saldoFinalInformado?: number;
  divergenciaValor: number;
  totalSangrias: number;
}

export interface AuditoriaSangria {
  publicId: string;
  dataHora: Date;
  operadorNome: string;
  valor: number;
  motivo: string;
  descricaoComplementar?: string;
}

export interface ResumoAuditoriaSangria {
  totalSangrias: number;
  valorTotal: number;
  porMotivo: Record<
    string,
    {
      quantidade: number;
      valor: number;
      percentual: number;
    }
  >;
}

export interface Transacao {
  publicId: string;
  tipo: string;
  valor: number;
  formaPagamento: string;
  criadoEm: Date;
  alunoNome: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface PoliticaCaixa {
  filialId: number;
  saldoRecomendado: number;
  faixaToleranciaMin: number;
  faixaToleranciaMax: number;
  toleranciaMaximaDivergencia: number;
  alertarGerenteSeDivergencia: boolean;
  bloquearFechamentoSeDivergencia: boolean;
  regrasEspeciais?: string;
}

export interface ResumoDiaCaixa {
  data: Date;
  caixasAbertos: Array<{
    sessaoPublicId: string;
    terminalCodigo: string;
    operadorNome: string;
    abertoEm: Date;
    saldoAtual: number;
    totalSangrias: number;
    divergenciaValor: number;
    statusDivergencia: "OK" | "Alerta" | "Crítico";
  }>;
  caixasFechados: Array<{
    sessaoPublicId: string;
    terminalCodigo: string;
    fechadoEm: Date;
    statusFechamento: string;
  }>;
  metricas: {
    entradaTotal: number;
    saidaTotal: number;
    sangriaTotal: number;
    saldoLiquido: number;
  };
  alertas: Array<{
    tipo: string;
    mensagem: string;
    severidade: "Info" | "Alerta" | "Crítico";
    acaoRecomendada?: string;
  }>;
}

export interface DivergenciaItem {
  sessaoPublicId: string;
  dataReferencia: Date;
  operadorNome: string;
  saldoCalculado: number;
  saldoFisico: number;
  divergencia: number;
  status: "Balanceado" | "Pequena" | "Grande";
}

export interface RelatorioDivergencias {
  totalSessoes: number;
  sessoesComDivergencia: number;
  sessoesBalanceadas: number;
  divergenciaMedia: number;
  divergenciaMaxima: number;
  divergenciaTotal: number;
  detalhes: DivergenciaItem[];
}

export interface Operador {
  id: number;
  nome: string;
  codigo: string;
}

export interface Filial {
  id: number;
  nome: string;
  codigo: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// Context/State Management
export interface CaixaContextType {
  sessaoAtual: SessaoCaixa | null;
  operador: Operador | null;
  filial: Filial | null;
  setSessaoAtual: (sessao: SessaoCaixa | null) => void;
  setOperador: (operador: Operador | null) => void;
  setFilial: (filial: Filial | null) => void;
}

// API Request/Response
export interface AbrirSessaoRequest {
  saldoInicial: number;
  observacoes?: string;
}

export interface FecharSessaoRequest {
  saldoFinalInformado: number;
  sangriaNoFechamento?: {
    valor: number;
    motivo: string;
    descricaoComplementar?: string;
  };
}

export interface RegistrarSangriaRequest {
  valor: number;
  motivo: string;
  descricaoComplementar?: string;
}

// UI Enums
export enum StatusDivergencia {
  OK = "OK",
  ALERTA = "Alerta",
  CRITICO = "Crítico",
}

export enum TipoAlerta {
  DIVERGENCIA = "Divergência",
  SALDO_BAIXO = "SaldoBaixo",
  SEM_FECHAMENTO = "SemFechamento",
  INFO = "Info",
}

export enum SeveridadeAlerta {
  INFO = "Info",
  ALERTA = "Alerta",
  CRITICO = "Crítico",
}

export enum TipoMotivoDivergencia {
  POSITIVA = "Positiva",
  NEGATIVA = "Negativa",
  TODAS = "Todas",
}
