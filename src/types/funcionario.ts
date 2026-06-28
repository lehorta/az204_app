// Tipos para o módulo de Funcionários

export type TipoFuncionario = 'Professor' | 'Recepcionista' | 'Limpeza' | 'Administrativo' | 'Outro';
export type TipoContrato = 'CLT' | 'PJ' | 'Estagio' | 'Voluntario';
export type StatusFuncionario = 'Ativo' | 'Inativo' | 'Afastado';

export interface Funcionario {
  id?: number;
  publicId?: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  foto?: string;
  tipo: TipoFuncionario;
  especialidade?: string;
  cref?: string;
  dataAdmissao: string;
  dataDemissao?: string;
  tipoContrato: TipoContrato;
  salarioBase?: number;
  cargaHorariaSemanal?: number;
  status: StatusFuncionario;
  academiaId?: number;
  applicationUserId?: number;
}
