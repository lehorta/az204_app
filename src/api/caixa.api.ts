import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/config/apiClient";
import {
  AbrirSessaoCaixaDTO,
  FecharSessaoCaixaDTO,
  RegistrarSangriaDTO,
  FiltroHistoricoSessionDTO,
  FiltroAuditoriaSangriaDTO,
  FiltroDivergenciasDTO,
} from "@/schemas/caixa.schemas";
import {
  SessaoCaixa,
  PaginatedResponse,
  HistoricoSessao,
  AuditoriaSangria,
  ResumoAuditoriaSangria,
  RelatorioDivergencias,
  PoliticaCaixa,
  ResumoDiaCaixa,
  Transacao,
  Sangria,
} from "@/types/caixa.types";

const CACHE_KEYS = {
  sessoes: ["caixa", "sessoes"],
  sessaoAberta: ["caixa", "sessao-aberta"],
  sangrias: (sessaoId: string) => ["caixa", "sangrias", sessaoId],
  historico: ["caixa", "historico"],
  auditoria: ["caixa", "auditoria"],
  divergencias: ["caixa", "divergencias"],
  politicas: ["caixa", "politicas"],
  resumoDia: ["caixa", "resumo-dia"],
  transacoes: (sessaoId: string) => ["caixa", "transacoes", sessaoId],
};

// ======================== ABERTURA & FECHAMENTO ========================

export const useAbrirCaixa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AbrirSessaoCaixaDTO) => {
      const response = await apiClient.post<SessaoCaixa>(
        "/caixa/sessoes/abrir",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidar cache e definir nova sessão aberta
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.sessaoAberta });
      queryClient.setQueryData(
        [...CACHE_KEYS.sessaoAberta, data.publicId],
        data
      );
    },
  });
};

export const useFecharCaixa = (sessaoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FecharSessaoCaixaDTO) => {
      const response = await apiClient.post<SessaoCaixa>(
        `/api/caixa/sessoes/${sessaoId}/fechar`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidar caches relacionados
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.sessaoAberta });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.historico });
      queryClient.setQueryData(
        [...CACHE_KEYS.sessoes, data.publicId],
        data
      );
    },
  });
};

// ======================== CONSULTAS DE SESSÃO ========================

export const useSessaoAberta = (filialId: number, estacaoId?: number) => {
  return useQuery({
    queryKey: [...CACHE_KEYS.sessaoAberta, filialId, estacaoId],
    queryFn: async () => {
      const params = new URLSearchParams({
        filialId: String(filialId),
        ...(estacaoId && { estacaoId: String(estacaoId) }),
      });

      const response = await apiClient.get<SessaoCaixa | null>(
        `/api/caixa/sessoes/aberta?${params}`
      );
      return response.data;
    },
    staleTime: 30_000, // 30 segundos
    gcTime: 5 * 60_000, // 5 minutos
  });
};

export const useSessao = (publicId: string) => {
  return useQuery({
    queryKey: [...CACHE_KEYS.sessoes, publicId],
    queryFn: async () => {
      const response = await apiClient.get<SessaoCaixa>(
        `/api/caixa/sessoes/${publicId}`
      );
      return response.data;
    },
    staleTime: 15_000, // 15 segundos (atualizar frequentemente)
    gcTime: 5 * 60_000,
  });
};

// ======================== SANGRIA ========================

export const useRegistrarSangria = (sessaoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegistrarSangriaDTO) => {
      const response = await apiClient.post(
        `/api/caixa/sessoes/${sessaoId}/sangrias`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidar sangrias e resumo da sessão
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.sangrias(sessaoId),
      });
      queryClient.invalidateQueries({
        queryKey: [...CACHE_KEYS.sessoes, sessaoId],
      });
    },
  });
};

export const useSangrias = (sessaoId: string) => {
  return useQuery({
    queryKey: CACHE_KEYS.sangrias(sessaoId),
    queryFn: async () => {
      const response = await apiClient.get<Sangria[]>(
        `/api/caixa/sessoes/${sessaoId}/sangrias`
      );
      return response.data;
    },
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  });
};

// ======================== HISTÓRICO ========================

export const useHistoricoSessoes = (filtro: FiltroHistoricoSessionDTO) => {
  return useQuery({
    queryKey: [
      ...CACHE_KEYS.historico,
      filtro.dataInicio,
      filtro.dataFim,
      filtro.operadorId,
      filtro.status,
      filtro.pagina,
    ],
    queryFn: async () => {
      const params = new URLSearchParams(
        Object.entries(filtro).reduce(
          (acc, [key, value]) => {
            if (value !== null && value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          },
          {} as Record<string, string>
        )
      );

      const response = await apiClient.get<
        PaginatedResponse<HistoricoSessao>
      >(`/api/caixa/sessoes?${params}`);
      return response.data;
    },
    staleTime: 60_000, // 1 minuto
    gcTime: 10 * 60_000,
  });
};

// ======================== AUDITORIA ========================

export const useAuditoriaSangria = (filtro: FiltroAuditoriaSangriaDTO) => {
  return useQuery({
    queryKey: [
      ...CACHE_KEYS.auditoria,
      filtro.dataInicio,
      filtro.dataFim,
      filtro.motivo,
      filtro.operadorId,
      filtro.pagina,
    ],
    queryFn: async () => {
      const params = new URLSearchParams(
        Object.entries(filtro).reduce(
          (acc, [key, value]) => {
            if (value !== null && value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          },
          {} as Record<string, string>
        )
      );

      const response = await apiClient.get<
        PaginatedResponse<AuditoriaSangria>
      >(`/api/caixa/sangrias/auditoria?${params}`);
      return response.data;
    },
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
};

export const useResumoAuditoriaSangria = (
  dataInicio: Date,
  dataFim: Date
) => {
  return useQuery({
    queryKey: [
      ...CACHE_KEYS.auditoria,
      "resumo",
      dataInicio,
      dataFim,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
      });

      const response = await apiClient.get<ResumoAuditoriaSangria>(
        `/api/caixa/sangrias/auditoria/resumo?${params}`
      );
      return response.data;
    },
    staleTime: 120_000, // 2 minutos
    gcTime: 15 * 60_000,
  });
};

// ======================== DIVERGÊNCIAS ========================

export const useRelatorioDivergencias = (filtro: FiltroDivergenciasDTO) => {
  return useQuery({
    queryKey: [
      ...CACHE_KEYS.divergencias,
      filtro.dataInicio,
      filtro.dataFim,
      filtro.operadorId,
      filtro.tipoDivergencia,
      filtro.pagina,
    ],
    queryFn: async () => {
      const params = new URLSearchParams(
        Object.entries(filtro).reduce(
          (acc, [key, value]) => {
            if (value !== null && value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          },
          {} as Record<string, string>
        )
      );

      const response = await apiClient.get<RelatorioDivergencias>(
        `/api/caixa/relatorios/divergencias?${params}`
      );
      return response.data;
    },
    staleTime: 120_000, // 2 minutos
    gcTime: 15 * 60_000,
  });
};

// ======================== POLÍTICAS ========================

export const usePoliticasFilial = (filialId: number) => {
  return useQuery({
    queryKey: [...CACHE_KEYS.politicas, filialId],
    queryFn: async () => {
      const response = await apiClient.get<PoliticaCaixa>(
        `/api/caixa/politicas/filial/${filialId}`
      );
      return response.data;
    },
    staleTime: 10 * 60_000, // 10 minutos (dados menos dinâmicos)
    gcTime: 30 * 60_000,
  });
};

export const useAtualizarPoliticas = (filialId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PoliticaCaixa) => {
      const response = await apiClient.put<PoliticaCaixa>(
        `/api/caixa/politicas/filial/${filialId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [...CACHE_KEYS.politicas, filialId],
        data
      );
    },
  });
};

// ======================== RESUMO DO DIA ========================

export const useResumoDia = (data: Date, filialId?: number) => {
  return useQuery({
    queryKey: [
      ...CACHE_KEYS.resumoDia,
      data.toDateString(),
      filialId,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        data: data.toISOString().split("T")[0],
        ...(filialId && { filialId: String(filialId) }),
      });

      const response = await apiClient.get<ResumoDiaCaixa>(
        `/api/caixa/resumo-dia?${params}`
      );
      return response.data;
    },
    staleTime: 30_000, // 30 segundos
    gcTime: 5 * 60_000,
  });
};

// ======================== TRANSAÇÕES ========================

export const useTransacoesSessao = (
  sessaoId: string,
  pagina: number = 1,
  tamanhoPagina: number = 10
) => {
  return useQuery({
    queryKey: [
      ...CACHE_KEYS.transacoes(sessaoId),
      pagina,
      tamanhoPagina,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        pagina: String(pagina),
        tamanhoPagina: String(tamanhoPagina),
      });

      const response = await apiClient.get<PaginatedResponse<Transacao>>(
        `/api/caixa/sessoes/${sessaoId}/transacoes?${params}`
      );
      return response.data;
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
};

export const useRegistrarTransacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      sessaoId: string;
      transacao: Transacao;
    }) => {
      const response = await apiClient.post(
        `/api/caixa/transacoes/recebimento`,
        data.transacao
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.transacoes(variables.sessaoId),
      });
    },
  });
};

// ======================== HOOKS CUSTOMIZADOS ========================

export const useCaixaOperacoes = () => {
  const abrirCaixa = useAbrirCaixa();
  const fecharCaixa = useFecharCaixa("");
  const registrarSangria = useRegistrarSangria("");

  return {
    abrirCaixa,
    fecharCaixa,
    registrarSangria,
  };
};

export const useCaixaRelatorios = () => {
  const relatorioDivergencias = useRelatorioDivergencias({
    dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dataFim: new Date(),
    tipoDivergencia: "Todas",
    pagina: 1,
    tamanhoPagina: 10,
  });

  const resumoAuditoria = useResumoAuditoriaSangria(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  );

  return {
    relatorioDivergencias,
    resumoAuditoria,
  };
};
