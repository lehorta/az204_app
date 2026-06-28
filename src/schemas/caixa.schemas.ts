import { z } from "zod";

// ======================== ABERTURA & FECHAMENTO ========================

export const abrirSessaoCaixaSchema = z.object({
  saldoInicial: z
    .number()
    .min(0, "Saldo inicial deve ser maior ou igual a R$ 0,00")
    .positive("Saldo inicial deve ser um valor positivo"),
  observacoes: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export type AbrirSessaoCaixaDTO = z.infer<typeof abrirSessaoCaixaSchema>;

export const fecharSessaoCaixaSchema = z.object({
  saldoFinalInformado: z
    .number()
    .min(0, "Saldo final deve ser maior ou igual a R$ 0,00"),
  sangriaNoFechamento: z
    .object({
      valor: z
        .number()
        .gt(0, "Valor de sangria deve ser maior que R$ 0,00"),
      motivo: z.enum(
        [
          "TrocaOperador",
          "DepositoBancario",
          "PageamentoDespesa",
          "SangriaSeguranca",
          "AjusteContabil",
          "RequisicaoGerencial",
          "Outro",
        ],
        { errorMap: () => ({ message: "Motivo inválido" }) }
      ),
      descricaoComplementar: z
        .string()
        .max(500, "Máximo 500 caracteres")
        .optional(),
    })
    .optional()
    .nullable(),
});

export type FecharSessaoCaixaDTO = z.infer<typeof fecharSessaoCaixaSchema>;

// ======================== SANGRIA ========================

export const registrarSangriaSchema = z
  .object({
    valor: z
      .number()
      .gt(0, "Valor de sangria deve ser maior que R$ 0,00")
      .refine(
        (val) => Number.isFinite(val),
        "Valor deve ser um número válido"
      ),
    motivo: z.enum(
      [
        "TrocaOperador",
        "DepositoBancario",
        "PageamentoDespesa",
        "SangriaSeguranca",
        "AjusteContabil",
        "RequisicaoGerencial",
        "Outro",
      ],
      { errorMap: () => ({ message: "Selecione um motivo válido" }) }
    ),
    descricaoComplementar: z
      .string()
      .max(500, "Máximo 500 caracteres")
      .optional(),
  })
  .refine(
    (data) =>
      data.motivo !== "Outro" ||
      (data.descricaoComplementar && data.descricaoComplementar.trim().length > 0),
    {
      message: "Descrição complementar é obrigatória quando o motivo é 'Outro'",
      path: ["descricaoComplementar"],
    }
  );

export type RegistrarSangriaDTO = z.infer<typeof registrarSangriaSchema>;

// ======================== FILTROS ========================

export const filtroHistoricoSessionSchema = z.object({
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date(),
  operadorId: z.number().optional(),
  status: z.string().optional(),
  filialId: z.number().optional(),
  pagina: z.number().min(1).default(1),
  tamanhoPagina: z.number().min(1).max(100).default(10),
});

export type FiltroHistoricoSessionDTO = z.infer<
  typeof filtroHistoricoSessionSchema
>;

export const filtroAuditoriaSangriaSchema = z.object({
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date(),
  motivo: z.string().optional(),
  operadorId: z.number().optional(),
  sessaoId: z.string().uuid().optional(),
  pagina: z.number().min(1).default(1),
  tamanhoPagina: z.number().min(1).max(100).default(10),
});

export type FiltroAuditoriaSangriaDTO = z.infer<
  typeof filtroAuditoriaSangriaSchema
>;

export const filtroDivergenciasSchema = z.object({
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date(),
  operadorId: z.number().optional(),
  tipoDivergencia: z.enum(["Positiva", "Negativa", "Todas"]).default("Todas"),
  filialId: z.number().optional(),
  pagina: z.number().min(1).default(1),
  tamanhoPagina: z.number().min(1).max(100).default(10),
});

export type FiltroDivergenciasDTO = z.infer<typeof filtroDivergenciasSchema>;

// ======================== POLÍTICAS ========================

export const politicaCaixaSchema = z.object({
  filialId: z.number().positive("ID da filial inválido"),
  saldoRecomendado: z.number().min(0),
  faixaToleranciaMin: z.number().min(0),
  faixaToleranciaMax: z.number().min(0),
  toleranciaMaximaDivergencia: z.number().min(0),
  alertarGerenteSeDivergencia: z.boolean().default(true),
  bloquearFechamentoSeDivergencia: z.boolean().default(false),
  regrasEspeciais: z.string().max(1000).optional(),
});

export type PoliticaCaixaDTO = z.infer<typeof politicaCaixaSchema>;

// ======================== TRANSAÇÕES ========================

export const transacaoCaixaSchema = z.object({
  academiaId: z.number().positive(),
  filialId: z.number().positive(),
  estacaoCaixaId: z.number().positive(),
  sessaoCaixaId: z.number().positive(),
  alunoId: z.number().positive().optional(),
  usuarioExecutorId: z.number().positive(),
  operadorEmUsoId: z.number().positive(),
  tipo: z.string(),
  valor: z.number().gt(0, "Valor deve ser maior que R$ 0,00"),
  formaPagamento: z.string(),
  origem: z.string(),
  referenciaExterna: z.string().optional(),
  observacao: z.string().optional(),
});

export type TransacaoCaixaDTO = z.infer<typeof transacaoCaixaSchema>;

// ======================== TIPOS DE RESPOSTA ========================

export const sessionResponseSchema = z.object({
  publicId: z.string().uuid(),
  status: z.string(),
  saldoInicial: z.number(),
  saldoFinalInformado: z.number().optional(),
  saldoFinalCalculado: z.number(),
  divergenciaValor: z.number(),
  abertoEm: z.coerce.date(),
  fechadoEm: z.coerce.date().optional(),
  motivoDivergencia: z.string().optional(),
});

export type SessionResponseDTO = z.infer<typeof sessionResponseSchema>;

export const sangriaResponseSchema = z.object({
  publicId: z.string().uuid(),
  valor: z.number(),
  motivo: z.string().optional(),
  descricaoComplementar: z.string().optional(),
  criadoEm: z.coerce.date(),
  operadorNome: z.string(),
});

export type SangriaResponseDTO = z.infer<typeof sangriaResponseSchema>;

// ======================== PAGINAÇÃO ========================

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    pagina: z.number(),
    totalPaginas: z.number(),
  });

export const historicoSessaoListSchema = z.object({
  publicId: z.string().uuid(),
  dataReferencia: z.coerce.date(),
  operadorAberturaName: z.string(),
  abertoEm: z.coerce.date(),
  fechadoEm: z.coerce.date().optional(),
  status: z.string(),
  saldoInicial: z.number(),
  saldoFinalInformado: z.number().optional(),
  divergenciaValor: z.number(),
  totalSangrias: z.number(),
});

export type HistoricoSessaoListDTO = z.infer<typeof historicoSessaoListSchema>;

export const auditoriaSangriaSchema = z.object({
  publicId: z.string().uuid(),
  dataHora: z.coerce.date(),
  operadorNome: z.string(),
  valor: z.number(),
  motivo: z.string(),
  descricaoComplementar: z.string().optional(),
});

export type AuditoriaSangriaDTO = z.infer<typeof auditoriaSangriaSchema>;

export const resumoAuditoriaSangriaSchema = z.object({
  totalSangrias: z.number(),
  valorTotal: z.number(),
  porMotivo: z.record(
    z.object({
      quantidade: z.number(),
      valor: z.number(),
      percentual: z.number(),
    })
  ),
});

export type ResumoAuditoriaSangriaDTO = z.infer<
  typeof resumoAuditoriaSangriaSchema
>;

// ======================== RESUMO DO DIA ========================

export const resumoDiaCaixaSchema = z.object({
  data: z.coerce.date(),
  caixasAbertos: z.array(
    z.object({
      sessaoPublicId: z.string().uuid(),
      terminalCodigo: z.string(),
      operadorNome: z.string(),
      abertoEm: z.coerce.date(),
      saldoAtual: z.number(),
      totalSangrias: z.number(),
      divergenciaValor: z.number(),
      statusDivergencia: z.enum(["OK", "Alerta", "Crítico"]),
    })
  ),
  caixasFechados: z.array(
    z.object({
      sessaoPublicId: z.string().uuid(),
      terminalCodigo: z.string(),
      fechadoEm: z.coerce.date(),
      statusFechamento: z.string(),
    })
  ),
  metricas: z.object({
    entradaTotal: z.number(),
    saidaTotal: z.number(),
    sangriaTotal: z.number(),
    saldoLiquido: z.number(),
  }),
  alertas: z.array(
    z.object({
      tipo: z.string(),
      mensagem: z.string(),
      severidade: z.enum(["Info", "Alerta", "Crítico"]),
      acaoRecomendada: z.string().optional(),
    })
  ),
});

export type ResumoDiaCaixaDTO = z.infer<typeof resumoDiaCaixaSchema>;

// ======================== ENUMS & CONSTANTES ========================

export const MOTIVOS_SANGRIA = [
  { value: "TrocaOperador", label: "Troca de Operador" },
  { value: "DepositoBancario", label: "Depósito Bancário" },
  { value: "PageamentoDespesa", label: "Pagamento de Despesa" },
  { value: "SangriaSeguranca", label: "Sangria de Segurança" },
  { value: "AjusteContabil", label: "Ajuste Contábil" },
  { value: "RequisicaoGerencial", label: "Requisição Gerencial" },
  { value: "Outro", label: "Outro" },
] as const;

export const STATUS_SESSAO = {
  PLANEJADA: "Planejada",
  ABERTA: "Aberta",
  FECHADA: "Fechada",
  ERRO: "Erro",
} as const;

export const STATUS_DIVERGENCIA = {
  OK: "OK",
  ALERTA: "Alerta",
  CRITICO: "Crítico",
} as const;
