import { describe, it, expect } from "vitest";
import {
  abrirSessaoCaixaSchema,
  fecharSessaoCaixaSchema,
  registrarSangriaSchema,
} from "@/schemas/caixa.schemas";

describe("Caixa Schemas", () => {
  describe("abrirSessaoCaixaSchema", () => {
    it("deve validar um objeto válido de abertura de caixa", () => {
      const data = {
        saldoInicial: 1000,
        observacoes: "Teste de abertura",
      };

      const result = abrirSessaoCaixaSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });

    it("deve rejeitar saldo inicial negativo", () => {
      const data = {
        saldoInicial: -100,
      };

      const result = abrirSessaoCaixaSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve aceitar observações opcionais", () => {
      const data = {
        saldoInicial: 500,
      };

      const result = abrirSessaoCaixaSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("registrarSangriaSchema", () => {
    it("deve validar uma sangria com motivo específico", () => {
      const data = {
        valor: 250.5,
        motivo: "DepositoBancario",
        descricaoComplementar: "",
      };

      const result = registrarSangriaSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve exigir descrição quando motivo é 'Outro'", () => {
      const data = {
        valor: 100,
        motivo: "Outro",
        descricaoComplementar: "", // descrição vazia quando motivo é Outro
      };

      const result = registrarSangriaSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve validar sangria com motivo 'Outro' e descrição válida", () => {
      const data = {
        valor: 100,
        motivo: "Outro",
        descricaoComplementar: "Razão específica da sangria",
      };

      const result = registrarSangriaSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar valor zero", () => {
      const data = {
        valor: 0,
        motivo: "DepositoBancario",
      };

      const result = registrarSangriaSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve rejeitar motivo inválido", () => {
      const data = {
        valor: 100,
        motivo: "MotivoBogus",
      };

      const result = registrarSangriaSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve aceitar todos os motivos válidos", () => {
      const motivos = [
        "TrocaOperador",
        "DepositoBancario",
        "PageamentoDespesa",
        "SangriaSeguranca",
        "AjusteContabil",
        "RequisicaoGerencial",
        "Outro",
      ];

      motivos.forEach((motivo) => {
        const data = {
          valor: 100,
          motivo: motivo,
          descricaoComplementar: motivo === "Outro" ? "desc" : undefined,
        };

        const result = registrarSangriaSchema.safeParse(data);
        expect(result.success).toBe(true, `Motivo ${motivo} deve ser válido`);
      });
    });
  });

  describe("fecharSessaoCaixaSchema", () => {
    it("deve validar fechamento simples sem sangria", () => {
      const data = {
        saldoFinalInformado: 1500,
        sangriaNoFechamento: null,
      };

      const result = fecharSessaoCaixaSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve validar fechamento com sangria", () => {
      const data = {
        saldoFinalInformado: 1500,
        sangriaNoFechamento: {
          valor: 200,
          motivo: "DepositoBancario",
        },
      };

      const result = fecharSessaoCaixaSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("deve rejeitar saldo final negativo", () => {
      const data = {
        saldoFinalInformado: -100,
      };

      const result = fecharSessaoCaixaSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("deve validar sangria com descrição quando motivo é Outro", () => {
      const data = {
        saldoFinalInformado: 1500,
        sangriaNoFechamento: {
          valor: 200,
          motivo: "Outro",
          descricaoComplementar: "Motivo específico",
        },
      };

      const result = fecharSessaoCaixaSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
