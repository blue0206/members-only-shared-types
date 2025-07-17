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
    - [Project Evolution: From Monolith to Serverless](#project-evolution-from-monolith-to-serverless)
        - [Version 2: Serverless Microservices (Current)](#version-2-serverless-microservices-current)
        - [Version 1: Containerized Monolith (Legacy)](#version-1-containerized-monolith-legacy)
    - [API Documentation](#api-documentation)
        - [Authentication (`/auth`)](#authentication-auth)
            - [Register User](#register-user)
            - [Login User](#login-user)
            - [Logout User](#logout-user)
            - [Refresh User's Tokens](#refresh-users-tokens)
            - [Get User's Sessions](#get-users-sessions)
            - [Revoke Specific Session](#revoke-specific-session)
            - [Revoke All Other Sessions](#revoke-all-other-sessions)
        - [Users (`/users`)](#users-users)
            - [Get Users](#get-users)
            - [Edit User (Update Profile Details)](#edit-user-update-profile-details)
            - [Delete User (Admin)](#delete-user-admin)
            - [Delete User (Self)](#delete-user-self)
            - [Reset Password](#reset-password)
            - [Member Role Update](#member-role-update)
            - [Set Role](#set-role)
            - [Upload Avatar](#upload-avatar)
            - [Delete Avatar](#delete-avatar)
            - [Get Bookmarks (Admin/Member)](#get-bookmarks-adminmember)
            - [Add Bookmark](#add-bookmark)
            - [Remove Bookmark](#remove-bookmark)
        - [Messages (`/messages`)](#messages-messages)
            - [Get All Messages (Unregistered/User)](#get-all-messages-unregistereduser)
            - [Get All Messages (Admin/Member)](#get-all-messages-adminmember)
            - [Create Message](#create-message)
            - [Edit Message](#edit-message)
            - [Delete Message](#delete-message)
            - [Like Message](#like-message)
            - [Unlike Message](#unlike-message)
        - [Server-Sent Events (`/events`)](#server-sent-events-events)
            - [Create EventSource Connection (for frontend)](#create-eventsource-connection-for-frontend)
            - [Dispatch Event to SSE Service (Internal API Endpoint)](#dispatch-event-to-sse-service-internal-api-endpoint)
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

## Project Evolution: From Monolith to Serverless

The "Members Only" project has been built in two distinct architectural versions to demonstrate different development methodologies. This package provides the types and DTOs that are compatible with **both versions**.

### Version 2: Serverless Microservices (Current)

The primary version of the application is a distributed system built on a modern, serverless-first architecture using AWS.

- **Live Frontend (V2):** **[cloud.nevery.shop](https://cloud.nevery.shop)**
- **REST API Base URL (V2):** `https://api-v2.nevery.shop/api/v2`
- **SSE Endpoint (V2):** `https://event.nevery.shop/api/v2/events`
- **Backend Architecture:** A collection of AWS Lambda microservices, managed by API Gateway, with stateful components (SSE Server) running on EC2. Utilizes SQS, EventBridge, and Redis for a decoupled, event-driven design.
- **Backend Repository:** [Members Only Backend Microservice](https://github.com/blue0206/members-only-backend)

### Version 1: Containerized Monolith (Legacy)

The initial version of the application was built as a robust, layered monolith, deployed as a single container. This version is preserved on a separate branch for reference.

- **Live Frontend (V1):** **[app.nevery.shop](https://app.nevery.shop)**
- **API Base URL (V1):** `https://api.nevery.shop/api/v1`
- **Backend Architecture:** A traditional Node.js/Express application with a layered structure, deployed as a single Docker container on Render.
- **Backend Repository Branch:** [Members Only Backend Monolith](https://github.com/blue0206/members-only-backend/tree/monolith-deployment)

---

## API Documentation

---

### Authentication (`/auth`)

#### Register User

- **Endpoint:** `POST /auth/register`
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

    | Status Code | Error Code              | Message                                                        | Details                       | Description                                                                          |
    | ----------- | ----------------------- | -------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
    | 422         | `VALIDATION_ERROR`      | "Invalid request."                                             | `{ /* Zod error details */ }` | Returned when request fails validation                                               |
    | 500         | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Client Details." | -                             | Returned when the client details object is missing from request.                     |
    | 500         | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error"                                            | `{ /* Zod error details */ }` | Returned when the mapping to the `RegisterResponseDto` fails parsing with the schema |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [File Upload Errors](#file-upload-errors) for error response on file upload errors.

---

#### Login User

- **Endpoint:** `POST /auth/login`
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

    | Status Code | Error Code              | Message                                                        | Details                       | Description                                                                               |
    | ----------- | ----------------------- | -------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
    | 401         | `UNAUTHORIZED`          | "Invalid username or password."                                | -                             | Returned when user with username not found in database or if the password does not match. |
    | 422         | `VALIDATION_ERROR`      | "Invalid request."                                             | `{ /* Zod error details */ }` | Returned when request fails validation                                                    |
    | 500         | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Client Details." | -                             | Returned when the client details object is missing from request.                          |
    | 500         | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error"                                            | `{ /* Zod error details */ }` | Returned when the mapping to the `LoginResponseDto` fails parsing with the schema         |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.

---

#### Logout User

- **Endpoint:** `DELETE /auth/logout`
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

- **Endpoint:** `POST /auth/refresh`
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
  | 401 | `MISSING_REFRESH_TOKEN` | "Missing refresh token." | - | Returned when there's no refresh token in cookie. |
  | 401 | `INVALID_TOKEN` | "The refresh token is invalid." | - | Returned when the refresh token is present and verified but the token's entry is not in database. |
  | 500 | `INTERNAL_SERVER_ERROR` | "Internal server configuration error: Missing Client Details." | - | Returned when the client details object is missing from request. |
  | 500 | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error" | `{ /* Zod error details */ }` | Returned when the mapping to the `RefreshTokenResponseDto` fails parsing with the schema |
  | 500 | `DATABASE_ERROR` | "User not found in database." | - | Returned when the refresh token is present and verified but the user's entry is not in database. |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Get User's Sessions

- **Endpoint:** `GET /auth/sessions`
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
  | 401 | `MISSING_REFRESH_TOKEN` | "Missing refresh token." | - | Returned when there's no refresh token in cookie. |
  | 401 | `INVALID_TOKEN` | "Invalid refresh token: missing jti claim." | - | Returned when the refresh token is present and verified but the token's jti claim is missing. |
  | 401 | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | - | Returned when the access token verification middleware fails to populate `req.user` object. |
  | 500 | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error" | `{ /* Zod error details */ }` | Returned when the mapping to the `UserSessionsResponseDto` fails parsing with the schema |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Revoke Specific Session

- **Endpoint:** `DELETE /auth/sessions/:sessionId`
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
  | 401 | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | - | Returned when the access token verification middleware fails to populate `req.user` object. |
  | 422 | `VALIDATION_ERROR` | "Invalid request." | `{ /* Zod error details */ }` | Returned when request fails validation. |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Revoke All Other Sessions

- **Endpoint:** `DELETE /auth/sessions`
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
  | 401 | `MISSING_REFRESH_TOKEN` | "Missing refresh token." | - | Returned when there's no refresh token in cookie. |
  | 401 | `INVALID_TOKEN` | "Invalid refresh token: missing jti claim." | - | Returned when the refresh token is present and verified but the token's jti claim is missing. |
  | 401 | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | - | Returned when the access token verification middleware fails to populate `req.user` object. |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

### Users (`/users`)

#### Get Users

- **Endpoint:** `GET /users`
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

    | Status Code | Error Code              | Message                          | Details                       | Description                                                                            |
    | ----------- | ----------------------- | -------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
    | 403         | `FORBIDDEN`             | "Admin privileges are required." | -                             | Returned when the logged-in user is not an admin and hence cannot perform this action. |
    | 500         | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error"              | `{ /* Zod error details */ }` | Returned when the mapping to the `GetUsersResponseDto` fails parsing with the schema   |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.

---

#### Edit User (Update Profile Details)

- **Endpoint:** `PATCH /users`
- **Description:** Update user profile details (except password).
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** `application/json`
    ```jsonc
    // Example Request Body (Matches EditUserRequestDto)
    {
        // Though all fields are optional,
        // at least one field must be provided, else it'll fail schema parsing.
        "newUsername": "blue0206", // string, optional
        "newFirstname": "John", // string, optional
        "newMiddlename": "Mac", // string, optional
        "newLastname": "Tavish", // string, optional
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

    | Status Code | Error Code                | Message                           | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                | `{ /* Zod error details */ }` | Returned when request fails validation                                                      |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"               | `{ /* Zod error details */ }` | Returned when the mapping to the `EditUserResponseDto` fails parsing with the schema        |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.
    - See [File Upload Errors](#file-upload-errors) for error response on file upload errors.

---

#### Delete User (Admin)

- **Endpoint:** `DELETE /users/:username`
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

    | Status Code | Error Code                | Message                           | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Admin privileges are required."  | -                             | Returned when the logged-in user is not an admin and hence cannot perform this action.      |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Delete User (Self)

- **Endpoint:** `DELETE /users`
- **Description:** Delete the account of the logged-in user.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                           | Details | Description                                                                                 |
    | ----------- | ------------------------- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | -       | Returned when the access token verification middleware fails to populate `req.user` object. |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Reset Password

- **Endpoint:** `PATCH /users/reset-password`
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

    | Status Code | Error Code                | Message                           | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `INCORRECT_PASSWORD`      | "Incorrect password."             | -                             | Returned when the provided old password is incorrect.                                       |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |
    | 500         | `DATABASE_ERROR`          | "User not found in database."     | -                             | Returned when the user's entry is not in database.                                          |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Member Role Update

- **Endpoint:** `PATCH /users/role`
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

    | Status Code | Error Code                | Message                           | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `INCORRECT_SECRET_KEY`    | "The secret key is incorrect."    | -                             | Returned when the provided secret key is incorrect.                                         |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Set Role

- **Endpoint:** `PATCH /users/role/:username`
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

    | Status Code | Error Code                | Message                           | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Admin privileges are required."  | -                             | Returned when the logged-in user is not an admin and hence cannot perform this action.      |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Upload Avatar

- **Endpoint:** `PATCH /users/avatar`
- **Description:** Allows registered users to update their avatar.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** `multipart/form-data`
    ```jsonc
    // Example Request Body (The schema for this is not provided as Zod generated schema is of 'any' type and causes issues on frontend. The frontend is responsible for properly validating the request body with the help of AvatarSchema exported by this package.)
    {
        "avatar": "...", // file
    }
    ```
- **Request Parameters:** None.
- **Success Response:** `200 OK`
    - **Headers:** None.
    - **Body:** `application/json` (Matches `ApiResponseSuccess<UploadAvatarResponseDto>`)
        ```jsonc
        // Example Success Response Body (Matches UploadAvatarResponseDto)
        {
            "success": true,
            "data": {
                "avatar": "....", // url
            },
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                           | Details | Description                                                                                 |
    | ----------- | ------------------------- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | -       | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 500         | `FILE_UPLOAD_ERROR`       | "File not found in request."      | -       | Returned when the multer middleware fails to populate the `req` object with the file.       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.
    - See [File Upload Errors](#file-upload-errors) for error response on file upload/delete errors.

---

#### Delete Avatar

- **Endpoint:** `DELETE /users/avatar`
- **Description:** Delete a user's avatar.
- **Request Cookies:** Requires a `csrf-token` cookie for passing CSRF verification checks.
- **Request Headers**: Requires a valid `access token` in `Authorization` header prefixed with "Bearer " for passing access token verification checks, and a valid `CSRF token` in `x-csrf-token` header for passing CSRF verification checks.
- **Request Body:** None.
- **Request Parameters:** None.
- **Success Response:** `204 No Content`
    - **Headers:** None.
    - **Body:** None.
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                              | Details | Description                                                                                 |
    | ----------- | ------------------------- | ------------------------------------ | ------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."    | -       | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 500         | `DATABASE_ERROR`          | "User avatar not found in database." | -       | Returned when the user's avatar entry is not in database.                                   |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.
    - See [File Upload Errors](#file-upload-errors) for error response on file upload/delete errors.

---

#### Get Bookmarks (Admin/Member)

- **Endpoint:** `GET /users/bookmarks`
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
                    "messageTimestamp": "...", // createdAt timestamp of message
                    "timestamp": "...", // createdAt timestamp of bookmark
                },
            ],
            "requestId": "...",
            "statusCode": 200,
        }
        ```
- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                                    | Details                       | Description                                                                                  |
    | ----------- | ------------------------- | ------------------------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."          | -                             | Returned when the access token verification middleware fails to populate `req.user` object.  |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required." | -                             | Returned when the logged-in user is not an admin or member and hence cannot edit messages.   |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                        | `{ /* Zod error details */ }` | Returned when the mapping to the `GetUserBookmarksResponseDto` fails parsing with the schema |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.

---

#### Add Bookmark

- **Endpoint:** `POST /users/bookmarks/:messageId`
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

    | Status Code | Error Code                | Message                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required." | -                             | Returned when the logged-in user is not an admin or member.                                 |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                         | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Remove Bookmark

- **Endpoint:** `DELETE /users/bookmarks/:messageId`
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

    | Status Code | Error Code                | Message                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required." | -                             | Returned when the logged-in user is not an admin or member.                                 |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                         | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

### Messages (`/messages`)

#### Get All Messages (Unregistered/User)

- **Endpoint:** `GET /messages/public`
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

    | Status Code | Error Code              | Message             | Details                       | Description                                                                                           |
    | ----------- | ----------------------- | ------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
    | 500         | `INTERNAL_SERVER_ERROR` | "DTO Mapping Error" | `{ /* Zod error details */ }` | Returned when the mapping to the `GetMessagesWithoutAuthorResponseDto` fails parsing with the schema. |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.

---

#### Get All Messages (Admin/Member)

- **Endpoint:** `GET /messages`
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

    | Status Code | Error Code                | Message                                    | Details                       | Description                                                                                   |
    | ----------- | ------------------------- | ------------------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."          | -                             | Returned when the access token verification middleware fails to populate `req.user` object.   |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required." | -                             | Returned when the logged-in user is not an admin or member and hence cannot see author names. |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                        | `{ /* Zod error details */ }` | Returned when the mapping to the `GetMessagesResponseDto` fails parsing with the schema.      |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.

---

#### Create Message

- **Endpoint:** `POST /messages`
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

    | Status Code | Error Code                | Message                           | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing." | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"               | `{ /* Zod error details */ }` | Returned when the mapping to the `CreateMessageResponseDto` fails parsing with the schema.  |
    | 500         | `DATABASE_ERROR`          | "User not found in database."     | -                             | Returned when the user's entry is not in created message in database.                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Edit Message

- **Endpoint:** `PATCH /messages/:messageId`
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

    | Status Code | Error Code                | Message                                            | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | -------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                  | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required."         | -                             | Returned when the logged-in user is not an admin or member and hence cannot edit messages.  |
    | 403         | `FORBIDDEN`               | "You do not have permission to edit this message." | -                             | Returned when the logged-in user is a Member and is trying to edit another user's message.  |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                                 | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                                | `{ /* Zod error details */ }` | Returned when the mapping to the `EditMessageResponseDto` fails parsing with the schema.    |
    | 500         | `DATABASE_ERROR`          | "Message not found in database."                   | -                             | Returned when the message's entry is not in database.                                       |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Delete Message

- **Endpoint:** `DELETE /messages/:messageId`
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

    | Status Code | Error Code                | Message                                              | Details                       | Description                                                                                               |
    | ----------- | ------------------------- | ---------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."                    | -                             | Returned when the access token verification middleware fails to populate `req.user` object.               |
    | 403         | `FORBIDDEN`               | "You do not have permission to delete this message." | -                             | Returned when the logged-in user is a Member or User role and is trying to delete another user's message. |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                                   | `{ /* Zod error details */ }` | Returned when request fails validation.                                                                   |
    | 500         | `DATABASE_ERROR`          | "Message not found in database."                     | -                             | Returned when the message's entry is not in database.                                                     |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Like Message

- **Endpoint:** `POST /messages/:messageId/like`
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

    | Status Code | Error Code                | Message                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required." | -                             | Returned when the logged-in user is not an admin or member.                                 |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                         | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |
    | 500         | `INTERNAL_SERVER_ERROR`   | "DTO Mapping Error"                        | `{ /* Zod error details */ }` | Returned when the mapping to the `LikeMessageResponseDto` fails parsing with the schema.    |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

#### Unlike Message

- **Endpoint:** `DELETE /messages/:messageId/like`
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

    | Status Code | Error Code                | Message                                    | Details                       | Description                                                                                 |
    | ----------- | ------------------------- | ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Authentication details missing."          | -                             | Returned when the access token verification middleware fails to populate `req.user` object. |
    | 403         | `FORBIDDEN`               | "Member or Admin privileges are required." | -                             | Returned when the logged-in user is not an admin or member.                                 |
    | 422         | `VALIDATION_ERROR`        | "Invalid request."                         | `{ /* Zod error details */ }` | Returned when request fails validation.                                                     |

    - See [Prisma Errors](#prisma-and-database-errors) for error response on failed database calls.
    - See [JWT Verification Errors](#jwt-verification-errors) for error response on errors thrown during JWT verification.
    - See [CSRF Verification Errors](#csrf-verification-errors) for error response on failed CSRF token verification.

---

### Server-Sent Events (`/events`)

#### Create EventSource Connection (for frontend)

- **Endpoint:** `GET /events`
- **Description:** Establishes a server-sent events connection.
- **Request Body:** None.
- **Request Parameters:** None.
- **Request Query Parameters:**
    - `accessToken` - A valid access token for passing access token verification checks.
    - **Schema:** See [`EventRequestQuerySchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/event.dto.ts)
- **Success Response:** `200 OK`

    - **Headers:**
        - `Content-Type`: `text/event-stream`
        - `Cache-Control`: `no-cache`
        - `Connection`: `keep-alive`
    - **Body:** `text/event-stream`

        - The server holds the connection open and streams events to the client. Each event follows the SSE format and corresponds to the `ServerSentEvent` interface defined in this package.
        - The `event` field will be one of `MESSAGE_EVENT`, `USER_EVENT`, or `MULTI_EVENT`.
        - The `data` field is a JSON stringified payload matching one of the event payload DTOs (e.g., `UserEventPayloadDto`, `MessageEventPayloadDto`, `MultiEventPayloadDto`).

        **Example Event Stream:**

        ```text
        id: 1
        event: MULTI_EVENT
        data: {"reason":"USER_CREATED","originId":42,"originUsername":"new_user","targetUserRole":"MEMBER"}

        id: 2
        event: MESSAGE_EVENT
        data: {"reason":"MESSAGE_CREATED","originId":15}

        id: 3
        event: USER_EVENT
        data: {"reason":"USER_UPDATED","originId":42}

        ```

- **Error Responses:** (Matches `ApiResponseError`)

    | Status Code | Error Code                | Message                 | Details | Description                                        |
    | ----------- | ------------------------- | ----------------------- | ------- | -------------------------------------------------- |
    | 401         | `AUTHENTICATION_REQUIRED` | "Missing access token." | -       | Returned when the access token verification fails. |

---

#### Dispatch Event to SSE Service (Internal API Endpoint)

- **Endpoint:** `POST /events/internal/dispatch`
- **Description:** This endpoint is specifically for dispatching events to the SSE service in serverless implementation of this project. This endpoint is unavailable for monolithic implementation of this project.
- **Request Body:** `application/json`
    ```jsonc
    // Example Request Body (Matches EventRequestDto)
    {
        "events": [
            {
                "eventName": "MESSAGE_EVENT",
                "data": { "reason": "MESSAGE_CREATED", "originId": 15 },
                "transmissionType": "unicast",
                "targetId": 16,
            },
            {
                "eventName": "MESSAGE_EVENT",
                "data": { "reason": "MESSAGE_CREATED", "originId": 15 },
                "transmissionType": "multicast",
                "targetRoles": ["ADMIN", "MEMBER"],
            },
        ],
    }
    ```
    - **Schema:** See [`EventRequestSchema`](https://github.com/blue0206/members-only-shared-types/blob/main/src/dtos/event.dto.ts)
- **Request Headers**: Requires a valid `internal api secret key` in `x-internal-api-secret` to verify the request origin authenticity.
- **Success Response:** `204 No Content`
- **Error Responses:** No error response for this route. The error is just logged.

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
