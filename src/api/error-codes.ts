export const ErrorCodes = {
    // Generic codes.
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    CONFLICT: 'CONFLICT',
    // Validation, Prisma, and Bad Request error codes.
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
    UNIQUE_CONSTRAINT_VIOLATION: 'UNIQUE_CONSTRAINT_VIOLATION',
    REQUIRED_CONSTRAINT_VIOLATION: 'REQUIRED_CONSTRAINT_VIOLATION',
    RANGE_ERROR: 'RANGE_ERROR',
    VALUE_TOO_LONG: 'VALUE_TOO_LONG',
    FOREIGN_KEY_VIOLATION: 'FOREIGN_KEY_VIOLATION',
    INVALID_VALUE: 'INVALID_VALUE',
    INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
    // Auth error codes.
    INVALID_TOKEN: 'INVALID_TOKEN',
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',
    AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
    MISSING_CSRF_HEADER: 'MISSING_CSRF_HEADER',
    MISSING_CSRF_COOKIE: 'MISSING_CSRF_COOKIE',
    CSRF_TOKEN_MISMATCH: 'CSRF_TOKEN_MISMATCH',
    // Server error codes.
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
    DATABASE_VALIDATION_ERROR: 'DATABASE_VALIDATION_ERROR',
} as const;

export type ApiErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
