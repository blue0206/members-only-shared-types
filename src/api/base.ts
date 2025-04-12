import type { ApiErrorCode } from "./error-codes.js";

export interface ApiErrorPayload {
  code: ApiErrorCode;
  message: string;
  statusCode: number;
  details?: unknown;
}
