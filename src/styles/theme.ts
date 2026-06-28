// 🎨 Design System - Academia System
// Temas Dark e Light com configuração dinâmica

export const darkTheme = {
  colors: {
    // Background colors
    background: {
      primary: '#0a1929',      // Fundo principal (azul escuro profundo)
      secondary: '#0f1f2e',    // Fundo de cards e elementos
      tertiary: '#1a2f4a',     // Fundo de hover/destaque
      sidebar: '#0c1e35',      // Fundo da sidebar
    },

    // Border colors
    border: {
      primary: '#1e3a5f',      // Bordas principais
      secondary: '#2d4a6f',    // Bordas secundarias
      active: '#2196F3',       // Borda de elementos ativos
    },

    // Text colors
    text: {
      primary: '#ffffff',      // Texto principal
      secondary: '#90caf9',    // Texto secundario (azul claro)
      muted: '#b0bec5',        // Texto menos importante
      disabled: '#546e7a',     // Texto desabilitado
    },

    // Brand colors
    brand: {
      primary: '#2196F3',      // Azul primario
      primaryHover: '#1976D2', // Azul primario hover
      secondary: '#64B5F6',    // Azul secundario
    },

    // Status colors
    status: {
      success: '#4caf50',      // Verde (ativo)
      warning: '#ff9800',      // Laranja (aviso)
      error: '#f44336',        // Vermelho (erro)
      info: '#2196F3',         // Azul (info)
    },

    // Role badge colors (perfis de usuario)
    roles: {
      administrador: {
        bg: '#a855f7',         // Roxo
        bgLight: 'rgba(168, 85, 247, 0.2)',
        border: 'rgba(168, 85, 247, 0.3)',
      },
      gerente: {
        bg: '#3b82f6',         // Azul
        bgLight: 'rgba(59, 130, 246, 0.2)',
        border: 'rgba(59, 130, 246, 0.3)',
      },
      financeiro: {
        bg: '#22c55e',         // Verde
        bgLight: 'rgba(34, 197, 94, 0.2)',
        border: 'rgba(34, 197, 94, 0.3)',
      },
      recepcionista: {
        bg: '#eab308',         // Amarelo
        bgLight: 'rgba(234, 179, 8, 0.2)',
        border: 'rgba(234, 179, 8, 0.3)',
      },
      professor: {
        bg: '#f97316',         // Laranja
        bgLight: 'rgba(249, 115, 22, 0.2)',
        border: 'rgba(249, 115, 22, 0.3)',
      },
    },
  },

  gradients: {
    primary: 'linear-gradient(135deg, #1a2f4a 0%, #0a1929 100%)',
    card: 'linear-gradient(135deg, #0f1f2e 0%, #0a1929 100%)',
    button: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
  },
};

export const lightTheme = {
  colors: {
    // Background colors
    background: {
      primary: '#ffffff',      // Fundo principal (branco)
      secondary: '#f5f7fa',    // Fundo de cards e elementos (cinza muito claro)
      tertiary: '#e8ecf1',     // Fundo de hover/destaque (cinza claro)
      sidebar: '#f9fafb',      // Fundo da sidebar
    },

    // Border colors
    border: {
      primary: '#d1dce6',      // Bordas principais (cinza medio)
      secondary: '#c1ccd8',    // Bordas secundarias
      active: '#1976D2',       // Borda de elementos ativos (azul mais escuro)
    },

    // Text colors
    text: {
      primary: '#1a1f36',      // Texto principal (cinza/preto)
      secondary: '#5a6c7d',    // Texto secundario (cinza medio)
      muted: '#8a95a3',        // Texto menos importante (cinza)
      disabled: '#b8c2cc',     // Texto desabilitado (cinza claro)
    },

    // Brand colors
    brand: {
      primary: '#1976D2',      // Azul primario (mais escuro no light)
      primaryHover: '#1565C0', // Azul primario hover
      secondary: '#2196F3',    // Azul secundario
    },

    // Status colors
    status: {
      success: '#388e3c',      // Verde (mais escuro)
      warning: '#f57c00',      // Laranja (mais escuro)
      error: '#d32f2f',        // Vermelho (mais escuro)
      info: '#1976D2',         // Azul (mais escuro)
    },

    // Role badge colors (perfis de usuario)
    roles: {
      administrador: {
        bg: '#9c27b0',
        bgLight: 'rgba(156, 39, 176, 0.1)',
        border: 'rgba(156, 39, 176, 0.3)',
      },
      gerente: {
        bg: '#1976D2',
        bgLight: 'rgba(25, 118, 210, 0.1)',
        border: 'rgba(25, 118, 210, 0.3)',
      },
      financeiro: {
        bg: '#388e3c',
        bgLight: 'rgba(56, 142, 60, 0.1)',
        border: 'rgba(56, 142, 60, 0.3)',
      },
      recepcionista: {
        bg: '#fbc02d',
        bgLight: 'rgba(251, 192, 45, 0.1)',
        border: 'rgba(251, 192, 45, 0.3)',
      },
      professor: {
        bg: '#f57c00',
        bgLight: 'rgba(245, 124, 0, 0.1)',
        border: 'rgba(245, 124, 0, 0.3)',
      },
    },
  },

  gradients: {
    primary: 'linear-gradient(135deg, #e8ecf1 0%, #ffffff 100%)',
    card: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
    button: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

// Exporta o tema escuro como padrao para compatibilidade com codigo existente
export const colors = darkTheme.colors;
export const gradients = darkTheme.gradients;
export const shadows = darkTheme.shadows;
