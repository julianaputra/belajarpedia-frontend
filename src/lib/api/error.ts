export type ValidationErrors = Record<string, string[]>;

export type ApiErrorPayload = {
  message?: string;
  code?: string;
  errors?: ValidationErrors;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly errors: ValidationErrors | undefined;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message ?? `API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code;
    this.errors = payload.errors;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isGone(): boolean {
    return this.status === 410;
  }

  get isValidation(): boolean {
    return this.status === 422;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
