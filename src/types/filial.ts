export type TipoUnidadeFilial = 'Matriz' | 'Filial';

export interface Filial {
  id?: number;
  publicId?: string;
  academiaId?: number;
  nome: string;
  codigo: string;
  fusoHorario: string;
  tipoUnidade: TipoUnidadeFilial;
  matrizId?: number;
  matrizPublicId?: string;
  ativa: boolean;
  createdAt?: string;
  updatedAt?: string;
}