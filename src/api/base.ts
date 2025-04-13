import type { ApiErrorCode } from './error-codes.js';

// Payload Interface for Backend Errors
export interface ApiErrorPayload {
    code: ApiErrorCode;
    message: string;
    statusCode: number;
    details?: unknown;
}

// Interface for Api Response in case of Error.
export interface ApiResponseError {
    success: false;
    error: ApiErrorPayload;
    requestId?: string;
}

// Interface for successful Api Response.
export interface ApiResponseSuccess<DataType> {
    success: true;
    statusCode: number;
    data: DataType;
    requestId: string;
}

// Type for Api Response.
export type ApiResponse<DataType> = ApiResponseError | ApiResponseSuccess<DataType>;
