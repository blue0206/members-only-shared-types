# [@blue0206/members-only-shared-types](https://www.npmjs.com/package/@blue0206/members-only-shared-types)

[![npm version](https://img.shields.io/npm/v/@blue0206/members-only-shared-types.svg)](https://www.npmjs.com/package/@blue0206/members-only-shared-types)
[![License: ISC](https://img.shields.io/npm/l/@blue0206/members-only-shared-types.svg)](./LICENSE)

Shared TypeScript types, Zod schemas, and API definitions for the "Members Only" project. This package ensures type safety and a consistent API contract between the frontend and backend repositories.

## Table of Contents

- [@blue0206/members-only-shared-types](#blue0206members-only-shared-types)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Purpose \& Usage](#purpose--usage)
  - [Core Contents](#core-contents)
  - [API Documentation](#api-documentation)
    - [Authentication (`/api/v1/auth`)](#authentication-apiv1auth)
      - [Register User](#register-user)
      - [Login User](#login-user)
      - [Logout User](#logout-user)
      - [Refresh User's Tokens](#refresh-users-tokens)
      - [Get User's Sessions](#get-users-sessions)
      - [Revoke Specific Session](#revoke-specific-session)
      - [Revoke All Other Sessions](#revoke-all-other-sessions)
    - [Users (`/api/v1/users`)](#users-apiv1users)
      - [Get Users](#get-users)
      - [Edit User (Update Profile Details)](#edit-user-update-profile-details)
      - [Delete User (Admin)](#delete-user-admin)
      - [Delete User (Self)](#delete-user-self)
      - [Reset Password](#reset-password)
      - [Member Role Update](#member-role-update)
      - [Set Role](#set-role)
      - [Delete Avatar](#delete-avatar)
      - [Get Bookmarks (Admin/Member)](#get-bookmarks-adminmember)
      - [Add Bookmark](#add-bookmark)
      - [Remove Bookmark](#remove-bookmark)
    - [Messages (`/api/v1/messages`)](#messages-apiv1messages)
      - [Get All Messages (Unregistered/User)](#get-all-messages-unregistereduser)
      - [Get All Messages (Admin/Member)](#get-all-messages-adminmember)
      - [Create Message](#create-message)
      - [Edit Message](#edit-message)
      - [Delete Message](#delete-message)
      - [Like Message](#like-message)
      - [Unlike Message](#unlike-message)
    - [Errors](#errors)
      - [Prisma and Database Errors](#prisma-and-database-errors)
      - [JWT Verification Errors](#jwt-verification-errors)
      - [CSRF Verification Errors](#csrf-verification-errors)
      - [File Upload Errors](#file-upload-errors)

## Installation

```bash
npm install @blue0206/members-only-shared-types
```

## Purpose & Usage

This package serves as the single source of truth for data structures and contracts shared between the "Members Only" frontend and backend. It primarily includes:

- **Zod Schemas:** For runtime validation (primarily in the backend) of API request bodies, parameters, and potentially responses.
- **TypeScript Types (DTOs):** Inferred directly from Zod schemas, providing static type safety for API payloads (Data Transfer Objects) in both frontend and backend code.
- **API Response Wrappers:** Standard interfaces (`ApiResponseSuccess`, `ApiResponseError`, `ApiErrorPayload`) defining the consistent structure of all API responses.
- **Shared Enums:** Common enumerations (`Role` for user roles, etc.) used across the application domain.
- **Error Codes:** Centralized constant definitions (`ErrorCodes`) for machine-readable API errors.

By using this shared package, we ensure that changes to API data structures are reflected consistently across repositories, reducing integration errors and improving maintainability.

## Core Contents

- `/api`: Base API response wrapper interfaces (`ApiResponse`, `ApiErrorPayload`, etc.).
- `/dtos`: Feature-specific Zod schemas and inferred DTO types (e.g., `auth.dto.ts`, `user.dto.ts`).
- `/enums`: Shared enumerations (e.g., `roles.enum.ts`).
- `index.ts`: Re-exports all public schemas, types, interfaces, enums, and constants.

## API Documentation

---

### Authentication (`/api/v1/auth`)

#### Register User

- **Endpoint:** `POST /api/v1/auth/register`
- **Description:** Creates a new user account and logs them in, returning user details and tokens.
- **Request Body:** `multipart/form-data`
    ```jsonc
    // Example Request Body (Matches RegisterRequestDto)
    {
        "username": "blue0206", // string
        "firstname": "Blue", // string
        "password": "P@ssword1234", // string, min 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character
    }
    ```
    - **Schema:** See [`RegisterRequestSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/auth.dto.ts)
- **Success Response:** `201 Created`
    - **Headers:**
        - `Set-Cookie`: `refreshToken=...; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=...`
        - `Set-Cookie`: `csrf-token=...; Secure; SameSite=Lax; Path=/; Max-Age=...`
    - **Body:** `application/json` (Matches `ApiResponseSuccess<RegisterResponseDto>`)
        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": {
                // Matches RegisterResponseDto / LoginResponseDto
                "user": {
                    // Matches UserDto
                    "id": 5,
                    "firstname": "Blue",
                    "username": "blue0206",
                    "avatar": null,
                    "role": "USER",
                    //...
                },
                "accessToken": "eyignavtfkscfky...", // JWT Access Token
                // Note: Refresh token is NOT in the body. It is sent as cookie.
            },
            "requestId": "...",
            "statusCode": 201,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code              | Message                                                    | Details                       | Description                                                                          |
    | ----------- | ----------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
    | 422         | `VALIDATION_ERROR`      | "Invalid request body."                                    | `{ /* Zod error details */ }` | Returned when request body fails validation                                          |
    | 500         | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                |
    | 500         | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `RegisterResponseDto` fails parsing with the schema |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [File Upload Errors](#file-upload-errors) for error response on file upload errors.

---

#### Login User

- **Endpoint:** `POST /api/v1/auth/login`
- **Description:** Authenticates an existing user, returning user details and tokens.
- **Request Body:** `application/json`
    ```jsonc
    // Example Request Body (Matches LoginRequestDto)
    {
        "username": "blue0206", // string
        "password": "P@ssword1234", // string
    }
    ```
    - **Schema:** See [`LoginRequestSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/auth.dto.ts)
- **Success Response:** `200 OK`
    - **Headers:** (Same `Set-Cookie` headers as Register)
    - **Body:** `application/json` (Matches `ApiResponseSuccess<LoginResponseDto>`) - Same structure as Register success response.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code              | Message                                                    | Details                       | Description                                                                               |
    | ----------- | ----------------------- | ---------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
    | 401         | `UNAUTHORIZED`          | "Invalid username or password."                            | -                             | Returned when user with username not found in database or if the password does not match. |
    | 422         | `VALIDATION_ERROR`      | "Invalid request body."                                    | `{ /* Zod error details */ }` | Returned when request body fails validation                                               |
    | 500         | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                     |
    | 500         | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `LoginResponseDto` fails parsing with the schema         |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.

---

#### Logout User

- **Endpoint:** `DELETE /api/v1/auth/logout`
- **Description:** Invalidates the current session's refresh token on the server.
- **Request Cookies:** Requires a valid `refreshToken` HttpOnly cookie to be sent by the browser, and a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Success Response:** `204 No Content`
    - **Headers:** `Set-Cookie` headers to _clear_ the `refreshToken` and `csrf-token` cookies.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    - This route does not return any error response (with the exception of access and CSRF token verification) because we intend to logout the user in any case and clear the cookies.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Refresh User's Tokens

- **Endpoint:** `POST /api/v1/auth/refresh`
- **Description:** Uses a valid refresh token (sent via cookie) to obtain a new access token.
- **Request Cookies:** Requires a valid `refreshToken` HttpOnly cookie to be sent by the browser, and a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Success Response:** `200 OK`

    - **Headers:** (Same `Set-Cookie` headers as Register/Login)
    - **Body:** `application/json` (Matches `ApiResponseSuccess<RefreshTokenResponseDto>`)

        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": {
                // Matches RefreshTokenResponseDto
                "accessToken": "dbawlfblblvksdvlibsaviabv...", // NEW JWT Access Token
            },
            "requestId": "...",
            "statusCode": 200,
        }
        ```

- **Error Responses:** (Matches `ApiResponseError`)
  | Status Code | Error Code | Message | Details | Description |
  |-------------|------------|---------|---------|-------------|
  | 401 | `AUTHENTICATION_REQUIRED` | "Missing refresh token." | - | Returned when there's no refresh token in cookie. |
  | 401 | `INVALID_TOKEN` | "The refresh token is invalid." | - | Returned when the refresh token is present and verified but the token's entry is not in database. |
  | 500 | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | - | Returned when the request ID is missing from request. |
  | 500 | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error" | `{ /* Zod error details */ }` | Returned when the mapping to the `RefreshTokenResponseDto` fails parsing with the schema |
  | 500 | `DATABASE_ERROR` | "User not found in database." | - | Returned when the refresh token is present and verified but the user's entry is not in database.

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Get User's Sessions

- **Endpoint:** `GET /api/v1/auth/sessions`
- **Description:** Gets all the sessions of the current user.
- **Request Cookies:** Requires a valid `refreshToken` HttpOnly cookie to be sent by the browser, and a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Success Response:** `200 OK`

    - **Body:** `application/json` (Matches `ApiResponseSuccess<UserSessionsResponseDto>`)

        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": {
                // Matches UserSessionsResponseDto
                "sessionId": "uuid", // JwtID or jti
                "userId": 16,
                "userIp": "192.168.0.1",
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "userLocation": "New York, United States",
                "lastUsedOn": "...",
                "currentSession": true,
            },
            "requestId": "...",
            "statusCode": 200,
        }
        ```

- **Error Responses:** (Matches `ApiResponseError`)
  | Status Code | Error Code | Message | Details | Description |
  |-------------|------------|---------|---------|-------------|
  | 403 | `FORBIDDEN` | "Admin privileges are required." | - | Returned when the logged-in user is not an admin and hence cannot perform this action. |
  | 500 | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | - | Returned when the request ID is missing from request. |
  | 500 | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error" | `{ /* Zod error details */ }` | Returned when the mapping to the `UserSessionsResponseDto` fails parsing with the schema |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Revoke Specific Session

- **Endpoint:** `DELETE /api/v1/auth/sessions/:sessionId`
- **Description:** Revoke a specific session of the user.
- **Request Cookies:** Requires a valid `refreshToken` HttpOnly cookie to be sent by the browser, and a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Request Parameters:**
    - `sessionId` - The ID of the session to revoke.
    - **Schema:** See [`SessionIdParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/auth.dto.ts)
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)
  | Status Code | Error Code | Message | Details | Description |
  |-------------|------------|---------|---------|-------------|
  | 403 | `FORBIDDEN` | "Admin privileges are required." | - | Returned when the logged-in user is not an admin and hence cannot perform this action. |
  | 500 | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | - | Returned when the request ID is missing from request. |
  | 500 | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error" | `{ /* Zod error details */ }` | Returned when the mapping to the `UserSessionsResponseDto` fails parsing with the schema |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Revoke All Other Sessions

- **Endpoint:** `DELETE /api/v1/auth/sessions`
- **Description:** Revoke all of the user's sessions except the current one.
- **Request Cookies:** Requires a valid `refreshToken` HttpOnly cookie to be sent by the browser, and a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)
  | Status Code | Error Code | Message | Details | Description |
  |-------------|------------|---------|---------|-------------|
  | 403 | `FORBIDDEN` | "Admin privileges are required." | - | Returned when the logged-in user is not an admin and hence cannot perform this action. |
  | 500 | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | - | Returned when the request ID is missing from request. |
  | 500 | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error" | `{ /* Zod error details */ }` | Returned when the mapping to the `UserSessionsResponseDto` fails parsing with the schema |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

### Users (`/api/v1/users`)

#### Get Users

- **Endpoint:** `GET /api/v1/users`
- **Description:** Gets all the users. This route is Admin only.
- **Request Cookies:** None.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks.
- **Request Body:** None.
- **Success Response:** `200 OK`
    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<GetUsersResponseDto>`)
        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": [
                // Matches GetUsersResponseDto
                {
                    "username": "blue0206",
                    "firstname": "Aayush",
                    "middlename": null,
                    "lastActive": "...",
                    "..."
                },
            ],
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code              | Message                                                    | Details                       | Description                                                                            |
    | ----------- | ----------------------- | ---------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
    | 403         | `FORBIDDEN`             | "Admin privileges are required."                           | -                             | Returned when the logged-in user is not an admin and hence cannot perform this action. |
    | 500         | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                  |
    | 500         | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `GetUsersResponseDto` fails parsing with the schema   |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.

---

#### Edit User (Update Profile Details)

- **Endpoint:** `PATCH /api/v1/users`
- **Description:** Update user profile details (except password).
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** `multipart/form-data`
    ```jsonc
    // Example Request Body (Matches EditUserRequestDto)
    {
        // Though all fields are optional,
        // at least one field must be provided, else it'll fail schema parsing.
        "newUsername": "blue0206", // string, optional
        "newFirstname": "John", // string, optional
        "newMiddlename": "Mac", // string, optional
        "newLastname": "Tavish", // string, optional
        "newAvatar": "...", // string/url, optional
        "avatarPresent": true, // boolean, optional (required when newAvatar is sent).
    }
    ```
    - **Schema:** See [`EditUserRequestSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/user.dto.ts)
- **Success Response:** `200 OK`
    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<EditUserResponseDto>`)
        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": {
                // Matches EditUserResponseDto
                "id": 5,
                "firstname": "Blue",
                "username": "blue0206",
                "avatar": null,
                "role": "USER",
            },
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request body."                                    | `{ /* Zod error details */ }` | Returned when request body fails validation                                                 |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `EditUserResponseDto` fails parsing with the schema        |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.
    - See [File Upload Errors](#file-upload-errors) for error response on file upload errors.

---

#### Delete User (Admin)

- **Endpoint:** `DELETE /api/v1/users/:username`
- **Description:** Delete a user's account. Note that this endpoint is for Admin deleting other users' account.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Request Parameters:**
    - `username` - The username of the user to delete.
    - **Schema:** See [`UsernameParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/user.dto.ts)
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code              | Message                                                    | Details                       | Description                                                                            |
    | ----------- | ----------------------- | ---------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
    | 403         | `FORBIDDEN`             | "Admin privileges are required."                           | -                             | Returned when the logged-in user is not an admin and hence cannot perform this action. |
    | 422         | `VALIDATION_ERROR`      | "Invalid request parameters."                              | `{ /* Zod error details */ }` | Returned when request params fails validation                                          |
    | 500         | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                  |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Delete User (Self)

- **Endpoint:** `DELETE /api/v1/users`
- **Description:** Delete the account of the logged-in user.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -       | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -       | Returned when the request ID is missing from request.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Reset Password

- **Endpoint:** `PATCH /api/v1/users/reset-password`
- **Description:** Reset a user's password.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** `application/json`
    ```jsonc
    // Example Request Body (Matches ResetPasswordRequestSchema)
    {
        "oldPassword": "********",
        "newPassword": "********",
    }
    ```
    - **Schema:** See [`ResetPasswordRequestSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/user.dto.ts)
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `INCORRECT_PASSWORD`      | "Incorrect password."                                      | -                             | Returned when the provided old password is incorrect.                                       |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request body."                                    | `{ /* Zod error details */ }` | Returned when request body fails validation.                                                |
    | 500         | `DATABASE_ERROR`          | "User not found in database."                              | -                             | Returned when the user's entry is not in database.                                          |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Member Role Update

- **Endpoint:** `PATCH /api/v1/users/role`
- **Description:** Update the user's role. Allows users to promote themselves to "Member" by providing a valid "secret key".
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** `application/json`
    ```jsonc
    // Example Request Body (Matches MemberRoleUpdateRequestSchema)
    {
        "secretKey": "********",
    }
    ```
    - **Schema:** See [`MemberRoleUpdateRequestSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/user.dto.ts)
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `INCORRECT_SECRET_KEY`    | "The secret key is incorrect."                             | -                             | Returned when the provided secret key is incorrect.                                         |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request body."                                    | `{ /* Zod error details */ }` | Returned when request body fails validation.                                                |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Set Role

- **Endpoint:** `PATCH /api/v1/users/role/:username`
- **Description:** Update the user's role. Admin only.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Request Parameters:**
    - `username` - The username of the user to delete.
    - **Schema:** See [`UsernameParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/user.dto.ts)
- **Request Query Parameters:**
    - `role` - The role to set the user to.
    - **Schema:** See [`SetRoleRequestQuerySchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/user.dto.ts)
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code              | Message                                                    | Details                       | Description                                                                            |
    | ----------- | ----------------------- | ---------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
    | 403         | `FORBIDDEN`             | "Admin privileges are required."                           | -                             | Returned when the logged-in user is not an admin and hence cannot perform this action. |
    | 422         | `VALIDATION_ERROR`      | "Invalid request parameters."                              | `{ /* Zod error details */ }` | Returned when request params fails validation.                                         |
    | 422         | `VALIDATION_ERROR`      | "Invalid request query."                                   | `{ /* Zod error details */ }` | Returned when request query fails validation.                                          |
    | 500         | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                  |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Delete Avatar

- **Endpoint:** `DELETE /api/v1/users/avatar`
- **Description:** Delete a user's avatar.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Request Parameters:** None.
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -       | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 500         | `DATABASE_ERROR`          | "User avatar not found in database."                       | -       | Returned when the user's avatar entry is not in database.                                   |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -       | Returned when the request ID is missing from request.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.
    - See [File Upload Errors](#file-upload-errors) for error response on file upload/delete errors.

---

#### Get Bookmarks (Admin/Member)

- **Endpoint:** `GET /api/v1/users/bookmarks`
- **Description:** Gets all the messages bookmarked by Admin/Member users.
- **Request Cookies:** None.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks.
- **Request Body:** None.
- **Success Response:** `200 OK`
    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<GetUserBookmarksResponseDto>`)
        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": [
                // Matches GetUserBookmarksResponseDto
                {
                    "messageId": 5,
                    "message": "...",
                    "user": {
                        // Can also be nullish for deleted user.
                        "userId": 16,
                        "username": "soap0206",
                        "firstname": "John",
                        "middlename": "'SOAP'",
                        "lastname": "MacTavish",
                        "avatar": "...",
                        "role": "MEMBER",
                    },
                    "likes": 5,
                    "bookmarks": 4,
                    "edited": false,
                    "bookmarked": true,
                    "liked": true,
                    "timestamp": "...", // createdAt timestamp
                },
            ],
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                  |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object.  |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required."                 | -                             | Returned when the logged-in user is not an admin or member and hence cannot edit messages.   |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                        |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `GetUserBookmarksResponseDto` fails parsing with the schema |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.

---

#### Add Bookmark

- **Endpoint:** `POST /api/v1/users/bookmarks/:messageId`
- **Description:** Add logged-in Admin/Member user's bookmark.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Parameters:**
    - `messageId` - The ID of the message to bookmark.
    - **Schema:** See [`MessageParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/message.dto.ts)
- **Request Body:** None.
- **Success Response:** `201 Created`
    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<null>`)
        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": null,
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required."                 | -                             | Returned when the logged-in user is not an admin or member.                                 |
    | 422         | `VALIDATION_ERROR`        | "Invalid request parameters."                              | `{ /* Zod error details */ }` | Returned when request params fails validation.                                              |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Remove Bookmark

- **Endpoint:** `DELETE /api/v1/users/bookmarks/:messageId`
- **Description:** Remove logged-in Admin/Member user's bookmark.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Parameters:**
    - `messageId` - The ID of the message to bookmark.
    - **Schema:** See [`MessageParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/message.dto.ts)
- **Request Body:** None.
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required."                 | -                             | Returned when the logged-in user is not an admin or member.                                 |
    | 422         | `VALIDATION_ERROR`        | "Invalid request parameters."                              | `{ /* Zod error details */ }` | Returned when request params fails validation.                                              |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

### Messages (`/api/v1/messages`)

#### Get All Messages (Unregistered/User)

- **Endpoint:** `GET /api/v1/messages/public`
- **Description:** Gets all the messages without author names.
- **Request Cookies:** None.
- **Request Headers**: None.
- **Request Body:** None.
- **Success Response:** `200 OK`
    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<GetMessagesWithoutAuthorResponseDto>`)
        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": [
                // Matches GetMessagesWithoutAuthorResponseDto
                {
                    "messageId": 5,
                    "message": "...",
                    "likes": 5,
                    "bookmarks": 4,
                    "userId": 16,
                    "timestamp": "...", // createdAt timestamp
                },
            ],
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code              | Message                                                    | Details                       | Description                                                                                           |
    | ----------- | ----------------------- | ---------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
    | 500         | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                                 |
    | 500         | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `GetMessagesWithoutAuthorResponseDto` fails parsing with the schema. |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.

---

#### Get All Messages (Admin/Member)

- **Endpoint:** `GET /api/v1/messages`
- **Description:** Gets all the messages with author names.
- **Request Cookies:** None.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks.
- **Request Body:** None.
- **Success Response:** `200 OK`
    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<GetMessagesResponseDto>`)
        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": [
                // Matches GetMessagesResponseDto
                {
                    "messageId": 5,
                    "message": "...",
                    "user": {
                        // Can also be nullish for deleted user.
                        "userId": 16,
                        "username": "soap0206",
                        "firstname": "John",
                        "middlename": "'SOAP'",
                        "lastname": "MacTavish",
                        "avatar": "...",
                        "role": "MEMBER",
                    },
                    "likes": 5,
                    "bookmarks": 4,
                    "edited": false,
                    // Details for the user viewing the message.
                    "bookmarked": true,
                    "liked": true,
                    "timestamp": "...", // createdAt timestamp
                },
            ],
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                   |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object.   |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required."                 | -                             | Returned when the logged-in user is not an admin or member and hence cannot see author names. |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                         |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `GetMessagesResponseDto` fails parsing with the schema.      |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.

---

#### Create Message

- **Endpoint:** `POST /api/v1/messages`
- **Description:** Create/send a new message.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** `application/json`
    ```jsonc
    // Example Request Body (Matches CreateMessageRequestDto)
    {
        "message": "....",
    }
    ```
    - **Schema:** See [`CreateMessageRequestSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/message.dto.ts)
- **Success Response:** `201 Created`

    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<CreateMessageResponseDto>`)

        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": {
                // Matches CreateMessageResponseDto (content depends on user role)
                "messageId": 5,
                "message": "...",
                "edited": false, // Admin/Member only
                "timestamp": "...", // createdAt timestamp
                "..."
            },
            "requestId": "...",
            "statusCode": 201,
        }
        ```

- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request body."                                    | `{ /* Zod error details */ }` | Returned when request body fails validation.                                                |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `CreateMessageResponseDto` fails parsing with the schema.  |
    | 500         | `DATABASE_ERROR`          | "User not found in database."                              | -                             | Returned when the user's entry is not in created message in database.                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Edit Message

- **Endpoint:** `PATCH /api/v1/messages/:messageId`
- **Description:** Edit an existing message. Admin can edit any message while Member can only edit their own message. User role does not have access to this privilege.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Parameters:**
    - `messageId` - The ID of the message to delete.
    - **Schema:** See [`MessageParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/message.dto.ts)
- **Request Body:** `application/json`
    ```jsonc
    // Example Request Body (Matches EditMessageRequestSchema)
    {
        "newMessage": "....",
    }
    ```
    - **Schema:** See [`EditMessageRequestSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/message.dto.ts)
- **Success Response:** `200 OK`
    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<EditMessageResponseDto>`)
        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "data": {
                // Matches EditMessageResponseDto
                "messageId": 5,
                "message": "...",
                "edited": false,
                "timestamp": "...", // createdAt timestamp
                "..."
            },
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required."                 | -                             | Returned when the logged-in user is not an admin or member and hence cannot edit messages.  |
    | 403         | `FORBIDDEN`               | "You do not have permission to edit this message."         | -                             | Returned when the logged-in user is a Member and is trying to edit another user's message.  |
    | 422         | `VALIDATION_ERROR`        | "Invalid request body."                                    | `{ /* Zod error details */ }` | Returned when request body fails validation.                                                |
    | 422         | `VALIDATION_ERROR`        | "Invalid request parameters."                              | `{ /* Zod error details */ }` | Returned when request params fails validation.                                              |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `EditMessageResponseDto` fails parsing with the schema.    |
    | 500         | `DATABASE_ERROR`          | "Message not found in database."                           | -                             | Returned when the message's entry is not in database.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Delete Message

- **Endpoint:** `DELETE /api/v1/messages/:messageId`
- **Description:** Delete an existing message. Admin can delete any message while Member and User can only delete their own message.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Request Parameters:**
    - `messageId` - The ID of the message to delete.
    - **Schema:** See [`MessageParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/message.dto.ts)
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                               |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object.               |
    | 403         | `FORBIDDEN`               | "You do not have permission to delete this message."       | -                             | Returned when the logged-in user is a Member or User role and is trying to delete another user's message. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request parameters."                              | `{ /* Zod error details */ }` | Returned when request params fails validation.                                                            |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                                     |
    | 500         | `DATABASE_ERROR`          | "Message not found in database."                           | -                             | Returned when the message's entry is not in database.                                                     |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Like Message

- **Endpoint:** `POST /api/v1/messages/:messageId/like`
- **Description:** Like a message (Admin/Member only).
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Parameters:**
    - `messageId` - The ID of the message to delete.
    - **Schema:** See [`MessageParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/message.dto.ts)
- **Request Body:** None.
- **Success Response:** `201 Created`

    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<null>`)

        ```jsonc
        // Example Success Response Body
        {
            "success": true,
            "payload": null,
            "requestId": "...",
            "statusCode": 201,
        }
        ```

- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required."                 | -                             | Returned when the logged-in user is not an admin or member.                                 |
    | 422         | `VALIDATION_ERROR`        | "Invalid request parameters."                              | `{ /* Zod error details */ }` | Returned when request params fails validation.                                              |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                                        | `{ /* Zod error details */ }` | Returned when the mapping to the `LikeMessageResponseDto` fails parsing with the schema.    |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Unlike Message

- **Endpoint:** `DELETE /api/v1/messages/:messageId/like`
- **Description:** Unlike a message (Admin/Member only).
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Request Parameters:**
    - `messageId` - The ID of the message to delete.
    - **Schema:** See [`MessageParamsSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/message.dto.ts)
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required."                 | -                             | Returned when the logged-in user is not an admin or member.                                 |
    | 422         | `VALIDATION_ERROR`        | "Invalid request parameters."                              | `{ /* Zod error details */ }` | Returned when request params fails validation.                                              |
    | 500         | `INTERNAL_SERVER_ERROR`   | "Internal server configuration error: Missing Request ID." | -                             | Returned when the request ID is missing from request.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

### Errors

#### Prisma and Database Errors

| Status Code | Error Code                      | Message                                                       | Details                          | Remarks                                                                                                                 |
| ----------- | ------------------------------- | ------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 400         | `VALUE_TOO_LONG`                | "Value too long for the field(s): {field name}"               | -                                | -                                                                                                                       |
| 400         | `INVALID_VALUE`                 | "Invalid value provided for the field: {field name}."         | -                                | -                                                                                                                       |
| 400         | `FOREIGN_KEY_VIOLATION`         | "Foreign key constraint failed on the field: {field name}"    | -                                | -                                                                                                                       |
| 400         | `REQUIRED_CONSTRAINT_VIOLATION` | "Missing required argument."                                  | -                                | -                                                                                                                       |
| 400         | `REQUIRED_CONSTRAINT_VIOLATION` | "Required relation violation."                                | -                                | -                                                                                                                       |
| 400         | `RANGE_ERROR`                   | "Value out of range."                                         | -                                | -                                                                                                                       |
| 400         | `DATABASE_VALIDATION_ERROR`     | "Database validation failed. Invalid data provided to query." | `{ /* Prisma error details */ }` | This is a generic error for all instances of `PrismaClientValidationError`.                                             |
| 404         | `NOT_FOUND`                     | "The record does not exist."                                  | -                                | -                                                                                                                       |
| 409         | `UNIQUE_CONSTRAINT_VIOLATION`   | "Value already exists for unique field: {field name}."        | -                                | -                                                                                                                       |
| 500         | `DATABASE_ERROR`                | "Database request failed (Code: {prisma error code})."        | `{ /* Prisma error details */ }` | This is a generic error for the remaining instances of `PrismaClientKnownRequestError` not handled by switch-statement. |
| 500         | `DATABASE_ERROR`                | "Unknown database error occurred."                            | `{ /* Prisma error details */ }` | This is a generic error for all instances of `PrismaClientUnknownRequestError`.                                         |
| 500         | `INTERNAL_SERVER_ERROR`         | "Internal database engine error."                             | `{ /* Prisma error details */ }` | This is a generic error for all instances of `PrismaClientRustPanicError`.                                              |
| 503         | `DATABASE_CONNECTION_ERROR`     | "Database connection error."                                  | `{ /* Prisma error details */ }` | This is a generic error for all instances of `PrismaClientInitializationError`.                                         |

These errors are handled using an error-handling wrapper around database calls. See [prismaErrorHandler](https://github.com/blue0206/members-only-backend/blob/main/src/core/utils/prismaErrorHandler.ts) for implementation.

---

#### JWT Verification Errors

| Status Code | Error Code              | Message                                   | Details | Remarks                                                                                                               |
| ----------- | ----------------------- | ----------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| 401         | `EXPIRED_TOKEN`         | "The token has expired."                  | -       | -                                                                                                                     |
| 401         | `INVALID_TOKEN`         | "Token verification failed."              | -       | -                                                                                                                     |
| 401         | `INVALID_TOKEN`         | "Failed to authenticate token."           | -       | This is a generic error thrown when an error not an instance of `JsonWebTokenError` occurs during token verification. |
| 500         | `INTERNAL_SERVER_ERROR` | "Internal server error processing token." | -       | This is a generic error thrown when the verified and decoded token fails parsing against Zod schema.                  |

These errors are handled using an error-handling wrapper around JWT verification calls. See [jwtErrorHandler](https://github.com/blue0206/members-only-backend/blob/main/src/core/utils/jwtErrorHandler.ts) for implementation.

---

#### CSRF Verification Errors

| Status Code | Error Code            | Message                | Description                                                                                                              |
| ----------- | --------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 403         | `MISSING_CSRF_HEADER` | "CSRF token missing."  | This error is thrown when CSRF token is not passed via `x-csrf-token` header.                                            |
| 403         | `MISSING_CSRF_COOKIE` | "CSRF token missing."  | This error is thrown when CSRF token is not passed via `csrf-token` cookie.                                              |
| 403         | `CSRF_TOKEN_MISMATCH` | "CSRF token mismatch." | This error is thrown when the CSRF token passed via `x-csrf-token` header does not match the one in `csrf-token` cookie. |

---

#### File Upload Errors

| Status Code | Error Code                | Message                                 | Details                              | Remarks                                                           |
| ----------- | ------------------------- | --------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| 400         | `FILE_UPLOAD_ERROR`       | `{/* Multer error message */}`          | -                                    | Thrown by multer when file upload fails.                          |
| 400         | `FILE_TOO_LARGE`          | "The file exceeds size limit."          | -                                    | Thrown by multer when file size exceeds limits.                   |
| 422         | `VALIDATION_ERROR`        | "File upload validation failed."        | `{ /* Zod error details */ }`        | This is a generic error thrown when file upload validation fails. |
| 422         | `FILE_TYPE_NOT_SUPPORTED` | "File upload validation failed."        | `{ /* Zod error details */ }`        | Thrown when the file type uploaded is not supported.              |
| 422         | `FILE_TOO_LARGE`          | "File upload validation failed."        | `{ /* Zod error details */ }`        | Thrown when the file size uploaded is too large.                  |
| 500         | `FILE_UPLOAD_ERROR`       | "File upload to Cloudinary failed."     | `{ /* Cloudinary error details */ }` | Thrown by Cloudinary when file upload fails.                      |
| 500         | `FILE_DELETE_ERROR`       | "File deletion from Cloudinary failed." | `{ /* Cloudinary error details */ }` | Thrown by Cloudinary when file deletion fails.                    |

---

```

```

```

```
