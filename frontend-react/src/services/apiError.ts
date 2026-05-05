export type ApiErrorResponse = {
  message?: string;
  errors?: string[];
};

export type ApiErrorDetails = {
  message: string;
  errors: string[];
  combined: string;
};

export type ApiError = Error & {
  errors?: string[];
};

export const parseApiError = (errorBody: unknown, fallback: string): ApiErrorDetails => {
  // Se o corpo está vazio, retorna fallback
  if (!errorBody) {
    return {
      message: fallback,
      errors: [],
      combined: fallback,
    };
  }

  if (typeof errorBody === 'object') {
    const apiError = errorBody as ApiErrorResponse;
    const message = typeof apiError.message === 'string' && apiError.message.trim() ? apiError.message : '';
    const errors = Array.isArray(apiError.errors)
      ? apiError.errors.filter((item): item is string => {
          return typeof item === 'string' && item.trim().length > 0;
        })
      : [];

    if (message && errors.length > 0) {
      return {
        message,
        errors,
        combined: `${message}: ${errors.join(' ')}`,
      };
    }

    if (message) {
      return {
        message,
        errors: [],
        combined: message,
      };
    }

    if (errors.length > 0) {
      return {
        message: fallback,
        errors,
        combined: errors.join(' '),
      };
    }
  }

  return {
    message: fallback,
    errors: [],
    combined: fallback,
  };
};

export const getApiErrorMessage = (errorBody: unknown, fallback: string): string => {
  return parseApiError(errorBody, fallback).combined;
};

export const createApiError = (errorBody: unknown, fallback: string): ApiError => {
  const details = parseApiError(errorBody, fallback);
  const error = new Error(details.combined) as ApiError;
  if (details.errors.length > 0) {
    error.errors = details.errors;
  }
  return error;
};

export const getErrorMessages = (error: unknown, fallback: string): string[] => {
  if (error && typeof error === 'object') {
    const apiError = error as ApiError;
    // Se tem array de erros específicos, retorna eles
    if (Array.isArray(apiError.errors) && apiError.errors.length > 0) {
      return apiError.errors;
    }
    // Se tem mensagem, retorna ela
    if (typeof apiError.message === 'string' && apiError.message.trim()) {
      return [apiError.message];
    }
  }

  return [fallback];
};
